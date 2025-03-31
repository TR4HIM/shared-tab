import { CreateGroupInput, GroupInput, UpdateGroupInput } from '@/types/Group';
import { SuccessResponse } from '@/types/Responses';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const groupsApi = createApi({
  reducerPath: 'groupsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Groups'],
  endpoints: (builder) => ({
    getGroups: builder.query<SuccessResponse<GroupInput[]>, void>({
      query: () => 'groups',
      providesTags: ['Groups'],
    }),
    getGroup: builder.query<SuccessResponse<GroupInput>, string>({
      query: (id) => `groups/${id}`,
    }),
    createGroup: builder.mutation<
      SuccessResponse<GroupInput>,
      CreateGroupInput
    >({
      query: (group) => ({
        url: 'groups',
        method: 'POST',
        body: group,
      }),
      invalidatesTags: ['Groups'],
    }),
    updateGroup: builder.mutation<
      SuccessResponse<GroupInput>,
      UpdateGroupInput
    >({
      query: (group) => ({
        url: `groups/${group.id}`,
        method: 'PATCH',
        body: group,
      }),
      invalidatesTags: ['Groups'],
    }),
    deleteGroup: builder.mutation<SuccessResponse<GroupInput>, string>({
      query: (id) => ({
        url: `groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Groups'],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApi;
