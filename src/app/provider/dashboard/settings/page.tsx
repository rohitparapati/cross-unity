import { redirect } from 'next/navigation';
import LogoutButton from '@/components/auth/logout-button';
import ProviderDashboardNav from '@/components/provider/provider-dashboard-nav';
import ProviderSettingsForm from '@/components/provider/provider-settings-form';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function ProviderDashboardSettingsPage() {
  const session = await getSessionFromCookies();

  if (!session || session.role !== 'PROVIDER') {
    redirect('/provider/login');
  }

  const provider = await db.provider.findUnique({
    where: {
      userId: session.sub,
    },
  });

  if (!provider) {
    redirect('/provider/register');
  }

  return (
    <div className="space-y-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-slate-600">Update your provider account email and password.</p>
        </div>

        <LogoutButton redirectTo="/" />
      </div>

      <ProviderDashboardNav currentPath="/provider/dashboard/settings" />

      <ProviderSettingsForm currentEmail={provider.email} />
    </div>
  );
}