import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { proposalSchema } from "@/lib/validations";
import { serializeProposal } from "@/lib/serializers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = proposalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { eventId, chefNotes, tiers } = parsed.data;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const proposal = await prisma.$transaction(async (tx) => {
      const created = await tx.menuProposal.create({
        data: {
          eventId,
          chefNotes,
          status: "SENT",
          tiers: {
            create: tiers.map((tier) => ({
              name: tier.name,
              description: tier.description,
              pricePerPerson: tier.pricePerPerson,
              totalCost: tier.pricePerPerson * event.headcount,
              menuItems: tier.menuItems,
              imageUrl: tier.imageUrl || null,
            })),
          },
        },
        include: { tiers: true },
      });

      await tx.event.update({
        where: { id: eventId },
        data: { status: "CLIENT_REVIEW" },
      });

      return created;
    });

    return NextResponse.json(
      {
        proposalId: proposal.id,
        eventId,
        proposal: serializeProposal(proposal),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/proposals error:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}
