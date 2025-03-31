import { errorResponse, successResponse } from '@/lib/helpers';
import { getExpenseParticipants } from '@/services/expenseService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ expenseId: string; id: string }> }
): Promise<Response> {
  try {
    const { expenseId } = await params;
    const participants = await getExpenseParticipants(expenseId);

    return NextResponse.json(
      successResponse(participants, 'Expense participants fetched successfully')
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
