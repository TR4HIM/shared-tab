import * as expenseService from '@/services/expenseService';
import { NextRequest } from 'next/server';
import { GET } from '../route';

// Mock the expenseService module
jest.mock('@/services/expenseService');

describe('Expense Participants API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/groups/[id]/expenses/[expenseId]/participants', () => {
    it('should return expense participants when found', async () => {
      // Mock data
      const mockParticipants = [
        {
          id: 'part1',
          expenseId: 'exp1',
          userId: 'user1',
          share: 30,
          createdAt: new Date().toISOString(),
          user: {
            id: 'user1',
            name: 'Alice',
            groupId: 'group1',
            joinedAt: new Date().toISOString(),
          },
          expense: {
            id: 'exp1',
            title: 'Dinner',
            amount: 90,
            date: new Date().toISOString(),
            paidBy: 'user1',
            groupId: 'group1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            categoryId: 'cat1',
            isReimbursement: false,
          },
        },
        {
          id: 'part2',
          expenseId: 'exp1',
          userId: 'user2',
          share: 30,
          createdAt: new Date().toISOString(),
          user: {
            id: 'user2',
            name: 'Bob',
            groupId: 'group1',
            joinedAt: new Date().toISOString(),
          },
          expense: {
            id: 'exp1',
            title: 'Dinner',
            amount: 90,
            date: new Date().toISOString(),
            paidBy: 'user1',
            groupId: 'group1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            categoryId: 'cat1',
            isReimbursement: false,
          },
        },
      ];
      const mockParams = Promise.resolve({ id: 'group1', expenseId: 'exp1' });

      // Mock the service function
      (expenseService.getExpenseParticipants as jest.Mock).mockResolvedValue(
        mockParticipants
      );

      // Call the API handler directly
      const req = new NextRequest(
        'http://localhost:3000/api/groups/group1/expenses/exp1/participants',
        {
          method: 'GET',
        }
      );
      const response = await GET(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockParticipants);
      expect(jsonResponse.message).toBe(
        'Expense participants fetched successfully'
      );
      expect(expenseService.getExpenseParticipants).toHaveBeenCalledTimes(1);
      expect(expenseService.getExpenseParticipants).toHaveBeenCalledWith(
        'exp1'
      );
    });

    it('should handle errors and return error response', async () => {
      // Mock params
      const mockParams = Promise.resolve({ id: 'group1', expenseId: 'exp1' });

      // Mock the service function to throw an error
      const errorMessage = 'Failed to fetch participants';
      (expenseService.getExpenseParticipants as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      // Call the API handler directly
      const req = new NextRequest(
        'http://localhost:3000/api/groups/group1/expenses/exp1/participants',
        {
          method: 'GET',
        }
      );
      const response = await GET(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(500);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.code).toBe('INTERNAL_SERVER_ERROR');
      expect(jsonResponse.error.message).toBe(errorMessage);
      expect(jsonResponse.error.status).toBe(500);
      expect(expenseService.getExpenseParticipants).toHaveBeenCalledTimes(1);
      expect(expenseService.getExpenseParticipants).toHaveBeenCalledWith(
        'exp1'
      );
    });
  });
});
