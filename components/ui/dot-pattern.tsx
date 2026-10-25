"use client"

import React, { useEffect, useId, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * DotPattern (magicui), versión liviana.
 *
 * La original creaba un <circle> animado con JavaScript por cada punto: en una
 * sección grande eran casi 1.800 animaciones infinitas a la vez y la página
 * se trababa. Esta versión dibuja la grilla con un único <pattern> SVG
 * (estático, lo pinta el navegador una vez) y, si `glow` está activo, hace
 * titilar solo una muestra chica de puntos con una animación CSS de opacidad
 * (clase `dot-titila` en globals.css).
 */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
  glow?: boolean
  /** Cantidad máxima de puntos que titilan cuando `glow` está activo. */
  glowCount?: number
}

type Brillo = {
  x: number
  y: number
  delay: number
  duration: number
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  glowCount = 48,
  ...props
}: DotPatternProps) {
  const id = useId()
  const containerRef = useRef<SVGSVGElement>(null)
  const [brillos, setBrillos] = useState<Brillo[]>([])

  useEffect(() => {
    if (!glow) return
    const el = containerRef.current
    if (!el) return

    let ultimo = ""
    const generar = () => {
      const { width: w, height: h } = el.getBoundingClientRect()
      const cols = Math.ceil(w / width)
      const filas = Math.ceil(h / height)
      const clave = `${cols}x${filas}`
      // Solo se regenera si cambia la grilla, no en cada evento de resize.
      if (clave === ultimo || cols === 0 || filas === 0) return
      ultimo = clave
      const total = Math.min(glowCount, cols * filas)
      const usados = new Set<number>()
      const lista: Brillo[] = []
      while (lista.length < total) {
        const i = Math.floor(Math.random() * cols * filas)
        if (usados.has(i)) continue
        usados.add(i)
        lista.push({
          x: (i % cols) * width + cx + x,
          y: Math.floor(i / cols) * height + cy + y,
          delay: Math.random() * 5,
          duration: Math.random() * 3 + 2,
        })
      }
      setBrillos(lista)
    }

    generar()
    const observer = new ResizeObserver(generar)
    observer.observe(el)
    return () => observer.disconnect()
  }, [glow, glowCount, width, height, cx, cy, x, y])

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={`${id}-pattern`}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr} fill="currentColor" opacity={0.45} />
        </pattern>
        {glow && (
          <radialGradient id={`${id}-gradient`}>
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-pattern)`} />
      {glow &&
        brillos.map((b) => (
          <circle
            key={`${b.x}-${b.y}`}
            cx={b.x}
            cy={b.y}
            r={cr * 2.2}
            fill={`url(#${id}-gradient)`}
            className="dot-titila"
            style={{
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          />
        ))}
    </svg>
  )
}
