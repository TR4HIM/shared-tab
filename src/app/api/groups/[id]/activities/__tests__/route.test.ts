import * as settlementUtils from '@/lib/settlementUtils';
import { NextRequest } from 'next/server';
import { GET } from '../route';

// Mock the settlementUtils module
jest.mock('@/lib/settlementUtils');

describe('Group Activities API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/groups/[id]/activities', () => {
    it('should return group activities when found', async () => {
      // Mock data
      const mockActivities = {
        expenses: [
          {
            id: 'exp1',
            title: 'Dinner',
            amount: 90,
            paidBy: 'Alice',
            date: new Date().toISOString(),
            isReimbursement: false,
            shares: [
              { user: 'Alice', share: 30 },
              { user: 'Bob', share: 30 },
              { user: 'Charlie', share: 30 },
            ],
          },
        ],
      };
      const mockParams = Promise.resolve({ id: 'group1' });

      // Mock the util function
      (settlementUtils.getGroupActivities as jest.Mock).mockResolvedValue(
        mockActivities
      );

      // Call the API handler directly
      const req = new NextRequest(
        'http://localhost:3000/api/groups/group1/activities',
        {
          method: 'GET',
        }
      );
      const response = await GET(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockActivities);
      expect(jsonResponse.message).toBe(
        'Group activities fetched successfully'
      );
      expect(settlementUtils.getGroupActivities).toHaveBeenCalledTimes(1);
      expect(settlementUtils.getGroupActivities).toHaveBeenCalledWith('group1');
    });

    it('should handle errors and return error response', async () => {
      // Mock params
      const mockParams = Promise.resolve({ id: 'group1' });

      // Mock the util function to throw an error
      const errorMessage = 'Failed to fetch activities';
      (settlementUtils.getGroupActivities as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      // Call the API handler directly
      const req = new NextRequest(
        'http://localhost:3000/api/groups/group1/activities',
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
      expect(settlementUtils.getGroupActivities).toHaveBeenCalledTimes(1);
      expect(settlementUtils.getGroupActivities).toHaveBeenCalledWith('group1');
    });
  });
});
