"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import "./laboratorio.css"
import {
  obras,
  obrasEnCurso,
  type Estado,
  type Obra,
  type ObraMapa,
} from "@/components/demos/faro/obras"
import { abrirObra } from "@/components/demos/faro/utiles"
import { cn } from "@/lib/utils"

type Punto = (Obra | ObraMapa) & { conFicha: boolean }

const puntos: Punto[] = [
  ...obras.map((o) => ({ ...o, conFicha: true })),
  ...obrasEnCurso.map((o) => ({ ...o, conFicha: false })),
]

type Encuadre = {
  id: "montevideo" | "costa"
  nombre: string
  lon: [number, number]
  lat: [number, number]
  costa: [number, number][]
  rotulos: { t: string; lon: number; lat: number; agua?: boolean }[]
  paralelos: number[]
}

const encuadres: Encuadre[] = [
  {
    id: "montevideo",
    nombre: "Montevideo",
    lon: [-56.235, -56.02],
    lat: [-34.85, -34.949],
    costa: [
      [-56.3, -34.88], [-56.25, -34.884], [-56.232, -34.893], [-56.218, -34.898],
      [-56.214, -34.903], [-56.216, -34.907], [-56.209, -34.911], [-56.2, -34.912],
      [-56.188, -34.913], [-56.178, -34.914], [-56.168, -34.918], [-56.162, -34.918],
      [-56.159, -34.926], [-56.153, -34.923], [-56.149, -34.916], [-56.141, -34.913],
      [-56.134, -34.912], [-56.128, -34.907], [-56.12, -34.905], [-56.105, -34.897],
      [-56.09, -34.894], [-56.081, -34.9], [-56.073, -34.896], [-56.06, -34.889],
      [-56.04, -34.883], [-56.0, -34.874],
    ],
    rotulos: [
      { t: "Ciudad Vieja", lon: -56.205, lat: -34.9 },
      { t: "Cordón", lon: -56.18, lat: -34.895 },
      { t: "Pocitos", lon: -56.152, lat: -34.904 },
      { t: "Buceo", lon: -56.128, lat: -34.896 },
      { t: "Malvín", lon: -56.104, lat: -34.884 },
      { t: "Carrasco", lon: -56.05, lat: -34.872 },
      { t: "Río de la Plata", lon: -56.12, lat: -34.935, agua: true },
    ],
    paralelos: [-34.88, -34.92],
  },
  {
    id: "costa",
    nombre: "Costa este",
    lon: [-56.3, -54.75],
    lat: [-34.5, -35.21],
    costa: [
      [-56.45, -34.79], [-56.3, -34.87], [-56.21, -34.91], [-56.158, -34.925],
      [-56.1, -34.896], [-56.03, -34.881], [-55.9, -34.84], [-55.76, -34.777],
      [-55.6, -34.79], [-55.45, -34.82], [-55.27, -34.868], [-55.2, -34.9],
      [-55.08, -34.9], [-55.04, -34.916], [-54.98, -34.93], [-54.952, -34.966],
      [-54.935, -34.952], [-54.9, -34.93], [-54.867, -34.916], [-54.8, -34.89],
      [-54.6, -34.82],
    ],
    rotulos: [
      { t: "Montevideo", lon: -56.18, lat: -34.84 },
      { t: "Atlántida", lon: -55.76, lat: -34.72 },
      { t: "Piriápolis", lon: -55.28, lat: -34.81 },
      { t: "Punta del Este", lon: -54.96, lat: -35.02 },
      { t: "Río de la Plata", lon: -55.9, lat: -35.02, agua: true },
      { t: "Océano Atlántico", lon: -55.05, lat: -35.13, agua: true },
    ],
    paralelos: [-34.6, -34.8, -35.0],
  },
]

const W = 1000
const H = 562

