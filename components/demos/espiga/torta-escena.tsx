"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw, RotateCw } from "lucide-react"

import {
  detalleTorta,
  type ConfigTorta,
} from "@/components/demos/espiga/contenido"
import {
  estaQuieto,
  suscribirQuieto,
} from "@/components/demos/espiga/estado"
import { crearBucle } from "@/components/demos/espiga/tres-d"

const CARAS = 24
const ALTO = 62
const TABLA = 10

const radiosPorPisos: Record<number, number[]> = {
  1: [122],
  2: [126, 88],
  3: [130, 98, 66],
}

/** Puntos repartidos en un círculo, para copos, frutillas y velas. */
const enCirculo = (n: number, desfase = 0) =>
  Array.from({ length: n }, (_, i) => desfase + (i * 360) / n)

type Estilo = React.CSSProperties & Record<`--${string}`, string | number>

function Piso({
  k,
  radio,
  lado,
  tapa,
  confites,
  copos,
}: {
  k: number
  radio: number
  lado: string
  tapa: string
  confites: boolean
  copos: boolean
}) {
  const ancho = 2 * radio * Math.tan(Math.PI / CARAS) + 0.9
  const y = -(TABLA + ALTO * (k + 0.5))
  return (
    <div className="piso" style={{ transform: `translateY(${y}px)` }}>
      <div className="piso-anim">
        {enCirculo(CARAS).map((a) => (
          <div
            key={a}
            className={confites ? "cara cara-confites" : "cara"}
            style={
              {
                width: ancho,
                height: ALTO,
                marginLeft: -ancho / 2,
                marginTop: -ALTO / 2,
                backgroundColor: lado,
                "--a": a,
                transform: `rotateY(${a}deg) translateZ(${radio}px)`,
              } as Estilo
            }
          />
        ))}
        <div
          className="tapa"
          style={{
            width: radio * 2,
            height: radio * 2,
            marginLeft: -radio,
            marginTop: -radio,
            background: `radial-gradient(circle at 40% 38%, ${tapa}, ${lado} 115%)`,
            transform: `translateY(${-ALTO / 2}px) rotateX(90deg)`,
          }}
        />
        {copos &&
          enCirculo(Math.round(radio / 7), k * 7).map((a) => (
            <span
              key={`c${a}`}
              className="cartelera copo"
              style={
                { "--a": a, "--r": radio - 6, "--y": -ALTO / 2 - 5 } as Estilo
              }
            />
          ))}
      </div>
    </div>
  )
}

