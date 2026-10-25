"use client"

import React, { useEffect, useRef, type ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

/**
 * Particles (magicui), versión corregida.
 *
 * Cambios respecto de la original:
 * - Creaba el doble de partículas de las pedidas (las generaba al ajustar el
 *   tamaño y otra vez al dibujar).
 * - Guardaba la posición del mouse en estado de React, así que el componente
 *   se volvía a renderizar con cada movimiento del mouse.
 * - Seguía dibujando 60 veces por segundo aunque estuviera fuera de pantalla
 *   o la pestaña estuviera oculta. Ahora se pausa.
 * - Limita la densidad de píxeles a 2 para no pintar lienzos enormes.
 */
interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "")
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }
  const hexInt = parseInt(hex, 16)
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255]
}

type Circle = {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
}

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const [r, g, b] = hexToRgb(color)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: 0, y: 0 }
    const tamano = { w: 0, h: 0 }
    let circles: Circle[] = []
    let raf = 0
    let visible = true
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null

    const nuevo = (): Circle => ({
      x: Math.random() * tamano.w,
      y: Math.random() * tamano.h,
      translateX: 0,
      translateY: 0,
      size: Math.floor(Math.random() * 2) + size,
      alpha: 0,
      targetAlpha: Math.round((Math.random() * 0.6 + 0.1) * 10) / 10,
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    })

    const ajustar = () => {
      tamano.w = container.offsetWidth
      tamano.h = container.offsetHeight
      canvas.width = tamano.w * dpr
      canvas.height = tamano.h * dpr
      canvas.style.width = `${tamano.w}px`
      canvas.style.height = `${tamano.h}px`
      circles = Array.from({ length: quantity }, nuevo)
    }

    const cuadro = () => {
      raf = 0
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, tamano.w, tamano.h)
      for (let i = 0; i < circles.length; i++) {
        const c = circles[i]
        const borde = Math.min(
          c.x + c.translateX - c.size,
          tamano.w - c.x - c.translateX - c.size,
          c.y + c.translateY - c.size,
          tamano.h - c.y - c.translateY - c.size
        )
        const cercania = Math.max(0, borde / 20)
        if (cercania > 1) {
          c.alpha = Math.min(c.targetAlpha, c.alpha + 0.02)
        } else {
          c.alpha = c.targetAlpha * cercania
        }
        c.x += c.dx + vx
        c.y += c.dy + vy
        c.translateX +=
          (mouse.x / (staticity / c.magnetism) - c.translateX) / ease
        c.translateY +=
          (mouse.y / (staticity / c.magnetism) - c.translateY) / ease

        if (
          c.x < -c.size ||
          c.x > tamano.w + c.size ||
          c.y < -c.size ||
          c.y > tamano.h + c.size
        ) {
          circles[i] = nuevo()
          continue
        }

        ctx.beginPath()
        ctx.arc(c.x + c.translateX, c.y + c.translateY, c.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${c.alpha})`
        ctx.fill()
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(cuadro)
    }

    const arrancar = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(cuadro)
    }
    const parar = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!visible) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left - tamano.w / 2
      const y = e.clientY - rect.top - tamano.h / 2
      if (Math.abs(x) < tamano.w / 2 && Math.abs(y) < tamano.h / 2) {
        mouse.x = x
        mouse.y = y
      }
    }

    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(ajustar, 200)
    }

    const onVisibilidad = () => (document.hidden ? parar() : arrancar())

    const io = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting
      if (visible) arrancar()
      else parar()
    })

    ajustar()
    arrancar()
    io.observe(container)
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", onVisibilidad)

    return () => {
      parar()
      io.disconnect()
      if (resizeTimeout) clearTimeout(resizeTimeout)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibilidad)
    }
  }, [color, quantity, staticity, ease, size, vx, vy, refresh])

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={containerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
