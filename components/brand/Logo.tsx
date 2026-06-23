import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function Logo({ href = "/", className, size = "md" }: LogoProps) {
  const sizeClass = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  const content = (
    <span
      className={cn(
        "font-serif tracking-tight text-foreground",
        sizeClass,
        className
      )}
    >
      Menu<span className="text-muted-foreground mx-1">·</span>To
      <span className="text-muted-foreground mx-1">·</span>Table
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-80">
        {content}
      </Link>
    );
  }

  return content;
}
