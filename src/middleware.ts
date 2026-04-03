import { NextRequest, NextResponse } from "next/server";

const AGM_PATH = "/agm";

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);

  if (pathname.toLowerCase() === AGM_PATH && pathname !== AGM_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = AGM_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
