import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/api';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        errorResponse('UNAUTHORIZED', 'You are not authorized to do this.'),
        { status: 401 },
      );
    }

    const { id } = await params;

    const existingProvider = await db.provider.findUnique({
      where: { id },
    });

    if (!existingProvider) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Provider was not found.'),
        { status: 404 },
      );
    }

    const provider = await db.provider.update({
      where: { id },
      data: {
        status: 'APPROVED',
        isVerified: true,
        denialReason: null,
      },
    });

    return NextResponse.json(
      successResponse(
        {
          providerId: provider.id,
          status: provider.status,
        },
        'Provider approved successfully.',
      ),
    );
  } catch (error) {
    console.error('Approve provider error:', error);

    return NextResponse.json(
      errorResponse(
        'SERVER_ERROR',
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown server error'
          : 'Something went wrong while approving.',
      ),
      { status: 500 },
    );
  }
}