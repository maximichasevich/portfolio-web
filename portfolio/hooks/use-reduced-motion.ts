"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

/**
 * Devuelve true si el sistema pide reducir el movimiento.
 * En el servidor (y en el primer render) devuelve true para no cargar
 * animaciones pesadas antes de saber qué prefiere la persona.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true
  )
}
