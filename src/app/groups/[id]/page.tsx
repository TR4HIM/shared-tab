'use client';
import ExpensesList from '@/components/ExpensesList';
import { GroupForm } from '@/components/GroupForm';
import { GroupSettlement } from '@/components/GroupSettlement';
import { GroupStats } from '@/components/GroupStats';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SettlementLog } from '@/components/SettlementLog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  useDeleteGroup,
  useGroupActivities,
  useGroupExpenses,
  useGroupSettlement,
  useUpdateGroup,
} from '@/hooks';
import { RootState, setSuccess } from '@/store/rtk.store';
import { UpdateGroupInput } from '@/types/Group';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuBadgePlus, LuCheck, LuCopy, LuTrash2 } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';

export default function GroupViewPage() {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [groupLink, setGroupLink] = useState('');

  const { activeGroup: group } = useSelector(
    (state: RootState) => state.groups
  );
  const { updateGroup, loading: updateLoading } = useUpdateGroup();
  const { deleteGroup, loading: deleteLoading } = useDeleteGroup();
  const {
    settlementResult,
    loading: settlementLoading,
    calculateSettlement,
  } = useGroupSettlement(id);

  const { getActivities, activities } = useGroupActivities(id);

  const { expenses } = useGroupExpenses(id);

  useEffect(() => {
    handleCalculate();
    getActivities();
    setGroupLink(window.location.href);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCalculate = async () => {
    await calculateSettlement();
  };

  if (!group) {
    return (
      <div className="container mx-auto py-6">
        <LoadingSpinner size="large" className="mx-auto" color="red" />
      </div>
    );
  }

  async function handleUpdateGroup(formData: UpdateGroupInput) {
    const response = await updateGroup({
      id: id,
      name: formData.name,
      description: formData.description,
      members: formData.members,
    });
    if (response.data?.success) {
      dispatch(setSuccess('Group updated successfully'));
      handleCalculate();
    }
  }

  async function handleDeleteGroup() {
    const response = await deleteGroup(id);
    if (response.data?.success) {
      router.push('/groups');
      dispatch(setSuccess('Group deleted successfully'));
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    dispatch(setSuccess('Group link copied to clipboard'));
  };

  if (!group) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-red-400 bg-red-100 text-red-700">
          <CardContent>Group not found</CardContent>
        </Card>
        <Button className="mt-4" onClick={() => router.push('/groups')}>
          Back to Groups
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{group.name}</h2>
        <div className="flex items-center gap-1">
          <span className="max-w-[200px]">
            <Input
              type="text"
              value={groupLink}
              className="hover:border-outline w-full focus:outline-none"
              readOnly
            />
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-1 p-1 text-gray-500 hover:text-gray-700"
            aria-label="Copy group link"
          >
            {copied ? (
              <LuCheck className="h-4 w-4 text-green-500" />
            ) : (
              <LuCopy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="settlements">
        <TabsList data-test-id="group-tabs-list">
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="settlements">
          <h2 className="relative mb-4 mt-4 text-xl font-semibold">
            Settlement Details
            {settlementLoading && (
              <div className="absolute left-0 right-0 top-0">
                <LoadingSpinner className="mx-auto" color="red" />
              </div>
            )}
          </h2>
          {settlementResult && (
            <GroupSettlement
              key={settlementLoading ? 'loading' : 'loaded'}
              settlementResult={settlementResult}
              loading={settlementLoading}
            />
          )}
        </TabsContent>
        <TabsContent value="expenses">
          <div className="mb-4 flex flex-row items-center justify-between pt-2">
            <h2 className="text-xl font-semibold">Group Expenses</h2>
            <Button
              size="sm"
              onClick={() => router.push(`/groups/${id}/expenses/new`)}
            >
              <LuBadgePlus />
              Add Expense
            </Button>
          </div>
          <ExpensesList expenses={expenses} />
        </TabsContent>
        <TabsContent value="settings">
          <h2 className="mb-4 mt-4 text-xl font-semibold">Group Settings</h2>
          <GroupForm
            initialValues={{
              name: group.name,
              description: group.description ?? '',
              members: group.members,
            }}
            onSubmit={handleUpdateGroup}
            onCancel={() => router.push(`/groups/${id}`)}
            submitButtonText="Update Group"
            loading={updateLoading}
            allParticipants={settlementResult?.allParticipants ?? []}
          />

          <div className="mt-8 border-t pt-6">
            <div className="flex flex-row items-center justify-end gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    data-test-id="delete-group-button"
                  >
                    <LuTrash2 className="h-4 w-4" />
                    Delete Group
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the group and all of its expenses.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteGroup}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete Group'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="logs">
          <div className="mb-6">
            <h2 className="mb-4 mt-4 text-xl font-semibold">Activity Logs</h2>
            {activities && activities?.expenses.length > 0 ? (
              <SettlementLog activityLogs={activities} />
            ) : (
              <p className="text-center text-sm">
                No activity logs available yet.
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="stats">
          <h2 className="mb-4 mt-4 text-xl font-semibold">Group Stats</h2>
          {settlementResult ? (
            <GroupStats settlementResult={settlementResult} />
          ) : (
            <p>No stats available yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
