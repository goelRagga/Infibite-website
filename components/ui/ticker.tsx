import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type TickerProps = {
  direction: "up" | "down"
  durationSec: number
  gapClassName?: string
  className?: string
  trackClassName?: string
  children: ReactNode
}

export function Ticker({
  direction,
  durationSec,
  gapClassName = "gap-4",
  className,
  trackClassName,
  children,
}: TickerProps) {
  return (
    <div className={cn("relative h-full min-h-0 overflow-hidden", className)}>
      <div
        className={cn(
          "flex min-h-0 flex-col will-change-transform",
          gapClassName,
          direction === "up" ? "infibite-ticker-up" : "infibite-ticker-down",
          trackClassName
        )}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
