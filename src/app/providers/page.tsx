import { Prisma } from '@prisma/client';
import ProviderCard from '@/components/providers/provider-card';
import ProviderFilters from '@/components/providers/provider-filters';
import ProvidersPagination from '@/components/providers/providers-pagination';
import { db } from '@/lib/db';
import { ProviderListItem } from '@/lib/types/provider';

type SearchParams = Promise<{
  q?: string;
  category?: string;
  location?: string;
  verified?: string;
  page?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

const PAGE_SIZE = 6;

export default async function ProvidersPage({ searchParams }: Props) {
  const params = await searchParams;

  const q = params.q?.trim() ?? '';
  const category = params.category?.trim() ?? '';
  const location = params.location?.trim() ?? '';
  const verified = params.verified === 'true';
  const currentPage = Math.max(Number(params.page ?? '1') || 1, 1);

  const where: Prisma.ProviderWhereInput = {
    status: 'APPROVED',
    ...(verified ? { isVerified: true } : {}),
    ...(category
      ? {
          category: {
            slug: category,
          },
        }
      : {}),
    ...(q
      ? {
          OR: [
            {
              businessName: {
                contains: q,
                mode: 'insensitive',
              },
            },
            {
              bio: {
                contains: q,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}),
    ...(location
      ? {
          OR: [
            {
              city: {
                contains: location,
                mode: 'insensitive',
              },
            },
            {
              zip: {
                contains: location,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}),
  };

  const [categories, totalCount, providers] = await Promise.all([
    db.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    db.provider.count({ where }),
    db.provider.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { isVerified: 'desc' },
        { createdAt: 'desc' },
      ],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProviders: ProviderListItem[] =
    safeCurrentPage !== currentPage
      ? await db.provider.findMany({
          where,
          include: {
            category: true,
          },
          orderBy: [
            { isVerified: 'desc' },
            { createdAt: 'desc' },
          ],
          skip: (safeCurrentPage - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
        })
      : (providers as ProviderListItem[]);

  return (
    <div className="space-y-8 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Service Providers</h1>
        <p className="text-slate-600">
          Search approved home service providers by category, city, or ZIP.
        </p>
      </div>

      <ProviderFilters
        categories={categories}
        initialValues={{
          q,
          category,
          location,
          verified,
        }}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {totalCount} provider{totalCount === 1 ? '' : 's'} found
        </p>

        <p className="text-sm text-slate-500">
          Showing approved providers only
        </p>
      </div>

      {paginatedProviders.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No providers matched your filters
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Try a different category, city, ZIP, or remove some filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>

          <ProvidersPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            basePath="/providers"
            query={{
              q: q || undefined,
              category: category || undefined,
              location: location || undefined,
              verified: verified ? 'true' : undefined,
            }}
          />
        </>
      )}
    </div>
  );
}