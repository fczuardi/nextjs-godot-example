import { NextResponse } from "next/server"

export async function POST(req: Request) {

    // --- AUTH CHECK  TODO: REPLACE WITH whatever you use for authenticated endpoints---
    const cookie = req.headers.get("cookie") ?? "";
    const authed = cookie.includes("demo_auth=1");
    if (!authed) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }


    const body = await req.json();
    console.log("game sent a score", {body})

    const informed_score = body.sc
    const headers =  new Headers()
    const scoreValidated = validateScore(body)

    if (scoreValidated === true) {
        headers.set("X-Score-Validated", "1")
    }
    if (informed_score >= 2000) {
        headers.set("X-Coupon", "FANTASTICPLAYER10-XYWZ")
    } else if (informed_score >= 1000) {
        headers.set("X-Coupon", "GREATPLAYER10-ABCD")
    }

    return new Response(null, { status: 204, headers });
}

// TODO: do some validation on the allegedly score
function validateScore(payload){
    return true
}
