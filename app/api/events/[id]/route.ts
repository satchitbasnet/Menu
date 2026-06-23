import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { serializeEvent } from "@/lib/serializers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const eventPatchSchema = z.object({
  status: z.enum(["PAID"]),
});

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        chef: true,
        client: true,
        menuProposals: {
          orderBy: { createdAt: "desc" },
          include: { tiers: { orderBy: { pricePerPerson: "asc" } } },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(serializeEvent(event));
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = eventPatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const event = await prisma.event.update({
      where: { id },
      data: { status: parsed.data.status },
      include: {
        chef: true,
        client: true,
        menuProposals: {
          orderBy: { createdAt: "desc" },
          include: { tiers: true },
        },
      },
    });

    return NextResponse.json(serializeEvent(event));
  } catch (error) {
    console.error("PATCH /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
