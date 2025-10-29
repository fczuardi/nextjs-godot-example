import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: ["/game/:path*"], // only run for /game
};

export function proxy(req: NextRequest) {
  const authed = req.cookies.get("demo_auth")?.value === "1";
  if (!authed) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

