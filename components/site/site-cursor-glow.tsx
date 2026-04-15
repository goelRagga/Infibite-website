"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

const CURSOR_DOT = 22
const CURSOR_HALF = CURSOR_DOT / 2

export function SiteCursorGlow() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)

  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)
  const springX = useSpring(mvX, { stiffness: 400, damping: 34, mass: 0.22 })
  const springY = useSpring(mvY, { stiffness: 400, damping: 34, mass: 0.22 })

  const dotX = useTransform(springX, (v) => v - CURSOR_HALF)
  const dotY = useTransform(springY, (v) => v - CURSOR_HALF)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setEnabled(true)

    const move = (e: PointerEvent) => {
      mvX.set(e.clientX)
      mvY.set(e.clientY)
      setActive(true)
    }

    const out = (e: MouseEvent) => {
      if (e.relatedTarget != null) return
      setActive(false)
    }

    window.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("mouseout", out)

    return () => {
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("mouseout", out)
    }
  }, [mvX, mvY])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden" aria-hidden>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 rounded-full will-change-transform"
        style={{
          width: CURSOR_DOT,
          height: CURSOR_DOT,
          x: dotX,
          y: dotY,
          backgroundColor: "rgba(255,255,255,0.42)",
        }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </div>
  )
}
