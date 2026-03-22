import { redirect } from 'next/navigation';
import LogoutButton from '@/components/auth/logout-button';
import ProviderDashboardNav from '@/components/provider/provider-dashboard-nav';
import ProviderInboxList from '@/components/provider/provider-inbox-list';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function ProviderDashboardInboxPage() {
  const session = await getSessionFromCookies();

  if (!session || session.role !== 'PROVIDER') {
    redirect('/provider/login');
  }

  const provider = await db.provider.findUnique({
    where: {
      userId: session.sub,
    },
    include: {
      inquiries: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!provider) {
    redirect('/provider/register');
  }

  return (
    <div className="space-y-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-slate-600">View customer inquiries sent to your business.</p>
        </div>

        <LogoutButton redirectTo="/" />
      </div>

      <ProviderDashboardNav currentPath="/provider/dashboard/inbox" />

      <ProviderInboxList
        inquiries={provider.inquiries.map((item) => ({
          ...item,
          status: item.status as 'NEW' | 'RESPONDED',
        }))}
      />
    </div>
  );
}