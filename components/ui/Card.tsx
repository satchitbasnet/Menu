import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = "", hover }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-sm border border-border bg-card p-6",
        hover && "transition-shadow hover:shadow-soft",
        className
      )}
    >
      {children}
    </div>
  );
}
