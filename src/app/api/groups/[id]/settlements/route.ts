import { errorResponse, successResponse } from '@/lib/helpers';
import { getAdjustedGroupSettlements } from '@/lib/settlementUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;

    const settlementResult = await getAdjustedGroupSettlements(id);

    return NextResponse.json(
      successResponse(
        settlementResult,
        'Group settlements calculated successfully'
      )
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
