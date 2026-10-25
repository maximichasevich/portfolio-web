"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { RadioGroup } from "radix-ui"
import { ArrowRight, Frown, Hand, Meh, ShoppingBag, Smile } from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  catalogo,
  precioDesde,
  textoLuz,
  type Luz,
} from "@/components/demos/verde/catalogo"
import { afinidadLuz } from "@/components/demos/verde/extras"
import { rutaPlanta, useTienda } from "@/components/demos/verde/estado"
import { MacetaDibujo, PlantaDibujo } from "@/components/demos/verde/planta-svg"
import { BotonPausa } from "@/components/demos/verde/ui"

/*
 * Un living ilustrado en capas a distintas profundidades (como un diorama de
 * papel). Al mover el mouse la escena se inclina apenas y las capas hacen
 * parallax. La planta se arrastra en horizontal (con el dedo no traba el
 * scroll vertical) y se acomoda en el lugar más cercano. También se elige el
 * lugar con botones o con las flechas del teclado.
 */

type Lugar = {
  id: string
  nombre: string
  luz: Luz
  /** Dónde se apoya la maceta, en fracciones del ancho y el alto. */
  x: number
  y: number
  escala: number
  texto: string
}

const lugares: Lugar[] = [
  { id: "ventana", nombre: "Junto a la ventana", luz: "sol", x: 0.15, y: 0.9, escala: 1.12, texto: "Le da el sol de la tarde varias horas." },
  { id: "sillon", nombre: "Al lado del sillón", luz: "mucha", x: 0.33, y: 0.78, escala: 0.92, texto: "Muy luminoso, sin sol directo." },
  { id: "repisa", nombre: "En la repisa", luz: "indirecta", x: 0.72, y: 0.335, escala: 0.5, texto: "Luz clarita que rebota en la pared." },
  { id: "escritorio", nombre: "En el escritorio", luz: "poca", x: 0.885, y: 0.535, escala: 0.6, texto: "El rincón más tranquilo del living." },
]

/** Interpola alto y escala entre los lugares vecinos según x. */
function posicionEn(x: number) {
  if (x <= lugares[0].x) return { y: lugares[0].y, escala: lugares[0].escala }
  for (let i = 0; i < lugares.length - 1; i++) {
    const a = lugares[i]
    const b = lugares[i + 1]
    if (x <= b.x) {
      const t = (x - a.x) / (b.x - a.x)
      // Pasa "por arriba" entre el piso y la repisa: un arco suave.
      const arco = Math.sin(t * Math.PI) * (Math.abs(a.y - b.y) > 0.2 ? 0.06 : 0.02)
      return { y: a.y + (b.y - a.y) * t - arco, escala: a.escala + (b.escala - a.escala) * t }
    }
  }
  const u = lugares[lugares.length - 1]
  return { y: u.y, escala: u.escala }
}

function masCercano(x: number) {
  return lugares.reduce((m, l) => (Math.abs(l.x - x) < Math.abs(m.x - x) ? l : m), lugares[0])
}

function veredicto(plantaId: string, lugar: Lugar) {
  const planta = catalogo.find((p) => p.id === plantaId)!
  const af = afinidadLuz(planta, lugar.luz)
  const exterior = planta.categoria === "Exterior" || planta.categoria === "Huerta"
  if (exterior && lugar.id !== "ventana")
    return { nivel: 0, texto: `${planta.nombre} es de exterior: adentro solo anda pegada a una ventana con sol.` }
  if (lugar.id === "repisa" && (planta.id === "ficus" || planta.id === "palo"))
    return { nivel: 0, texto: `En la repisa no entra: ${planta.nombre.toLowerCase()} crece muy alto. Probala en el piso.` }
  if (af === 2) return { nivel: 2, texto: `¡Acá ${planta.nombre.toLowerCase()} va a estar feliz! Es justo la luz que pide.` }
  if (af === 1) {
    const mas = ["poca", "indirecta", "mucha", "sol"].indexOf(planta.luz) > ["poca", "indirecta", "mucha", "sol"].indexOf(lugar.luz)
    return {
      nivel: 1,
      texto: mas
        ? `Aguanta, pero va a crecer más lento. Si podés, acercala a la luz.`
        : `Aguanta, aunque prefiere un lugar más tranquilo. Ojo con que no se queme.`,
    }
  }
  const pideMas = ["poca", "indirecta", "mucha", "sol"].indexOf(planta.luz) > ["poca", "indirecta", "mucha", "sol"].indexOf(lugar.luz)
  return {
    nivel: 0,
    texto: pideMas
      ? `Le va a faltar luz. ${planta.nombre} pide ${textoLuz[planta.luz].toLowerCase()}.`
      : `Demasiada luz para ${planta.nombre.toLowerCase()}: se le van a quemar las hojas.`,
  }
}

