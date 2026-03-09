import ProviderCard from '@/components/providers/provider-card';
import { db } from '@/lib/db';
import { ProviderListItem } from '@/lib/types/provider';

export default async function ProvidersPage() {
  const providers: ProviderListItem[] = await db.provider.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Service Providers</h1>
        <p className="text-slate-600">
          Browse providers by category, location, and verification status.
        </p>
      </div>

      {providers.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center text-slate-500">
          No providers found in the database yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}