"use client"

import { useEffect, useRef } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Globe (magicui), versión que se pausa.
 *
 * La original dibujaba el globo en WebGL 60 veces por segundo para siempre,
 * aunque estuviera fuera de pantalla o la pestaña oculta. Ahora se detiene
 * en esos casos, limita la densidad de píxeles a 2 y no lee el tamaño del
 * lienzo en cada cuadro.
 */

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
  rotar = true,
}: {
  className?: string
  config?: COBEOptions
  /** Si es false, el globo queda quieto (para "reducir movimiento"). */
  rotar?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteracting.current = clientX
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const onResize = () => {
      widthRef.current = canvas.offsetWidth
    }
    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvas, {
      ...config,
      devicePixelRatio: dpr,
      width: widthRef.current * dpr,
      height: widthRef.current * dpr,
      onRender: (state) => {
        if (rotar && pointerInteracting.current === null) phiRef.current += 0.004
        state.phi = phiRef.current + rs.get()
        state.width = widthRef.current * dpr
        state.height = widthRef.current * dpr
      },
    })

    let enPantalla = true
    const actualizar = () => globe.toggle(enPantalla && !document.hidden)
    const io = new IntersectionObserver(([entrada]) => {
      enPantalla = entrada.isIntersecting
      actualizar()
    })
    io.observe(canvas)
    document.addEventListener("visibilitychange", actualizar)

    const t = setTimeout(() => (canvas.style.opacity = "1"), 0)
    return () => {
      clearTimeout(t)
      io.disconnect()
      document.removeEventListener("visibilitychange", actualizar)
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config, rotar])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className
      )}
    >
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) => updatePointerInteraction(e.clientX)}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onPointerMove={(e) => updateMovement(e.clientX)}
      />
    </div>
  )
}
