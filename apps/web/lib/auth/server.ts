import { auth as clerkAuth, clerkMiddleware } from "@clerk/nextjs/server";
import type { NextMiddleware } from "next/server";

type SessionUser = { id: string; name: string | null; email: string | null };
type Session = { user: SessionUser } | null;
type GetSessionResult = { data: Session };

async function getSession(): Promise<GetSessionResult> {
  const { userId } = await clerkAuth();
  if (!userId) return { data: null };
  return { data: { user: { id: userId, name: null, email: null } } };
}

export const auth: {
  getSession: () => Promise<GetSessionResult>;
  middleware: NextMiddleware;
} = {
  getSession,
  middleware: clerkMiddleware as unknown as NextMiddleware,
};
