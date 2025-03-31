import { GroupMember } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import '@testing-library/jest-dom';
import { ExpenseWithRelations } from '../../types/Expense';
import { calculateGroupSettlement } from '../settlementUtils';

// Create a Decimal factory function for easier mocking
const createDecimal = (value: number): Decimal => {
  return new Decimal(value);
};

// Mock data
const mockUsers: GroupMember[] = [
  {
    id: 'user1',
    name: 'Alice',
    groupId: 'group1',
    joinedAt: new Date(),
  },
  {
    id: 'user2',
    name: 'Bob',
    groupId: 'group1',
    joinedAt: new Date(),
  },
  {
    id: 'user3',
    name: 'Charlie',
    groupId: 'group1',
    joinedAt: new Date(),
  },
];

describe('settlementUtils', () => {
  describe('calculateGroupSettlement', () => {
    test('should handle empty expenses array', () => {
      const result = calculateGroupSettlement([], mockUsers);

      expect(result).toEqual({
        balances: [],
        groupTotal: 0,
      });
    });

    test('should calculate balances for a simple expense with equal splits', () => {
      const mockExpenses: ExpenseWithRelations[] = [
        {
          id: 'exp1',
          title: 'Dinner',
          amount: createDecimal(90),
          date: new Date(),
          paidBy: 'user1',
          groupId: 'group1',
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: 'category1',
          isReimbursement: false,
          participants: [
            {
              id: 'part1',
              expenseId: 'exp1',
              userId: 'user1',
              share: createDecimal(30),
              createdAt: new Date(),
              user: mockUsers[0],
            },
            {
              id: 'part2',
              expenseId: 'exp1',
              userId: 'user2',
              share: createDecimal(30),
              createdAt: new Date(),
              user: mockUsers[1],
            },
            {
              id: 'part3',
              expenseId: 'exp1',
              userId: 'user3',
              share: createDecimal(30),
              createdAt: new Date(),
              user: mockUsers[2],
            },
          ],
        },
      ];

      const result = calculateGroupSettlement(mockExpenses, mockUsers);

      // Verify balances
      expect(result.groupTotal).toBe(90);

      // Alice paid 90 but owes 30, so net balance is 60
      const aliceBalance = result.balances.find((b) => b.userId === 'user1');
      expect(aliceBalance?.balance).toBe(60);

      // Bob owes 30
      const bobBalance = result.balances.find((b) => b.userId === 'user2');
      expect(bobBalance?.balance).toBe(-30);

      // Charlie owes 30
      const charlieBalance = result.balances.find((b) => b.userId === 'user3');
      expect(charlieBalance?.balance).toBe(-30);
    });

    test('should calculate balances for multiple expenses with complex distributions', () => {
      const mockExpenses: ExpenseWithRelations[] = [
        // Expense 1: Alice pays 100, split between all three
        {
          id: 'exp1',
          title: 'Groceries',
          amount: createDecimal(100),
          date: new Date(),
          paidBy: 'user1',
          groupId: 'group1',
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: 'category1',
          isReimbursement: false,
          participants: [
            {
              id: 'part1',
              expenseId: 'exp1',
              userId: 'user1',
              share: createDecimal(33.33),
              createdAt: new Date(),
              user: mockUsers[0],
            },
            {
              id: 'part2',
              expenseId: 'exp1',
              userId: 'user2',
              share: createDecimal(33.33),
              createdAt: new Date(),
              user: mockUsers[1],
            },
            {
              id: 'part3',
              expenseId: 'exp1',
              userId: 'user3',
              share: createDecimal(33.34),
              createdAt: new Date(),
              user: mockUsers[2],
            },
          ],
        },
        // Expense 2: Bob pays 60, split between Bob and Charlie
        {
          id: 'exp2',
          title: 'Movie tickets',
          amount: createDecimal(60),
          date: new Date(),
          paidBy: 'user2',
          groupId: 'group1',
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: 'category1',
          isReimbursement: false,
          participants: [
            {
              id: 'part4',
              expenseId: 'exp2',
              userId: 'user2',
              share: createDecimal(30),
              createdAt: new Date(),
              user: mockUsers[1],
            },
            {
              id: 'part5',
              expenseId: 'exp2',
              userId: 'user3',
              share: createDecimal(30),
              createdAt: new Date(),
              user: mockUsers[2],
            },
          ],
        },
        // Expense 3: Charlie pays 45, all for Alice
        {
          id: 'exp3',
          title: 'Gift',
          amount: createDecimal(45),
          date: new Date(),
          paidBy: 'user3',
          groupId: 'group1',
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: 'category1',
          isReimbursement: false,
          participants: [
            {
              id: 'part6',
              expenseId: 'exp3',
              userId: 'user1',
              share: createDecimal(45),
              createdAt: new Date(),
              user: mockUsers[0],
            },
          ],
        },
      ];

      const result = calculateGroupSettlement(mockExpenses, mockUsers);
      // Verify groupTotal
      expect(result.groupTotal).toBe(205); // 100 + 60 + 45

      // Check individual balances
      const aliceBalance = result.balances.find((b) => b.userId === 'user1');
      const bobBalance = result.balances.find((b) => b.userId === 'user2');
      const charlieBalance = result.balances.find((b) => b.userId === 'user3');

      // Using toBeCloseTo for floating point comparisons
      expect(aliceBalance?.balance).toBeCloseTo(21.67, 1);
      expect(bobBalance?.balance).toBeCloseTo(-3.33, 1);
      expect(charlieBalance?.balance).toBeCloseTo(-18.34, 1);
    });

    test('should handle an expense where payer is not a participant', () => {
      const mockExpenses: ExpenseWithRelations[] = [
        {
          id: 'exp1',
          title: 'Event tickets',
          amount: createDecimal(100),
          date: new Date(),
          paidBy: 'user1',
          groupId: 'group1',
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: 'category1',
          isReimbursement: false,
          participants: [
            {
              id: 'part1',
              expenseId: 'exp1',
              userId: 'user2',
              share: createDecimal(50),
              createdAt: new Date(),
              user: mockUsers[1],
            },
            {
              id: 'part2',
              expenseId: 'exp1',
              userId: 'user3',
              share: createDecimal(50),
              createdAt: new Date(),
              user: mockUsers[2],
            },
          ],
        },
      ];

      const result = calculateGroupSettlement(mockExpenses, mockUsers);

      // Alice paid 100 but doesn't have a share, so her balance is 100
      const aliceBalance = result.balances.find((b) => b.userId === 'user1');
      expect(aliceBalance?.balance).toBe(100);

      // Bob and Charlie each owe 50
      const bobBalance = result.balances.find((b) => b.userId === 'user2');
      const charlieBalance = result.balances.find((b) => b.userId === 'user3');
      expect(bobBalance?.balance).toBe(-50);
      expect(charlieBalance?.balance).toBe(-50);
    });

    test('should handle the case where total shares are less than expense amount', () => {
      const mockExpenses: ExpenseWithRelations[] = [
        {
          id: 'exp1',
          title: 'Lunch',
          amount: createDecimal(120),
          date: new Date(),
          paidBy: 'user1',
          groupId: 'group1',
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: 'category1',
          isReimbursement: false,
          participants: [
            {
              id: 'part1',
              expenseId: 'exp1',
              userId: 'user2',
              share: createDecimal(40),
              createdAt: new Date(),
              user: mockUsers[1],
            },
            {
              id: 'part2',
              expenseId: 'exp1',
              userId: 'user3',
              share: createDecimal(40),
              createdAt: new Date(),
              user: mockUsers[2],
            },
          ],
        },
      ];

      const result = calculateGroupSettlement(mockExpenses, mockUsers);

      // Total assigned shares are 80, expense is 120
      // Payer (Alice) should have a balance of 120 (paid) - 40 (implicit share) = 80
      const aliceBalance = result.balances.find((b) => b.userId === 'user1');
      expect(aliceBalance?.balance).toBe(80);

      // Bob and Charlie each owe 40
      const bobBalance = result.balances.find((b) => b.userId === 'user2');
      const charlieBalance = result.balances.find((b) => b.userId === 'user3');
      expect(bobBalance?.balance).toBe(-40);
      expect(charlieBalance?.balance).toBe(-40);
    });
  });
});
