"use client"

import { useRef, useState } from "react"
import Image from "next/image"

import "./laboratorio.css"
import { obras } from "@/components/demos/faro/obras"
import { cn } from "@/lib/utils"

const elegidas = ["carrasco", "barra", "pocitos"]
  .map((id) => obras.find((o) => o.id === id))
  .filter((o) => o !== undefined)

/**
 * Comparador "del croquis a la obra": un deslizador revela la foto de la
 * obra terminada sobre el croquis de anteproyecto. El velo se mueve solo con
 * transform (dos traslaciones opuestas), sin recortes que repinten.
 */
export default function Comparador() {
  const [actual, setActual] = useState(0)
  const marcoRef = useRef<HTMLDivElement>(null)
  const rangoRef = useRef<HTMLInputElement>(null)
  const cuadroRef = useRef(0)
  const valorRef = useRef(0.5)
  const arrastreRef = useRef(false)

  const obra = elegidas[actual]

  function poner(p: number) {
    valorRef.current = Math.min(1, Math.max(0, p))
    if (cuadroRef.current) return
    cuadroRef.current = requestAnimationFrame(() => {
      cuadroRef.current = 0
      const v = valorRef.current
      marcoRef.current?.style.setProperty("--p", v.toFixed(4))
      const r = rangoRef.current
      if (r) {
        r.value = String(Math.round(v * 100))
        r.setAttribute(
          "aria-valuetext",
          `${Math.round(v * 100)} % de croquis, ${Math.round((1 - v) * 100)} % de obra`
        )
      }
    })
  }

  function desdePuntero(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    poner((e.clientX - r.left) / r.width)
  }

  return (
    <div>
      <svg className="absolute size-0" aria-hidden="true" focusable="false">
        <filter id="faro-croquis" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0"
          />
          <feGaussianBlur stdDeviation="0.7" />
          <feConvolveMatrix
            order="3"
            kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1"
            preserveAlpha="true"
          />
          <feComponentTransfer>
            <feFuncR type="linear" slope="-3.2" intercept="1.04" />
            <feFuncG type="linear" slope="-3.2" intercept="1.04" />
            <feFuncB type="linear" slope="-3.2" intercept="1.04" />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.91" intercept="0.059" />
            <feFuncG type="linear" slope="0.902" intercept="0.059" />
            <feFuncB type="linear" slope="0.882" intercept="0.051" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div
        role="group"
        aria-label="Obra para comparar"
        className="mb-5 flex flex-wrap gap-x-6 gap-y-1"
      >
        {elegidas.map((o, i) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={actual === i}
            onClick={() => setActual(i)}
            className={cn(
              "serif min-h-11 text-[1.4rem] transition-colors sm:text-[1.7rem]",
              actual === i
                ? "text-[var(--carbon)] italic"
                : "text-[var(--piedra)] hover:text-[var(--carbon)]"
            )}
          >
            {o.nombre}
          </button>
        ))}
      </div>

      <div
        ref={marcoRef}
        className="comparador relative aspect-[4/3] cursor-ew-resize overflow-hidden bg-[var(--hueso-2)] select-none focus-within:outline focus-within:outline-1 focus-within:outline-offset-4 focus-within:outline-[var(--carbon)] sm:aspect-[16/9]"
        onPointerDown={(e) => {
          if (e.button !== 0) return
          arrastreRef.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          desdePuntero(e)
        }}
        onPointerMove={(e) => {
          if (arrastreRef.current) desdePuntero(e)
        }}
        onPointerUp={() => (arrastreRef.current = false)}
        onPointerCancel={() => (arrastreRef.current = false)}
      >
        {/* Obra terminada (debajo) */}
        <Image
          key={`f-${obra.id}`}
          src={obra.foto.src}
          alt={`${obra.nombre}, obra terminada`}
          fill
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="aparece object-cover"
          draggable={false}
        />
        {/* Croquis (encima, a la izquierda del divisor) */}
        <div className="comparador-velo absolute inset-0 overflow-hidden will-change-transform">
          <div className="absolute inset-0 bg-[var(--papel)] will-change-transform">
            <Image
              key={`c-${obra.id}`}
              src={obra.foto.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover [filter:url(#faro-croquis)]"
              draggable={false}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(rgba(15,15,13,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,15,13,0.05)_1px,transparent_1px)] bg-[size:28px_28px]"
            />
            <p className="etiqueta absolute top-4 left-4 bg-[var(--papel)] px-2 py-1 text-[var(--piedra)]">
              Croquis<span className="hidden sm:inline"> de anteproyecto</span>
            </p>
          </div>
        </div>
        <p className="etiqueta absolute top-4 right-4 bg-[var(--carbon)]/80 px-2 py-1 text-[var(--hueso)]">
          Obra<span className="hidden sm:inline"> terminada</span>
        </p>

        {/* Divisor */}
        <div
          aria-hidden="true"
          className="comparador-linea pointer-events-none absolute inset-y-0 left-0 w-full will-change-transform"
        >
          <div className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-[var(--hueso)] shadow-[0_0_0_0.5px_rgba(15,15,13,0.35)]" />
          <div className="mono absolute top-1/2 left-0 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center border border-[var(--carbon)] bg-[var(--papel)] text-xs">
            ↔
          </div>
        </div>

        <input
          ref={rangoRef}
          type="range"
          min="0"
          max="100"
          defaultValue="50"
          aria-label={`Comparar croquis y obra terminada de ${obra.nombre}`}
          className="sr-only"
          onInput={(e) => poner(Number(e.currentTarget.value) / 100)}
        />
      </div>
      <p className="mono mt-3 flex flex-wrap justify-between gap-2 text-xs text-[var(--piedra)]">
        <span>
          {obra.nombre} · {obra.anio} · {obra.m2} m²
        </span>
        <span>Arrastrá el divisor o usá las flechas</span>
      </p>
    </div>
  )
}