function proyectar(e: Encuadre, lon: number, lat: number) {
  return {
    x: ((lon - e.lon[0]) / (e.lon[1] - e.lon[0])) * W,
    y: ((lat - e.lat[0]) / (e.lat[1] - e.lat[0])) * H,
  }
}
const dentro = (e: Encuadre, p: { lon: number; lat: number }) =>
  p.lon >= e.lon[0] && p.lon <= e.lon[1] && p.lat <= e.lat[0] && p.lat >= e.lat[1]

const filtros: ("Todas" | Estado)[] = ["Todas", "Construida", "En obra", "En proyecto"]
const plural: Record<string, string> = {
  Todas: "Todas",
  Construida: "Construidas",
  "En obra": "En obra",
  "En proyecto": "En proyecto",
}

const grados = (v: number) => {
  const a = Math.abs(v)
  return `${Math.floor(a)}°${String(Math.round((a % 1) * 60)).padStart(2, "0")}′S`
}

/** Mapa de obras en estilo de plano: dos encuadres y filtro por estado. */
export default function MapaObras() {
  const [encuadre, setEncuadre] = useState<Encuadre["id"]>("montevideo")
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("Todas")
  const [activa, setActiva] = useState("carrasco")

  const e = encuadres.find((x) => x.id === encuadre)!
  const visibles = puntos.filter(
    (p) => dentro(e, p) && (filtro === "Todas" || p.estado === filtro)
  )
  const elegida = visibles.find((p) => p.id === activa) ?? visibles[0]

  const costa = e.costa.map(([lon, lat]) => proyectar(e, lon, lat))
  const tierra = `M ${costa.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")} L ${W + 50} -50 L -50 -50 Z`

  return (
    <div className="grid gap-px border border-[var(--linea)] bg-[var(--linea)] lg:grid-cols-12">
      <div className="bg-[var(--papel)] lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--linea)] px-4 py-2 sm:px-6">
          <div role="group" aria-label="Encuadre del mapa" className="flex gap-5">
            {encuadres.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={encuadre === x.id}
                onClick={() => setEncuadre(x.id)}
                className={cn(
                  "serif min-h-11 text-xl transition-colors",
                  encuadre === x.id ? "italic" : "text-[var(--piedra)] hover:text-[var(--carbon)]"
                )}
              >
                {x.nombre}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-x-3">
            {filtros.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filtro === f}
                onClick={() => setFiltro(f)}
                className={cn(
                  "mono min-h-11 text-[0.7rem] transition-colors",
                  filtro === f ? "text-[var(--carbon)] underline underline-offset-4" : "text-[var(--piedra)] hover:text-[var(--carbon)]"
                )}
              >
                {plural[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
            <defs>
              <pattern id="mapa-agua" width="8" height="8" patternUnits="userSpaceOnUse">
                <line x1="0" y1="4" x2="8" y2="4" stroke="rgba(15,15,13,0.07)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#mapa-agua)" />
            <path d={tierra} fill="#efebe4" stroke="#0f0f0d" strokeWidth="1" />
            {e.paralelos.map((lat) => {
              const y = proyectar(e, e.lon[0], lat).y
              return (
                <g key={lat}>
                  <line x1="0" x2={W} y1={y} y2={y} stroke="rgba(15,15,13,0.12)" strokeDasharray="2 6" />
                  <text x="8" y={y - 6} fontSize="11" fill="rgba(15,15,13,0.5)" fontFamily="var(--faro-mono), monospace">
                    {grados(lat)}
                  </text>
                </g>
              )
            })}
            {e.rotulos.map((r) => {
              const p = proyectar(e, r.lon, r.lat)
              return (
                <text
                  key={r.t}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  fontSize={r.agua ? 22 : 12}
                  fontStyle={r.agua ? "italic" : "normal"}
                  letterSpacing={r.agua ? 1 : 2}
                  fill={r.agua ? "rgba(15,15,13,0.4)" : "rgba(15,15,13,0.55)"}
                  fontFamily={r.agua ? "var(--faro-serif), serif" : "var(--faro-mono), monospace"}
                >
                  {r.agua ? r.t : r.t.toUpperCase()}
                </text>
              )
            })}
            <g transform={`translate(${W - 50} 50)`} stroke="rgba(15,15,13,0.7)" fill="none">
              <circle r="16" />
              <path d="M0 -16 L0 16 M-5 -9 L0 -16 L5 -9" />
              <text y="34" textAnchor="middle" fontSize="11" stroke="none" fill="rgba(15,15,13,0.7)" fontFamily="var(--faro-mono), monospace">
                N
              </text>
            </g>
          </svg>

          <ul>
            {visibles.map((p) => {
              const q = proyectar(e, p.lon, p.lat)
              const esta = elegida?.id === p.id
              return (
                <li
                  key={p.id}
                  className="absolute"
                  style={{ left: `${(q.x / W) * 100}%`, top: `${(q.y / H) * 100}%` }}
                >
                  <button
                    type="button"
                    aria-pressed={esta}
                    aria-label={`${p.nombre}, ${p.lugar}. ${p.estado}`}
                    onMouseEnter={() => setActiva(p.id)}
                    onFocus={() => setActiva(p.id)}
                    onClick={() => setActiva(p.id)}
                    className="group absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block size-2.5 rotate-45 border border-[var(--carbon)] transition-transform duration-300 group-hover:scale-150",
                        p.estado === "Construida" && "bg-[var(--carbon)]",
                        p.estado === "En obra" && "bg-[var(--luz)]",
                        p.estado === "En proyecto" && "bg-[var(--papel)]",
                        esta && "scale-150"
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-1 rounded-full border border-[var(--carbon)] transition-[opacity,transform] duration-500",
                        esta ? "scale-100 opacity-60" : "scale-50 opacity-0"
                      )}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <ul className="mono flex flex-wrap gap-x-5 gap-y-1 border-t border-[var(--linea)] px-4 py-3 text-[0.65rem] text-[var(--piedra)] sm:px-6">
          {[
            ["bg-[var(--carbon)]", "Construida"],
            ["bg-[var(--luz)]", "En obra"],
            ["bg-[var(--papel)]", "En proyecto"],
          ].map(([c, t]) => (
            <li key={t} className="flex items-center gap-2">
              <span aria-hidden="true" className={cn("block size-2 rotate-45 border border-[var(--carbon)]", c)} />
              {t}
            </li>
          ))}
          <li className="ml-auto">{visibles.length} obras en este encuadre</li>
        </ul>
      </div>

      <div className="bg-[var(--papel)] lg:col-span-4" aria-live="polite">
        {elegida ? (
          <div key={elegida.id} className="aparece flex h-full flex-col">
            {"foto" in elegida ? (
              <div className="relative aspect-[16/10]">
                <Image
                  src={elegida.foto.src}
                  alt={`${elegida.nombre}, ${elegida.lugar}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="grid aspect-[16/10] place-items-center border-b border-[var(--linea)] bg-[linear-gradient(rgba(15,15,13,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,15,13,0.05)_1px,transparent_1px)] bg-[size:20px_20px]">
                <p className="etiqueta text-[var(--piedra)]">
                  {elegida.estado === "En obra" ? "Obra en curso" : "Proyecto en desarrollo"}
                </p>
              </div>
            )}
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="etiqueta text-[var(--piedra)]">
                {elegida.estado} · {elegida.categoria}
              </p>
              <p className="serif mt-2 text-3xl">{elegida.nombre}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--carbon)]/80">
                {elegida.bajada}
              </p>
              <p className="mono mt-4 text-xs text-[var(--piedra)]">
                {elegida.lugar} · {elegida.m2.toLocaleString("es-UY")} m² ·{" "}
                {elegida.estado === "Construida" ? elegida.anio : `entrega ${elegida.anio}`}
              </p>
              {elegida.conFicha && (
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => abrirObra(elegida.id)}
                  className="boton-linea mt-6 self-start"
                >
                  Ver ficha de obra
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="p-6 text-sm text-[var(--piedra)]">
            No hay obras con ese estado en este encuadre.
          </p>
        )}
      </div>
    </div>
  )
}
