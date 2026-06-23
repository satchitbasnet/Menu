import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeDashboardEvent } from "@/lib/serializers";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { userId: session.userId },
    });

    if (!client) {
      return NextResponse.json({ bookings: [] });
    }

    const events = await prisma.event.findMany({
      where: { clientId: client.id },
      include: {
        client: true,
        menuProposals: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { tiers: true },
        },
      },
      orderBy: { eventDate: "desc" },
    });

    return NextResponse.json({
      bookings: events.map(serializeDashboardEvent),
    });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
