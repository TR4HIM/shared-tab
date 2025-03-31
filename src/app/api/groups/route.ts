import { errorResponse, successResponse } from '@/lib/helpers';
import { createGroup, getGroups } from '@/services/groupService';
import { createGroupSchema } from '@/types/Group';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(): Promise<Response> {
  try {
    const groups = await getGroups();

    return NextResponse.json(
      successResponse(groups, 'Groups fetched successfully')
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

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsedBody = createGroupSchema.parse(body);
    const group = await createGroup(parsedBody);

    return NextResponse.json(
      successResponse(group, 'Group created successfully')
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
