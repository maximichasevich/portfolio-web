"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { ArrowDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

import { useFaro } from "@/components/demos/faro/contexto"
import { obras } from "@/components/demos/faro/obras"
import { cn } from "@/lib/utils"

/** El avance lo marca el fin de la animación de la barra de tiempo: así la
 * pausa (mouse, foco, pestaña oculta) congela barra y pase a la vez. */
/* Preferencia de movimiento reducido sin romper la hidratación: en el
 * servidor y en el primer render del cliente vale false. */
const consulta = "(prefers-reduced-motion: reduce)"
function suscribir(aviso: () => void) {
  const mq = window.matchMedia(consulta)
  mq.addEventListener("change", aviso)
  return () => mq.removeEventListener("change", aviso)
}
function useMovimientoReducido() {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(consulta).matches,
    () => false
  )
}

const DURACION = 6500
const diapositivas = ["carrasco", "barra", "ciudadvieja", "puntagorda", "pocitos"]
  .map((id) => obras.find((o) => o.id === id))
  .filter((o) => o !== undefined)

/**
 * Portada a pantalla completa: fotos de obra en fundido. Se pausa al pasar
 * el mouse o al enfocar un control, tiene control manual y no avanza sola si
 * el sistema pide reducir el movimiento.
 */
export function Portada() {
  const { abrir } = useFaro()
  const reducir = useMovimientoReducido()
  const [actual, setActual] = useState(0)
  const [pausaManual, setPausaManual] = useState(false)
  const [encima, setEncima] = useState(false)
  const [oculta, setOculta] = useState(false)

  const pausada = pausaManual || encima || oculta || reducir

  useEffect(() => {
    const alCambiar = () => setOculta(document.hidden)
    document.addEventListener("visibilitychange", alCambiar)
    return () => document.removeEventListener("visibilitychange", alCambiar)
  }, [])

  const ir = (delta: number) =>
    setActual((a) => (a + delta + diapositivas.length) % diapositivas.length)

  const obra = diapositivas[actual]

  return (
    <section
      id="inicio"
      data-oscuro
      tabIndex={-1}
      aria-roledescription="carrusel"
      aria-label="Obras destacadas"
      className="sobre-oscuro relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-[var(--carbon)] text-[var(--hueso)] outline-none"
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setEncima(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setEncima(false)
      }}
    >
      {diapositivas.map((o, i) => (
        <div
          key={o.id}
          role="group"
          aria-roledescription="diapositiva"
          aria-label={`${i + 1} de ${diapositivas.length}: ${o.nombre}`}
          aria-hidden={i !== actual}
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-[1600ms] ease-in-out",
            i === actual ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={o.foto.src}
            alt={`${o.nombre}, ${o.lugar}`}
            fill
            sizes="100vw"
            preload={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "object-cover transition-transform duration-[8000ms] ease-out",
              i === actual && !reducir ? "scale-100" : "scale-[1.06]",
              reducir && "scale-100"
            )}
          />
        </div>
      ))}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(15,15,13,0.5)_0%,rgba(15,15,13,0.08)_22%,rgba(15,15,13,0.5)_52%,rgba(15,15,13,0.9)_100%)] lg:bg-[linear-gradient(180deg,rgba(15,15,13,0.5)_0%,rgba(15,15,13,0.05)_28%,rgba(15,15,13,0.25)_55%,rgba(15,15,13,0.85)_100%)]"
      />

      <div className="px-4 pt-32 pb-24 sm:px-8 sm:pb-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="etiqueta text-[var(--hueso)]/80">
              Montevideo · Punta del Este · Desde 2015
            </p>
            <h1 className="serif mt-5 text-[clamp(3.1rem,9.5vw,8.5rem)]">
              Arquitectura
              <br />
              <em className="font-light">con luz propia.</em>
            </h1>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-[var(--hueso)]/80">
              Viviendas, espacios de trabajo e interiores entre el Río de la
              Plata y el Atlántico. Pocos proyectos por año, cada uno dirigido
              por las socias y socios del estudio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="boton"
                aria-haspopup="dialog"
                onClick={() => abrir("agendar")}
              >
                Agendar primera reunión
              </button>
              <a href="#obras" className="boton-linea">
                Ver obras
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="border-t border-[var(--linea-clara)] pt-4">
              <p className="sr-only" aria-live="polite">
                {pausada
                  ? `Foto ${actual + 1} de ${diapositivas.length}: ${obra.nombre}`
                  : ""}
              </p>
              <div className="flex items-start justify-between gap-6">
                <div key={obra.id} className="aparece min-w-0">
                  <p className="serif text-2xl italic">{obra.nombre}</p>
                  <p className="mono mt-1 text-xs text-[var(--hueso)]/70">
                    {obra.coordenadas} · {obra.anio} · {obra.m2} m²
                  </p>
                </div>
                <p className="mono shrink-0 text-xs">
                  {String(actual + 1).padStart(2, "0")}
                  <span className="text-[var(--hueso)]/50">
                    {" "}
                    / {String(diapositivas.length).padStart(2, "0")}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => ir(-1)}
                  className="grid size-11 place-items-center border border-[var(--linea-clara)] transition-colors hover:bg-[var(--hueso)] hover:text-[var(--carbon)]"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                {!reducir && (
                <button
                  type="button"
                  onClick={() => setPausaManual((p) => !p)}
                  className="grid size-11 place-items-center border border-[var(--linea-clara)] transition-colors hover:bg-[var(--hueso)] hover:text-[var(--carbon)]"
                  aria-label={
                    pausaManual
                      ? "Reanudar el pase de fotos"
                      : "Pausar el pase de fotos"
                  }
                  aria-pressed={pausaManual}
                >
                  {pausaManual ? (
                    <Play className="size-4" aria-hidden="true" />
                  ) : (
                    <Pause className="size-4" aria-hidden="true" />
                  )}
                </button>
                )}
                <button
                  type="button"
                  onClick={() => ir(1)}
                  className="grid size-11 place-items-center border border-[var(--linea-clara)] transition-colors hover:bg-[var(--hueso)] hover:text-[var(--carbon)]"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
                <div
                  className="ml-3 h-px flex-1 bg-[var(--linea-clara)]"
                  aria-hidden="true"
                >
                  <div
                    key={actual}
                    className="tiempo h-px bg-[var(--hueso)]"
                    data-pausa={pausada}
                    onAnimationEnd={() => ir(1)}
                    style={
                      { "--duracion": `${DURACION}ms` } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
