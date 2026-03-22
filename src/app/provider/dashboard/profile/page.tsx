import { redirect } from 'next/navigation';
import LogoutButton from '@/components/auth/logout-button';
import ProviderDashboardNav from '@/components/provider/provider-dashboard-nav';
import ProviderProfileForm from '@/components/provider/provider-profile-form';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function ProviderDashboardProfilePage() {
  const session = await getSessionFromCookies();

  if (!session || session.role !== 'PROVIDER') {
    redirect('/provider/login');
  }

  const [provider, categories] = await Promise.all([
    db.provider.findUnique({
      where: {
        userId: session.sub,
      },
    }),
    db.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  if (!provider) {
    redirect('/provider/register');
  }

  return (
    <div className="space-y-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
          <p className="text-slate-600">Update your business details and public profile information.</p>
        </div>

        <LogoutButton redirectTo="/" />
      </div>

      <ProviderDashboardNav currentPath="/provider/dashboard/profile" />

      <div className="rounded-2xl border bg-white p-6">
        <ProviderProfileForm
          categories={categories}
          initialValues={{
            businessName: provider.businessName,
            categoryId: provider.categoryId,
            phone: provider.phone ?? '',
            bio: provider.bio,
            city: provider.city,
            state: provider.state,
            zip: provider.zip,
            pricingText: provider.pricingText ?? '',
            availabilityText: provider.availabilityText ?? '',
          }}
        />
      </div>
    </div>
  );
}