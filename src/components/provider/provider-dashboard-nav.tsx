import Link from 'next/link';

type Props = {
  currentPath: string;
};

function navClass(href: string, currentPath: string) {
  const isActive = currentPath === href;
  return isActive
    ? 'rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white'
    : 'rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50';
}

export default function ProviderDashboardNav({ currentPath }: Props) {
  return (
    <nav className="flex flex-wrap gap-2">
      <Link href="/provider/dashboard" className={navClass('/provider/dashboard', currentPath)}>
        Overview
      </Link>
      <Link href="/provider/dashboard/profile" className={navClass('/provider/dashboard/profile', currentPath)}>
        Profile
      </Link>
      <Link href="/provider/dashboard/inbox" className={navClass('/provider/dashboard/inbox', currentPath)}>
        Inbox
      </Link>
      <Link href="/provider/dashboard/settings" className={navClass('/provider/dashboard/settings', currentPath)}>
        Settings
      </Link>
    </nav>
  );
}