"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import type { Role } from "@prisma/client";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const INPUT_CLASS =
  "w-full rounded-sm border border-border bg-transparent px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/55 focus:border-foreground focus:outline-none";

const CHEF_IMG =
  "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=700&h=860&fit=crop&auto=format";
const CLIENT_IMG =
  "https://images.unsplash.com/photo-1536392706976-e486e2ba97af?w=700&h=860&fit=crop&auto=format";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRole = searchParams.get("role");
  const normalizedRole =
    rawRole?.toUpperCase() === "CHEF"
      ? "CHEF"
      : rawRole?.toUpperCase() === "CLIENT"
        ? "CLIENT"
        : null;

  const [step, setStep] = useState<1 | 2>(normalizedRole ? 2 : 1);
  const [role, setRole] = useState<Role | null>(normalizedRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create account");
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  }

  const sideImage = role === "CHEF" ? CHEF_IMG : CLIENT_IMG;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="border-b border-border">
        <div className="flex h-16 items-center justify-between px-5 md:px-10">
          <Logo />
          <span className="text-xs text-muted-foreground">
            Have an account?{" "}
            <Link
              href="/login"
              className="text-foreground underline-offset-2 hover:underline"
            >
              Log in
            </Link>
          </span>
        </div>
      </nav>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-6 py-14">
          <div className="w-full max-w-sm">
            {step === 1 && (
              <div>
                <div className="mb-10">
                  <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                    Step 1 of 2
                  </p>
                  <h1 className="mb-2 font-serif text-3xl font-normal text-foreground">
                    Join Menu·To·Table
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Tell us how you&apos;ll be using the platform.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {(
                    [
                      {
                        r: "CHEF" as Role,
                        label: "I'm a Chef",
                        sub: "List your services, send proposals, and manage client bookings.",
                        img: CHEF_IMG,
                      },
                      {
                        r: "CLIENT" as Role,
                        label: "I'm a Client",
                        sub: "Browse private chefs, book experiences, and manage your events.",
                        img: CLIENT_IMG,
                      },
                    ] as const
                  ).map(({ r, label, sub, img }) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setStep(2);
                      }}
                      className="group flex gap-4 overflow-hidden rounded-sm border border-border p-4 text-left transition-all hover:border-foreground"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-secondary">
                        <Image
                          src={img}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <p className="font-serif text-lg font-normal text-foreground">
                          {label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {sub}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && role && (
              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mb-6 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft size={12} /> Back
                </button>
                <div className="mb-8">
                  <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                    Step 2 of 2
                  </p>
                  <h1 className="mb-2 font-serif text-3xl font-normal text-foreground">
                    {role === "CHEF" ? "Chef account" : "Client account"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Create your credentials to get started.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                      Full Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={
                        role === "CHEF" ? "Chef Elena Martinez" : "Sarah Chen"
                      }
                      className={INPUT_CLASS}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={INPUT_CLASS}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        minLength={8}
                        className={cn(INPUT_CLASS, "pr-10")}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {error && <p className="text-xs text-destructive">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-foreground py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-foreground/90 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border border-primary-foreground/40 border-t-primary-foreground" />
                    ) : (
                      <>
                        Create Account <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="relative hidden bg-secondary lg:block">
          <Image
            src={step === 2 && role ? sideImage : CLIENT_IMG}
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}
