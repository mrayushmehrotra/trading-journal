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
  const entryId = Number(id);
  if (!Number.isInteger(entryId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : null;
  const tradesTaken = typeof body?.tradesTaken === "string" ? body.tradesTaken : null;
  const reason = typeof body?.reason === "string" ? body.reason : null;
  const mindset = typeof body?.mindset === "string" ? body.mindset : null;

  if (!date || !tradesTaken) {
    return NextResponse.json(
      { error: "date (YYYY-MM-DD) and tradesTaken are required" },
      { status: 400 }
    );
  }

  try {
    const entry = await prisma.journalEntry.update({
      where: { id: entryId },
      data: { date: new Date(date), tradesTaken, reason, mindset },
    });
    return NextResponse.json(entry);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A journal entry already exists for this date" },
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
  const entryId = Number(id);
  if (!Number.isInteger(entryId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.journalEntry.delete({ where: { id: entryId } });
  return NextResponse.json({ success: true });
}