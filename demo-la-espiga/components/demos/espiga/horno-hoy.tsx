"use client"

import dynamic from "next/dynamic"
import { Flame } from "lucide-react"

import { useAhora } from "@/components/demos/espiga/estado"
import {
  hora,
  horarioPorDia,
  horneadasDelDia,
  momentoMontevideo,
  type Horneada,
} from "@/components/demos/espiga/horario"
import { Diferido, Inclinable } from "@/components/demos/espiga/tres-d"
import { cn } from "@/lib/utils"

const Horno3D = dynamic(
  () => import("@/components/demos/espiga/horno-3d").then((m) => m.Horno3D),
  { ssr: false, loading: () => <div className="horno-reserva" aria-hidden="true" /> }
)

function duracion(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

type Estado = { texto: string; tono: "espera" | "horno" | "caliente" | "salio" }

function estadoHorneada(h: Horneada, minutos: number | null): Estado | null {
  if (minutos === null) return null
  const falta = h.minuto - minutos
  if (falta > 40) return { texto: `Sale en ${duracion(falta)}`, tono: "espera" }
  if (falta > 0)
    return { texto: `En el horno · sale en ${falta} min`, tono: "horno" }
  if (falta > -90)
    return { texto: "¡Recién salida, calentita!", tono: "caliente" }
  return { texto: `Ya salió a las ${hora(h.minuto)}`, tono: "salio" }
}

const estilosTono: Record<Estado["tono"], string> = {
  espera: "bg-[var(--papel-2)] text-[var(--tinta)]",
  horno: "bg-[var(--amarilla)] text-[var(--tinta)]",
  caliente: "bg-[var(--rojo)] text-[var(--papel)]",
  salio: "bg-[var(--tinta)] text-[var(--papel)]",
}

/** Las horneadas del día con su estado en vivo y una línea del día. */
export function HornoHoy() {
  const ahora = useAhora()
  const momento = ahora === null ? null : momentoMontevideo(ahora)
  const dia = momento?.dia ?? 1
  const horneadas = horneadasDelDia(dia)
  const { abre, cierra } = horarioPorDia[dia]
  // La línea va de las 6:00 al cierre, para que entre la horneada de las 7.
  const inicio = 6 * 60
  const fin = Math.max(cierra, 20 * 60)
  const pos = (m: number) =>
    `${Math.min(100, Math.max(0, ((m - inicio) / (fin - inicio)) * 100))}%`

  // La horneada que se muestra adentro del horno: la próxima, o la última.
  const minutos = momento?.minutos ?? 0
  const enHorno =
    horneadas.find((h) => h.minuto + 90 > minutos) ??
    horneadas[horneadas.length - 1]
  const estadoHorno = estadoHorneada(enHorno, momento?.minutos ?? null)

  return (
    <div>
      <Diferido
        className="mb-12"
        reserva={<div className="horno-reserva" aria-hidden="true" />}
      >
        <Horno3D
          titulo={`${enHorno.titulo} · ${hora(enHorno.minuto)}`}
          productos={enHorno.productos}
          estado={estadoHorno?.texto ?? "Dos horneadas por día"}
        />
      </Diferido>
      <div className="grid gap-5 md:grid-cols-2">
        {horneadas.map((h) => {
          const estado = estadoHorneada(h, momento?.minutos ?? null)
          return (
            <Inclinable
              as="article"
              key={h.minuto}
              className="ticket sombra-papel px-6 py-8 sm:px-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="volanta text-[var(--rojo)]">{h.titulo}</p>
                  <p className="titulo mt-1 text-[4.2rem] leading-none tabular-nums sm:text-[5rem]">
                    {hora(h.minuto)}
                  </p>
                </div>
                {estado && (
                  <p
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-bold",
                      estilosTono[estado.tono]
                    )}
                  >
                    {(estado.tono === "horno" ||
                      estado.tono === "caliente") && (
                      <Flame className="size-4" aria-hidden="true" />
                    )}
                    {estado.texto}
                  </p>
                )}
              </div>
              <ul className="mt-5 grid gap-1.5 border-t-2 border-dashed border-[var(--tinta-20)] pt-4 text-[1.05rem]">
                {h.productos.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden="true" className="text-[var(--rojo)]">
                      ✦
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Inclinable>
          )
        })}
        {horneadas.length === 1 && (
          <article className="flex flex-col justify-center rounded-md border-2 border-dashed border-[var(--tinta-20)] p-6 sm:p-8">
            <p className="titulo text-[1.8rem]">
              Los domingos, una sola horneada
            </p>
            <p className="mt-2 text-[var(--tinta-70)]">
              Abrimos de 8:00 a 13:00. Si querés asegurarte el pan, sumalo a tu
              bolsa y te lo apartamos.
            </p>
          </article>
        )}
      </div>

      {/* Línea del día */}
      <div className="mt-10">
        <div aria-hidden="true">
          <div className="relative h-14">
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--tinta-20)]" />
            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--tinta)]"
              style={{
                left: pos(abre),
                width: `calc(${pos(cierra)} - ${pos(abre)})`,
              }}
            />
            {horneadas.map((h) => (
              <div
                key={h.minuto}
                className="absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--tinta)] bg-[var(--amarilla)]"
                style={{ left: pos(h.minuto) }}
              >
                <Flame className="size-4" aria-hidden="true" />
              </div>
            ))}
            {momento && (
              <div
                className="absolute top-0 bottom-0 flex -translate-x-1/2 flex-col items-center"
                style={{ left: pos(momento.minutos) }}
              >
                <span className="h-full w-0.5 bg-[var(--rojo)]" />
              </div>
            )}
          </div>
          <div className="relative mt-1 h-6 text-[0.95rem] text-[var(--tinta-70)] tabular-nums">
            {[7, 10, 13, 16, 19].map((h) => (
              <span
                key={h}
                className="absolute -translate-x-1/2"
                style={{ left: pos(h * 60) }}
              >
                {h}:00
              </span>
            ))}
          </div>
        </div>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-bold">
          <span>
            <span className="mr-2 inline-block h-1 w-6 rounded-full bg-[var(--tinta)] align-middle" />
            Abierto hoy de {hora(abre)} a {hora(cierra)}
          </span>
          {momento && (
            <span>
              <span className="mr-2 inline-block h-3 w-0.5 bg-[var(--rojo)] align-middle" />
              Ahora son las {hora(momento.minutos)} en Montevideo
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
