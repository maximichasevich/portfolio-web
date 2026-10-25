"use client"

import { useEffect, useRef, useState } from "react"
import {
  Code2,
  Gauge,
  MessageCircle,
  Palette,
  Search,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Modelos 3D de la portada hechos con transformaciones CSS 3D (los dibuja la
 * placa de video, no descargan ninguna librería). Comparten el mismo manejo:
 * se arrastran para girarlos (mouse en los dos ejes; dedo solo en horizontal
 * para no trabar el scroll), tienen inercia y su bucle de animación se apaga
 * fuera de pantalla.
 */

type Rotacion = {
  x: number
  y: number
  vx: number
  vy: number
  arrastrando: boolean
  tipo: string
  ux: number
  uy: number
}

/** Maneja arrastre + inercia + giro automático y escribe --rx/--ry. */
function useGiro3d({
  inicial,
  auto,
  limiteX,
}: {
  inicial: { x: number; y: number }
  /** Giro automático en grados por segundo sobre el eje Y. */
  auto: number
  /** Límite de inclinación en X (grados), o null para giro libre. */
  limiteX: [number, number] | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const pausaRef = useRef(false)
  const r = useRef<Rotacion>({
    x: inicial.x,
    y: inicial.y,
    vx: 0,
    vy: 0,
    arrastrando: false,
    tipo: "mouse",
    ux: 0,
    uy: 0,
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const g = r.current
    let raf = 0
    let ultimo = 0
    let visible = false

    const cuadro = (t: number) => {
      const dt = ultimo ? Math.min(0.05, (t - ultimo) / 1000) : 1 / 60
      ultimo = t
      if (!g.arrastrando) {
        g.y += g.vy + (pausaRef.current ? 0 : auto * dt)
        g.x += g.vx
        g.vx *= 0.92
        g.vy *= 0.94
      }
      if (limiteX) g.x = Math.max(limiteX[0], Math.min(limiteX[1], g.x))
      el.style.setProperty("--rx", `${g.x.toFixed(2)}deg`)
      el.style.setProperty("--ry", `${g.y.toFixed(2)}deg`)
      raf = visible && !document.hidden ? requestAnimationFrame(cuadro) : 0
    }
    const arrancar = () => {
      if (!raf && visible && !document.hidden) {
        ultimo = 0
        raf = requestAnimationFrame(cuadro)
      }
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) arrancar()
    })
    io.observe(el)
    document.addEventListener("visibilitychange", arrancar)
    el.style.setProperty("--rx", `${g.x}deg`)
    el.style.setProperty("--ry", `${g.y}deg`)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener("visibilitychange", arrancar)
    }
  }, [auto, limiteX])

  const eventos = {
    onPointerDown(ev: React.PointerEvent<HTMLDivElement>) {
      const g = r.current
      g.arrastrando = true
      g.tipo = ev.pointerType
      g.ux = ev.clientX
      g.uy = ev.clientY
      g.vx = 0
      g.vy = 0
      ev.currentTarget.setPointerCapture(ev.pointerId)
    },
    onPointerMove(ev: React.PointerEvent<HTMLDivElement>) {
      const g = r.current
      if (!g.arrastrando) return
      const dx = ev.clientX - g.ux
      const dy = ev.clientY - g.uy
      g.ux = ev.clientX
      g.uy = ev.clientY
      g.vy = dx * 0.45
      g.y += g.vy
      if (g.tipo !== "touch") {
        g.vx = -dy * 0.45
        g.x += g.vx
      }
    },
    onPointerUp() {
      r.current.arrastrando = false
    },
    onPointerCancel() {
      r.current.arrastrando = false
    },
  }

  return { ref, eventos, pausaRef }
}

/* ------------------------------------------------------------------ */
/* Cubo de capacidades                                                 */
/* ------------------------------------------------------------------ */

