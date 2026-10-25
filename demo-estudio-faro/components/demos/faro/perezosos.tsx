"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"

/* Piezas pesadas que no se ven al abrir: su código se descarga recién
   cuando quien visita se acerca a la sección. */
const Maqueta = dynamic(() => import("@/components/demos/faro/maqueta"), { ssr: false })
const Corte = dynamic(() => import("@/components/demos/faro/corte"), { ssr: false })
const Comparador = dynamic(() => import("@/components/demos/faro/comparador"), { ssr: false })
const MapaObras = dynamic(() => import("@/components/demos/faro/mapa"), { ssr: false })
const Estimador = dynamic(() => import("@/components/demos/faro/estimador"), { ssr: false })

const piezas = {
  maqueta: Maqueta,
  corte: Corte,
  comparador: Comparador,
  mapa: MapaObras,
  estimador: Estimador,
}

/**
 * Monta la pieza cuando su lugar queda a menos de ~900 px de la pantalla.
 * Mientras tanto reserva la altura para que la página no salte.
 */
export function Diferido({
  pieza,
  alto,
  className,
}: {
  pieza: keyof typeof piezas
  /** Clases de altura mínima del lugar reservado. */
  alto: string
  className?: string
}) {
  const lugarRef = useRef<HTMLDivElement>(null)
  const [cerca, setCerca] = useState(false)

  useEffect(() => {
    const el = lugarRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCerca(true)
          io.disconnect()
        }
      },
      { rootMargin: "900px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Pieza = piezas[pieza]
  return (
    <div ref={lugarRef} className={cn(alto, className)}>
      {cerca ? (
        <Pieza />
      ) : (
        <div
          aria-hidden="true"
          className={cn("border border-[var(--linea)] bg-[var(--papel)]", alto)}
        />
      )}
    </div>
  )
}
