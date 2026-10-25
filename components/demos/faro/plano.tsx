"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog } from "radix-ui"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import type { Categoria, Obra } from "@/components/demos/faro/obras"
import { cn } from "@/lib/utils"

/* ---- Planta esquemática por tipo de obra (grilla de 20 × 10) ---- */

type Local = { n: string; x: number; y: number; w: number; h: number; abierto?: boolean }

const plantas: Record<Categoria, Local[]> = {
  Residencial: [
    { n: "Estar · comedor", x: 0, y: 0, w: 9, h: 6 },
    { n: "Terraza", x: 0, y: 6, w: 9, h: 4, abierto: true },
    { n: "Cocina", x: 9, y: 0, w: 4, h: 4 },
    { n: "Patio", x: 9, y: 4, w: 4, h: 3, abierto: true },
    { n: "Lavadero", x: 9, y: 7, w: 4, h: 3 },
    { n: "Dormitorio", x: 13, y: 0, w: 7, h: 5 },
    { n: "Baño", x: 13, y: 5, w: 3, h: 2.5 },
    { n: "Vestidor", x: 16, y: 5, w: 4, h: 2.5 },
    { n: "Dormitorio", x: 13, y: 7.5, w: 7, h: 2.5 },
  ],
  Comercial: [
    { n: "Planta libre", x: 0, y: 0, w: 13, h: 10 },
    { n: "Sala de reuniones", x: 13, y: 0, w: 7, h: 4 },
    { n: "Núcleo", x: 13, y: 4, w: 3, h: 3 },
    { n: "Office", x: 16, y: 4, w: 4, h: 3 },
    { n: "Depósito", x: 13, y: 7, w: 7, h: 3 },
  ],
  Interiores: [
    { n: "Estar", x: 0, y: 0, w: 11, h: 6 },
    { n: "Cocina", x: 11, y: 0, w: 5, h: 4 },
    { n: "Baño", x: 16, y: 0, w: 4, h: 4 },
    { n: "Comedor", x: 0, y: 6, w: 8, h: 4 },
    { n: "Escritorio", x: 8, y: 6, w: 3, h: 4 },
    { n: "Dormitorio", x: 11, y: 4, w: 9, h: 6 },
  ],
}

const decimal = (n: number) => n.toFixed(1).replace(".", ",")

export function Plano({ obra }: { obra: Obra }) {
  const locales = plantas[obra.categoria]
  const escala = Math.sqrt(obra.m2 / 200)
  const U = 28
  const ox = 30
  const oy = 34
  return (
    <figure>
      <svg
        viewBox="0 0 620 360"
        className="h-auto w-full border border-[var(--linea)] bg-[var(--papel)]"
        role="img"
        aria-label={`Planta esquemática de ${obra.nombre}, ${obra.m2} metros cuadrados`}
      >
        <defs>
          <pattern id="plano-grilla" width={U} height={U} patternUnits="userSpaceOnUse" x={ox} y={oy}>
            <path d={`M ${U} 0 L 0 0 0 ${U}`} fill="none" stroke="rgba(15,15,13,0.05)" />
          </pattern>
        </defs>
        <rect width="620" height="360" fill="url(#plano-grilla)" />
        <g transform={`translate(${ox} ${oy})`} fontFamily="var(--faro-mono), monospace">
          {locales.map((l, i) => (
            <g key={i}>
              <rect
                x={l.x * U}
                y={l.y * U}
                width={l.w * U}
                height={l.h * U}
                fill={l.abierto ? "rgba(201,169,110,0.07)" : "none"}
                stroke="#0f0f0d"
                strokeWidth="1"
                strokeDasharray={l.abierto ? "4 4" : undefined}
              />
              <text x={(l.x + l.w / 2) * U} y={(l.y + l.h / 2) * U - 2} textAnchor="middle" fontSize="9.5" fill="#0f0f0d" letterSpacing="0.5">
                {l.n.toUpperCase()}
              </text>
              <text x={(l.x + l.w / 2) * U} y={(l.y + l.h / 2) * U + 11} textAnchor="middle" fontSize="8.5" fill="#77736a">
                {decimal(l.w * l.h * escala * escala)} m²
              </text>
            </g>
          ))}
          <rect x="0" y="0" width={20 * U} height={10 * U} fill="none" stroke="#0f0f0d" strokeWidth="3" />
          {/* Cotas generales */}
          <g stroke="#77736a" strokeWidth="0.8" fill="#77736a" fontSize="9">
            <line x1="0" y1={10 * U + 16} x2={20 * U} y2={10 * U + 16} />
            <line x1="0" y1={10 * U + 11} x2="0" y2={10 * U + 21} />
            <line x1={20 * U} y1={10 * U + 11} x2={20 * U} y2={10 * U + 21} />
            <text x={10 * U} y={10 * U + 12} textAnchor="middle" stroke="none">
              {decimal(20 * escala)} m
            </text>
            <line x1={20 * U + 16} y1="0" x2={20 * U + 16} y2={10 * U} />
            <text x={20 * U + 22} y={5 * U} stroke="none" writingMode="tb">
              {decimal(10 * escala)} m
            </text>
          </g>
          <g transform={`translate(${-10} ${-16})`} fontSize="9" fill="#77736a">
            <text>PLANTA · ESC. GRÁFICA · {obra.m2} m²</text>
          </g>
        </g>
      </svg>
      <figcaption className="mono mt-2 text-[0.65rem] text-[var(--piedra)]">
        Planta esquemática de presentación. Los planos ejecutivos se entregan en el área de clientes.
      </figcaption>
    </figure>
  )
}

