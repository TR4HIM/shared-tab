import { errorResponse, successResponse } from '@/lib/helpers';
import { getExpenseCategory } from '@/services/expenseService';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const category = await getExpenseCategory(id);

    if (!category) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Category not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      successResponse(category, 'Category fetched successfully')
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
