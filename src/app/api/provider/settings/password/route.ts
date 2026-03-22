import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/api';
import { getSessionFromCookies } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/password';

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();

    if (!session || session.role !== 'PROVIDER') {
      return NextResponse.json(
        errorResponse('UNAUTHORIZED', 'You are not authorized to do this.'),
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = passwordSchema.safeParse({
      currentPassword: body.currentPassword ?? '',
      newPassword: body.newPassword ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Password details are invalid.'),
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.sub },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'User not found.'),
        { status: 404 },
      );
    }

    const isValid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        errorResponse('INVALID_PASSWORD', 'Current password is incorrect.'),
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(parsed.data.newPassword);

    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json(
      successResponse({ updated: true }, 'Password updated successfully.'),
    );
  } catch (error) {
    console.error('Provider password update error:', error);

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Could not update password.'),
      { status: 500 },
    );
  }
}