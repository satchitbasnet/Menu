import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    const [chef, client] = await Promise.all([
      prisma.chef.findUnique({
        where: { userId: session.userId },
        select: { id: true },
      }),
      prisma.client.findUnique({
        where: { userId: session.userId },
        select: { id: true },
      }),
    ]);

    return NextResponse.json({
      user: session,
      chefId: chef?.id ?? null,
      clientId: client?.id ?? null,
    });
  } catch (error) {
    console.error("GET /api/me error:", error);
    return NextResponse.json({ user: null });
  }
}
