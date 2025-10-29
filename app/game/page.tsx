"use client";
import { useState, useEffect } from "react";

export default function GamePage() {

    const [status, setStatus] = useState("Waiting for game end...");

    async function sendScore(payload) {
        setStatus("Validating score...");
        const res = await fetch("/api/score", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.status === 204) {
            const validated = res.headers.get("X-Score-Validated") === "1";
            const coupon = res.headers.get("X-Coupon");
            if (validated && coupon) setStatus(`Score validated! Coupon: ${coupon}`);
            else if (validated) setStatus("Score validated!");
            else setStatus("Score rejected.");
            return;
        }
    }

    async function sendTelemetry(payload) {
        fetch("/api/telemetry", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload)
        });
    }

    useEffect(() => {
        function onMsg(e: MessageEvent) {
            if (e.origin !== location.origin) {
                return;
            }
            const { type, payload } = e.data || {};
            if (type === "score") {
                sendScore(payload)
            }
            if (type === "telemetry") {
                sendTelemetry(payload)
            }
        }
        window.addEventListener("message", onMsg);
        return () => window.removeEventListener("message", onMsg);
    }, []);

    async function logout() {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/login";
    }

    return (
<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ padding: 8 }}>
        <button onClick={logout}>Logout</button>
    </div>
    <iframe
        src="/game/index.html"
        style={{ flex: 1, border: 0 }}
        allow="cross-origin-isolated"
    />
    <div>
        <center><p>{ status }</p></center>
    </div>
</div>
    );
}

