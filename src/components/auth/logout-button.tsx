'use client';

import { useRouter } from 'next/navigation';

type Props = {
  redirectTo?: string;
};

export default function LogoutButton({ redirectTo = '/' }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      Logout
    </button>
  );
}