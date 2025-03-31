import {
  convertToErrorResponse,
  loadUserGroups,
  saveUserGroups,
} from '@/lib/helpers';
import { groupsApi } from '@/services/groupsApi';
import { GroupInput } from '@/types/Group';
import { ErrorResponse } from '@/types/Responses';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Create a slice for locally stored user groups
const userGroupsSlice = createSlice({
  name: 'userGroups',
  initialState: {
    groupIds: loadUserGroups(),
  },
  reducers: {
    addUserGroup: (state, action: PayloadAction<string>) => {
      if (!state.groupIds.includes(action.payload)) {
        state.groupIds.push(action.payload);
        saveUserGroups(state.groupIds);
      }
    },
    removeUserGroup: (state, action: PayloadAction<string>) => {
      state.groupIds = state.groupIds.filter((id) => id !== action.payload);
      saveUserGroups(state.groupIds);
    },
  },
});

// Create a slice for groups
const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    activeGroup: null as GroupInput | null,
    loading: true,
    error: null as ErrorResponse | null,
    success: null as string | null,
  },
  reducers: {
    setActiveGroup: (state, action: PayloadAction<GroupInput | null>) => {
      state.activeGroup = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<ErrorResponse | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(groupsApi.endpoints.getGroup.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        groupsApi.endpoints.getGroup.matchFulfilled,
        (state, action) => {
          state.activeGroup = action.payload.data;
          state.loading = false;
        }
      )
      .addMatcher(
        groupsApi.endpoints.getGroup.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = convertToErrorResponse(action.payload ?? action.error);
        }
      )
      .addMatcher(
        groupsApi.endpoints.updateGroup.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = convertToErrorResponse(action.payload ?? action.error);
        }
      )
      .addMatcher(
        groupsApi.endpoints.updateGroup.matchFulfilled,
        (state, action) => {
          state.activeGroup = action.payload.data;
        }
      )
      .addMatcher(groupsApi.endpoints.updateGroup.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(groupsApi.endpoints.deleteGroup.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(groupsApi.endpoints.deleteGroup.matchFulfilled, (state) => {
        state.loading = false;
      })
      .addMatcher(
        groupsApi.endpoints.deleteGroup.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = convertToErrorResponse(action.payload ?? action.error);
        }
      );
  },
});

export const store = configureStore({
  reducer: {
    groups: groupsSlice.reducer,
    userGroups: userGroupsSlice.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(groupsApi.middleware),
});

// Export actions
export const { setActiveGroup, setLoading, setError, setSuccess } =
  groupsSlice.actions;
export const { addUserGroup, removeUserGroup } = userGroupsSlice.actions;

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
