import { UserProfile } from "@clerk/nextjs"
import { IconShieldCheck, IconUser } from "@tabler/icons-react"
import { privateAreaMetadata } from "@/app/seo-metadata"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  ...privateAreaMetadata,
  title: "Account Settings",
}

export default function AccountPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00E575]/15 px-3 py-1 text-xs font-semibold text-[#00E575]">
              <IconShieldCheck size={14} />
              100% Encrypted &amp; Private
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Account Settings &amp; Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal profile, security options, and account preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full border border-border/60">
          <IconUser size={16} className="text-[#00E575]" />
          <span>Personal Account</span>
        </div>
      </div>

      {/* Clerk UserProfile Container with Custom Styling */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl rounded-3xl bg-card border border-border/80 p-4 sm:p-6 shadow-sm overflow-hidden">
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none bg-transparent border-0",
                card: "bg-transparent shadow-none w-full border-0 p-0",
                navbar: "border-r border-border/60 pr-4",
                navbarButton: "text-muted-foreground hover:text-foreground font-medium rounded-xl text-sm py-2.5",
                navbarButtonActive: "bg-[#00E575]/15 text-[#00E575] font-semibold rounded-xl",
                headerTitle: "text-foreground font-semibold text-lg",
                headerSubtitle: "text-muted-foreground text-xs",
                profileSectionTitleText: "text-foreground font-medium text-sm",
                formButtonPrimary:
                  "bg-[#00E575] hover:bg-[#00D66C] text-[#0F172A] font-semibold text-sm rounded-full px-5 py-2.5 shadow-md shadow-[#00E575]/20 transition",
                formButtonReset:
                  "rounded-full text-xs font-medium text-muted-foreground hover:bg-muted px-4 py-2",
                formFieldInput:
                  "rounded-xl border-border focus:border-[#00E575] focus:ring-[#00E575] text-sm",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}