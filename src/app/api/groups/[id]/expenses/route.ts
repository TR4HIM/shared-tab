import { errorResponse, successResponse } from '@/lib/helpers';
import { createExpense, getExpensesByGroup } from '@/services/expenseService';
import { createExpenseSchema } from '@/types/Expense';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // Ensure params is properly handled
    const { id: groupId } = await params;

    // Get all expenses for the group
    const expenses = await getExpensesByGroup(groupId);

    return NextResponse.json(
      successResponse(expenses, 'Group expenses fetched successfully')
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      errorResponse('INTERNAL_SERVER_ERROR', message, 500),
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id: groupId } = await params;
    const body = await request.json();
    const parsedBody = createExpenseSchema.parse({ ...body, groupId });
    const expense = await createExpense(parsedBody, body.participants);

    return NextResponse.json(
      successResponse(expense, 'Expense created successfully')
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        errorResponse(
          'BAD_REQUEST',
          error.errors.map((e) => e.message).join(', '),
          400
        ),
        { status: 400 }
      );
    }
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      errorResponse('INTERNAL_SERVER_ERROR', message, 500),
      { status: 500 }
    );
  }
}
