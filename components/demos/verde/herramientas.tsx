"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { RadioGroup } from "radix-ui"
import { ArrowLeft, BellRing, CalendarDays, Check, Droplets, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { catalogo, textoLuz } from "@/components/demos/verde/catalogo"
import {
  diasDeRiego,
  plantasParaLuz,
  zonaDeLuz,
  zonasLuz,
} from "@/components/demos/verde/extras"
import { rutaPlanta, useTienda } from "@/components/demos/verde/estado"
import { fondo } from "@/components/demos/verde/ui"

export function Herramientas() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <MedidorLuz />
      <CalendarioRiego />
    </div>
  )
}

/* ---------- Medidor de luz ---------- */

const cielos = ["#6c6a8a", "#9cc6ee", "#c8e6ff", "#ffe39a"]

function MedidorLuz() {
  const [valor, setValor] = useState(42)
  const zona = zonaDeLuz(valor)
  const indice = zonasLuz.indexOf(zona)
  const plantas = plantasParaLuz(zona.luz).slice(0, 6)
  const t = valor / 100

  return (
    <div className="flex min-w-0 flex-col rounded-[36px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)]">
          <Sun className="size-5" aria-hidden="true" />
        </span>
        <h3 className="vt-titulo text-3xl sm:text-4xl">Medidor de luz</h3>
      </div>
      <p className="mt-2 text-sm text-[var(--vt-tinta-70)]">
        Mové el sol según cuánta luz entra en tu rincón y te decimos qué plantas
        van ahí.
      </p>

      <div className="mt-5 grid items-center gap-5 sm:grid-cols-[1fr_1fr]">
        {/* Ventana con sol */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border-2 border-[var(--vt-tinta)] sm:aspect-square" aria-hidden="true">
          {cielos.map((c, i) => (
            <div
              key={c}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ background: c, opacity: i === 0 ? 1 : Math.max(0, Math.min(1, (t - (i - 1) * 0.3) / 0.3)) }}
            />
          ))}
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full">
            <g
              className="transition-transform duration-500"
              style={{ transform: `translate(0px, ${(1 - t) * 90}px) scale(${0.6 + t * 0.6})`, transformOrigin: "140px 60px" }}
            >
              <g className="vt-rayos vt-anim" style={{ opacity: Math.max(0.15, t) }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <rect key={i} x="137" y="14" width="6" height="16" rx="3" fill="#ffd84d" stroke="#1f2a22" strokeWidth="2" transform={`rotate(${i * 30} 140 60)`} />
                ))}
              </g>
              <circle cx="140" cy="60" r="22" fill="#ffd84d" stroke="#1f2a22" strokeWidth="3" />
              <path d="M131 62 q9 8 18 0" stroke="#1f2a22" strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <circle cx="133" cy="54" r="2.4" fill="#1f2a22" />
              <circle cx="147" cy="54" r="2.4" fill="#1f2a22" />
            </g>
            {/* Nubes cuando hay poca luz */}
            <g style={{ opacity: Math.max(0, 1 - t * 2.2) }} className="transition-opacity duration-500">
              <path d="M30 70 q4 -18 22 -14 q8 -14 24 -4 q16 -2 16 14 q0 12 -14 12 h-40 q-12 0 -8 -8 Z" fill="#fffdf8" stroke="#1f2a22" strokeWidth="3" />
            </g>
            {/* Marco de la ventana */}
            <path d="M100 0 V200 M0 120 H200" stroke="#1f2a22" strokeWidth="5" />
            {/* Mano y sombra: el test de la sombra */}
            <ellipse cx="62" cy="178" rx="34" ry="8" fill="#1f2a22" style={{ opacity: 0.08 + t * 0.32 }} />
            <path d="M48 176 l-2 -26 q0 -5 5 -5 q4 0 4 5 l1 14 l1 -22 q0 -5 5 -5 q4 0 4 5 l0 22 l2 -18 q1 -5 5 -4 q4 1 4 5 l-2 20 l4 -10 q2 -4 6 -2 q3 2 2 6 l-8 20 q-4 10 -14 10 h-8 q-8 0 -9 -10 Z" fill="#ffcf9e" stroke="#1f2a22" strokeWidth="2.6" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Reloj medidor */}
        <div>
          <svg viewBox="0 0 200 116" className="w-full" aria-hidden="true">
            {zonasLuz.map((z, i) => {
              const a0 = Math.PI + (i / 4) * Math.PI
              const a1 = Math.PI + ((i + 1) / 4) * Math.PI
              const r = 86
              const d = `M100 100 L${100 + r * Math.cos(a0)} ${100 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${100 + r * Math.cos(a1)} ${100 + r * Math.sin(a1)} Z`
              return <path key={z.luz} d={d} fill={["#a9a6c9", "#b6dcff", "#ffe9a3", "#ffd84d"][i]} stroke="#1f2a22" strokeWidth="3" strokeLinejoin="round" />
            })}
            <circle cx="100" cy="100" r="30" fill="#fffdf8" stroke="#1f2a22" strokeWidth="3" />
            <g className="vt-aguja" style={{ transform: `rotate(${-90 + t * 180}deg)` }}>
              <path d="M96 100 L100 26 L104 100 Z" fill="#ff6542" stroke="#1f2a22" strokeWidth="2.6" strokeLinejoin="round" />
            </g>
            <circle cx="100" cy="100" r="7" fill="#1f2a22" />
          </svg>
          <p className="vt-titulo mt-1 text-center text-3xl">{zona.titulo}</p>
          <p className="text-center text-sm text-[var(--vt-tinta-70)]">
            {zona.sombra} · {zona.lugar}
          </p>
        </div>
      </div>

      <label htmlFor="vt-luz" className="mt-6 block text-sm font-extrabold">
        ¿Cuánta luz hay en tu rincón?
      </label>
      <input
        id="vt-luz"
        type="range"
        min={0}
        max={100}
        value={valor}
        onChange={(e) => setValor(Number(e.target.value))}
        aria-valuetext={`${zona.titulo}: ${textoLuz[zona.luz]}`}
        className="vt-rango mt-3"
      />
      <div className="mt-2 flex justify-between text-[11px] font-bold text-[var(--vt-tinta-70)]" aria-hidden="true">
        {zonasLuz.map((z, i) => (
          <span key={z.luz} className={cn(i === indice && "text-[var(--vt-tinta)]")}>
            {textoLuz[z.luz]}
          </span>
        ))}
      </div>

      <div className="mt-6" aria-live="polite">
        <p className="text-sm font-extrabold">Van bien con {textoLuz[zona.luz].toLowerCase()}:</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {plantas.map(({ planta, afinidad }) => (
            <li key={planta.id}>
              <Link
                href={rutaPlanta(planta.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 border-[var(--vt-tinta)] py-1 pr-3 pl-1 text-sm font-bold transition-transform hover:-rotate-2",
                  afinidad === 2 ? fondo[planta.color] : "bg-[var(--vt-papel)]"
                )}
              >
                <span className="relative size-8 overflow-hidden rounded-full border-2 border-[var(--vt-tinta)]">
                  <Image src={planta.foto.src} alt="" fill sizes="32px" className="object-cover" />
                </span>
                {planta.nombre}
                <span className="text-[11px] font-extrabold text-[var(--vt-tinta-70)]">
                  {afinidad === 2 ? "Ideal" : "Aguanta"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ---------- Calendario de riego (tarjeta que se da vuelta) ---------- */

const dias = ["L", "M", "M", "J", "V", "S", "D"]

function CalendarioRiego() {
  const { misPlantas, agregarMiPlanta, avisar, abrirCuenta } = useTienda()
  const [plantaId, setPlantaId] = useState("monstera")
  const [vuelta, setVuelta] = useState(false)
  const frenteRef = useRef<HTMLButtonElement>(null)
  const dorsoRef = useRef<HTMLHeadingElement>(null)
  const planta = catalogo.find((p) => p.id === plantaId)!
  const cada = diasDeRiego(plantaId)
  const guardada = misPlantas.some((m) => m.plantaId === plantaId)
  // Día 1 = el día que llega (ese día no se riega).
  const riegos = new Set<number>()
  for (let d = 1 + cada; d <= 28; d += cada) riegos.add(d)

  function girar(a: boolean) {
    setVuelta(a)
    window.setTimeout(() => (a ? dorsoRef.current : frenteRef.current)?.focus(), 380)
  }

  return (
    <div className="vt-giro min-w-0" data-vuelta={vuelta}>
      <div className="vt-giro-interior h-full">
        {/* Frente */}
        <div
          className="vt-giro-cara flex flex-col rounded-[36px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-cielo)] p-5 sm:p-7"
          inert={vuelta}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>
            <h3 className="vt-titulo text-3xl sm:text-4xl">Calendario de riego</h3>
          </div>
          <p className="mt-2 text-sm text-[var(--vt-tinta-70)]">
            Elegí tu planta y dale vuelta la tarjeta: te armamos el primer mes de
            riegos desde el día que llega.
          </p>
          <RadioGroup.Root
            value={plantaId}
            onValueChange={setPlantaId}
            aria-label="Planta para el calendario"
            className="mt-5 flex flex-wrap gap-2"
          >
            {catalogo.map((p) => (
              <RadioGroup.Item key={p.id} value={p.id} className="vt-chip h-9 px-3 text-sm">
                {p.nombre}
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <div className="mt-6 flex items-center gap-5 rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-4">
            <div className={cn("vt-blob-2 relative size-24 shrink-0 overflow-hidden border-2 border-[var(--vt-tinta)]", fondo[planta.color])}>
              <Image src={planta.foto.src} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <div>
              <p className="vt-titulo text-2xl">{planta.nombre}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold">
                <Droplets className="size-4 text-[#2b7fd1]" aria-hidden="true" /> Cada {cada} días
              </p>
              <p className="text-xs text-[var(--vt-tinta-70)]">{planta.riego}</p>
            </div>
          </div>
          <div className="min-h-5 flex-1" aria-hidden="true" />
          <button ref={frenteRef} type="button" className="vt-boton-tinta mt-auto h-12 px-6" onClick={() => girar(true)}>
            Dar vuelta y ver mi calendario
          </button>
        </div>

        {/* Dorso */}
        <div
          className="vt-giro-dorso flex flex-col rounded-[36px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5 sm:p-7"
          inert={!vuelta}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 ref={dorsoRef} tabIndex={-1} className="vt-titulo text-3xl outline-none">
              Primer mes de {planta.nombre.toLowerCase()}
            </h3>
            <button type="button" className="vt-icono size-10 shrink-0 border-2 border-[var(--vt-tinta)]" onClick={() => girar(false)} aria-label="Volver a elegir planta">
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1 text-sm text-[var(--vt-tinta-70)]">
            Regá cada {cada} días. El día 1 es cuando llega: ese día dejala descansar.
          </p>
          <div className="mt-4 grid grid-cols-7 gap-1.5 text-center" role="table" aria-label={`Calendario de riego de ${planta.nombre}`}>
            <div role="row" className="contents">
              {dias.map((d, i) => (
                <span key={i} role="columnheader" className="text-[11px] font-extrabold text-[var(--vt-tinta-70)]">
                  {d}
                </span>
              ))}
            </div>
            {[0, 1, 2, 3].map((semana) => (
              <div key={semana} role="row" className="contents">
                {Array.from({ length: 7 }, (_, i) => {
                  const dia = semana * 7 + i + 1
                  const toca = riegos.has(dia)
                  return (
                    <span
                      key={dia}
                      role="cell"
                      aria-label={`Día ${dia}${toca ? ", toca regar" : ""}`}
                      className={cn(
                        "relative grid aspect-square place-items-center rounded-xl border-2 text-xs font-bold",
                        toca ? "border-[var(--vt-tinta)] bg-[var(--vt-cielo)]" : "border-[var(--vt-tinta-15)]",
                        dia === 1 && "border-[var(--vt-tinta)] bg-[var(--vt-manteca)]"
                      )}
                    >
                      {toca ? <Droplets className="size-4 text-[#2b7fd1]" aria-hidden="true" /> : <span aria-hidden="true">{dia}</span>}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--vt-tinta-70)]">
            <span className="mr-1 inline-block size-3 rounded border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)] align-middle" /> Llega
            <span className="mr-1 ml-3 inline-block size-3 rounded border-2 border-[var(--vt-tinta)] bg-[var(--vt-cielo)] align-middle" /> Toca regar ({riegos.size} veces)
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {guardada ? (
              <button type="button" className="vt-boton-linea h-11 px-5 text-sm" onClick={() => abrirCuenta("plantas")}>
                <Check className="size-4" aria-hidden="true" /> Ya está en Mis plantas
              </button>
            ) : (
              <button
                type="button"
                className="vt-boton h-11 px-5 text-sm"
                onClick={() => {
                  agregarMiPlanta(plantaId)
                  avisar(`Te vamos a recordar regar ${planta.nombre.toLowerCase()} cada ${cada} días`)
                }}
              >
                <BellRing className="size-4" aria-hidden="true" /> Activar recordatorios
              </button>
            )}
            <Link href={rutaPlanta(plantaId)} className="vt-boton-linea h-11 px-5 text-sm">
              Ver la planta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
