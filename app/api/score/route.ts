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

    const informed_score = body.score
    const headers =  new Headers()
    const scoreValidated = validateScore(body)
    // console.log("console validation:", scoreValidated)

    if (scoreValidated !== true) {
        return new Response(null, { status: 400 });
    }

    if (scoreValidated === true) {
        headers.set("X-Score-Validated", "1")
    }

    console.log({informed_score})
    if (informed_score >= 2000) {
        console.log("bigger than 2000")
        headers.set("X-Coupon", "FANTASTICPLAYER10-XYWZ")
    } else if (informed_score >= 1000) {
        console.log("bigger than 1000")
        headers.set("X-Coupon", "GREATPLAYER10-ABCD")
    }

    console.log({headers})
    return new Response(null, { status: 204, headers });
}

const LIFE_TOTAL_AMOUNT = 3
const MIN_TIME_BETWEEN_JUMPS = 0.69
const MINIMUM_SCORE = 82.7
const MINIMUM_SCORE_MARGIN = 20.0
const SIMULATED_SCORE_ERROR_MARGIN = 100.0
const CLIENT_SETTINGS = {
    forward_speed: 180.0,
    speed_increase: 10.0,
    max_speed: 400.0,
    distance_score_rate: 19.0,
    score_milestone_size: 100.0,
}

function calculateScoreFromTime(play_time){
    const {
        forward_speed,
        speed_increase,
        max_speed,
        distance_score_rate,
        score_milestone_size,
    } = CLIENT_SETTINGS
    const seconds = Math.floor(play_time)
    // replay the game second by second
    let total_score = 0.0
    let total_distance = 0.0
    let speed = forward_speed
    let last_milestone = 0
    for (let s = 0; s <= seconds; s++){
        total_distance += speed
        total_score = total_distance / distance_score_rate
        // increase speed on milestones
        if (total_score > last_milestone + score_milestone_size) {
            speed = Math.min(speed + speed_increase, max_speed)
            last_milestone += score_milestone_size
        }
    }
    return total_score
}

function validateScore(payload){
    const {
        score,
        play_time,
        jump_count,
        glide_count,
        life_count,
    } = payload

    // a player cannot have a final score without having lost all 3 lives
    if (life_count !== LIFE_TOTAL_AMOUNT) {
        console.log("life count check failed", life_count, LIFE_TOTAL_AMOUNT)
        return false
    }

    // jump number should respect the minimum time between them
    if (play_time / jump_count < MIN_TIME_BETWEEN_JUMPS) {
        console.log("jump count check failed", play_time / jump_count, MIN_TIME_BETWEEN_JUMPS)
        return false
    }

    // it should not be possible to have more glides than jumps
    if (glide_count > jump_count) {
        console.log("glide vs jump check failed", glide_count, jump_count)
        return false
    }

    // why would someone want to score less than the score of doing nothing?
    if (score < MINIMUM_SCORE - MINIMUM_SCORE_MARGIN) {
        console.log("score bigger than minimum check failed", score, MINIMUM_SCORE - MINIMUM_SCORE_MARGIN)
        return false
    }

    const simulatedScore = calculateScoreFromTime(play_time)
    console.log("DEBUG simulated vs informed score:", {score, simulatedScore})
    if (score > simulatedScore +SIMULATED_SCORE_ERROR_MARGIN) {
        console.log("informed score is bigger than simulated score, this should not happen", score, simulatedScore, SIMULATED_SCORE_ERROR_MARGIN)
        return false
    }


    return true
}
