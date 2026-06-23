"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavbarActionsProps = {
  session: SessionUser | null;
};

export function NavbarActions({ session }: NavbarActionsProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Link
          href="/login"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground px-3 py-1.5"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-sm bg-foreground px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-foreground/90"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <span className="hidden text-xs text-muted-foreground sm:inline">
        {session.name}
      </span>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-foreground">
        <span className="font-serif text-xs text-primary-foreground">
          {initials}
        </span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className={cn(
          "text-sm text-muted-foreground transition-colors hover:text-foreground px-2 py-1.5"
        )}
      >
        Log out
      </button>
    </div>
  );
}
