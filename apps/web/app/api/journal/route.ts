import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : null;
  const tradesTaken = typeof body?.tradesTaken === "string" ? body.tradesTaken : null;
  const reason = typeof body?.reason === "string" ? body.reason : null;
  const mindset = typeof body?.mindset === "string" ? body.mindset : null;
  const revengeTrading =
    typeof body?.revengeTrading === "boolean" ? body.revengeTrading : false;

  if (!date || !tradesTaken) {
    return NextResponse.json(
      { error: "date (YYYY-MM-DD) and tradesTaken are required" },
      { status: 400 }
    );
  }

  try {
    const entry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        tradesTaken,
        reason,
        mindset,
        revengeTrading,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A journal entry already exists for this date" },
        { status: 409 }
      );
    }
    throw error;
  }
}