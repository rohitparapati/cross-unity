import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/api';
import { getSessionFromCookies } from '@/lib/auth';
import { sanitizeEmail } from '@/lib/sanitize';

const emailSchema = z.object({
  email: z.string().email(),
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

    const parsed = emailSchema.safeParse({
      email: sanitizeEmail(body.email ?? ''),
    });

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Please enter a valid email.'),
        { status: 400 },
      );
    }

    const existingUser = await db.user.findFirst({
      where: {
        email: parsed.data.email,
        NOT: { id: session.sub },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        errorResponse('EMAIL_EXISTS', 'That email is already in use.'),
        { status: 409 },
      );
    }

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.sub },
        data: { email: parsed.data.email },
      });

      await tx.provider.update({
        where: { userId: session.sub },
        data: { email: parsed.data.email },
      });
    });

    return NextResponse.json(
      successResponse({ updated: true }, 'Email updated successfully.'),
    );
  } catch (error) {
    console.error('Provider email update error:', error);

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Could not update email.'),
      { status: 500 },
    );
  }
}