import { z } from 'zod';

export type SuccessResponse<T = unknown> = {
  success: true;
  message?: string;
  data: T;
};

export const errorResponse = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    status: z.number().optional(),
  }),
});

export type ErrorResponse = z.infer<typeof errorResponse>;

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
