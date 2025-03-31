import * as groupService from '@/services/groupService';
import { ZodError } from 'zod';
import { GET, POST } from '../route';

// Mock the groupService module
jest.mock('@/services/groupService');

describe('Groups API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/groups', () => {
    it('should return groups and success message', async () => {
      // Mock data
      const mockGroups = [
        {
          id: 'group1',
          name: 'Family Trip',
          description: 'Our family vacation',
          currency: 'MAD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          members: [
            {
              id: 'member1',
              name: 'Alice',
              groupId: 'group1',
              joinedAt: new Date().toISOString(),
            },
            {
              id: 'member2',
              name: 'Bob',
              groupId: 'group1',
              joinedAt: new Date().toISOString(),
            },
          ],
        },
      ];

      // Mock the service function
      (groupService.getGroups as jest.Mock).mockResolvedValue(mockGroups);

      // Call the API handler directly
      const response = await GET();

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockGroups);
      expect(jsonResponse.message).toBe('Groups fetched successfully');
      expect(groupService.getGroups).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and return error response', async () => {
      // Mock the service function to throw an error
      const errorMessage = 'Database connection error';
      (groupService.getGroups as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      // Call the API handler directly
      const response = await GET();

      // Assert the response
      expect(response.status).toBe(500);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.code).toBe('INTERNAL_SERVER_ERROR');
      expect(jsonResponse.error.message).toBe(errorMessage);
      expect(jsonResponse.error.status).toBe(500);
      expect(groupService.getGroups).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/groups', () => {
    it('should create a group and return success message', async () => {
      // Mock request body
      const mockRequestBody = {
        name: 'New Group',
        description: 'A test group',
        currency: 'USD',
        members: [
          { id: 'member1', name: 'Alice' },
          { id: 'member2', name: 'Bob' },
        ],
      };

      // Mock created group
      const mockCreatedGroup = {
        id: 'newgroup1',
        ...mockRequestBody,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock the service function
      (groupService.createGroup as jest.Mock).mockResolvedValue(
        mockCreatedGroup
      );

      // Create a mock request with the body
      const req = new Request('http://localhost:3000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequestBody),
      });

      // Call the API handler directly
      const response = await POST(req);

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockCreatedGroup);
      expect(jsonResponse.message).toBe('Group created successfully');
      expect(groupService.createGroup).toHaveBeenCalledTimes(1);
      expect(groupService.createGroup).toHaveBeenCalledWith(mockRequestBody);
    });

    it('should handle validation errors', async () => {
      // Mock request with invalid data
      const mockRequestBody = {
        name: '', // Invalid: empty name
        members: [], // Invalid: empty members array
      };

      // Mock Zod validation error
      const zodError = new ZodError([
        {
          code: 'too_small',
          minimum: 1,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'Group name is required',
          path: ['name'],
        },
        {
          code: 'too_small',
          minimum: 1,
          type: 'array',
          inclusive: true,
          exact: false,
          message: 'At least one member is required',
          path: ['members'],
        },
      ]);

      // Mock the parse function to throw a validation error
      jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        throw zodError;
      });

      // Create a mock request with the invalid body
      const req = new Request('http://localhost:3000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequestBody),
      });

      // Mock the createGroup function to throw a ZodError when parsing
      jest.spyOn(JSON, 'parse').mockImplementationOnce(() => mockRequestBody);
      (groupService.createGroup as jest.Mock).mockImplementation(() => {
        throw zodError;
      });

      // Call the API handler directly
      const response = await POST(req);

      // Assert the response
      expect(response.status).toBe(400);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.code).toBe('BAD_REQUEST');
      expect(groupService.createGroup).not.toHaveBeenCalled();
    });

    it('should handle server errors during creation', async () => {
      // Mock request body
      const mockRequestBody = {
        name: 'New Group',
        description: 'A test group',
        currency: 'USD',
        members: [
          { id: 'member1', name: 'Alice' },
          { id: 'member2', name: 'Bob' },
        ],
      };

      // Mock service error
      const errorMessage = 'Database error during creation';
      (groupService.createGroup as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      // Create a mock request with the body
      const req = new Request('http://localhost:3000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequestBody),
      });

      // Call the API handler directly
      const response = await POST(req);

      // Assert the response
      expect(response.status).toBe(500);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.code).toBe('INTERNAL_SERVER_ERROR');
      expect(jsonResponse.error.message).toBe(errorMessage);
      expect(jsonResponse.error.status).toBe(500);
    });
  });
});
