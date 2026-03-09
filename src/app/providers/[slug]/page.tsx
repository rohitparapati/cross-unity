import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProviderDetailPage({ params }: Props) {
  const { slug } = await params;

  const provider = await db.provider.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!provider) {
    notFound();
  }

  return (
    <div className="py-10">
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            {provider.businessName}
          </h1>
          {provider.isVerified ? (
            <Badge>Verified</Badge>
          ) : (
            <Badge variant="secondary">Pending</Badge>
          )}
        </div>

        <p className="text-slate-600">
          {provider.category.name} • {provider.city}, {provider.state}
        </p>

        <div className="rounded-2xl border p-6">
          <h2 className="mb-3 text-lg font-semibold">About</h2>
          <p className="text-slate-700">{provider.bio}</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="mb-3 text-lg font-semibold">Details</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-medium">Email:</span> {provider.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{' '}
              {provider.phone ?? 'Not provided'}
            </p>
            <p>
              <span className="font-medium">ZIP:</span> {provider.zip}
            </p>
            <p>
              <span className="font-medium">Pricing:</span>{' '}
              {provider.pricingText ?? 'Not provided'}
            </p>
            <p>
              <span className="font-medium">Availability:</span>{' '}
              {provider.availabilityText ?? 'Not provided'}
            </p>
            <p>
              <span className="font-medium">Status:</span> {provider.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}