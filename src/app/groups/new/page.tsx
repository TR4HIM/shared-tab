'use client';
import { GroupForm } from '@/components/GroupForm';
import { useCreateGroup } from '@/hooks';
import { addUserGroup } from '@/store/rtk.store';
import { CreateGroupInput } from '@/types/Group';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function NewGroupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState<CreateGroupInput>({
    name: '',
    description: '',
    members: [],
    currency: 'MAD',
  });
  const { createGroup, loading } = useCreateGroup();

  useEffect(() => {
    setInitialValues({
      name: '',
      description: '',
      members: [],
      currency: 'MAD',
    });
  }, []);

  async function handleSubmit(formData: CreateGroupInput) {
    const { data: res } = await createGroup(formData);
    if (res?.success) {
      // Save the created group to userGroups
      dispatch(addUserGroup(res.data.id));
      // Refresh the groups using the RTK query
      router.push(`/groups/${res.data.id}`);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <GroupForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/groups')}
        submitButtonText="Create Group"
        loading={loading}
        allParticipants={[]}
      />
    </div>
  );
}
