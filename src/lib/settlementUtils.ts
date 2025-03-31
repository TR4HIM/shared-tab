import { getExpensesByGroup } from '@/services/expenseService';
import { getGroupById } from '@/services/groupService';
import { ExpenseWithRelations, Settlement, UserBalance } from '@/types/Expense';
import { GroupMember } from '@prisma/client';

interface UserMap {
  [userId: string]: {
    id: string;
    name: string;
    balance: number;
  };
}

/**
 * Calculates the net balances and optimal settlement transactions for a group based on expenses
 * @param expenses Array of expenses with their participants
 * @param groupMembers All group members in the system (to get names)
 * @returns Settlement result containing balances and group total
 */
export function calculateGroupSettlement(
  expenses: ExpenseWithRelations[],
  groupMembers: GroupMember[]
): {
  balances: UserBalance[];
  groupTotal: number;
} {
  // Initialize variables
  const userMap: UserMap = {};
  let groupTotal = 0;
  const uniqueUserIds = new Set<string>();

  // First pass: collect all unique users involved in expenses
  for (const expense of expenses) {
    uniqueUserIds.add(expense.paidBy);
    for (const participant of expense.participants) {
      uniqueUserIds.add(participant.userId);
    }
  }

  // Initialize userMap with relevant group members and zero balances
  for (const user of groupMembers) {
    if (uniqueUserIds.has(user.id)) {
      userMap[user.id] = {
        id: user.id,
        name: user.name,
        balance: 0,
      };
    }
  }

  // Second pass: calculate balances in one go
  for (const expense of expenses) {
    const amount = Number(expense.amount);
    groupTotal += amount;

    // Credit the payer
    userMap[expense.paidBy].balance += amount;

    // Calculate participant shares in one pass
    let totalParticipantShares = 0;
    let payerIsParticipant = false;

    for (const participant of expense.participants) {
      const share = Number(participant.share);
      totalParticipantShares += share;

      // Debit each participant
      userMap[participant.userId].balance -= share;

      // Check if payer is also a participant
      if (participant.userId === expense.paidBy) {
        payerIsParticipant = true;
      }
    }

    // Handle case where payer is not a participant but there's unassigned money
    if (!payerIsParticipant && totalParticipantShares < amount) {
      userMap[expense.paidBy].balance -= amount - totalParticipantShares;
    }
  }

  // Format balances with proper precision
  const balances: UserBalance[] = Object.values(userMap).map((user) => ({
    userId: user.id,
    userName: user.name,
    balance: parseFloat(user.balance.toFixed(2)), // Round to 2 decimal places
  }));

  return {
    balances,
    groupTotal,
  };
}

/**
 * Calculates the optimal settlement transactions to balance all users
 * Minimizes the number of transactions needed
 * @param userMap Map of users with their balances
 * @returns Array of Settlement objects
 */
export function calculateOptimalSettlements(userMap: UserMap): Settlement[] {
  const settlements: Settlement[] = [];
  const EPSILON = 0.001; // Floating point precision threshold

  // Partition and sort users by balance type
  const users = Object.values(userMap);
  const creditors = users
    .filter((user) => user.balance > EPSILON)
    .sort((a, b) => b.balance - a.balance);
  const debtors = users
    .filter((user) => user.balance < -EPSILON)
    .sort((a, b) => a.balance - b.balance);

  // Early return if no settlements needed
  if (!creditors.length || !debtors.length) {
    return settlements;
  }

  let c = 0,
    d = 0; // Use shorter variable names for indexes

  // Greedy algorithm: match highest creditor with highest debtor
  while (c < creditors.length && d < debtors.length) {
    const creditor = creditors[c];
    const debtor = debtors[d];

    // Calculate optimal settlement amount
    const settlementAmount = Math.min(
      creditor.balance,
      Math.abs(debtor.balance)
    );

    // Only create settlement if amount is significant
    if (settlementAmount > EPSILON) {
      settlements.push({
        fromUserId: debtor.id,
        fromUserName: debtor.name,
        toUserId: creditor.id,
        toUserName: creditor.name,
        amount: parseFloat(settlementAmount.toFixed(2)),
      });

      // Update balances
      creditor.balance -= settlementAmount;
      debtor.balance += settlementAmount;
    }

    // Advance to next user if current balance is settled
    if (Math.abs(creditor.balance) < EPSILON) c++;
    if (Math.abs(debtor.balance) < EPSILON) d++;
  }

  return settlements;
}

/**
 * Converts user balances to the format needed by calculateOptimalSettlements
 */
const convertBalancesToUserMap = (balances: UserBalance[]): UserMap => {
  const userMap: UserMap = {};

  for (const balance of balances) {
    userMap[balance.userId] = {
      id: balance.userId,
      name: balance.userName,
      balance: balance.balance,
    };
  }

  return userMap;
};

/**
 * Creates activity logs from expenses and settlements
 */
export const getGroupActivities = async (groupId: string) => {
  // Get all required data
  const [expenses, group] = await Promise.all([
    getExpensesByGroup(groupId),
    getGroupById(groupId),
  ]);

  return {
    expenses: expenses.map((expense) => ({
      id: expense.id,
      title: expense.title,
      amount: parseFloat(expense.amount.toString()),
      paidBy: group?.members.find((m) => m.id === expense.paidBy)?.name,
      date: expense.date,
      isReimbursement: expense.isReimbursement,
      shares: expense.participants.map((participant) => ({
        user: participant.user.name,
        share: parseFloat(participant.share.toString()),
      })),
    })),
  };
};

/**
 * Calculate settlements for a group with adjustments for already completed settlements
 * This combines data fetching and business logic for the settlements feature
 */
export async function getAdjustedGroupSettlements(groupId: string) {
  // Get all required data
  const [expenses, group] = await Promise.all([
    getExpensesByGroup(groupId),
    getGroupById(groupId),
  ]);

  if (!group) {
    throw new Error('Group not found');
  }

  // Calculate initial settlements
  const { balances, groupTotal } = calculateGroupSettlement(
    expenses,
    group.members
  );

  // Convert to format needed for recalculation and get settlements
  const userMap = convertBalancesToUserMap(balances);
  const settlements = calculateOptimalSettlements(userMap);
  const getAllParticipants = expenses
    .map((expense) =>
      expense.participants.map((participant) => participant.user.id)
    )
    .flat();
  const uniqueParticipants = [...new Set(getAllParticipants)];

  return {
    groupTotal,
    balances,
    settlements,
    allParticipants: uniqueParticipants,
  };
}
