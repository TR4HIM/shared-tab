import * as expenseService from '@/services/expenseService';
import { NextRequest } from 'next/server';
import { GET } from '../route';

// Mock the expenseService module
jest.mock('@/services/expenseService');

describe('Category By ID API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/categories/[id]', () => {
    it('should return a category when found', async () => {
      // Mock data
      const mockCategory = { id: 'cat1', name: 'Food', icon: '🍔' };
      const mockParams = Promise.resolve({ id: 'cat1' });

      // Mock the service function
      (expenseService.getExpenseCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      // Call the API handler directly
      const req = new NextRequest('http://localhost:3000/api/categories/cat1', {
        method: 'GET',
      });
      const response = await GET(req, { params: mockParams });

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockCategory);
      expect(jsonResponse.message).toBe('Category fetched successfully');
      expect(expenseService.getExpenseCategory).toHaveBeenCalledTimes(1);
      expect(expenseService.getExpenseCategory).toHaveBeenCalledWith('cat1');
    });

    it('should return 404 when category not found', async () => {
      // Mock params
      const mockParams = Promise.resolve({ id: 'nonexistent' });

      // Mock the service function to return null (not found)
      (expenseService.getExpenseCategory as jest.Mock).mockResolvedValue(null);

      // Call the API handler directly
      const req = new NextRequest(
        'http://localhost:3000/api/categories/nonexistent',
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
      expect(jsonResponse.error.message).toBe('Category not found');
      expect(jsonResponse.error.status).toBe(404);
      expect(expenseService.getExpenseCategory).toHaveBeenCalledTimes(1);
      expect(expenseService.getExpenseCategory).toHaveBeenCalledWith(
        'nonexistent'
      );
    });

    it('should handle errors and return error response', async () => {
      // Mock params
      const mockParams = Promise.resolve({ id: 'cat1' });

      // Mock the service function to throw an error
      const errorMessage = 'Database connection error';
      (expenseService.getExpenseCategory as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      // Call the API handler directly
      const req = new NextRequest('http://localhost:3000/api/categories/cat1', {
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
      expect(expenseService.getExpenseCategory).toHaveBeenCalledTimes(1);
      expect(expenseService.getExpenseCategory).toHaveBeenCalledWith('cat1');
    });
  });
});
