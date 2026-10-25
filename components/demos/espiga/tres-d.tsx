"use client"

/**
 * Piezas comunes para los efectos 3D de La Espiga, sin librerías:
 * - Diferido: monta su contenido recién cuando se acerca a la pantalla.
 * - Inclinable: tarjeta que se inclina hacia el cursor. Escribe variables
 *   CSS dentro de requestAnimationFrame, sin re-renderizar React.
 * - crearBucle: bucle de animación que se pausa fuera de pantalla, con la
 *   pestaña oculta o cuando ya no hay nada que mover.
 */
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export function Diferido({
  children,
  reserva = null,
  className,
  margen = "500px 0px",
}: {
  children: React.ReactNode
  /** Lo que se ve antes de montar (mismo tamaño, para que nada salte). */
  reserva?: React.ReactNode
  className?: string
  margen?: string
}) {
  const cajaRef = useRef<HTMLDivElement>(null)
  const [cerca, setCerca] = useState(false)

  useEffect(() => {
    const el = cajaRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setCerca(true)
          obs.disconnect()
        }
      },
      { rootMargin: margen }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [margen])

  return (
    <div ref={cajaRef} className={className}>
      {cerca ? children : reserva}
    </div>
  )
}

/**
 * Bucle con requestAnimationFrame. `paso` recibe los milisegundos desde el
 * cuadro anterior y devuelve true si quiere seguir. Se detiene solo fuera
 * de pantalla o con la pestaña oculta; `despertar()` lo vuelve a arrancar.
 */
export function crearBucle(el: Element, paso: (dt: number) => boolean) {
  let visible = false
  let id = 0
  let ultimo = 0
  let activo = true

  const cuadro = (t: number) => {
    const dt = ultimo ? Math.min(64, t - ultimo) : 16
    ultimo = t
    if (paso(dt)) {
      id = requestAnimationFrame(cuadro)
    } else {
      id = 0
      activo = false
    }
  }

  const actualizar = () => {
    const debe = activo && visible && !document.hidden
    if (debe && !id) {
      ultimo = 0
      id = requestAnimationFrame(cuadro)
    } else if (!debe && id) {
      cancelAnimationFrame(id)
      id = 0
    }
  }

  const obs = new IntersectionObserver((entradas) => {
    visible = entradas.some((e) => e.isIntersecting)
    actualizar()
  })
  obs.observe(el)
  document.addEventListener("visibilitychange", actualizar)

  return {
    despertar() {
      activo = true
      actualizar()
    },
    destruir() {
      obs.disconnect()
      document.removeEventListener("visibilitychange", actualizar)
      if (id) cancelAnimationFrame(id)
      id = 0
    },
  }
}

/** Tarjeta que se inclina suavemente hacia el cursor (solo con mouse). */
export function Inclinable({
  children,
  className,
  max = 7,
  as: Etiqueta = "div",
  ...resto
}: {
  children: React.ReactNode
  className?: string
  /** Inclinación máxima en grados. */
  max?: number
  as?: "div" | "article" | "li" | "figure" | "blockquote"
} & React.HTMLAttributes<HTMLElement>) {
  const elRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    let cuadro = 0
    let x = 0.5
    let y = 0.5
    let dentro = false

    const pintar = () => {
      cuadro = 0
      const rx = dentro ? (0.5 - y) * max * 2 : 0
      const ry = dentro ? (x - 0.5) * max * 2 : 0
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`)
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`)
      el.style.setProperty("--brillo", dentro ? "1" : "0")
      el.style.setProperty("--bx", `${((x - 0.5) * 60).toFixed(1)}%`)
      el.style.setProperty("--by", `${((y - 0.5) * 60).toFixed(1)}%`)
    }
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(pintar)
    }
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const r = el.getBoundingClientRect()
      x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
      dentro = true
      pedir()
    }
    const salir = () => {
      dentro = false
      pedir()
    }
    el.addEventListener("pointermove", mover)
    el.addEventListener("pointerleave", salir)
    return () => {
      el.removeEventListener("pointermove", mover)
      el.removeEventListener("pointerleave", salir)
      if (cuadro) cancelAnimationFrame(cuadro)
    }
  }, [max])

  return (
    <Etiqueta
      ref={elRef as React.RefObject<never>}
      className={cn("inclinable", className)}
      {...resto}
    >
      {children}
      <span className="inclinable-brillo" aria-hidden="true" />
    </Etiqueta>
  )
}
