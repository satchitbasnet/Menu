import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { getSession } from "@/lib/auth";
import { NavbarActions } from "@/components/layout/NavbarActions";
import { cn } from "@/lib/utils";

type NavbarProps = {
  minimal?: boolean;
  sticky?: boolean;
};

const CHEF_LINKS = [
  { href: "/events", label: "My Events" },
  { href: "/menu-templates", label: "Menu Templates" },
] as const;

const CLIENT_LINKS = [
  { href: "/explore", label: "Find a Chef" },
  { href: "/bookings", label: "My Bookings" },
] as const;

export async function Navbar({ minimal = false, sticky = true }: NavbarProps) {
  const session = await getSession();

  const roleLinks =
    session?.role === "CHEF"
      ? CHEF_LINKS
      : session?.role === "CLIENT"
        ? CLIENT_LINKS
        : [];

  const homeHref =
    session?.role === "CHEF"
      ? "/dashboard"
      : session?.role === "CLIENT"
        ? "/explore"
        : "/";

  return (
    <header
      className={cn(
        "z-30 border-b border-border bg-background/95 backdrop-blur-md",
        sticky && "sticky top-0"
      )}
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-5 md:px-10">
        <Logo href={homeHref} />

        {!minimal && (
          <nav className="flex items-center gap-2 md:gap-6">
            {!session && (
              <Link
                href="/explore"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline px-3 py-1.5"
              >
                Browse Chefs
              </Link>
            )}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground px-3 py-1.5"
              >
                {link.label}
              </Link>
            ))}
            <NavbarActions session={session} />
          </nav>
        )}
      </div>
    </header>
  );
}
