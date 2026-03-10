import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/api';
import { hashPassword } from '@/lib/password';
import { sanitizeEmail, sanitizeText } from '@/lib/sanitize';
import { slugify } from '@/lib/slug';

const registerSchema = z.object({
  businessName: z.string().min(2).max(80),
  categoryId: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  phone: z.string().min(7).max(30).optional().or(z.literal('')),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  zip: z.string().min(3).max(12),
  bio: z.string().min(20).max(1000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse({
      businessName: sanitizeText(body.businessName ?? ''),
      categoryId: body.categoryId ?? '',
      email: sanitizeEmail(body.email ?? ''),
      password: body.password ?? '',
      phone: sanitizeText(body.phone ?? ''),
      city: sanitizeText(body.city ?? ''),
      state: sanitizeText(body.state ?? ''),
      zip: sanitizeText(body.zip ?? ''),
      bio: sanitizeText(body.bio ?? ''),
    });

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse(
          'VALIDATION_ERROR',
          'Please correct the highlighted fields.',
          parsed.error.flatten().fieldErrors,
        ),
        { status: 400 },
      );
    }

    const data = parsed.data;

    const category = await db.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        errorResponse('CATEGORY_NOT_FOUND', 'Selected category was not found.'),
        { status: 404 },
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    const existingProvider = await db.provider.findUnique({
      where: { email: data.email },
    });

    if (existingUser || existingProvider) {
      return NextResponse.json(
        errorResponse('EMAIL_EXISTS', 'An account with this email already exists.'),
        { status: 409 },
      );
    }

    const baseSlug = slugify(data.businessName);
    let slug = baseSlug;
    let counter = 1;

    while (await db.provider.findUnique({ where: { slug } })) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    const passwordHash = await hashPassword(data.password);

    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          role: 'PROVIDER',
        },
      });

      await tx.provider.create({
        data: {
          userId: user.id,
          businessName: data.businessName,
          slug,
          categoryId: data.categoryId,
          email: data.email,
          phone: data.phone || null,
          bio: data.bio,
          city: data.city,
          state: data.state,
          zip: data.zip,
          status: 'PENDING',
          isVerified: false,
        },
      });
    });

    return NextResponse.json(
      successResponse(
        {
          redirectTo: '/provider/login',
        },
        'Registration submitted successfully. Your profile is pending admin review.',
      ),
      { status: 201 },
    );
  } catch (error) {
    console.error('Provider registration error:', error);

    return NextResponse.json(
      errorResponse(
        'SERVER_ERROR',
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown server error'
          : 'Could not complete registration.',
      ),
      { status: 500 },
    );
  }
}