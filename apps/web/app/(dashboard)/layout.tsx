import { redirect } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { auth } from "@/lib/auth/server"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = await auth.getSession()
  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <Topbar />
      <main className="min-h-screen pt-16 md:ml-[248px]">
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>

  )
}