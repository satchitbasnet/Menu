import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  wide?: boolean;
};

export function PageContainer({
  children,
  className = "",
  wide = false,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto px-5 py-10 md:px-10 md:py-14",
        wide ? "max-w-screen-xl" : "max-w-3xl",
        className
      )}
    >
      {children}
    </main>
  );
}
