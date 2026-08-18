import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created" || type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const primaryEmail = email_addresses?.find((e) => e.id === data.primary_email_address_id)?.email_address ?? email_addresses?.[0]?.email_address;

    if (!id || !primaryEmail) {
      return NextResponse.json({ error: "Missing user data" }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: primaryEmail,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        imageUrl: image_url ?? null,
      },
      create: {
        clerkId: id,
        email: primaryEmail,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        imageUrl: image_url ?? null,
      },
    });

    return NextResponse.json({ success: true });
  }

  if (type === "user.deleted") {
    const { id } = data;
    if (id) {
      await prisma.user.deleteMany({ where: { clerkId: id } });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true });
}