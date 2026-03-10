import { redirect } from 'next/navigation';
import AdminReviewActions from '@/components/admin/admin-review-actions';
import LogoutButton from '@/components/auth/logout-button';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function AdminPage() {
  const session = await getSessionFromCookies();

  if (!session || session.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  const pendingProviders = await db.provider.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Review Queue</h1>
          <p className="text-slate-600">
            Review and approve newly registered providers.
          </p>
        </div>

        <LogoutButton redirectTo="/" />
      </div>

      {pendingProviders.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
          No pending providers right now.
        </div>
      ) : (
        <div className="space-y-6">
          {pendingProviders.map((provider) => (
            <div key={provider.id} className="rounded-2xl border bg-white p-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{provider.businessName}</h2>
                <p className="text-sm text-slate-500">
                  {provider.category.name} • {provider.city}, {provider.state}
                </p>
              </div>

              <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-2 text-sm text-slate-700">
                  <p><span className="font-medium">Email:</span> {provider.email}</p>
                  <p><span className="font-medium">Phone:</span> {provider.phone ?? 'Not provided'}</p>
                  <p><span className="font-medium">ZIP:</span> {provider.zip}</p>
                  <p><span className="font-medium">Bio:</span> {provider.bio}</p>
                </div>

                <AdminReviewActions providerId={provider.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}