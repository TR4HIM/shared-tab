import { errorResponse } from '@/lib/helpers';
import { NextResponse } from 'next/server';

const notFoundResponse = errorResponse('NOT_FOUND', 'Not Found :/', 404);

export function GET() {
  return NextResponse.json(notFoundResponse, { status: 404 });
}

export function POST() {
  return NextResponse.json(notFoundResponse, { status: 404 });
}
