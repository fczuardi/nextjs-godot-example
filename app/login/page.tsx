"use client";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: f.get("username"),
        password: f.get("password"),
      }),
    });
    if (r.ok){
        window.location.href = "/game";
    } else {
        setError("Invalid credentials");
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <p>This is just a demo login page, any credentials will work</p>
      <div style={{display: "flex", flexDirection: "column"}}>
          <input name="username" placeholder="user" defaultValue="foo" required />
          <input name="password" type="password" placeholder="pass" defaultValue="bar" required />
          <button>Log in</button>
      </div>
      {error && <p>{error}</p>}
    </form>
  );
}

