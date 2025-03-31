import * as settlementUtils from '@/lib/settlementUtils';
import { NextRequest } from 'next/server';
import { GET } from '../route';

// Mock the settlementUtils module
jest.mock('@/lib/settlementUtils');

describe('Group Settlements API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/groups/[id]/settlements', () => {
    it('should return settlement calculations when found', async () => {
      // Mock data
      const mockSettlements = {
        groupTotal: 90,
        balances: [
          { userId: 'user1', userName: 'Alice', balance: 60 },
          { userId: 'user2', userName: 'Bob', balance: -30 },
          { userId: 'user3', userName: 'Charlie', balance: -30 },
        ],
        settlements: [
          {
            from: 'user2',
            to: 'user1',
            amount: 30,
            fromName: 'Bob',
            toName: 'Alice',
          },
          {
            from: 'user3',
            to: 'user1',
            amount: 30,
            fromName: 'Charlie',
            toName: 'Alice',
          },
        ],
        allParticipants: ['user1', 'user2', 'user3'],
      };
      const mockParams = Promise.resolve({ id: 'group1' });

      // Mock the service function
      (
        settlementUtils.getAdjustedGroupSettlements as jest.Mock
      ).mockResolvedValue(mockSettlements);

      // Call the API handler directly
      const req = new NextRequest(
        'http://localhost:3000/api/groups/group1/settlements',
        {
          method: 'GET',
        }
      );
      const response = await GET(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockSettlements);
      expect(jsonResponse.message).toBe(
        'Group settlements calculated successfully'
      );
      expect(settlementUtils.getAdjustedGroupSettlements).toHaveBeenCalledTimes(
        1
      );
      expect(settlementUtils.getAdjustedGroupSettlements).toHaveBeenCalledWith(
        'group1'
      );
    });

    it('should handle errors and return error response', async () => {
      // Mock params
      const mockParams = Promise.resolve({ id: 'group1' });

      // Mock the service function to throw an error
      const errorMessage = 'Failed to calculate settlements';
      (
        settlementUtils.getAdjustedGroupSettlements as jest.Mock
      ).mockRejectedValue(new Error(errorMessage));

      // Call the API handler directly
      const req = new NextRequest(
        'http://localhost:3000/api/groups/group1/settlements',
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
      expect(settlementUtils.getAdjustedGroupSettlements).toHaveBeenCalledTimes(
        1
      );
      expect(settlementUtils.getAdjustedGroupSettlements).toHaveBeenCalledWith(
        'group1'
      );
    });
  });
});
