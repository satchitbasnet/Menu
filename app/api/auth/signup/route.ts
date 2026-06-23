import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, getRedirectForRole } from "@/lib/auth";
import { signupSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { name, email, passwordHash, role },
      });

      if (role === "CHEF") {
        await tx.chef.create({
          data: {
            userId: created.id,
            name,
            email,
            bio: null,
            activeServices: ["PRIVATE_DINNER", "MEAL_PREP", "COOKING_CLASS"],
          },
        });
      } else {
        await tx.client.create({
          data: {
            userId: created.id,
            name,
            email,
          },
        });
      }

      return created;
    });

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        redirectTo: getRedirectForRole(user.role),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);

    const prismaCode =
      error && typeof error === "object" && "code" in error
        ? (error as { code: string }).code
        : null;

    if (prismaCode === "P2021") {
      return NextResponse.json(
        {
          error:
            "Database is not set up. Run: npx prisma db push --force-reset && npm run db:seed",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
