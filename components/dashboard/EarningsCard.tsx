import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";

type EarningsCardProps = {
  totalEarnings: number;
  upcomingCount: number;
};

export function EarningsCard({
  totalEarnings,
  upcomingCount,
}: EarningsCardProps) {
  return (
    <div className="rounded-sm border border-border bg-card p-5 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Total Revenue
          </p>
          <p className="mt-2 font-serif text-3xl font-normal leading-none text-foreground md:text-4xl">
            {formatCurrency(totalEarnings)}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {upcomingCount} upcoming booking{upcomingCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div
          className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs"
          style={{ backgroundColor: "#EDF4ED", color: "#3A7A47" }}
        >
          <TrendingUp size={10} />
          <span>+18%</span>
        </div>
      </div>
    </div>
  );
}