export function Probador() {
  const { agregar } = useTienda()
  const [plantaId, setPlantaId] = useState("monstera")
  const [lugarId, setLugarId] = useState("sillon")
  const lugar = lugares.find((l) => l.id === lugarId) ?? lugares[1]
  const planta = catalogo.find((p) => p.id === plantaId)!
  const v = veredicto(plantaId, lugar)

  const escenaRef = useRef<HTMLDivElement>(null)
  const mundoRef = useRef<HTMLDivElement>(null)
  const macetaRef = useRef<HTMLButtonElement>(null)
  const arrastreRef = useRef({ activo: false, x0: 0, xFrac0: 0, xFrac: lugar.x, ancho: 1, alto: 1, id: 0 })
  const inclinacionRef = useRef(0)

  const pintar = useCallback((xFrac: number) => {
    const el = macetaRef.current
    const a = arrastreRef.current
    if (!el) return
    const { y, escala } = posicionEn(xFrac)
    el.style.transform = `translate(${xFrac * a.ancho}px, ${y * a.alto}px) translate(-50%, -100%) scale(${escala})`
  }, [])

  // Medir la escena y ubicar la planta en su lugar (también al cambiar el tamaño).
  useEffect(() => {
    const escena = escenaRef.current
    if (!escena) return
    const medir = () => {
      const r = escena.getBoundingClientRect()
      arrastreRef.current.ancho = r.width
      arrastreRef.current.alto = r.height
      if (!arrastreRef.current.activo) pintar(arrastreRef.current.xFrac)
    }
    medir()
    const obs = new ResizeObserver(medir)
    obs.observe(escena)
    return () => obs.disconnect()
  }, [pintar])

  // Al elegir un lugar (botones, teclado o al soltar), la planta va con un rebote.
  useEffect(() => {
    const el = macetaRef.current
    if (!el) return
    arrastreRef.current.xFrac = lugar.x
    el.dataset.suelta = ""
    pintar(lugar.x)
    const t = window.setTimeout(() => delete el.dataset.suelta, 480)
    return () => window.clearTimeout(t)
  }, [lugar, pintar])

  function inclinar(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return
    const escena = escenaRef.current
    const mundo = mundoRef.current
    if (!escena || !mundo) return
    const r = escena.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    cancelAnimationFrame(inclinacionRef.current)
    inclinacionRef.current = requestAnimationFrame(() => {
      mundo.style.setProperty("--ly", `${(px * 6).toFixed(2)}deg`)
      mundo.style.setProperty("--lx", `${(-py * 4).toFixed(2)}deg`)
    })
  }

  function enderezar() {
    const mundo = mundoRef.current
    if (!mundo) return
    cancelAnimationFrame(inclinacionRef.current)
    mundo.style.setProperty("--ly", "0deg")
    mundo.style.setProperty("--lx", "0deg")
  }

  function moverA(indice: number) {
    const i = Math.max(0, Math.min(lugares.length - 1, indice))
    setLugarId(lugares[i].id)
  }

  const Icono = v.nivel === 2 ? Smile : v.nivel === 1 ? Meh : Frown

  return (
    <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr] lg:gap-8">
      <div className="min-w-0">
        <div
          ref={escenaRef}
          className="vt-living relative aspect-[4/3] overflow-hidden rounded-[32px] border-2 border-[var(--vt-tinta)] bg-[#fdf1dc]"
          onPointerMove={inclinar}
          onPointerLeave={enderezar}
        >
          <div ref={mundoRef} className="vt-living-mundo">
            {/* Fondo: paredes, piso, ventana y repisa */}
            <div className="vt-living-capa" style={{ transform: "translateZ(-60px) scale(1.06)" }}>
              <FondoLiving />
            </div>
            {/* Muebles */}
            <div className="vt-living-capa" style={{ transform: "translateZ(-10px) scale(1.01)" }}>
              <MueblesLiving />
            </div>
            {/* Puntos donde se puede dejar la planta */}
            <div className="vt-living-capa" aria-hidden="true">
              {lugares.map((l) => (
                <span
                  key={l.id}
                  className={cn(
                    "absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--vt-tinta)]",
                    l.id === lugarId ? "bg-transparent" : "bg-[var(--vt-papel)]"
                  )}
                  style={{ left: `${l.x * 100}%`, top: `${l.y * 100}%` }}
                >
                  {l.id !== lugarId && (
                    <span className="vt-living-punto vt-anim absolute -inset-1.5 rounded-full border-2 border-[var(--vt-coral)]" />
                  )}
                </span>
              ))}
            </div>
            {/* La planta */}
            <div className="vt-living-capa" style={{ transform: "translateZ(30px)" }}>
              <button
                ref={macetaRef}
                type="button"
                className="vt-living-planta w-[22%] origin-bottom"
                aria-label={`${planta.nombre}, ${lugar.nombre.toLowerCase()}. Usá las flechas para moverla de lugar.`}
                onKeyDown={(e) => {
                  const i = lugares.findIndex((l) => l.id === lugarId)
                  if (e.key === "ArrowRight") {
                    e.preventDefault()
                    moverA(i + 1)
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault()
                    moverA(i - 1)
                  }
                }}
                onPointerDown={(e) => {
                  const a = arrastreRef.current
                  a.activo = true
                  a.x0 = e.clientX
                  a.xFrac0 = a.xFrac
                  e.currentTarget.setPointerCapture(e.pointerId)
                  e.currentTarget.dataset.arrastrando = ""
                  delete e.currentTarget.dataset.suelta
                }}
                onPointerMove={(e) => {
                  const a = arrastreRef.current
                  if (!a.activo) return
                  const x = Math.max(0.08, Math.min(0.94, a.xFrac0 + (e.clientX - a.x0) / a.ancho))
                  a.xFrac = x
                  cancelAnimationFrame(a.id)
                  a.id = requestAnimationFrame(() => pintar(x))
                }}
                onPointerUp={(e) => {
                  const a = arrastreRef.current
                  if (!a.activo) return
                  a.activo = false
                  delete e.currentTarget.dataset.arrastrando
                  const destino = masCercano(a.xFrac)
                  if (destino.id === lugarId) {
                    e.currentTarget.dataset.suelta = ""
                    a.xFrac = destino.x
                    pintar(destino.x)
                  } else setLugarId(destino.id)
                }}
                onPointerCancel={(e) => {
                  arrastreRef.current.activo = false
                  delete e.currentTarget.dataset.arrastrando
                  pintar(lugar.x)
                }}
              >
                <span className="pointer-events-none block">
                  <span className="vt-mece-portada vt-anim block">
                    <PlantaDibujo id={plantaId} className="relative z-[1] -mb-[16%] block w-full" />
                    <MacetaDibujo tipo="barro" className="mx-auto block w-[60%]" />
                  </span>
                </span>
                <span className="absolute -bottom-1 left-1/2 -z-10 h-3 w-[70%] -translate-x-1/2 rounded-full bg-[rgba(31,42,34,0.25)]" aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] px-3 py-1.5 text-xs font-extrabold">
            <Hand className="size-3.5" aria-hidden="true" /> Arrastrá la planta
          </p>
          <BotonPausa className="absolute top-3 right-3 hidden sm:inline-flex" />
        </div>

        <RadioGroup.Root
          value={lugarId}
          onValueChange={setLugarId}
          aria-label="Lugar del living"
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {lugares.map((l) => (
            <RadioGroup.Item key={l.id} value={l.id} className="vt-opcion bg-[var(--vt-papel)] px-3 py-2 text-left">
              <span className="block text-sm font-extrabold">{l.nombre}</span>
              <span className="block text-xs text-[var(--vt-tinta-70)]">{textoLuz[l.luz]}</span>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <fieldset className="min-w-0">
          <legend className="vt-titulo text-2xl">Elegí la planta</legend>
          <RadioGroup.Root
            value={plantaId}
            onValueChange={setPlantaId}
            aria-label="Planta para probar"
            className="mt-3 flex flex-wrap gap-2"
          >
            {catalogo.map((p) => (
              <RadioGroup.Item key={p.id} value={p.id} aria-label={p.nombre} className="vt-chip h-11 gap-1.5 py-1 pr-3 pl-1 text-sm">
                <span className="relative size-8 overflow-hidden rounded-full border-2 border-[var(--vt-tinta)]">
                  <Image src={p.foto.src} alt="" fill sizes="32px" className="object-cover" />
                </span>
                <span className="max-w-[7.5rem] truncate">{p.nombre}</span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </fieldset>

        <div
          className={cn(
            "rounded-[28px] border-2 border-[var(--vt-tinta)] p-5",
            v.nivel === 2 ? "bg-[var(--vt-menta)]" : v.nivel === 1 ? "bg-[var(--vt-manteca)]" : "bg-[var(--vt-rosa)]"
          )}
          aria-live="polite"
        >
          <p className="flex items-center gap-2 text-sm font-bold">
            <Icono className="size-5" aria-hidden="true" />
            {lugar.nombre} · {textoLuz[lugar.luz]}
          </p>
          <p className="mt-1 text-xs text-[var(--vt-tinta-70)]">{lugar.texto}</p>
          <p className="vt-titulo mt-3 text-2xl leading-tight">{v.texto}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="vt-boton h-11 px-4 text-sm"
              onClick={(e) => agregar(planta.id, { origen: e.currentTarget })}
            >
              <ShoppingBag className="size-4" aria-hidden="true" /> Agregar · {pesos(precioDesde(planta))}
            </button>
            <Link href={rutaPlanta(planta.id)} className="vt-boton-linea h-11 px-4 text-sm">
              Ver ficha <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Ilustraciones del living ---------- */

const T = "#1f2a22"

function FondoLiving() {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
      {/* Pared del fondo */}
      <rect x="140" y="-20" width="680" height="420" fill="#fff0d6" />
      {/* Pared izquierda */}
      <path d="M-20 -20 L140 -20 L140 400 L-20 590 Z" fill="#ffdcc4" stroke={T} strokeWidth="3" />
      {/* Piso */}
      <path d="M140 400 L820 400 L820 620 L-20 620 L-20 590 Z" fill="#e9b98a" stroke={T} strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${160 + i * 120} 400 L${40 + i * 170} 620`} stroke="#d9a271" strokeWidth="3" />
      ))}
      {/* Ventana en la pared izquierda */}
      <path d="M28 96 L112 118 L112 302 L28 332 Z" fill="#b6dcff" stroke={T} strokeWidth="4" />
      <path d="M70 107 L70 317 M28 214 L112 210" stroke={T} strokeWidth="3" />
      <circle cx="88" cy="150" r="14" fill="#ffd84d" stroke={T} strokeWidth="3" />
      {/* Rayo de sol sobre el piso */}
      <path d="M112 302 L28 332 L120 600 L330 600 Z" fill="#ffe9a3" opacity="0.65" />
      {/* Cuadro */}
      <rect x="250" y="70" width="110" height="80" rx="8" fill="#cbbcff" stroke={T} strokeWidth="3" transform="rotate(-3 305 110)" />
      <path d="M262 136 l28 -30 22 20 16 -14 24 26" fill="none" stroke={T} strokeWidth="3" strokeLinejoin="round" transform="rotate(-3 305 110)" />
      <circle cx="334" cy="92" r="8" fill="#ffd84d" stroke={T} strokeWidth="2.5" transform="rotate(-3 305 110)" />
      {/* Repisa con libros */}
      <rect x="500" y="200" width="220" height="14" rx="4" fill="#b07a4e" stroke={T} strokeWidth="3" />
      <rect x="512" y="150" width="16" height="50" fill="#ff6542" stroke={T} strokeWidth="2.5" />
      <rect x="528" y="160" width="14" height="40" fill="#b8ead0" stroke={T} strokeWidth="2.5" />
      <rect x="544" y="146" width="18" height="54" fill="#ffd84d" stroke={T} strokeWidth="2.5" transform="rotate(8 553 200)" />
      <circle cx="690" cy="188" r="12" fill="#ffbfd4" stroke={T} strokeWidth="2.5" />
      {/* Alfombra */}
      <ellipse cx="460" cy="510" rx="230" ry="52" fill="#ffbfd4" stroke={T} strokeWidth="3" />
      <ellipse cx="460" cy="510" rx="190" ry="36" fill="none" stroke="#ff9fbf" strokeWidth="4" strokeDasharray="10 10" />
    </svg>
  )
}

function MueblesLiving() {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
      {/* Sillón */}
      <g stroke={T} strokeWidth="3" strokeLinejoin="round">
        <rect x="300" y="300" width="250" height="90" rx="26" fill="#ff8a6a" />
        <rect x="286" y="352" width="278" height="74" rx="22" fill="#ff6542" />
        <rect x="276" y="330" width="40" height="96" rx="18" fill="#ff8a6a" />
        <rect x="534" y="330" width="40" height="96" rx="18" fill="#ff8a6a" />
        <path d="M425 356 L425 420" />
        <rect x="300" y="426" width="14" height="22" fill="#7a4a2c" />
        <rect x="536" y="426" width="14" height="22" fill="#7a4a2c" />
        <rect x="340" y="318" width="64" height="44" rx="14" fill="#ffd84d" transform="rotate(-8 372 340)" />
      </g>
      {/* Escritorio */}
      <g stroke={T} strokeWidth="3" strokeLinejoin="round">
        <rect x="620" y="322" width="190" height="16" rx="4" fill="#c58a5c" />
        <rect x="636" y="338" width="12" height="130" fill="#a8693f" />
        <rect x="786" y="338" width="12" height="130" fill="#a8693f" />
        <path d="M650 322 L664 270 L742 270 L736 322 Z" fill="#b6dcff" />
        <rect x="640" y="316" width="110" height="8" rx="3" fill="#dfe7ee" />
        <path d="M776 322 L776 262 L800 246" fill="none" />
        <path d="M786 236 l28 10 -10 22 -28 -10 Z" fill="#ffd84d" />
      </g>
    </svg>
  )
}
