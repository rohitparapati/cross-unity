import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/api';
import { sanitizeEmail } from '@/lib/sanitize';
import { verifyPassword } from '@/lib/password';
import { SESSION_COOKIE_NAME, signSessionToken } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  expectedRole: z.enum(['PROVIDER', 'ADMIN']).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse({
      email: sanitizeEmail(body.email ?? ''),
      password: body.password ?? '',
      expectedRole: body.expectedRole,
    });

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Invalid login details.', parsed.error.flatten().fieldErrors),
        { status: 400 },
      );
    }

    const { email, password, expectedRole } = parsed.data;

    const user = await db.user.findUnique({
      where: { email },
      include: { provider: true },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse('INVALID_CREDENTIALS', 'Invalid email or password.'),
        { status: 401 },
      );
    }

    if (expectedRole && user.role !== expectedRole) {
      return NextResponse.json(
        errorResponse('ROLE_MISMATCH', 'Please use the correct login page.'),
        { status: 403 },
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        errorResponse('INVALID_CREDENTIALS', 'Invalid email or password.'),
        { status: 401 },
      );
    }

    const token = await signSessionToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      successResponse(
        {
          redirectTo: user.role === 'ADMIN' ? '/admin' : '/provider/dashboard',
          role: user.role,
        },
        'Login successful.',
      ),
    );

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      errorResponse(
        'SERVER_ERROR',
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown server error'
          : 'Something went wrong while logging in.',
      ),
      { status: 500 },
    );
  }
}