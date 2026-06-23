import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeChef } from "@/lib/serializers";
import { chefServicesSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const chef = await prisma.chef.findUnique({ where: { id } });

    if (!chef) {
      return NextResponse.json({ error: "Chef not found" }, { status: 404 });
    }

    return NextResponse.json(serializeChef(chef));
  } catch (error) {
    console.error("GET /api/chef/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chef" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = chefServicesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const chef = await prisma.chef.update({
      where: { id },
      data: { activeServices: parsed.data.activeServices },
    });

    return NextResponse.json(serializeChef(chef));
  } catch (error) {
    console.error("PATCH /api/chef/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update chef" },
      { status: 500 }
    );
  }
}
