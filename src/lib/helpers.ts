import {
  ErrorResponse,
  errorResponse as errorResponseType,
  SuccessResponse,
} from '@/types/Responses';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function successResponse<T>(
  data: T,
  message: string
): SuccessResponse<T> {
  return { success: true, data, message };
}

export function errorResponse(
  code: string,
  message: string,
  status: number
): ErrorResponse {
  return {
    success: false,
    error: { code, message, status },
  };
}

export function convertToErrorResponse(
  error: FetchBaseQueryError | SerializedError
): ErrorResponse {
  if (error && 'data' in error) {
    const knownError = errorResponseType.safeParse(error.data);
    if (knownError.success) {
      return knownError.data;
    }
    return {
      success: false,
      error: {
        code:
          (error.data as { code?: string }).code?.toString() ?? 'UNKNOWN_ERROR',
        message:
          (error.data as { message?: string }).message ??
          'An unknown error occurred',
      },
    };
  }

  return {
    success: false,
    error: {
      code: 'NETWORK_ERROR',
      message: 'Failed to fetch data from the server',
    },
  };
}

// Load user's groups from localStorage
export const loadUserGroups = (): string[] => {
  if (typeof window !== 'undefined') {
    const storedGroups = localStorage.getItem('userGroups');
    return storedGroups ? JSON.parse(storedGroups) : [];
  }
  return [];
};

// Save user's groups to localStorage
export const saveUserGroups = (groups: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userGroups', JSON.stringify(groups));
  }
};
