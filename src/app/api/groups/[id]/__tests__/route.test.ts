import * as groupService from '@/services/groupService';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { DELETE, GET, PATCH } from '../route';

// Mock the groupService module
jest.mock('@/services/groupService');

describe('Group By ID API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/groups/[id]', () => {
    it('should return a group when found', async () => {
      // Mock data
      const mockGroup = {
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
      };
      const mockParams = Promise.resolve({ id: 'group1' });

      // Mock the service function
      (groupService.getGroupById as jest.Mock).mockResolvedValue(mockGroup);

      // Call the API handler directly
      const req = new NextRequest('http://localhost:3000/api/groups/group1', {
        method: 'GET',
      });
      const response = await GET(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockGroup);
      expect(jsonResponse.message).toBe('Group fetched successfully');
      expect(groupService.getGroupById).toHaveBeenCalledTimes(1);
      expect(groupService.getGroupById).toHaveBeenCalledWith('group1');
    });

    it('should return 404 when group not found', async () => {
      // Mock params
      const mockParams = Promise.resolve({ id: 'nonexistent' });

      // Mock the service function to return null (not found)
      (groupService.getGroupById as jest.Mock).mockResolvedValue(null);

      // Call the API handler directly
      const req = new NextRequest(
        'http://localhost:3000/api/groups/nonexistent',
        {
          method: 'GET',
        }
      );
      const response = await GET(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(404);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.code).toBe('NOT_FOUND');
      expect(jsonResponse.error.message).toBe('Group not found');
      expect(jsonResponse.error.status).toBe(404);
      expect(groupService.getGroupById).toHaveBeenCalledTimes(1);
      expect(groupService.getGroupById).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle errors and return error response', async () => {
      // Mock params
      const mockParams = Promise.resolve({ id: 'group1' });

      // Mock the service function to throw an error
      const errorMessage = 'Database connection error';
      (groupService.getGroupById as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      // Call the API handler directly
      const req = new NextRequest('http://localhost:3000/api/groups/group1', {
        method: 'GET',
      });
      const response = await GET(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(500);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.code).toBe('INTERNAL_SERVER_ERROR');
      expect(jsonResponse.error.message).toBe(errorMessage);
      expect(jsonResponse.error.status).toBe(500);
      expect(groupService.getGroupById).toHaveBeenCalledTimes(1);
      expect(groupService.getGroupById).toHaveBeenCalledWith('group1');
    });
  });

  describe('PATCH /api/groups/[id]', () => {
    it('should update a group when valid data is provided', async () => {
      // Mock data
      const mockParams = Promise.resolve({ id: 'group1' });
      const mockRequestBody = {
        name: 'Updated Group Name',
        description: 'Updated description',
      };

      const mockUpdatedGroup = {
        id: 'group1',
        name: 'Updated Group Name',
        description: 'Updated description',
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
        ],
      };

      // Mock the service functions
      (groupService.getGroupById as jest.Mock).mockResolvedValue({
        id: 'group1',
        name: 'Original Group Name',
        description: 'Original description',
        currency: 'MAD',
      });

      (groupService.updateGroup as jest.Mock).mockResolvedValue(
        mockUpdatedGroup
      );

      // Create a mock request
      const req = new Request('http://localhost:3000/api/groups/group1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequestBody),
      });

      // Call the API handler directly
      const response = await PATCH(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockUpdatedGroup);
      expect(jsonResponse.message).toBe('Group updated successfully');
      expect(groupService.getGroupById).toHaveBeenCalledTimes(1);
      expect(groupService.getGroupById).toHaveBeenCalledWith('group1');
      expect(groupService.updateGroup).toHaveBeenCalledTimes(1);
      expect(groupService.updateGroup).toHaveBeenCalledWith(
        'group1',
        mockRequestBody
      );
    });

    it('should return 404 when trying to update a non-existent group', async () => {
      // Mock params
      const mockParams = Promise.resolve({ id: 'nonexistent' });
      const mockRequestBody = {
        name: 'Updated Group Name',
      };

      // Mock the service function to return null (not found)
      (groupService.getGroupById as jest.Mock).mockResolvedValue(null);

      // Create a mock request
      const req = new Request('http://localhost:3000/api/groups/nonexistent', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequestBody),
      });

      // Call the API handler directly
      const response = await PATCH(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(404);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.code).toBe('NOT_FOUND');
      expect(jsonResponse.error.message).toBe('Group not found');
      expect(jsonResponse.error.status).toBe(404);
      expect(groupService.getGroupById).toHaveBeenCalledTimes(1);
      expect(groupService.updateGroup).not.toHaveBeenCalled();
    });

    it('should handle validation errors during update', async () => {
      // Mock params and body
      const mockParams = Promise.resolve({ id: 'group1' });
      const mockRequestBody = {
        members: [
          { name: '' }, // Invalid: empty name
        ],
      };

      // Mock the existing group
      (groupService.getGroupById as jest.Mock).mockResolvedValue({
        id: 'group1',
        name: 'Original Group Name',
        description: 'Original description',
        currency: 'MAD',
      });

      // Mock Zod validation error
      const zodError = new ZodError([
        {
          code: 'too_small',
          minimum: 1,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'Name is required',
          path: ['members', 0, 'name'],
        },
      ]);

      // Create a mock request
      const req = new Request('http://localhost:3000/api/groups/group1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequestBody),
      });

      // Mock the validation to throw an error
      jest.spyOn(JSON, 'parse').mockImplementationOnce(() => mockRequestBody);
      jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        throw zodError;
      });

      // Make the handler throw validation error
      (groupService.updateGroup as jest.Mock).mockImplementation(() => {
        throw zodError;
      });

      // Call the API handler directly
      const response = await PATCH(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(400);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(false);
    });
  });

  describe('DELETE /api/groups/[id]', () => {
    it('should delete a group and return success message', async () => {
      // Mock data
      const mockParams = Promise.resolve({ id: 'group1' });
      const mockDeletedGroup = {
        id: 'group1',
        name: 'Group to delete',
        description: 'Will be deleted',
        currency: 'MAD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [],
      };

      // Mock the service function
      (groupService.deleteGroup as jest.Mock).mockResolvedValue(
        mockDeletedGroup
      );

      // Call the API handler directly
      const req = new NextRequest('http://localhost:3000/api/groups/group1', {
        method: 'DELETE',
      });
      const response = await DELETE(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockDeletedGroup);
      expect(jsonResponse.message).toBe('Group deleted successfully');
      expect(groupService.deleteGroup).toHaveBeenCalledTimes(1);
      expect(groupService.deleteGroup).toHaveBeenCalledWith('group1');
    });

    it('should handle errors during deletion', async () => {
      // Mock params
      const mockParams = Promise.resolve({ id: 'group1' });

      // Mock the service function to throw an error
      const errorMessage = 'Error deleting group';
      (groupService.deleteGroup as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      // Call the API handler directly
      const req = new NextRequest('http://localhost:3000/api/groups/group1', {
        method: 'DELETE',
      });
      const response = await DELETE(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(500);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(false);
      expect(jsonResponse.error.code).toBe('INTERNAL_SERVER_ERROR');
      expect(jsonResponse.error.message).toBe(errorMessage);
      expect(jsonResponse.error.status).toBe(500);
      expect(groupService.deleteGroup).toHaveBeenCalledTimes(1);
      expect(groupService.deleteGroup).toHaveBeenCalledWith('group1');
    });
  });
});
