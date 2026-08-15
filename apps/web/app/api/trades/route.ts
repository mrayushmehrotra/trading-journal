import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

function parseBody(body: Record<string, unknown>) {
  const date = typeof body?.date === "string" ? body.date : null;
  const pnl = typeof body?.pnl === "number" ? body.pnl : null;
  if (!date || pnl === null || Number.isNaN(pnl)) return null;
  return { date: new Date(date), pnl };
}

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trades = await prisma.trade.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(trades);
}

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = parseBody(body ?? {});
  if (!parsed) {
    return NextResponse.json(
      { error: "date (YYYY-MM-DD) and pnl are required" },
      { status: 400 }
    );
  }

  try {
    const trade = await prisma.trade.create({
      data: { userId: session.user.id, ...parsed },
    });
    return NextResponse.json(trade, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A trade entry already exists for this date" },
        { status: 409 }
      );
    }
    throw error;
  }
}