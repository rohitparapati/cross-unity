import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isProviderDashboard = pathname.startsWith('/provider/dashboard');
  const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isProviderAuth =
    pathname === '/provider/login' || pathname === '/provider/register';
  const isAdminLogin = pathname === '/admin/login';

  if (isProviderDashboard) {
    if (!session || session.role !== 'PROVIDER') {
      return NextResponse.redirect(new URL('/provider/login', request.url));
    }
  }

  if (isAdminArea) {
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (isProviderAuth && session?.role === 'PROVIDER') {
    return NextResponse.redirect(new URL('/provider/dashboard', request.url));
  }

  if (isAdminLogin && session?.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/provider/:path*', '/admin/:path*'],
};