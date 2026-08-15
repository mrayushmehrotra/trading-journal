import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const tradeId = Number(id);
  if (!Number.isInteger(tradeId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await prisma.trade.findFirst({
    where: { id: tradeId, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : null;
  const pnl = typeof body?.pnl === "number" ? body.pnl : null;
  if (!date || pnl === null || Number.isNaN(pnl)) {
    return NextResponse.json(
      { error: "date (YYYY-MM-DD) and pnl are required" },
      { status: 400 }
    );
  }

  try {
    const trade = await prisma.trade.update({
      where: { id: tradeId },
      data: { date: new Date(date), pnl },
    });
    return NextResponse.json(trade);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A trade entry already exists for this date" },
        { status: 409 }
      );
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const tradeId = Number(id);
  if (!Number.isInteger(tradeId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await prisma.trade.findFirst({
    where: { id: tradeId, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.trade.delete({ where: { id: tradeId } });
  return NextResponse.json({ success: true });
}