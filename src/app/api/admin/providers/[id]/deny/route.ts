import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/api';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { sanitizeText } from '@/lib/sanitize';

const denySchema = z.object({
  reason: z.string().min(5).max(300),
});

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, { params }: Props) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json(
      errorResponse('UNAUTHORIZED', 'You are not authorized to do this.'),
      { status: 401 },
    );
  }

  const body = await request.json();

  const parsed = denySchema.safeParse({
    reason: sanitizeText(body.reason ?? ''),
  });

  if (!parsed.success) {
    return NextResponse.json(
      errorResponse('VALIDATION_ERROR', 'Denial reason is required.', parsed.error.flatten().fieldErrors),
      { status: 400 },
    );
  }

  const { id } = await params;

  const provider = await db.provider.update({
    where: { id },
    data: {
      status: 'DENIED',
      isVerified: false,
      denialReason: parsed.data.reason,
    },
  });

  return NextResponse.json(
    successResponse(
      { providerId: provider.id, status: provider.status },
      'Provider denied successfully.',
    ),
  );
}