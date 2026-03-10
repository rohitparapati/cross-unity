import bcrypt from 'bcryptjs';
import { PrismaClient, ProviderStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  const plumbing = await prisma.category.create({
    data: {
      name: 'Plumbing',
      slug: 'plumbing',
      icon: 'wrench',
    },
  });

  const electrical = await prisma.category.create({
    data: {
      name: 'Electrical',
      slug: 'electrical',
      icon: 'zap',
    },
  });

  const landscaping = await prisma.category.create({
    data: {
      name: 'Landscaping',
      slug: 'landscaping',
      icon: 'trees',
    },
  });

  const cleaning = await prisma.category.create({
    data: {
      name: 'Cleaning',
      slug: 'cleaning',
      icon: 'sparkles',
    },
  });

  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const providerPasswordHash = await bcrypt.hash('Provider@123456', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@crossunity.local',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  const mikeUser = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      passwordHash: providerPasswordHash,
      role: UserRole.PROVIDER,
    },
  });

  await prisma.provider.create({
    data: {
      userId: mikeUser.id,
      businessName: "Mike's Plumbing",
      slug: 'mikes-plumbing',
      categoryId: plumbing.id,
      email: 'mike@example.com',
      phone: '314-555-0101',
      bio: 'Professional plumbing services for homes and businesses. Fast response and reliable repairs.',
      city: 'St Louis',
      state: 'MO',
      zip: '63103',
      pricingText: 'Service starts at $75',
      availabilityText: 'Mon-Sat 8AM - 6PM',
      isVerified: true,
      status: ProviderStatus.APPROVED,
    },
  });

  await prisma.provider.create({
    data: {
      businessName: 'Spark Electric',
      slug: 'spark-electric',
      categoryId: electrical.id,
      email: 'spark@example.com',
      phone: '314-555-0102',
      bio: 'Certified electricians for installations and repairs.',
      city: 'St Louis',
      state: 'MO',
      zip: '63108',
      pricingText: 'Inspection $90',
      availabilityText: 'Mon-Fri 9AM - 5PM',
      isVerified: true,
      status: ProviderStatus.APPROVED,
    },
  });

  await prisma.provider.create({
    data: {
      businessName: 'Green Lawn Care',
      slug: 'green-lawn-care',
      categoryId: landscaping.id,
      email: 'green@example.com',
      phone: '314-555-0103',
      bio: 'Affordable lawn maintenance and landscaping.',
      city: 'Chesterfield',
      state: 'MO',
      zip: '63017',
      pricingText: '$50 per visit',
      availabilityText: 'Mon-Sat 7AM - 4PM',
      isVerified: false,
      status: ProviderStatus.PENDING,
    },
  });

  await prisma.provider.create({
    data: {
      businessName: 'Fresh Home Cleaning',
      slug: 'fresh-home-cleaning',
      categoryId: cleaning.id,
      email: 'fresh@example.com',
      phone: '314-555-0104',
      bio: 'Home cleaning services with weekly and deep cleaning options.',
      city: 'Clayton',
      state: 'MO',
      zip: '63105',
      pricingText: 'Deep cleaning from $120',
      availabilityText: 'Tue-Sat 8AM - 5PM',
      isVerified: true,
      status: ProviderStatus.APPROVED,
    },
  });

  console.log('Database seeded successfully.');
  console.log('Admin login: admin@crossunity.local / Admin@123456');
  console.log('Provider login: mike@example.com / Provider@123456');
  console.log('Created admin user id:', adminUser.id);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });