"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { IconArrowRight, IconSparkles } from "@tabler/icons-react"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" as const },
  }),
}

export function LandingHero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/login_bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#0D1B2A]/70" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#22C55E] uppercase"
        >
          <IconSparkles size={14} />
          Free for all traders
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl"
        >
          Track your trades.
          <br />
          <span className="text-[#22C55E]">Master your mindset.</span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#B8C4CC] sm:text-lg"
        >
          Log your daily P&L, journal every trade you take, and reflect on why you took it —
          the discipline that separates profitable traders from the rest.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="bg-[#22C55E] px-8 text-white hover:bg-[#16A34A]">
            <Link href="/auth/sign-up">
              Start journaling free
              <IconArrowRight size={16} />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/auth/sign-in">Sign in to my journal</Link>
          </Button>
        </motion.div>

        <motion.p
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 text-xs text-[#8A9BA8]"
        >
          No credit card · No subscription · Your data stays private
        </motion.p>
      </div>
    </section>
  )
}