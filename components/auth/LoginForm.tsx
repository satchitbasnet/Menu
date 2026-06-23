"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const INPUT_CLASS =
  "w-full rounded-sm border border-border bg-transparent px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/55 focus:border-foreground focus:outline-none";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to sign in");
      }

      const redirect =
        searchParams.get("redirect") ?? data.redirectTo ?? "/";
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="border-b border-border">
        <div className="flex h-16 items-center justify-between px-5 md:px-10">
          <Logo />
          <span className="text-xs text-muted-foreground">
            No account?{" "}
            <Link
              href="/signup"
              className="text-foreground underline-offset-2 hover:underline"
            >
              Sign up
            </Link>
          </span>
        </div>
      </nav>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">
            <div className="mb-10">
              <h1 className="mb-2 font-serif text-3xl font-normal text-foreground">
                Welcome back.
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your Menu·To·Table account.
              </p>
            </div>

            <div className="mb-7 rounded-sm border border-border bg-secondary px-4 py-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="text-foreground">Demo — </span>
                Chef:{" "}
                <code className="rounded-sm bg-background px-1">
                  chef@menutotable.com
                </code>{" "}
                · Client:{" "}
                <code className="rounded-sm bg-background px-1">
                  client@example.com
                </code>
                <br />
                Password: <code className="rounded-sm bg-background px-1">password123</code>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(INPUT_CLASS, "pr-10")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-sm bg-foreground py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border border-primary-foreground/40 border-t-primary-foreground" />
                ) : (
                  <>
                    Sign In <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="relative hidden bg-secondary lg:block">
          <Image
            src="https://images.unsplash.com/photo-1606659894125-40824878b6ce?w=900&h=900&fit=crop&auto=format"
            alt="Candlelit dinner table"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
          <div className="absolute right-10 bottom-10 left-10">
            <p className="font-serif text-2xl font-normal italic leading-snug text-white">
              &ldquo;The table is set.
              <br />
              Your chef awaits.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
