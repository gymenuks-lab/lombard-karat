"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

export function Reveal({ children, className = "", delay = 0, variant = "fade" }: { children: ReactNode; className?: string; delay?: number; variant?: "fade" | "mask" }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.16 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <span ref={ref} className={`${variant === "mask" ? "reveal-mask" : "reveal"} ${visible ? "is-visible" : ""} ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{variant === "mask" ? <span className="reveal-line">{children}</span> : children}</span>
}
