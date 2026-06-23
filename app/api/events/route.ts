import { NextResponse } from "next/server";
import type { ServiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeDashboardEvent } from "@/lib/serializers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chefId = searchParams.get("chefId");
    const serviceType = searchParams.get("serviceType") as ServiceType | null;

    if (!chefId) {
      return NextResponse.json(
        { error: "chefId query parameter is required" },
        { status: 400 }
      );
    }

    const events = await prisma.event.findMany({
      where: {
        chefId,
        ...(serviceType ? { serviceType } : {}),
      },
      include: {
        client: true,
        menuProposals: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { tiers: true },
        },
      },
      orderBy: { eventDate: "asc" },
    });

    const dashboardEvents = events.map(serializeDashboardEvent);

    const totalEarnings = events
      .filter((e) => e.status === "PAID")
      .reduce((sum, event) => {
        const selected = event.menuProposals[0]?.tiers.find((t) => t.isSelected);
        return sum + (selected ? selected.totalCost.toNumber() : 0);
      }, 0);

    return NextResponse.json({ events: dashboardEvents, totalEarnings });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
