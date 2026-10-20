import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add "empulse.store" and "www.empulse.store" back here to show the coming-soon page again.
const COMING_SOON_HOSTS = new Set<string>([]);

function hostname(request: NextRequest) {
  const raw = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  return raw.split(",")[0].trim().replace(/:\d+$/, "").toLowerCase();
}

export function proxy(request: NextRequest) {
  if (!COMING_SOON_HOSTS.has(hostname(request))) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname === "/coming-soon" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
