import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = new Set([
  '/',
  '/agm',
  '/login',
  '/register',
  '/local',
  '/privacy',
  '/terms',
  '/book',
]);

const protectedPrefixes = ['/dashboard', '/account', '/admin', '/my-bookings', '/book/my-bookings', '/owners'];

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isPublicRoute(pathname: string) {
  return publicRoutes.has(pathname);
}

function isProtectedRoute(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function hasSession(request: NextRequest) {
  return Boolean(request.cookies.get('__session')?.value);
}

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const normalizedPathname = normalizePathname(nextUrl.pathname);

  // Canonicalize AGM route without relying on broad redirects that can self-loop.
  if (nextUrl.pathname === '/AGM' || normalizedPathname === '/AGM') {
    const url = nextUrl.clone();
    url.pathname = '/agm';
    return NextResponse.redirect(url);
  }

  if (nextUrl.pathname !== normalizedPathname) {
    const url = nextUrl.clone();
    url.pathname = normalizedPathname;
    return NextResponse.redirect(url);
  }

  if (isPublicRoute(normalizedPathname)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(normalizedPathname) && !hasSession(request)) {
    if (normalizedPathname !== '/login') {
      const url = nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', normalizedPathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|images/).*)'],
};
