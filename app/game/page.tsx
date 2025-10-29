"use client";
import { useEffect } from "react";

export default function GamePage() {
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.origin !== location.origin) {
          return;
      }
      const { type, payload } = e.data || {};
      if (type === "score") {
        fetch("/api/score", { 
              method: "POST", 
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload)
        });
      }
      if (type === "telemetry") {
        fetch("/api/telemetry", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload)
        });
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
    </div>
  );
}

