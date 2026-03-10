import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/api';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json(
    successResponse({ cleared: true }, 'Logged out successfully.'),
  );

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}