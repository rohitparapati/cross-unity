import { redirect } from 'next/navigation';
import LogoutButton from '@/components/auth/logout-button';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function ProviderDashboardPage() {
  const session = await getSessionFromCookies();

  if (!session || session.role !== 'PROVIDER') {
    redirect('/provider/login');
  }

  const provider = await db.provider.findUnique({
    where: {
      userId: session.sub,
    },
    include: {
      category: true,
    },
  });

  if (!provider) {
    redirect('/provider/register');
  }

  return (
    <div className="space-y-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
          <p className="text-slate-600">
            Welcome back, {provider.businessName}.
          </p>
        </div>

        <LogoutButton redirectTo="/" />
      </div>

      {provider.status === 'PENDING' ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-900">Pending Review</h2>
          <p className="mt-2 text-sm text-amber-800">
            Your account has been created successfully and is waiting for admin approval.
            Once approved, your provider profile can go live publicly.
          </p>
        </div>
      ) : null}

      {provider.status === 'DENIED' ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">Registration Denied</h2>
          <p className="mt-2 text-sm text-red-800">
            This provider account was denied by admin.
          </p>
          <p className="mt-2 text-sm text-red-800">
            <span className="font-medium">Reason:</span>{' '}
            {provider.denialReason ?? 'No reason provided.'}
          </p>
        </div>
      ) : null}

      {provider.status === 'APPROVED' ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-lg font-semibold text-green-900">Approved</h2>
          <p className="mt-2 text-sm text-green-800">
            Your account is approved and ready. In the next milestone, you’ll be able to edit
            your full profile and manage inquiries.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Profile Snapshot</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p><span className="font-medium">Category:</span> {provider.category.name}</p>
            <p><span className="font-medium">Email:</span> {provider.email}</p>
            <p><span className="font-medium">Phone:</span> {provider.phone ?? 'Not provided'}</p>
            <p><span className="font-medium">Location:</span> {provider.city}, {provider.state} {provider.zip}</p>
            <p><span className="font-medium">Status:</span> {provider.status}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Coming Next</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Edit provider profile</li>
            <li>• Update pricing and availability</li>
            <li>• Upload images</li>
            <li>• View customer inquiries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}