const caras: { Icono: LucideIcon; texto: string; cara: string }[] = [
  { Icono: Palette, texto: "Diseño propio", cara: "frente" },
  { Icono: Code2, texto: "Código a medida", cara: "derecha" },
  { Icono: Smartphone, texto: "Celular primero", cara: "atras" },
  { Icono: Search, texto: "Listo para Google", cara: "izquierda" },
  { Icono: Gauge, texto: "Carga rápida", cara: "arriba" },
  { Icono: ShieldCheck, texto: "Seguro", cara: "abajo" },
]

/** El cubo no se inclina tanto como para quedar de canto. */
const LIMITE_CUBO: [number, number] = [-45, 45]

export function CuboCapacidades({ className }: { className?: string }) {
  const { ref, eventos, pausaRef } = useGiro3d({
    inicial: { x: -22, y: 32 },
    auto: 18,
    limiteX: LIMITE_CUBO,
  })

  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      role="img"
      aria-label="Cubo 3D con lo que incluye cada página: diseño propio, código a medida, celular primero, listo para Google, carga rápida y seguro."
    >
      <div
        ref={ref}
        {...eventos}
        onPointerEnter={() => (pausaRef.current = true)}
        onPointerLeave={() => (pausaRef.current = false)}
        className="cubo-escena cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        <div className="cubo">
          {caras.map(({ Icono, texto, cara }) => (
            <div key={cara} className={`cubo-cara cubo-${cara}`}>
              <Icono className="size-7 text-[var(--cian)]" aria-hidden="true" />
              <span className="mono mt-2 text-[10px] tracking-widest uppercase">
                {texto}
              </span>
            </div>
          ))}
          <div className="cubo-nucleo" aria-hidden="true" />
        </div>
      </div>
      <p
        className="mono text-[10px] tracking-widest text-[var(--estrella-45)] uppercase"
        aria-hidden="true"
      >
        Arrastrá el cubo
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Anatomía de una web: capas apiladas                                 */
/* ------------------------------------------------------------------ */

type Capa = {
  titulo: string
  texto: string
  color: string
  Dibujo: () => React.ReactNode
}

const capas: Capa[] = [
  {
    titulo: "Servidor y dominio",
    texto:
      "Hosting rápido y seguro, con tu dominio y certificado. Todo a tu nombre.",
    color: "#7c5cff",
    Dibujo: () => (
      <div className="flex h-full flex-col justify-center gap-1.5 p-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 rounded-sm bg-white/5 px-2 py-1"
          >
            <span className="size-1.5 rounded-full bg-[#3fd68c]" />
            <span className="h-1 flex-1 rounded bg-white/15" />
          </div>
        ))}
      </div>
    ),
  },
  {
    titulo: "Código",
    texto:
      "Programación a medida con tecnología actual: rápida, liviana y fácil de mantener.",
    color: "#39d5ff",
    Dibujo: () => (
      <div className="mono flex h-full flex-col justify-center gap-1 p-3 text-[7px] leading-none text-[var(--cian)]/80">
        <span>{"<header>"}</span>
        <span className="pl-2 text-white/50">{"<h1>Tu negocio</h1>"}</span>
        <span className="pl-2 text-[#7c5cff]">{"<Boton />"}</span>
        <span>{"</header>"}</span>
      </div>
    ),
  },
  {
    titulo: "Diseño",
    texto:
      "Colores, tipografías y estilo propios según tu público. Nada de plantillas.",
    color: "#ff7ab6",
    Dibujo: () => (
      <div className="flex h-full items-center justify-center gap-2 p-3">
        {["#39d5ff", "#7c5cff", "#ff7ab6", "#f5f7ff"].map((c) => (
          <span
            key={c}
            className="size-4 rounded-full"
            style={{ background: c }}
          />
        ))}
        <span className="display ml-1 text-sm text-white/80">Aa</span>
      </div>
    ),
  },
  {
    titulo: "Contenido",
    texto:
      "Textos que se entienden en cinco segundos y fotos que muestran tu negocio.",
    color: "#e9b949",
    Dibujo: () => (
      <div className="flex h-full gap-2 p-3">
        <span className="w-1/3 rounded-sm bg-gradient-to-br from-[#e9b949]/50 to-[#7c5cff]/30" />
        <span className="flex flex-1 flex-col justify-center gap-1">
          <span className="h-1.5 w-4/5 rounded bg-white/40" />
          <span className="h-1 w-full rounded bg-white/15" />
          <span className="h-1 w-3/4 rounded bg-white/15" />
        </span>
      </div>
    ),
  },
  {
    titulo: "Google y WhatsApp",
    texto: "Configurada para que te encuentren y te escriban con un toque.",
    color: "#3fd68c",
    Dibujo: () => (
      <div className="flex h-full flex-col justify-center gap-2 p-3">
        <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
          <Search className="size-2.5 text-white/60" />
          <span className="h-1 flex-1 rounded bg-white/25" />
        </span>
        <span className="flex items-center gap-1 self-end rounded-full bg-[#25d366]/30 px-2 py-1">
          <MessageCircle className="size-2.5 text-[#3fd68c]" />
          <span className="h-1 w-8 rounded bg-white/30" />
        </span>
      </div>
    ),
  },
]

