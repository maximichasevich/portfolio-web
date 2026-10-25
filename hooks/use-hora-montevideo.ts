"use client"

import { useSyncExternalStore } from "react"

const formato = new Intl.DateTimeFormat("es-UY", {
  timeZone: "America/Montevideo",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 15_000)
  return () => window.clearInterval(id)
}

/**
 * Hora actual de Montevideo ("14:05"), actualizada cada 15 segundos.
 * En el servidor devuelve "--:--" para no desajustar la hidratación.
 */
export function useHoraMontevideo() {
  return useSyncExternalStore(
    subscribe,
    () => formato.format(new Date()),
    () => "--:--"
  )
}
