import { errorResponse, successResponse } from '@/lib/helpers';
import {
  deleteExpense,
  getExpenseById,
  updateExpense,
} from '@/services/expenseService';
import { updateExpenseSchema } from '@/types/Expense';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ expenseId: string; id: string }> }
): Promise<Response> {
  try {
    const { expenseId } = await params;
    const expense = await getExpenseById(expenseId);
    if (!expense) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Expense not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      successResponse(expense, 'Expense fetched successfully')
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ expenseId: string; id: string }> }
): Promise<Response> {
  try {
    const { expenseId } = await params;
    const body = await req.json();
    const parsedBody = updateExpenseSchema.parse(body);
    const expense = await updateExpense(
      expenseId,
      parsedBody,
      body.participants
    );

    return NextResponse.json(
      successResponse(expense, 'Expense updated successfully')
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ expenseId: string; id: string }> }
): Promise<Response> {
  try {
    const { expenseId } = await params;
    await deleteExpense(expenseId);

    return NextResponse.json(
      successResponse(null, 'Expense deleted successfully')
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
