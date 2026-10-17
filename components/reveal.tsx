"use client"

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

const splitWords = (children: ReactNode) => {
  if (typeof children !== "string" && typeof children !== "number") return [{ content: children, key: "content" }]
  return String(children).split(/(\s+)/).filter(Boolean).map((content, index) => ({ content, key: `${content}-${index}` }))
}

function MaskedLines({ children, visible, delay }: { children: ReactNode; visible: boolean; delay: number }) {
  const measureRef = useRef<HTMLSpanElement>(null)
  const [lines, setLines] = useState<ReactNode[][] | null>(null)
  const parts = splitWords(children)

  useLayoutEffect(() => {
    const measure = measureRef.current
    if (!measure) return
    const runMeasure = () => {
      const nodes = Array.from(measure.children) as HTMLElement[]
      const grouped: ReactNode[][] = []
      let lastTop = -Infinity
      nodes.forEach((node, index) => {
        if (Math.abs(node.offsetTop - lastTop) > 1) {
          grouped.push([])
          lastTop = node.offsetTop
        }
        grouped[grouped.length - 1].push(parts[index].content)
      })
      setLines(grouped)
    }
    runMeasure()

    const observer = new ResizeObserver(() => {
      setLines(null)
      requestAnimationFrame(runMeasure)
    })
    if (measure.parentElement) observer.observe(measure.parentElement)
    return () => observer.disconnect()
  }, [children, parts.length])

  return <>
    <span ref={measureRef} className="reveal-measure" aria-hidden="true">
      {parts.map((part) => <span key={part.key}>{part.content}</span>)}
    </span>
    {lines?.map((line, index) => <span key={index} className="reveal-mask"><span className={`reveal-line ${visible ? "is-visible" : ""}`} style={{ "--reveal-delay": `${delay + index * 110}ms` } as CSSProperties}>{line}</span></span>)}
    {!lines && <span className="reveal-fallback">{children}</span>}
  </>
}

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

  return <span ref={ref} className={`${variant === "mask" ? "reveal-mask-host" : "reveal"} ${visible ? "is-visible" : ""} ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{variant === "mask" ? <MaskedLines children={children} visible={visible} delay={delay} /> : children}</span>
}
