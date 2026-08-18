import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"
import type { Metadata } from "next"
import { baseMetadata, companyName, siteDescription } from "../seo-metadata"
import { LandingHero } from "@/components/landing-hero"
import { Button } from "@workspace/ui/components/button"
import {
  IconTrendingUp,
  IconBook2,
  IconBrain,
  IconChartBar,
  IconLock,
  IconDiscount2,
  IconArrowRight,
  IconTarget,
  IconClock,
  IconArrowUpRight,
} from "@tabler/icons-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  ...baseMetadata,
  title: `${companyName} — Free Trading Journal for Indian Stock Market Investors`,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
}

const features = [
  {
    icon: IconTrendingUp,
    title: "Daily P&L Tracking",
    description:
      "Log your profit and loss for every trading day and watch your cumulative performance charted over time.",
  },
  {
    icon: IconBook2,
    title: "Trade Journal",
    description:
      "Record which trades you took, why you took them, and what your mindset was. Journaling is the #1 habit of consistently profitable traders.",
  },
  {
    icon: IconBrain,
    title: "Trading Psychology",
    description:
      "Track your emotional state each day and spot patterns in your behaviour before they become expensive habits.",
  },
  {
    icon: IconChartBar,
    title: "Win Rate & Stats",
    description:
      "Win rate, best day, worst day, and total P&L calculated automatically. Know your real numbers.",
  },
  {
    icon: IconLock,
    title: "Private & Secure",
    description:
      "Your trades are yours alone. Every account is completely isolated and never shared.",
  },
  {
    icon: IconDiscount2,
    title: "100% Free",
    description:
      "No subscription, no premium tier, no ads. Free for all retail traders and investors.",
  },
]

const faqs = [
  {
    q: "What is TradeJournal?",
    a: "TradeJournal is a free web app to track daily profit and loss, log trades, and maintain a trading mindset journal — all in one place.",
  },
  {
    q: "Is TradeJournal free?",
    a: "Yes, TradeJournal is completely free with no subscription, no ads, and no hidden fees.",
  },
  {
    q: "Which markets does TradeJournal support?",
    a: "All Indian market segments — NSE & BSE equities, NIFTY & Bank NIFTY F&O, commodity futures, and currency derivatives.",
  },
  {
    q: "Does TradeJournal connect to Zerodha or Groww?",
    a: "Currently it's a manual journal — you enter your P&L and trade notes yourself. This keeps your data 100% private and broker-agnostic.",
  },
  {
    q: "How is this different from a spreadsheet?",
    a: "Instant charts, win-rate calculations, and a structured journaling format — without maintaining formulas. Always available from any device.",
  },
  {
    q: "Who is TradeJournal for?",
    a: "Intraday traders, swing traders, F&O traders, and long-term investors who want to build trading discipline through structured record-keeping.",
  },
]

