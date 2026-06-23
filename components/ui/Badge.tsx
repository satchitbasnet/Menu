import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function Badge({ children, className = "", style }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-xs",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
