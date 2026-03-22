import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/api';
import { getSessionFromCookies } from '@/lib/auth';
import { sanitizeText } from '@/lib/sanitize';
import { slugify } from '@/lib/slug';

const profileSchema = z.object({
  businessName: z.string().min(2).max(80),
  categoryId: z.string().min(1),
  phone: z.string().max(30).optional().or(z.literal('')),
  bio: z.string().min(20).max(1000),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  zip: z.string().min(3).max(12),
  pricingText: z.string().max(120).optional().or(z.literal('')),
  availabilityText: z.string().max(120).optional().or(z.literal('')),
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

    const parsed = profileSchema.safeParse({
      businessName: sanitizeText(body.businessName ?? ''),
      categoryId: body.categoryId ?? '',
      phone: sanitizeText(body.phone ?? ''),
      bio: sanitizeText(body.bio ?? ''),
      city: sanitizeText(body.city ?? ''),
      state: sanitizeText(body.state ?? ''),
      zip: sanitizeText(body.zip ?? ''),
      pricingText: sanitizeText(body.pricingText ?? ''),
      availabilityText: sanitizeText(body.availabilityText ?? ''),
    });

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Please correct the highlighted fields.', parsed.error.flatten().fieldErrors),
        { status: 400 },
      );
    }

    const provider = await db.provider.findUnique({
      where: { userId: session.sub },
    });

    if (!provider) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Provider profile not found.'),
        { status: 404 },
      );
    }

    const data = parsed.data;
    const baseSlug = slugify(data.businessName);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await db.provider.findUnique({ where: { slug } });
      if (!existing || existing.id === provider.id) break;
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    await db.provider.update({
      where: { id: provider.id },
      data: {
        businessName: data.businessName,
        categoryId: data.categoryId,
        phone: data.phone || null,
        bio: data.bio,
        city: data.city,
        state: data.state,
        zip: data.zip,
        pricingText: data.pricingText || null,
        availabilityText: data.availabilityText || null,
        slug,
      },
    });

    return NextResponse.json(
      successResponse({ saved: true }, 'Profile updated successfully.'),
    );
  } catch (error) {
    console.error('Provider profile update error:', error);

    return NextResponse.json(
      errorResponse('SERVER_ERROR', 'Could not update profile.'),
      { status: 500 },
    );
  }
}