import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/api';
import { sanitizeEmail, sanitizeText } from '@/lib/sanitize';
import { sendInquiryEmails } from '@/lib/email';

const inquirySchema = z.object({
  providerId: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal('')),
  message: z.string().min(10).max(2000),
  companyWebsite: z.string().max(0).optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = inquirySchema.safeParse({
      providerId: body.providerId ?? '',
      name: sanitizeText(body.name ?? ''),
      email: sanitizeEmail(body.email ?? ''),
      phone: sanitizeText(body.phone ?? ''),
      message: sanitizeText(body.message ?? ''),
      companyWebsite: body.companyWebsite ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse(
          'VALIDATION_ERROR',
          'Please correct the form fields and try again.',
          parsed.error.flatten().fieldErrors,
        ),
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.companyWebsite) {
      return NextResponse.json(
        successResponse({ accepted: true }, 'Inquiry submitted successfully.'),
        { status: 200 },
      );
    }

    const provider = await db.provider.findFirst({
      where: {
        id: data.providerId,
        status: 'APPROVED',
      },
    });

    if (!provider) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Provider not found.'),
        { status: 404 },
      );
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const userAgent = request.headers.get('user-agent') || null;

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const recentDuplicate = await db.inquiry.findFirst({
      where: {
        providerId: data.providerId,
        email: data.email,
        createdAt: {
          gte: tenMinutesAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (recentDuplicate) {
      return NextResponse.json(
        errorResponse(
          'RATE_LIMITED',
          'You recently sent a message to this provider. Please wait a few minutes before sending another one.',
        ),
        { status: 429 },
      );
    }

    const inquiry = await db.inquiry.create({
      data: {
        providerId: data.providerId,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        status: 'NEW',
        ipAddress,
        userAgent,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || undefined;

    await sendInquiryEmails({
      providerBusinessName: provider.businessName,
      providerEmail: provider.email,
      adminEmail,
      customerName: data.name,
      customerEmail: data.email,
      customerPhone: data.phone || null,
      message: data.message,
    });

    return NextResponse.json(
      successResponse(
        { inquiryId: inquiry.id },
        'Inquiry sent successfully.',
      ),
      { status: 201 },
    );
  } catch (error) {
    console.error('Inquiry submission error:', error);

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Could not send inquiry.'),
      { status: 500 },
    );
  }
}