/** La torta en CSS 3D: se gira arrastrando, con flechas o con botones. */
export function TortaEscena({ config }: { config: ConfigTorta }) {
  const escenaRef = useRef<HTMLDivElement>(null)
  const pausadoRef = useRef(false)
  const despertarRef = useRef<() => void>(() => {})
  const girarRef = useRef<(grados: number) => void>(() => {})
  const [pausado, setPausado] = useState(false)

  const d = detalleTorta(config)
  const radios = radiosPorPisos[config.pisos]
  const arriba = radios[radios.length - 1]
  const yArriba = -(TABLA + ALTO * radios.length)
  const tiene = (x: string) => config.deco.includes(x as never)

  useEffect(() => {
    const el = escenaRef.current
    if (!el) return
    let giro = 25
    let vel = 0
    let objetivo: number | null = null
    let arrastrando = false
    let ultimoX = 0
    let ultimoT = 0

    const escribir = () => el.style.setProperty("--giro", giro.toFixed(2))
    escribir()

    const bucle = crearBucle(el, (dt) => {
      if (arrastrando) {
        escribir()
        return true
      }
      if (objetivo !== null) {
        const resta = objetivo - giro
        giro += resta * Math.min(1, dt * 0.01)
        if (Math.abs(resta) < 0.15) {
          giro = objetivo
          objetivo = null
        }
      } else if (Math.abs(vel) > 0.004) {
        giro += vel * dt
        vel *= Math.pow(0.93, dt / 16)
      } else if (!pausadoRef.current && !estaQuieto()) {
        giro += 0.014 * dt
      } else {
        escribir()
        return false
      }
      escribir()
      return true
    })

    despertarRef.current = () => bucle.despertar()
    girarRef.current = (grados) => {
      vel = 0
      objetivo = (objetivo ?? giro) + grados
      bucle.despertar()
    }

    const bajar = (e: PointerEvent) => {
      if (e.button !== 0) return
      arrastrando = true
      objetivo = null
      vel = 0
      ultimoX = e.clientX
      ultimoT = e.timeStamp
      el.setPointerCapture(e.pointerId)
      el.dataset.arrastrando = ""
      bucle.despertar()
    }
    const mover = (e: PointerEvent) => {
      if (!arrastrando) return
      const dx = e.clientX - ultimoX
      const dtE = Math.max(1, e.timeStamp - ultimoT)
      giro += dx * 0.55
      vel = (dx * 0.55) / dtE
      ultimoX = e.clientX
      ultimoT = e.timeStamp
    }
    const soltar = (e: PointerEvent) => {
      if (!arrastrando) return
      arrastrando = false
      delete el.dataset.arrastrando
      if (e.timeStamp - ultimoT > 80) vel = 0
      vel = Math.max(-1.2, Math.min(1.2, vel))
      bucle.despertar()
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault()
        girarRef.current(e.key === "ArrowLeft" ? -30 : 30)
      }
    }

    el.addEventListener("pointerdown", bajar)
    el.addEventListener("pointermove", mover)
    el.addEventListener("pointerup", soltar)
    el.addEventListener("pointercancel", soltar)
    el.addEventListener("keydown", tecla)
    const dejarDeOir = suscribirQuieto(() => bucle.despertar())

    return () => {
      bucle.destruir()
      dejarDeOir()
      el.removeEventListener("pointerdown", bajar)
      el.removeEventListener("pointermove", mover)
      el.removeEventListener("pointerup", soltar)
      el.removeEventListener("pointercancel", soltar)
      el.removeEventListener("keydown", tecla)
    }
  }, [])

  function alternarPausa() {
    const nuevo = !pausado
    pausadoRef.current = nuevo
    setPausado(nuevo)
    despertarRef.current()
  }

  return (
    <div>
      <div
        ref={escenaRef}
        className="torta-escena"
        tabIndex={0}
        role="group"
        aria-roledescription="modelo 3D"
        aria-label={`Vista 3D de tu torta: ${d.lineas.join(", ")}. Arrastrá de costado o usá las flechas del teclado para girarla.`}
      >
        <div className="torta-sombra" aria-hidden="true" />
        <div
          className="torta-escala"
          aria-hidden="true"
          style={{ "--esc": config.pisos === 3 ? 0.86 : 1 } as Estilo}
        >
          <div className="torta-giro">
            <div
              className="torta-plato"
              style={{
                width: (radios[0] + 30) * 2,
                height: (radios[0] + 30) * 2,
                marginLeft: -(radios[0] + 30),
                marginTop: -(radios[0] + 30),
              }}
            />
            {radios.map((r, k) => (
              <Piso
                key={k}
                k={k}
                radio={r}
                lado={d.cobertura.lado}
                tapa={d.cobertura.tapa}
                confites={tiene("confites")}
                copos={tiene("copos")}
              />
            ))}
            <div
              className="piso"
              style={{ transform: `translateY(${yArriba}px)` }}
            >
              {tiene("frutillas") &&
                enCirculo(7, 10).map((a) => (
                  <span
                    key={`f${a}`}
                    className="cartelera frutilla"
                    style={
                      { "--a": a, "--r": arriba * 0.6, "--y": -9 } as Estilo
                    }
                  />
                ))}
              {tiene("velas") &&
                enCirculo(3, 30).map((a) => (
                  <span
                    key={`v${a}`}
                    className="cartelera vela"
                    style={
                      { "--a": a, "--r": arriba * 0.28, "--y": -24 } as Estilo
                    }
                  >
                    <span className="vela-llama" />
                  </span>
                ))}
              {tiene("cartel") && config.cartel.trim() && (
                <span
                  className="cartelera cartel-torta tiza"
                  style={{ "--a": 180, "--r": arriba * 0.3, "--y": -30 } as Estilo}
                >
                  {config.cartel.trim()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => girarRef.current(-45)}
          className="boton-borde rounded-md px-3"
        >
          <RotateCcw className="size-5" aria-hidden="true" />
          Girar
          <span className="sr-only"> la torta a la izquierda</span>
        </button>
        <button
          type="button"
          onClick={alternarPausa}
          aria-pressed={pausado}
          className="boton-borde rounded-md px-3"
        >
          {pausado ? (
            <Play className="size-5" aria-hidden="true" />
          ) : (
            <Pause className="size-5" aria-hidden="true" />
          )}
          {pausado ? "Que gire sola" : "Frenar el giro"}
        </button>
        <button
          type="button"
          onClick={() => girarRef.current(45)}
          className="boton-borde rounded-md px-3"
        >
          Girar
          <RotateCw className="size-5" aria-hidden="true" />
          <span className="sr-only"> la torta a la derecha</span>
        </button>
      </div>
    </div>
  )
}
