"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

/**
 * Interacciones livianas reutilizables de la portada. Todas:
 * - responden solo a mouse o lápiz (en pantallas táctiles no hacen nada),
 * - escriben estilos directo en el DOM dentro de requestAnimationFrame
 *   (sin re-renderizar React),
 * - se detienen solas cuando no hay movimiento.
 */

/**
 * Tarjeta que se inclina en 3D hacia el cursor, con un reflejo de luz que
 * sigue al mouse. Al salir vuelve suave a su lugar.
 */
export function Inclinable({
  children,
  className,
  grados = 8,
  reflejo = true,
}: {
  children: React.ReactNode
  className?: string
  /** Inclinación máxima en grados. */
  grados?: number
  reflejo?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  function mover(ev: React.PointerEvent<HTMLDivElement>) {
    if (ev.pointerType === "touch") return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (ev.clientX - r.left) / r.width
    const py = (ev.clientY - r.top) / r.height
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${((0.5 - py) * grados * 2).toFixed(2)}deg`)
      el.style.setProperty("--ry", `${((px - 0.5) * grados * 2).toFixed(2)}deg`)
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`)
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`)
      el.dataset.activo = "true"
    })
  }

  function salir() {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
    el.dataset.activo = "false"
  }

  return (
    <div
      ref={ref}
      onPointerMove={mover}
      onPointerLeave={salir}
      className={cn("inclinable", className)}
    >
      <div className="inclinable-interior h-full">
        {children}
        {reflejo && <span className="inclinable-reflejo" aria-hidden="true" />}
      </div>
    </div>
  )
}

/**
 * Envoltorio magnético: el contenido se desplaza un poco hacia el cursor
 * cuando este se acerca, como si lo atrajera.
 */
export function Magnetico({
  children,
  className,
  fuerza = 0.3,
}: {
  children: React.ReactNode
  className?: string
  /** Fracción de la distancia al cursor que se desplaza (0 a 1). */
  fuerza?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const raf = useRef(0)

  function mover(ev: React.PointerEvent<HTMLSpanElement>) {
    if (ev.pointerType === "touch") return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = ev.clientX - (r.left + r.width / 2)
    const dy = ev.clientY - (r.top + r.height / 2)
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate(${(dx * fuerza).toFixed(1)}px, ${(dy * fuerza).toFixed(1)}px)`
    })
  }

  function salir() {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    el.style.transform = "translate(0, 0)"
  }

  return (
    <span
      ref={ref}
      onPointerMove={mover}
      onPointerLeave={salir}
      className={cn("magnetico inline-flex", className)}
    >
      {children}
    </span>
  )
}

/**
 * Luz suave que sigue al cursor por toda la página. Se mueve con un poco de
 * retraso (interpolación) y el bucle se apaga cuando llega a destino.
 * Solo en dispositivos con mouse.
 */
export function CursorLuz() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia("(pointer: fine)").matches) return
    let x = window.innerWidth / 2
    let y = window.innerHeight / 3
    let tx = x
    let ty = y
    let raf = 0

    const paso = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.5)
        raf = requestAnimationFrame(paso)
      else raf = 0
    }
    const mover = (ev: PointerEvent) => {
      tx = ev.clientX
      ty = ev.clientY
      el.style.opacity = "1"
      if (!raf) raf = requestAnimationFrame(paso)
    }
    const salir = () => {
      el.style.opacity = "0"
    }

    window.addEventListener("pointermove", mover, { passive: true })
    document.documentElement.addEventListener("pointerleave", salir)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", mover)
      document.documentElement.removeEventListener("pointerleave", salir)
    }
  }, [])

  return <div ref={ref} className="cursor-luz" aria-hidden="true" />
}
