"use client";

import { useUser, useClerk } from "@clerk/nextjs";

function toSessionUser(user: ReturnType<typeof useUser>["user"]) {
  if (!user) return null;
  return {
    user: {
      id: user.id,
      name: user.fullName ?? user.username ?? null,
      email: user.primaryEmailAddress?.emailAddress ?? null,
    },
  };
}

export const authClient = {
  useSession() {
    const { isLoaded, user } = useUser();
    return { data: toSessionUser(user), isLoaded };
  },
  signOut() {
    const { signOut } = useClerk();
    return signOut({ redirectUrl: "/auth/sign-in" });
  },
};