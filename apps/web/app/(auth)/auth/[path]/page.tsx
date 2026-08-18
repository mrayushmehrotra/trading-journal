import Image from "next/image"
import Link from "next/link"
import { SignIn, SignUp } from "@clerk/nextjs"
import { IconCheck, IconStarFilled, IconShieldCheck, IconTrendingUp, IconBrain } from "@tabler/icons-react"

export const dynamicParams = false

export function generateStaticParams() {
  return [{ path: "sign-in" }, { path: "sign-up" }]
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params
  const isSignUp = path === "sign-up"

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F4F5F7]">
      {/* Left Showcase Panel */}
      <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-12 overflow-hidden bg-[#F4F5F7] border-r border-gray-200/80">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-300/60 bg-white shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/icon.png"
                alt="TradeJournal Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#0F172A]">
              Trade.Side <span className="text-xs text-[#64748B] font-normal">Journal</span>
            </span>
          </Link>
        </div>

        {/* Middle Showcase Content */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto py-12">
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-[#0F172A] leading-[1.12]">
            Turn trades into
            <br />
            <span className="relative inline-block mt-2">
              <span className="absolute -inset-1 bg-[#00E575] rounded-2xl -rotate-1 transform scale-y-90 opacity-90 shadow-sm" />
              <span className="relative italic font-normal text-[#0F172A] px-4">
                foresight
              </span>
            </span>
          </h1>

          <p className="text-base text-[#64748B] leading-relaxed">
            {isSignUp
              ? "Join thousands of disciplined Indian stock market traders tracking their daily P&L, trade logs, and psychological mindset."
              : "Welcome back! Sign in to access your personal trade journal, win-rate analytics, and execution history."}
          </p>

          <div className="space-y-4 pt-2">
            {[
              { icon: IconTrendingUp, text: "Automated Win-Rate & Equity Curve Analytics" },
              { icon: IconBrain, text: "Psychology & Emotional Mindset Tracking" },
              { icon: IconShieldCheck, text: "100% Private, Secure & Broker-Agnostic" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm font-medium text-[#0F172A]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00E575]/20 text-[#0F172A]">
                  <IconCheck size={16} stroke={3} />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-gray-200/80">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-sm border border-gray-200/80 text-xs font-medium text-[#0F172A]">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#0F172A] text-white text-[10px] font-bold flex items-center justify-center">
                IN
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#00E575] text-[#0F172A] text-[10px] font-bold flex items-center justify-center">
                TJ
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#3B82F6] text-white text-[10px] font-bold flex items-center justify-center">
                F&amp;O
              </div>
            </div>
            <span>Trusted by 10,000+ traders</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-[#0F172A]">
            <IconStarFilled size={14} className="text-[#00E575]" />
            <span>4.9 / 5 Rating</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:col-span-6 flex flex-col justify-center items-center p-6 sm:p-12 bg-[#0F172A] relative">
        {/* Mobile Logo Header */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-700 bg-[#1E293B]">
              <Image
                src="/icon.png"
                alt="TradeJournal Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-lg font-semibold text-white">
              Trade.Side <span className="text-xs text-gray-400 font-normal">Journal</span>
            </span>
          </Link>
        </div>

        {/* Clerk Sign-Up / Sign-In Container */}
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-full bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {isSignUp ? (
              <SignUp
                fallbackRedirectUrl="/dashboard"
                signInUrl="/auth/sign-in"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    cardBox: "w-full shadow-none bg-transparent p-0",
                    card: "bg-transparent shadow-none p-0 w-full",
                    headerTitle: "text-white text-xl font-semibold",
                    headerSubtitle: "text-gray-400 text-sm",
                    socialButtonsBlockButton:
                      "bg-white/10 border-white/10 text-white hover:bg-white/20 transition",
                    socialButtonsBlockButtonText: "text-white font-medium text-sm",
                    dividerLine: "bg-white/10",
                    dividerText: "text-gray-400 text-xs",
                    formFieldLabel: "text-gray-300 text-xs font-medium",
                    formFieldInput:
                      "bg-slate-900/90 border-white/10 text-white focus:border-[#00E575] focus:ring-1 focus:ring-[#00E575] rounded-xl text-sm py-2.5",
                    formButtonPrimary:
                      "bg-[#00E575] hover:bg-[#00D66C] text-[#0F172A] font-semibold text-sm rounded-full py-3 transition shadow-lg shadow-[#00E575]/20",
                    footerActionText: "text-gray-400 text-xs",
                    footerActionLink: "text-[#00E575] hover:underline text-xs font-medium",
                  },
                }}
              />
            ) : (
              <SignIn
                fallbackRedirectUrl="/dashboard"
                signUpUrl="/auth/sign-up"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    cardBox: "w-full shadow-none bg-transparent p-0",
                    card: "bg-transparent shadow-none p-0 w-full",
                    headerTitle: "text-white text-xl font-semibold",
                    headerSubtitle: "text-gray-400 text-sm",
                    socialButtonsBlockButton:
                      "bg-white/10 border-white/10 text-white hover:bg-white/20 transition",
                    socialButtonsBlockButtonText: "text-white font-medium text-sm",
                    dividerLine: "bg-white/10",
                    dividerText: "text-gray-400 text-xs",
                    formFieldLabel: "text-gray-300 text-xs font-medium",
                    formFieldInput:
                      "bg-slate-900/90 border-white/10 text-white focus:border-[#00E575] focus:ring-1 focus:ring-[#00E575] rounded-xl text-sm py-2.5",
                    formButtonPrimary:
                      "bg-[#00E575] hover:bg-[#00D66C] text-[#0F172A] font-semibold text-sm rounded-full py-3 transition shadow-lg shadow-[#00E575]/20",
                    footerActionText: "text-gray-400 text-xs",
                    footerActionLink: "text-[#00E575] hover:underline text-xs font-medium",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
