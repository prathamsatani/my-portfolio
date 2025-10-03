"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseBrowserClient } from "@/lib/supabaseClient";

const ADMIN_ROLE = "admin";

type AuthState = "idle" | "loading";

const LoginPage = () => {
  const router = useRouter();
  const supabase = useSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("[Login Page] Checking existing session:", {
          hasSession: !!session,
          userId: session?.user?.id,
          role: session?.user?.app_metadata?.role,
        });

        // Only redirect if there's a valid admin session
        if (session?.user?.app_metadata?.role === ADMIN_ROLE) {
          console.log("[Login Page] Valid admin session found, redirecting to /admin");
          router.replace("/admin");
        } else if (session) {
          // If there's a session but not admin, clear it
          console.log("[Login Page] Non-admin session found, clearing it");
          await supabase.auth.signOut();
        }
      } catch (err) {
        console.error("[Login Page] Error checking session:", err);
      }
    };

    void checkSession();
  }, [mounted, router, supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthState("loading");
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setAuthState("idle");
        return;
      }

      // Check role from the session data
      if (data.session?.user?.app_metadata?.role !== ADMIN_ROLE) {
        await supabase.auth.signOut();
        setError("You do not have permission to access the admin portal.");
        setAuthState("idle");
        return;
      }

      router.replace("/admin");
    } catch (error) {
      console.error("Unexpected sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
      setAuthState("idle");
    }
  };

  // Don't render form until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-12 text-neutral-200">
        <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-xl backdrop-blur">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-neutral-800 rounded"></div>
            <div className="mt-2 h-4 w-64 bg-neutral-800 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-12 text-neutral-200">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">Admin Portal Login</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Use your dedicated admin credentials to manage the portfolio.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={authState === "loading"}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
          >
            {authState === "loading" ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-xs text-neutral-500">
          Access is restricted to trusted maintainers. Contact the site owner if you need credentials.
        </p>
      </div>
    </main>
  );
};

export default LoginPage;