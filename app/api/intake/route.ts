import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { intakeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = intakeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const {
      chefId,
      serviceType,
      name,
      email,
      phone,
      eventDate,
      headcount,
      intakeData,
    } = parsed.data;

    const chef = await prisma.chef.findUnique({ where: { id: chefId } });

    if (!chef) {
      return NextResponse.json({ error: "Chef not found" }, { status: 404 });
    }

    if (!chef.activeServices.includes(serviceType)) {
      return NextResponse.json(
        { error: "This service is not currently offered by the chef" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: { name, email, phone: phone || null },
    });

    const event = await prisma.event.create({
      data: {
        chefId,
        clientId: client.id,
        eventDate: new Date(eventDate),
        headcount,
        serviceType,
        status: "PENDING_PROPOSAL",
        intakeData: intakeData as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(
      { eventId: event.id, clientId: client.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/intake error:", error);
    return NextResponse.json(
      { error: "Failed to submit intake" },
      { status: 500 }
    );
  }
}
