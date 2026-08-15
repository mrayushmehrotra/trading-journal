import { AccountView } from "@neondatabase/auth-ui";

export const dynamic = "force-dynamic";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <AccountView />
    </div>
  );
}