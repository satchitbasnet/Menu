import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeChef } from "@/lib/serializers";

export async function GET() {
  try {
    const chefs = await prisma.chef.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      chefs: chefs.map(serializeChef),
    });
  } catch (error) {
    console.error("GET /api/chefs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chefs" },
      { status: 500 }
    );
  }
}
