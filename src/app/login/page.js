"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authApi";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (loading) {
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await login(username, password);

      const token = response.data.accessToken;

      localStorage.setItem("token", token);

      router.push("/");
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block">Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="mb-1 block">Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="Password"
            />
          </div>
          /* display error*/
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading} /* disable button when in loading state */
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
