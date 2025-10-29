import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if ( username !== "invalid"  && password !== "invalid") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("demo_auth", "1", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      maxAge: 60 * 60, // 1h
    });
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}

