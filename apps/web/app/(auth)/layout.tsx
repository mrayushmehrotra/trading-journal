import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/login_bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}