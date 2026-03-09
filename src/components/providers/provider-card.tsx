import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProviderListItem } from '@/lib/types/provider';

type Props = {
  provider: ProviderListItem;
};

export default function ProviderCard({ provider }: Props) {
  return (
    <Card className="transition hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">{provider.businessName}</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              {provider.category.name} • {provider.city}, {provider.state}
            </p>
          </div>

          {provider.isVerified ? (
            <Badge>Verified</Badge>
          ) : (
            <Badge variant="secondary">Pending</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm text-slate-600">{provider.bio}</p>

        <div className="space-y-1 text-sm text-slate-600">
          {provider.pricingText ? (
            <p>
              <span className="font-medium text-slate-800">Pricing:</span>{' '}
              {provider.pricingText}
            </p>
          ) : null}

          {provider.availabilityText ? (
            <p>
              <span className="font-medium text-slate-800">Availability:</span>{' '}
              {provider.availabilityText}
            </p>
          ) : null}
        </div>

        <Button asChild className="w-full">
          <Link href={`/providers/${provider.slug}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}