export default async function HomePage() {
  const { data: session } = await auth.getSession()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <main className="bg-[#F4F5F7] text-[#0F172A] min-h-screen">
      {/* StackSide Inspired Top Navigation Bar */}
      <header className="fixed inset-x-0 top-0 z-50 py-4 px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-300/60 bg-white shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/icon.png"
                alt="TradeJournal Logo"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-base font-semibold tracking-tight text-[#0F172A]">
              Trade.Side <span className="text-xs text-[#64748B] font-normal">Journal</span>
            </span>
          </Link>

          {/* Center Floating Pill Navbar */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-4 rounded-full bg-white/90 backdrop-blur-md px-6 py-2 border border-gray-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] text-xs sm:text-sm font-medium text-[#475569]"
          >
            <a href="#hero" className="transition-colors hover:text-[#0F172A]">
              Home
            </a>
            <span className="text-gray-300">·</span>
            <a href="#features" className="transition-colors hover:text-[#0F172A]">
              Services
            </a>
            <span className="text-gray-300">·</span>
            <a href="#why" className="transition-colors hover:text-[#0F172A]">
              Why Journal
            </a>
            <span className="text-gray-300">·</span>
            <a href="#faq" className="transition-colors hover:text-[#0F172A]">
              About
            </a>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="hidden sm:inline-flex text-xs sm:text-sm font-medium text-[#475569] hover:text-[#0F172A] px-3 py-2 transition"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-1.5 bg-[#00E575] hover:bg-[#00D66C] text-[#0F172A] text-xs sm:text-sm font-semibold rounded-full px-5 py-2.5 shadow-md shadow-[#00E575]/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Get Started</span>
              <IconArrowUpRight size={16} stroke={2.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <LandingHero />

      {/* Features Section */}
      <section id="features" aria-labelledby="features-heading" className="bg-white py-28 border-t border-gray-200/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2
              id="features-heading"
              className="text-3xl font-light tracking-tight text-[#0F172A] sm:text-5xl"
            >
              Everything a disciplined trader needs
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#64748B]">
              Built specifically for Indian stock market investors — from intraday F&amp;O traders to long-term equity investors.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group relative rounded-3xl border border-gray-200/80 bg-[#F8FAFC] p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:border-[#00E575]/50"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-200/80 group-hover:border-[#00E575]/40 transition-colors">
                  <Icon size={24} stroke={1.8} className="text-[#0F172A]" />
                </div>
                <h3 className="mb-3 text-lg font-medium text-[#0F172A]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#64748B]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Keep a Journal Section */}
      <section id="why" aria-labelledby="why-heading" className="bg-[#0F172A] text-white py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 id="why-heading" className="text-3xl font-light tracking-tight sm:text-5xl leading-tight">
              Why keep a <br />
              <span className="italic text-[#00E575]">trading journal?</span>
            </h2>
            <p className="text-base leading-relaxed text-slate-300">
              Most retail traders lose money not because of bad strategies, but because of inconsistent execution and unchecked emotions. A trading journal forces you to confront the truth about your executions.
            </p>
            <p className="text-base leading-relaxed text-slate-400">
              Professional traders at prop desks and hedge funds all keep detailed trade logs. TradeJournal brings the same institutional discipline to your personal trading routine.
            </p>
            <div className="pt-4">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 bg-[#00E575] hover:bg-[#00D66C] text-[#0F172A] font-semibold rounded-full px-8 py-3.5 shadow-lg transition-transform hover:scale-105"
              >
                <span>Start Your Free Journal</span>
                <IconArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: IconClock,
                title: "2 minutes a day",
                text: "Logging your P&L and journal entry takes less time than a coffee break.",
              },
              {
                icon: IconChartBar,
                title: "Win rate & stats",
                text: "Your real numbers — not the ones you remember — computed automatically.",
              },
              {
                icon: IconTarget,
                title: "Discipline built in",
                text: "Structured prompts for the why and the mindset behind every trade.",
              },
              {
                icon: IconLock,
                title: "100% private",
                text: "Your journal is yours alone. No sharing, no ads, no selling data.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <Icon size={24} stroke={1.8} className="mb-4 text-[#00E575]" />
                <h3 className="mb-2 font-medium text-white text-base">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" aria-labelledby="faq-heading" className="bg-[#F4F5F7] py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <h2 id="faq-heading" className="text-3xl font-light tracking-tight text-[#0F172A] sm:text-5xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-sm text-[#64748B]">Everything you need to know about TradeJournal</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all hover:border-[#00E575]/40"
              >
                <h3 className="font-medium text-[#0F172A] text-base">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200/80 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="Logo" width={20} height={20} className="rounded-full" />
            <span className="font-medium text-[#0F172A]">TradeJournal</span>
            <span>· © {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 font-medium text-[#0F172A]">
            <a href="#hero" className="hover:text-[#00E575] transition">Home</a>
            <span>·</span>
            <a href="#features" className="hover:text-[#00E575] transition">Services</a>
            <span>·</span>
            <a href="#why" className="hover:text-[#00E575] transition">Works</a>
            <span>·</span>
            <a href="#faq" className="hover:text-[#00E575] transition">About</a>
          </div>
        </div>
      </footer>
    </main>
  )
}