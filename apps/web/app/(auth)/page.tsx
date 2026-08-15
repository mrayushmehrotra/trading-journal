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
    <main className="bg-[#0D1B2A]">
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22C55E]/20">
              <IconTrendingUp size={20} className="text-[#22C55E]" stroke={1.8} />
            </span>
            <span className="text-sm font-bold text-white">TradeJournal</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[#B8C4CC] md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#why" className="transition-colors hover:text-white">
              Why journal
            </a>
            <a href="#faq" className="transition-colors hover:text-white">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="bg-[#22C55E] text-white hover:bg-[#16A34A]">
              <Link href="/auth/sign-up">Get started free</Link>
            </Button>
          </div>
        </div>
      </nav>

      <LandingHero />

      <section id="features" aria-labelledby="features-heading" className="bg-[#F5F7FA] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2
            id="features-heading"
            className="text-center text-3xl font-bold text-[#1A202C] sm:text-4xl"
          >
            Everything a disciplined trader needs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[#6B7280]">
            Built specifically for NSE &amp; BSE traders — from intraday to long-term investors.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-7 transition-shadow hover:shadow-lg"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#22C55E]/10">
                  <Icon size={22} stroke={1.8} className="text-[#16A34A]" />
                </span>
                <h3 className="mb-2 font-bold text-[#1A202C]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#6B7280]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why" aria-labelledby="why-heading" className="bg-[#0D1B2A] py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 id="why-heading" className="text-3xl font-bold text-white sm:text-4xl">
              Why keep a trading journal?
            </h2>
            <p className="mt-6 leading-relaxed text-[#B8C4CC]">
              Most retail traders lose money not because of bad strategies, but because of
              inconsistent execution and unchecked emotions. A trading journal forces you to
              confront the truth about your trades — why you entered, why you exited, and
              whether fear or greed was driving you.
            </p>
            <p className="mt-4 leading-relaxed text-[#B8C4CC]">
              Professional traders at prop desks and hedge funds all keep detailed trade logs.
              TradeJournal brings the same discipline to retail traders — in under two minutes a
              day.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-[#22C55E] px-8 text-white hover:bg-[#16A34A]"
            >
              <Link href="/auth/sign-up">
                Start your journal today
                <IconArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <Icon size={22} stroke={1.8} className="mb-4 text-[#22C55E]" />
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-[#8A9BA8]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="bg-[#F5F7FA] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 id="faq-heading" className="text-center text-3xl font-bold text-[#1A202C] sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-6"
              >
                <h3 className="font-semibold text-[#1A202C]">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-heading" className="bg-[#0D1B2A] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 id="cta-heading" className="text-3xl font-bold text-white sm:text-4xl">
            Start your trading journal today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#B8C4CC]">
            Join traders who track their P&amp;L, reflect on their trades, and grow as
            disciplined investors — completely free.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-10 bg-[#22C55E] px-10 text-white hover:bg-[#16A34A]"
          >
            <Link href="/auth/sign-up">
              Create your free journal
              <IconArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-[#8A9BA8]">
            © {new Date().getFullYear()} TradeJournal · Free trading journal for Indian stock
            market investors
          </p>
          <p className="mt-2 text-xs text-[#5F7280]">
            Built for NSE · BSE · NIFTY · Bank NIFTY · F&amp;O traders
          </p>
        </div>
      </footer>
    </main>
  )
}