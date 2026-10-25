"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * Bucle de requestAnimationFrame que solo corre cuando `elRef` está en
 * pantalla y la pestaña está visible. `paso` recibe los milisegundos desde
 * el cuadro anterior y devuelve `true` si necesita otro cuadro; si devuelve
 * `false`, el bucle se duerme hasta que alguien llame a `despertar()`.
 *
 * Los estilos se escriben directo en el DOM dentro de `paso`: React no se
 * vuelve a renderizar en cada cuadro.
 */
export function useBucle<T extends Element>(
  elRef: React.RefObject<T | null>,
  paso: (dt: number) => boolean
) {
  const pasoRef = useRef(paso)
  const cuadroRef = useRef<(t: number) => void>(() => {})
  const corriendoRef = useRef(false)
  const visibleRef = useRef(false)
  const idRef = useRef(0)
  const antesRef = useRef(0)

  useEffect(() => {
    pasoRef.current = paso
  }, [paso])

  useEffect(() => {
    cuadroRef.current = (t: number) => {
      const dt = antesRef.current ? Math.min(64, t - antesRef.current) : 16
      antesRef.current = t
      const sigue = pasoRef.current(dt)
      if (sigue && visibleRef.current && !document.hidden) {
        idRef.current = window.requestAnimationFrame(cuadroRef.current)
      } else {
        corriendoRef.current = false
        antesRef.current = 0
      }
    }
  }, [])

  const despertar = useCallback(() => {
    if (corriendoRef.current || !visibleRef.current || document.hidden) return
    corriendoRef.current = true
    antesRef.current = 0
    idRef.current = window.requestAnimationFrame(cuadroRef.current)
  }, [])

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.isIntersecting
        if (e.isIntersecting) despertar()
      },
      { rootMargin: "80px" }
    )
    obs.observe(el)
    const alCambiar = () => {
      if (!document.hidden) despertar()
    }
    document.addEventListener("visibilitychange", alCambiar)
    return () => {
      obs.disconnect()
      document.removeEventListener("visibilitychange", alCambiar)
      window.cancelAnimationFrame(idRef.current)
      corriendoRef.current = false
    }
  }, [elRef, despertar])

  return despertar
}
