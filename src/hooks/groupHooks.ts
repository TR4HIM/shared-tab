'use client';
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupQuery,
  useGetGroupsQuery,
  useUpdateGroupMutation,
} from '@/services/groupsApi';
import { RootState } from '@/store/rtk.store';
import { useSelector } from 'react-redux';

export function useGroups() {
  const { data: groups, isLoading, error, isError } = useGetGroupsQuery();
  const userGroupIds = useSelector(
    (state: RootState) => state.userGroups.groupIds
  );

  // Return all groups if not filtering, or filter by user's created groups
  const filteredGroups =
    groups?.data?.filter((group) => userGroupIds.includes(group.id)) ?? [];

  return {
    groups: filteredGroups,
    allGroups: groups?.data,
    loading: isLoading,
    error: error,
    isError: isError,
  };
}

export function useGroup(id: string) {
  const { data: group, isLoading, error, isError } = useGetGroupQuery(id);
  return { group: group?.data, loading: isLoading, error, isError };
}

export function useCreateGroup() {
  const [createGroup, { isLoading, error, isError }] = useCreateGroupMutation();
  return { createGroup, loading: isLoading, error, isError };
}

export function useUpdateGroup() {
  const [updateGroup, { isLoading, error, isError }] = useUpdateGroupMutation();
  return { updateGroup, loading: isLoading, error, isError };
}

export function useDeleteGroup() {
  const [deleteGroup, { isLoading, error, isError }] = useDeleteGroupMutation();

  return { deleteGroup, loading: isLoading, error, isError };
}
