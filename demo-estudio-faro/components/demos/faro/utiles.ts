"use client"

import { useSyncExternalStore } from "react"

/**
 * Bucle de requestAnimationFrame que solo corre cuando hace falta: si el
 * elemento está en pantalla, la pestaña está visible y alguien lo pidió.
 * `paso` recibe los milisegundos desde el cuadro anterior y devuelve false
 * cuando ya no necesita más cuadros (por ejemplo, al terminar una inercia).
 */
export function bucleVisible(
  el: Element,
  paso: (dt: number) => boolean | void
) {
  let quiere = false
  let visible = false
  let cuadro = 0
  let ultimo = 0

  const correr = (t: number) => {
    const dt = ultimo ? Math.min(t - ultimo, 64) : 16
    ultimo = t
    if (paso(dt) === false) {
      quiere = false
      cuadro = 0
      ultimo = 0
      return
    }
    cuadro = requestAnimationFrame(correr)
  }

  const actualizar = () => {
    const puede = quiere && visible && !document.hidden
    if (puede && !cuadro) {
      ultimo = 0
      cuadro = requestAnimationFrame(correr)
    } else if (!puede && cuadro) {
      cancelAnimationFrame(cuadro)
      cuadro = 0
    }
  }

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    actualizar()
  })
  io.observe(el)
  document.addEventListener("visibilitychange", actualizar)

  return {
    iniciar() {
      quiere = true
      actualizar()
    },
    detener() {
      quiere = false
      actualizar()
    },
    destruir() {
      quiere = false
      actualizar()
      io.disconnect()
      document.removeEventListener("visibilitychange", actualizar)
    },
  }
}

export type Bucle = ReturnType<typeof bucleVisible>

/* Preferencia de movimiento reducido sin romper la hidratación. */
const consulta = "(prefers-reduced-motion: reduce)"
function suscribirMovimiento(aviso: () => void) {
  const mq = window.matchMedia(consulta)
  mq.addEventListener("change", aviso)
  return () => mq.removeEventListener("change", aviso)
}
export function useMovimientoReducido() {
  return useSyncExternalStore(
    suscribirMovimiento,
    () => window.matchMedia(consulta).matches,
    () => false
  )
}

/* localStorage como fuente externa: sin setState en efectos y sin
   diferencias entre servidor y cliente. */
const oyentes = new Set<() => void>()
function suscribirAlmacen(aviso: () => void) {
  oyentes.add(aviso)
  window.addEventListener("storage", aviso)
  return () => {
    oyentes.delete(aviso)
    window.removeEventListener("storage", aviso)
  }
}
export function leerClave(clave: string): string | null {
  try {
    return window.localStorage.getItem(clave)
  } catch {
    return null
  }
}
/** Guarda y avisa a los componentes suscritos. Devuelve false si falló. */
export function guardarClave(clave: string, valor: string | null) {
  try {
    if (valor === null) window.localStorage.removeItem(clave)
    else window.localStorage.setItem(clave, valor)
    oyentes.forEach((o) => o())
    return true
  } catch {
    return false
  }
}
export function useClave(clave: string) {
  return useSyncExternalStore(
    suscribirAlmacen,
    () => leerClave(clave),
    () => null
  )
}

/** Abre la ficha de una obra de la galería desde cualquier parte. */
export const EVENTO_OBRA = "faro:abrir-obra"
export function abrirObra(id: string) {
  window.dispatchEvent(new CustomEvent(EVENTO_OBRA, { detail: id }))
}
