import { ExpenseCategory } from '@/hooks/categoryHooks';
import * as expenseService from '@/services/expenseService';
import { GET } from '../route';

// Mock the expenseService module
jest.mock('@/services/expenseService');

describe('Categories API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/categories', () => {
    it('should return categories and success message', async () => {
      // Mock data
      const mockCategories: ExpenseCategory[] = [
        {
          id: 'cat1',
          name: 'Food',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'cat2',
          name: 'Transportation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Mock the service function
      (expenseService.getExpenseCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      // Call the API handler directly
      const response = await GET();

      // Assert the response
      expect(response.status).toBe(200);

      const jsonResponse = await response.json();
      expect(jsonResponse.success).toBe(true);
      expect(jsonResponse.data).toEqual(mockCategories);
      expect(jsonResponse.message).toBe('Categories fetched successfully');
      expect(expenseService.getExpenseCategories).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and return error response', async () => {
      // Mock the service function to throw an error
      const errorMessage = 'Database connection error';
      (expenseService.getExpenseCategories as jest.Mock).mockRejectedValue(
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
      expect(expenseService.getExpenseCategories).toHaveBeenCalledTimes(1);
    });
  });
});
