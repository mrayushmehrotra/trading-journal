"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { IconArrowUpRight, IconStarFilled, IconCheck } from "@tabler/icons-react"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.215, 0.61, 0.355, 1] as const },
  }),
}

const stats = [
  { value: "₹50Cr+", label: "P&L Logged", highlight: true },
  { value: "30k+", label: "Active traders", highlight: false },
  { value: "99.9%", label: "Uptime", highlight: false },
  { value: "4.9", label: "Product Rating", rating: true, highlight: true },
]

export function LandingHero() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="relative min-h-screen bg-[#F4F5F7] pt-24 pb-32 overflow-hidden text-[#0F172A]">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Headline */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-12 max-w-4xl"
        >
          <h1 className="text-5xl font-light tracking-tight text-[#0F172A] sm:text-7xl lg:text-8xl leading-[1.08]">
            Turn money into
            <br />
            <span className="relative inline-block mt-2">
              <span className="absolute -inset-1 sm:-inset-2 bg-[#00E575] rounded-full sm:rounded-3xl -rotate-1 transform scale-y-90 opacity-90 shadow-sm" />
              <span className="relative italic font-normal text-[#0F172A] px-3 sm:px-6">
                foresight
              </span>
            </span>
          </h1>
        </motion.div>

        {/* 3-Column Hero Content Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          {/* Left Column: Subhead & Description */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="lg:col-span-4 space-y-6 self-center"
          >
            <div className="border-l-2 border-[#0F172A] pl-5">
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0F172A]">
                Clarity and control to act
              </h2>
            </div>
            <p className="text-base leading-relaxed text-[#64748B] pl-5 max-w-md">
              TradeJournal connects every trade, P&amp;L log, and psychological note your strategy runs and turns scattered executions into disciplined foresight.
            </p>
          </motion.div>

          {/* Center Column: Halftone Dot-Matrix Graphic */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="lg:col-span-4 flex justify-center items-end relative -mb-12 lg:-mb-16"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[3/4]">
              <Image
                src="/dot_matrix_silhouette.png"
                alt="Dot Matrix Silhouette"
                fill
                priority
                className="object-contain mix-blend-multiply drop-shadow-md transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          </motion.div>

          {/* Right Column: 4 Stat Cards */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="lg:col-span-4 grid grid-cols-2 gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                  stat.highlight
                    ? "border-[#00E575]/50 ring-1 ring-[#00E575]/20"
                    : "border-gray-200/80"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-light tracking-tight text-[#0F172A] sm:text-4xl">
                    {stat.value}
                  </span>
                  {stat.rating && (
                    <IconStarFilled size={18} className="text-[#00E575]" />
                  )}
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-[#64748B]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Bottom Action Bar & Social Proof */}
      <div className="fixed bottom-6 inset-x-0 z-40 px-6 pointer-events-none">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
          {/* Quick Request Form Pill */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center w-full sm:w-auto bg-[#111827] rounded-full p-1.5 shadow-2xl border border-white/10 max-w-md"
          >
            {submitted ? (
              <div className="flex items-center gap-2 px-6 py-2.5 text-sm text-[#00E575] font-medium w-full justify-center">
                <IconCheck size={18} />
                <span>Redirecting to your journal...</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="shrink-0 bg-[#00E575] hover:bg-[#00D66C] text-[#0F172A] text-sm font-semibold rounded-full px-6 py-2.5 flex items-center gap-2 transition-transform active:scale-95 shadow-md shadow-[#00E575]/20"
                >
                  <span>Start Free</span>
                  <span className="w-2 h-2 rounded-full bg-[#0F172A]" />
                </button>
              </>
            )}
          </motion.form>

          {/* Social Proof Pill */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-gray-200/80 text-xs font-medium text-[#0F172A]"
          >
            <span>Trusted by 10,000+ finance teams &amp; traders</span>
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}