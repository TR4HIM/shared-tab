import { errorResponse, successResponse } from '@/lib/helpers';
import {
  deleteGroup,
  getGroupById,
  updateGroup,
} from '@/services/groupService';
import { updateGroupSchema } from '@/types/Group';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const group = await getGroupById(id);

    if (!group) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Group not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      successResponse(group, 'Group fetched successfully')
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      errorResponse('INTERNAL_SERVER_ERROR', message, 500),
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const body = await req.json();
    const existingGroup = await getGroupById(id);
    if (!existingGroup) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Group not found', 404),
        { status: 404 }
      );
    }

    try {
      updateGroupSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        return NextResponse.json(
          errorResponse(
            'VALIDATION_ERROR',
            validationError.errors.map((e) => e.message).join(', '),
            400
          ),
          { status: 400 }
        );
      }
    }

    const group = await updateGroup(id, body);

    return NextResponse.json(
      successResponse(group, 'Group updated successfully')
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      errorResponse('INTERNAL_SERVER_ERROR', message, 500),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const group = await deleteGroup(id);

    return NextResponse.json(
      successResponse(group, 'Group deleted successfully')
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      errorResponse('INTERNAL_SERVER_ERROR', message, 500),
      { status: 500 }
    );
  }
}
