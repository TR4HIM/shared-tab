import { errorResponse, successResponse } from '@/lib/helpers';
import { getExpenseCategories } from '@/services/expenseService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await getExpenseCategories();

    return NextResponse.json(
      successResponse(categories, 'Categories fetched successfully')
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