/* ---- Galería de detalles con visor a pantalla completa ---- */

const encuadres = [
  { pos: "50% 50%", z: 1, t: "Vista general" },
  { pos: "22% 35%", z: 1.9, t: "Detalle de materiales" },
  { pos: "78% 62%", z: 2.1, t: "Luz y sombra" },
  { pos: "50% 88%", z: 1.6, t: "Encuentro con el suelo" },
]

function Recorte({ obra, i, sizes, className }: { obra: Obra; i: number; sizes: string; className?: string }) {
  const e = encuadres[i]
  return (
    <Image
      src={obra.foto.src}
      alt={`${obra.nombre}: ${e.t.toLowerCase()}`}
      fill
      sizes={sizes}
      className={cn("object-cover", className)}
      style={{ objectPosition: e.pos, transform: `scale(${e.z})`, transformOrigin: e.pos }}
    />
  )
}

export function GaleriaDetalles({ obra }: { obra: Obra }) {
  const [visor, setVisor] = useState<number | null>(null)
  const total = encuadres.length
  const mover = (d: number) => setVisor((v) => (v === null ? v : (v + d + total) % total))

  return (
    <>
      <ul className="grid grid-cols-2 gap-2">
        {encuadres.map((e, i) => (
          <li key={e.t}>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setVisor(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden bg-[var(--hueso-2)]"
              aria-label={`Ampliar: ${e.t}`}
            >
              <Recorte obra={obra} i={i} sizes="(min-width: 1024px) 18vw, 45vw" />
              <span className="etiqueta absolute bottom-2 left-2 bg-[var(--papel)] px-1.5 py-0.5 text-[0.6rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                {e.t}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={visor !== null} onOpenChange={(v) => !v && setVisor(null)}>
        <Dialog.Overlay className="capa fixed inset-0 z-[70] bg-[var(--carbon)]/95" />
        {visor !== null && (
          <Dialog.Content
            className="capa sobre-oscuro fixed inset-0 z-[71] flex flex-col text-[var(--hueso)]"
            aria-describedby={undefined}
            onKeyDown={(e) => {
              // El visor maneja sus flechas; no pasan a la ficha de obra.
              e.stopPropagation()
              if (e.key === "ArrowRight") mover(1)
              if (e.key === "ArrowLeft") mover(-1)
            }}
          >
            <div className="flex items-center justify-between px-4 py-2 sm:px-8">
              <Dialog.Title className="etiqueta text-[var(--piedra-claro)]">
                {obra.nombre} · {encuadres[visor].t}
              </Dialog.Title>
              <Dialog.Close className="etiqueta inline-flex min-h-11 items-center gap-2 px-1">
                Cerrar
                <X className="size-4" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div className="relative mx-4 flex-1 overflow-hidden sm:mx-8">
              <div key={visor} className="aparece absolute inset-0">
                <Recorte obra={obra} i={visor} sizes="100vw" />
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 sm:px-8">
              <button type="button" onClick={() => mover(-1)} className="grid size-11 place-items-center border border-[var(--linea-clara)] transition-colors hover:bg-[var(--hueso)] hover:text-[var(--carbon)]" aria-label="Imagen anterior">
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <p className="mono text-xs" aria-live="polite">
                {String(visor + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
              <button type="button" onClick={() => mover(1)} className="grid size-11 place-items-center border border-[var(--linea-clara)] transition-colors hover:bg-[var(--hueso)] hover:text-[var(--carbon)]" aria-label="Imagen siguiente">
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </>
  )
}
