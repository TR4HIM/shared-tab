import TrashIcon from '@/components/icons/TrashIcon';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ListboxInput } from '@/components/ui/ListBox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { formatCurrency } from '@/lib/utils';
import { RootState } from '@/store/rtk.store';
import {
  ExpenseParticipantManagerProps,
  ParticipantShare,
} from '@/types/Expense';
import { GroupMemberInput } from '@/types/Group';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

// Utility functions
const calculateRemainingAmount = (
  participants: ParticipantShare[],
  expenseAmount: number
) => {
  const totalAssigned = participants.reduce((sum, p) => sum + p.share, 0);
  return Number((expenseAmount - totalAssigned).toFixed(2));
};

const getInitialParticipants = (
  initialParticipants: ParticipantShare[],
  paidByUserId: string,
  groupMembers: GroupMemberInput[]
): ParticipantShare[] => {
  if (initialParticipants?.length > 0) {
    return [...initialParticipants];
  }

  const payer = groupMembers.find((m) => m.id === paidByUserId);
  return payer
    ? [
        {
          userId: payer.id,
          userName: payer.name,
          share: 0,
        },
      ]
    : [];
};

export function ExpenseParticipantManager({
  expenseAmount,
  paidByUserId,
  onParticipantsChange,
  initialParticipants = [],
}: Readonly<ExpenseParticipantManagerProps>) {
  const { activeGroup } = useSelector((state: RootState) => state.groups);
  const groupMembers = activeGroup?.members ?? [];
  const [participants, setParticipants] = useState<ParticipantShare[]>(
    () =>
      getInitialParticipants(initialParticipants, paidByUserId, groupMembers) ??
      []
  );
  const [error, setError] = useState<string | null>(null);

  const remainingAmount = useMemo(
    () => calculateRemainingAmount(participants, expenseAmount),
    [participants, expenseAmount]
  );

  // Notify parent component whenever participants change
  useEffect(() => {
    onParticipantsChange(participants);
  }, [participants, onParticipantsChange]);

  const assignParticipants = (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;

    const selectedGroupMembers = groupMembers.filter((m) =>
      selectedIds.includes(m.id)
    );

    if (selectedGroupMembers.length > 0) {
      const newParticipants = selectedGroupMembers.map((member) => ({
        userId: member.id,
        userName: member.name,
        share: 0,
      }));

      setParticipants([...participants, ...newParticipants]);

      setError(null);
    }
  };

  const onParticipantShareChange = (userId: string, share: number) => {
    if (share < 0) return;

    const participantIndex = participants.findIndex((p) => p.userId === userId);
    if (participantIndex === -1) return;

    const oldShare = participants[participantIndex].share;
    const deltaShare = share - oldShare;

    if (deltaShare > remainingAmount) {
      setError(
        `Cannot exceed the total expense amount of ${formatCurrency(
          expenseAmount
        )}`
      );
      return;
    }

    const cloneParticipants = [...participants];
    cloneParticipants[participantIndex] = {
      ...cloneParticipants[participantIndex],
      share: Number(share.toFixed(2)),
    };

    setParticipants(cloneParticipants);
    setError(null);
  };

  const removeParticipant = (userId: string) => {
    if (userId === paidByUserId) {
      setError('Cannot remove the person who paid for the expense');
      return;
    }

    const newParticipants = participants.filter((p) => p.userId !== userId);
    setParticipants(newParticipants);

    setError(null);
  };

  const splitEqually = () => {
    if (participants.length === 0 || expenseAmount <= 0) {
      return;
    }

    const sharePerPerson = Number(
      (expenseAmount / participants.length).toFixed(2)
    );

    const newParticipants = participants.map((p) => ({
      ...p,
      share: sharePerPerson,
    }));

    // Update the state with the new array
    setParticipants(newParticipants);
    setError(null);
  };

  const assignRemainingToPayer = () => {
    if (remainingAmount <= 0) return;

    const payerIndex = participants.findIndex((p) => p.userId === paidByUserId);
    if (payerIndex === -1) return;

    const cloneParticipants = [...participants];
    const newShare = Number(
      (cloneParticipants[payerIndex].share + remainingAmount).toFixed(2)
    );

    cloneParticipants[payerIndex] = {
      ...cloneParticipants[payerIndex],
      share: newShare,
    };

    setParticipants(cloneParticipants);
    setError(null);
  };

  const notAssignedUsers = groupMembers.filter(
    (member) => !participants.some((p) => p.userId === member.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-base font-medium">
          Remaining:{' '}
          <span
            className={remainingAmount > 0 ? 'text-amber-500' : 'text-rose-500'}
          >
            {formatCurrency(remainingAmount)}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <div className="flex-1">
          <ListboxInput
            options={notAssignedUsers.map((member) => ({
              id: member.id,
              label: member.name,
            }))}
            onChange={(e) => assignParticipants(e)}
            label="Assign Participants"
            openModal={participants.length <= 1}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-rose-700">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {participants.length > 0 ? (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table data-test-id="participant-shares">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[40%] text-left text-sm font-medium text-gray-700">
                    User
                  </TableHead>
                  <TableHead className="text-sm font-medium text-gray-700">
                    Amount
                  </TableHead>
                  <TableHead className="text-right text-sm font-medium text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant, idx) => (
                  <TableRow
                    key={participant.userId}
                    className={
                      participant.userId === paidByUserId
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    }
                    data-test-id={`participant-share-row-${idx}`}
                  >
                    <TableCell className="font-medium text-gray-900">
                      {participant.userName}
                      {participant.userId === paidByUserId && (
                        <Button
                          onClick={assignRemainingToPayer}
                          variant="elevated"
                          disabled={remainingAmount <= 0}
                          size="sm"
                          className="ml-3"
                          type="button"
                        >
                          Assign Remaining
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        data-test-id={`participant-share-input-${idx}`}
                        type="text"
                        value={participant.share.toString()}
                        onChange={(e) =>
                          onParticipantShareChange(
                            participant.userId,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        required={true}
                        className="w-28 text-right"
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        type="button"
                        onClick={() => removeParticipant(participant.userId)}
                        disabled={participant.userId === paidByUserId}
                        variant="destructive"
                        size="sm"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={splitEqually}
              variant="glassColored"
              size="sm"
            >
              Split Equally
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            No participants added yet. Add participants to split the expense.
          </p>
        </div>
      )}
    </div>
  );
}
