import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { selectTierSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id: proposalId } = await context.params;
    const body = await request.json();
    const parsed = selectTierSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { tierId } = parsed.data;

    const proposal = await prisma.menuProposal.findUnique({
      where: { id: proposalId },
      include: { tiers: true, event: true },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const tier = proposal.tiers.find((t) => t.id === tierId);

    if (!tier) {
      return NextResponse.json({ error: "Tier not found" }, { status: 404 });
    }

    const recalculatedTotal = tier.pricePerPerson.toNumber() * proposal.event.headcount;

    const result = await prisma.$transaction(async (tx) => {
      await tx.proposalTier.updateMany({
        where: { menuProposalId: proposalId },
        data: { isSelected: false },
      });

      const updatedTier = await tx.proposalTier.update({
        where: { id: tierId },
        data: {
          isSelected: true,
          totalCost: recalculatedTotal,
        },
      });

      await tx.menuProposal.update({
        where: { id: proposalId },
        data: { status: "TIER_SELECTED" },
      });

      await tx.event.update({
        where: { id: proposal.eventId },
        data: { status: "APPROVED" },
      });

      return updatedTier;
    });

    return NextResponse.json({
      proposalId,
      tierId,
      totalCost: result.totalCost.toNumber(),
      eventId: proposal.eventId,
    });
  } catch (error) {
    console.error("PATCH /api/proposals/[id]/select-tier error:", error);
    return NextResponse.json(
      { error: "Failed to select tier" },
      { status: 500 }
    );
  }
}
