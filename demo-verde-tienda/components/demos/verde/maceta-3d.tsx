"use client"

import { memo, useCallback, useEffect, useRef } from "react"
import { RotateCcw, RotateCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { buscarColor } from "@/components/demos/verde/extras"
import { useBucle } from "@/components/demos/verde/bucle"
import { PlantaDibujo } from "@/components/demos/verde/planta-svg"

/*
 * Maceta 3D hecha con transformaciones CSS (perspective + preserve-3d):
 * un tronco de cono de 16 caras, tierra, plato y la planta en tres planos
 * cruzados para que tenga volumen al girar. Se gira arrastrando (solo en
 * horizontal, así el dedo sigue pudiendo hacer scroll), con las flechas del
 * teclado o con los botones. La luz se calcula por cara y se escribe como
 * opacidad de una capa oscura, sin re-renderizar React.
 */

const CARAS = 16
const PASO = 360 / CARAS
const LUZ = -35 // de dónde viene la luz (grados, negativo = izquierda)

type Estilo = { cuerpo: string; borde: string; brillo: number }

function estiloMaceta(macetaId: string, colorId?: string): Estilo {
  if (macetaId === "vivero") return { cuerpo: "#3a3f3b", borde: "#2a2e2b", brillo: 0.12 }
  if (macetaId === "ceramica") {
    const c = buscarColor(colorId)
    return { cuerpo: c.hex, borde: c.sombra, brillo: 0.55 }
  }
  return { cuerpo: "#de7d4f", borde: "#c2643a", brillo: 0.08 }
}

export type Maceta3DProps = {
  plantaId: string
  macetaId: string
  colorId?: string
  /** 0.8 chica, 1 mediana, 1.15 grande. */
  escala?: number
  /** Gira sola cuando nadie la toca. */
  autoGiro?: boolean
  pausado?: boolean
  etiqueta: string
  className?: string
}

export function Maceta3D({
  plantaId,
  macetaId,
  colorId,
  escala = 1,
  autoGiro = true,
  pausado = false,
  etiqueta,
  className,
}: Maceta3DProps) {
  const escenaRef = useRef<HTMLDivElement>(null)
  const mundoRef = useRef<HTMLDivElement>(null)
  const plantaRef = useRef<HTMLDivElement>(null)
  const carasRef = useRef<(HTMLSpanElement | null)[]>([])
  const brillosRef = useRef<(HTMLSpanElement | null)[]>([])
  const estadoRef = useRef({
    angulo: -20,
    vel: 0,
    arrastrando: false,
    x: 0,
    quietoHasta: 0,
    brisa: 0,
    brisaObjetivo: 0,
    auto: autoGiro && !pausado,
  })

  useEffect(() => {
    estadoRef.current.auto = autoGiro && !pausado
  }, [autoGiro, pausado])

  const pintar = useCallback(() => {
    const e = estadoRef.current
    const mundo = mundoRef.current
    if (mundo) mundo.style.transform = `rotateX(-13deg) rotateY(${e.angulo}deg)`
    for (let i = 0; i < CARAS; i++) {
      const phi = ((e.angulo + i * PASO - LUZ) * Math.PI) / 180
      const c = Math.cos(phi)
      const sombra = carasRef.current[i]
      if (sombra) sombra.style.opacity = String(((1 - c) / 2) * 0.62)
      const brillo = brillosRef.current[i]
      if (brillo) brillo.style.opacity = String(Math.pow(Math.max(0, Math.cos(phi + 0.35)), 14))
    }
    if (plantaRef.current) plantaRef.current.style.setProperty("--brisa", e.brisa.toFixed(3))
  }, [])

  const despertar = useBucle(escenaRef, (dt) => {
    const e = estadoRef.current
    const k = dt / 16.7
    let activo = false
    if (e.arrastrando) {
      activo = true
    } else if (Math.abs(e.vel) > 0.04) {
      e.angulo += e.vel * k
      e.vel *= Math.pow(0.93, k)
      activo = true
    } else if (e.auto && performance.now() > e.quietoHasta) {
      e.angulo += 0.22 * k
      activo = true
    }
    // La planta se inclina con la velocidad del giro, como si hubiera viento.
    e.brisaObjetivo = Math.max(-1, Math.min(1, -e.vel / 5))
    e.brisa += (e.brisaObjetivo - e.brisa) * Math.min(1, 0.12 * k)
    if (Math.abs(e.brisa - e.brisaObjetivo) > 0.002) activo = true
    pintar()
    return activo
  })

  // Repintar y reanudar cuando cambian las opciones o la pausa.
  useEffect(() => {
    pintar()
    despertar()
  }, [plantaId, macetaId, colorId, escala, autoGiro, pausado, pintar, despertar])

  function empujar(grados: number) {
    const e = estadoRef.current
    e.vel = grados / 14
    e.quietoHasta = performance.now() + 2500
    despertar()
  }

  return (
    <div className={cn("relative select-none", className)}>
      <div
        ref={escenaRef}
        className="vt-m3d-escena"
        role="img"
        aria-roledescription="modelo 3D"
        aria-label={`${etiqueta}. Arrastrá para girarla o usá las flechas del teclado.`}
        tabIndex={0}
        onKeyDown={(ev) => {
          if (ev.key === "ArrowLeft") {
            ev.preventDefault()
            empujar(-40)
          } else if (ev.key === "ArrowRight") {
            ev.preventDefault()
            empujar(40)
          }
        }}
        onPointerDown={(ev) => {
          const e = estadoRef.current
          e.arrastrando = true
          e.x = ev.clientX
          e.vel = 0
          ev.currentTarget.setPointerCapture(ev.pointerId)
          despertar()
        }}
        onPointerMove={(ev) => {
          const e = estadoRef.current
          if (!e.arrastrando) return
          const dx = ev.clientX - e.x
          e.x = ev.clientX
          e.angulo += dx * 0.55
          e.vel = dx * 0.55
        }}
        onPointerUp={() => {
          const e = estadoRef.current
          e.arrastrando = false
          e.quietoHasta = performance.now() + 2500
          despertar()
        }}
        onPointerCancel={() => {
          estadoRef.current.arrastrando = false
        }}
      >
        <span className="vt-m3d-piso" aria-hidden="true" />
        <ModeloMaceta
          plantaId={plantaId}
          macetaId={macetaId}
          colorId={colorId}
          escala={escala}
          mundoRef={mundoRef}
          plantaRef={plantaRef}
          carasRef={carasRef}
          brillosRef={brillosRef}
        />
      </div>
      <div className="mt-2 flex items-center justify-center gap-2">
        <button
          type="button"
          className="vt-icono size-10 border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
          onClick={() => empujar(-45)}
          aria-label="Girar a la izquierda"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>
        <span className="text-xs font-bold text-[var(--vt-tinta-70)]" aria-hidden="true">
          Arrastrá para girar
        </span>
        <button
          type="button"
          className="vt-icono size-10 border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
          onClick={() => empujar(45)}
          aria-label="Girar a la derecha"
        >
          <RotateCw className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/** La geometría: solo se vuelve a renderizar si cambian planta, maceta o tamaño. */
const ModeloMaceta = memo(function ModeloMaceta({
  plantaId,
  macetaId,
  colorId,
  escala,
  mundoRef,
  plantaRef,
  carasRef,
  brillosRef,
}: {
  plantaId: string
  macetaId: string
  colorId?: string
  escala: number
  mundoRef: React.RefObject<HTMLDivElement | null>
  plantaRef: React.RefObject<HTMLDivElement | null>
  carasRef: React.RefObject<(HTMLSpanElement | null)[]>
  brillosRef: React.RefObject<(HTMLSpanElement | null)[]>
}) {
  const est = estiloMaceta(macetaId, colorId)
  const alto = 124 * escala
  const rArriba = 72 * escala
  const rAbajo = 53 * escala
  const rMedio = (rArriba + rAbajo) / 2
  const inclinacion = (Math.atan((rArriba - rAbajo) / alto) * 180) / Math.PI
  const largo = Math.hypot(alto, rArriba - rAbajo)
  const anchoCara = 2 * rArriba * Math.tan(Math.PI / CARAS) + 1.2
  const k = rAbajo / rArriba
  const recorte = `polygon(0 0, 100% 0, ${50 + k * 50}% 100%, ${50 - k * 50}% 100%)`
  const planta = 186 * Math.min(1.12, escala * 1.04)

  return (
    <div
      ref={mundoRef}
      className="vt-m3d-mundo"
      style={{ top: `calc(100% - ${alto / 2 + 34}px)` }}
    >
      {/* Plato (solo barro) */}
      {macetaId === "barro" && (
        <span
          className="vt-m3d-disco"
          style={{
            width: rAbajo * 2 + 26,
            height: rAbajo * 2 + 26,
            background: "#c9683c",
            transform: `translate(-50%, -50%) translateY(${alto / 2 + 2}px) rotateX(90deg)`,
          }}
        />
      )}
      {/* Fondo de la maceta */}
      <span
        className="vt-m3d-disco"
        style={{
          width: rAbajo * 2,
          height: rAbajo * 2,
          background: est.borde,
          transform: `translate(-50%, -50%) translateY(${alto / 2}px) rotateX(90deg)`,
        }}
      />
      {/* Caras */}
      {Array.from({ length: CARAS }, (_, i) => (
        <span
          key={i}
          className="vt-m3d-cara"
          style={{
            width: anchoCara,
            height: largo,
            marginLeft: -anchoCara / 2,
            marginTop: -largo / 2,
            clipPath: recorte,
            background: `linear-gradient(to bottom, ${est.borde} 0 15%, #1f2a22 15% calc(15% + 2px), ${est.cuerpo} calc(15% + 2px))`,
            transform: `rotateY(${i * PASO}deg) translateZ(${rMedio}px) rotateX(${-inclinacion}deg)`,
          }}
        >
          <Decoracion i={i} macetaId={macetaId} />
          <span
            ref={(el) => {
              carasRef.current[i] = el
            }}
            className="vt-m3d-oscuro"
          />
          <span
            ref={(el) => {
              brillosRef.current[i] = el
            }}
            className="vt-m3d-brillo"
            style={{ "--brillo": est.brillo } as React.CSSProperties}
          />
        </span>
      ))}
      {/* Tierra */}
      <span
        className="vt-m3d-disco vt-m3d-tierra"
        style={{
          width: rArriba * 2 - 6,
          height: rArriba * 2 - 6,
          transform: `translate(-50%, -50%) translateY(${-alto / 2 + 9}px) rotateX(90deg)`,
        }}
      />
      {/* Planta: tres planos cruzados con brisa */}
      <div className="vt-m3d-planta" style={{ transform: `translateY(${-alto / 2 + 10}px)` }}>
        <div ref={plantaRef} className="vt-brisa">
          <div className="vt-mece vt-anim">
            {[0, 60, 120].map((g) => (
              <div
                key={g}
                className="vt-m3d-plano"
                style={{
                  width: planta,
                  height: planta,
                  marginLeft: -planta / 2,
                  marginTop: -planta,
                  transform: `rotateY(${g}deg)`,
                }}
              >
                <PlantaDibujo id={plantaId} className="size-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

/** Detalles pintados en algunas caras: la carita de la cerámica, nervaduras del vivero. */
function Decoracion({ i, macetaId }: { i: number; macetaId: string }) {
  if (macetaId === "ceramica") {
    if (i === 0)
      return (
        <svg viewBox="0 0 30 60" className="vt-m3d-deco" aria-hidden="true">
          <path d="M5 34 q10 10 20 0" stroke="#1f2a22" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      )
    if (i === 1 || i === CARAS - 1)
      return (
        <svg viewBox="0 0 30 60" className="vt-m3d-deco" aria-hidden="true">
          <ellipse cx={i === 1 ? 10 : 20} cy="25" rx="3.2" ry="4.2" fill="#1f2a22" />
        </svg>
      )
    if (i === 2 || i === CARAS - 2)
      return (
        <svg viewBox="0 0 30 60" className="vt-m3d-deco" aria-hidden="true">
          <ellipse cx={i === 2 ? 10 : 20} cy="38" rx="6" ry="3.5" fill="#ff7aa2" opacity="0.7" />
        </svg>
      )
    if (i === 8)
      return (
        <svg viewBox="0 0 30 60" className="vt-m3d-deco" aria-hidden="true">
          <path d="M15 22 l2.4 5 5.4.6-4 3.7 1.1 5.3-4.9-2.7-4.9 2.7 1.1-5.3-4-3.7 5.4-.6Z" fill="#ffd84d" stroke="#1f2a22" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      )
    return null
  }
  if (macetaId === "barro" && i % 4 === 0)
    return (
      <svg viewBox="0 0 30 60" className="vt-m3d-deco" aria-hidden="true">
        <path d="M15 24 c-6 6-6 14 0 18 c6-4 6-12 0-18Z" fill="#f4a57a" stroke="#1f2a22" strokeWidth="1.6" />
      </svg>
    )
  if (macetaId === "vivero")
    return <span className="vt-m3d-nervio" aria-hidden="true" />
  return null
}