/** Límites de inclinación del modelo de capas (constante: no reinicia el giro). */
const LIMITE_ANATOMIA: [number, number] = [30, 72]

export function AnatomiaWeb({ className }: { className?: string }) {
  const { ref, eventos } = useGiro3d({
    inicial: { x: 58, y: -38 },
    auto: 0,
    limiteX: LIMITE_ANATOMIA,
  })
  const [activa, setActiva] = useState<number | null>(null)
  const [abierta, setAbierta] = useState(false)
  const contRef = useRef<HTMLDivElement>(null)

  // Las capas se separan cuando el modelo entra en pantalla.
  useEffect(() => {
    const el = contRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAbierta(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const info = activa !== null ? capas[activa] : null

  return (
    <div ref={contRef} className={cn("flex flex-col gap-5", className)}>
      <div
        ref={ref}
        {...eventos}
        onPointerLeave={() => setActiva(null)}
        data-abierta={abierta}
        className="anatomia-escena cursor-grab touch-pan-y select-none active:cursor-grabbing"
        role="group"
        aria-label="Modelo 3D de las capas de una página web. Arrastrá para girarlo."
      >
        <div className="anatomia">
          {capas.map((c, i) => (
            <button
              key={c.titulo}
              type="button"
              aria-label={`${c.titulo}: ${c.texto}`}
              aria-pressed={activa === i}
              onPointerEnter={(ev) =>
                ev.pointerType !== "touch" && setActiva(i)
              }
              onFocus={() => setActiva(i)}
              onClick={() => setActiva(activa === i ? null : i)}
              className={cn("anatomia-capa", activa === i && "activa")}
              style={
                {
                  "--i": i,
                  "--color": c.color,
                } as React.CSSProperties
              }
            >
              <c.Dibujo />
              <span className="mono absolute top-1.5 left-2 text-[7px] tracking-widest text-white/60 uppercase">
                {String(i + 1).padStart(2, "0")} · {c.titulo}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="hud min-h-[5.5rem] rounded-2xl px-5 py-4"
        aria-live="polite"
      >
        {info ? (
          <>
            <p
              className="mono text-[10px] tracking-widest uppercase"
              style={{ color: info.color }}
            >
              Capa {String((activa ?? 0) + 1).padStart(2, "0")}
            </p>
            <p className="display-md mt-1 text-lg">{info.titulo}</p>
            <p className="mt-1 text-sm text-[var(--estrella-70)]">
              {info.texto}
            </p>
          </>
        ) : (
          <>
            <p className="mono text-[10px] tracking-widest text-[var(--cian)] uppercase">
              Anatomía de una web
            </p>
            <p className="mt-1 text-sm text-[var(--estrella-70)]">
              Cinco capas, todas a cargo mío. Pasá el mouse o tocá una capa para
              ver qué hago en cada una; arrastrá para girar el modelo.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
