"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import {
  CreditCard,
  Globe as GlobeIcon,
  MessageCircle,
  Move3d,
  Search,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Escena 3D interactiva de la portada: el globo (cobe, WebGL) con seis
 * satélites que orbitan en dos órbitas inclinadas y pasan por delante y por
 * detrás del planeta.
 *
 * - Se gira arrastrando (mouse: en los dos ejes; dedo: solo horizontal, así
 *   el scroll vertical de la página sigue funcionando), con inercia.
 * - Con el teclado: flechas cuando la escena tiene foco.
 * - Pasar el mouse por un satélite lo destaca y frena las órbitas; tocarlo
 *   lo fija y muestra qué significa.
 *
 * Todo se calcula en el mismo cuadro que dibuja el globo (onRender de cobe):
 * proyección en perspectiva de cada satélite y de cada órbita. Lo que queda
 * detrás del planeta va en una capa debajo del lienzo del globo (que es
 * opaco), así el planeta lo tapa sin cálculos extra. La escena se pausa
 * fuera de pantalla y con la pestaña oculta.
 */

type Satelite = {
  Icono: LucideIcon
  titulo: string
  descripcion: string
  orbita: 0 | 1
  /** Ángulo inicial en la órbita, en radianes. */
  fase: number
}

const satelites: Satelite[] = [
  {
    Icono: Smartphone,
    titulo: "Perfecta en el celular",
    descripcion:
      "Se adapta a cualquier pantalla: celular, tablet o computadora.",
    orbita: 0,
    fase: 0,
  },
  {
    Icono: Search,
    titulo: "Aparece en Google",
    descripcion:
      "Preparada para que te encuentren cuando buscan tu rubro y tu barrio.",
    orbita: 0,
    fase: (Math.PI * 2) / 3,
  },
  {
    Icono: MessageCircle,
    titulo: "Botón de WhatsApp",
    descripcion: "Un toque y te escriben directo, con el mensaje ya armado.",
    orbita: 0,
    fase: (Math.PI * 4) / 3,
  },
  {
    Icono: CreditCard,
    titulo: "Pagos online",
    descripcion: "Cobrá con Mercado Pago o tarjeta desde tu propia página.",
    orbita: 1,
    fase: Math.PI / 3,
  },
  {
    Icono: Zap,
    titulo: "Carga en segundos",
    descripcion: "Imágenes y código optimizados, incluso con datos móviles.",
    orbita: 1,
    fase: Math.PI,
  },
  {
    Icono: GlobeIcon,
    titulo: "Dominio propio",
    descripcion: "tunegocio.com.uy a tu nombre, con correo profesional.",
    orbita: 1,
    fase: (Math.PI * 5) / 3,
  },
]

/** Órbitas: radio en fracción del ancho de la escena, inclinación y giro. */
const orbitas = [
  { radio: 0.45, inclinacion: 1.2, nodo: 0.35, velocidad: 0.22 },
  { radio: 0.37, inclinacion: -1.0, nodo: -0.55, velocidad: -0.32 },
]

/** El globo de cobe ocupa el 76 % de la escena y su esfera el 80 % del lienzo. */
const LIENZO = 0.76
const PERSPECTIVA = 2.4
const SEGMENTOS = 96

const configGlobo: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.25,
  dark: 1,
  diffuse: 1.4,
  mapSamples: 12000,
  mapBrightness: 5,
  baseColor: [0.22, 0.2, 0.45],
  markerColor: [57 / 255, 213 / 255, 255 / 255],
  glowColor: [0.3, 0.22, 0.7],
  markers: [
    { location: [-34.9011, -56.1645], size: 0.12 }, // Montevideo
    { location: [-34.6037, -58.3816], size: 0.05 }, // Buenos Aires
    { location: [-23.5505, -46.6333], size: 0.05 }, // São Paulo
    { location: [-33.4489, -70.6693], size: 0.04 }, // Santiago
    { location: [40.4168, -3.7038], size: 0.04 }, // Madrid
    { location: [25.7617, -80.1918], size: 0.04 }, // Miami
  ],
}

/** Punto de una órbita en 3D (unidades: fracción del ancho), ya rotado. */
function punto(
  o: (typeof orbitas)[number],
  a: number,
  giro: number,
  inclinacionVista: number
) {
  // Círculo en el plano horizontal.
  let x = o.radio * Math.cos(a)
  let y = 0
  let z = o.radio * Math.sin(a)
  // Inclinación de la órbita (eje X) y orientación del nodo (eje Z).
  const ci = Math.cos(o.inclinacion)
  const si = Math.sin(o.inclinacion)
  ;[y, z] = [y * ci - z * si, y * si + z * ci]
  const cn_ = Math.cos(o.nodo)
  const sn = Math.sin(o.nodo)
  ;[x, y] = [x * cn_ - y * sn, x * sn + y * cn_]
  // Giro de la escena (eje Y) e inclinación de la vista (eje X).
  const cg = Math.cos(giro)
  const sg = Math.sin(giro)
  ;[x, z] = [x * cg + z * sg, -x * sg + z * cg]
  const cv = Math.cos(-inclinacionVista)
  const sv = Math.sin(-inclinacionVista)
  ;[y, z] = [y * cv - z * sv, y * sv + z * cv]
  return { x, y, z }
}

export function GloboOrbital({ className }: { className?: string }) {
  const escenaRef = useRef<HTMLDivElement>(null)
  const lienzoRef = useRef<HTMLCanvasElement>(null)
  const atrasRef = useRef<SVGSVGElement>(null)
  const adelanteRef = useRef<SVGSVGElement>(null)
  const satRefs = useRef<Array<HTMLButtonElement | null>>([])

  // Satélite bajo el mouse y satélite fijado con un clic.
  const [encima, setEncima] = useState<number | null>(null)
  const [fijado, setFijado] = useState<number | null>(null)
  const destacadoRef = useRef<number | null>(null)
  const destacado = encima ?? fijado
  useEffect(() => {
    destacadoRef.current = destacado
  }, [destacado])

  // Estado de la interacción, fuera de React para no re-renderizar en cada cuadro.
  const estado = useRef({
    giro: 0,
    inclinacion: 0,
    velGiro: 0,
    velInclinacion: 0,
    arrastrando: false,
    tipo: "mouse",
    ultX: 0,
    ultY: 0,
    angulos: satelites.map((s) => s.fase),
    ultimo: 0,
    ancho: 0,
  })

  useEffect(() => {
    const escena = escenaRef.current
    const lienzo = lienzoRef.current
    const atras = atrasRef.current
    const adelante = adelanteRef.current
    if (!escena || !lienzo || !atras || !adelante) return
    const e = estado.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const pathAtras = atras.querySelectorAll("path")
    const pathAdelante = adelante.querySelectorAll("path")

    const medir = () => {
      e.ancho = escena.offsetWidth
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(escena)

    const globo = createGlobe(lienzo, {
      ...configGlobo,
      devicePixelRatio: dpr,
      width: e.ancho * LIENZO * dpr,
      height: e.ancho * LIENZO * dpr,
      onRender: (s) => {
        const ahora = performance.now()
        const dt = e.ultimo ? Math.min(0.05, (ahora - e.ultimo) / 1000) : 1 / 60
        e.ultimo = ahora
        const W = e.ancho
        const lento = destacadoRef.current !== null

        // Giro automático + inercia del arrastre.
        if (!e.arrastrando) {
          e.giro += (lento ? 0.03 : 0.12) * dt + e.velGiro
          e.inclinacion += e.velInclinacion
          e.velGiro *= 0.94
          e.velInclinacion *= 0.9
          // La inclinación vuelve despacio a su lugar.
          e.inclinacion *= 0.985
        }
        e.inclinacion = Math.max(-0.55, Math.min(0.55, e.inclinacion))

        s.phi = e.giro
        s.theta = 0.25 + e.inclinacion
        s.width = W * LIENZO * dpr
        s.height = W * LIENZO * dpr

        const cx = W / 2
        const cy = W / 2
        const radioGlobo = W * LIENZO * 0.4

        // Órbitas: tramos de atrás (debajo del globo) y de adelante (encima).
        orbitas.forEach((o, k) => {
          let dA = ""
          let dF = ""
          let previo: boolean | null = null
          for (let i = 0; i <= SEGMENTOS; i++) {
            const a = (i / SEGMENTOS) * Math.PI * 2
            const p = punto(o, a, e.giro, e.inclinacion)
            const esc = PERSPECTIVA / (PERSPECTIVA - p.z)
            const X = (cx + p.x * W * esc).toFixed(1)
            const Y = (cy + p.y * W * esc).toFixed(1)
            const frente = p.z >= 0
            if (frente) {
              dF += `${previo === true ? "L" : "M"}${X} ${Y}`
            } else {
              dA += `${previo === false ? "L" : "M"}${X} ${Y}`
            }
            previo = frente
          }
          pathAtras[k]?.setAttribute("d", dA)
          pathAdelante[k]?.setAttribute("d", dF)
        })

        // Satélites.
        satelites.forEach((sat, i) => {
          const el = satRefs.current[i]
          if (!el) return
          const o = orbitas[sat.orbita]
          e.angulos[i] += o.velocidad * dt * (lento ? 0.25 : 1)
          const p = punto(o, e.angulos[i], e.giro, e.inclinacion)
          const esc = PERSPECTIVA / (PERSPECTIVA - p.z)
          const X = cx + p.x * W * esc
          const Y = cy + p.y * W * esc
          const frente = p.z >= 0
          // Detrás del planeta: va a la capa de abajo (el globo lo tapa).
          const tapado = !frente && Math.hypot(X - cx, Y - cy) < radioGlobo
          const elegido = destacadoRef.current === i
          const escala = esc * (elegido ? 1.25 : 1)
          el.style.transform = `translate(${X.toFixed(1)}px, ${Y.toFixed(1)}px) translate(-50%, -50%) scale(${escala.toFixed(3)})`
          el.style.zIndex = frente || elegido ? "30" : "5"
          el.style.opacity = elegido
            ? "1"
            : frente
              ? "1"
              : tapado
                ? "0.25"
                : "0.55"
          el.style.pointerEvents = tapado ? "none" : "auto"
        })
      },
    })

    // Pausa fuera de pantalla o con la pestaña oculta.
    let visible = true
    const actualizar = () => globo.toggle(visible && !document.hidden)
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      actualizar()
    })
    io.observe(escena)
    document.addEventListener("visibilitychange", actualizar)
    const t = window.setTimeout(() => (lienzo.style.opacity = "1"), 0)

    return () => {
      window.clearTimeout(t)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", actualizar)
      globo.destroy()
    }
  }, [])

  // Arrastre con puntero (mouse, dedo o lápiz).
  function alBajar(ev: React.PointerEvent) {
    if ((ev.target as HTMLElement).closest("button")) return
    const e = estado.current
    e.arrastrando = true
    e.tipo = ev.pointerType
    e.ultX = ev.clientX
    e.ultY = ev.clientY
    e.velGiro = 0
    e.velInclinacion = 0
    ;(ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId)
  }
  function alMover(ev: React.PointerEvent) {
    const e = estado.current
    if (!e.arrastrando) return
    const dx = ev.clientX - e.ultX
    const dy = ev.clientY - e.ultY
    e.ultX = ev.clientX
    e.ultY = ev.clientY
    e.velGiro = dx * 0.006
    e.giro += e.velGiro
    // Con el dedo solo se gira en horizontal, para no trabar el scroll.
    if (e.tipo === "mouse" || e.tipo === "pen") {
      e.velInclinacion = dy * 0.004
      e.inclinacion += e.velInclinacion
    }
  }
  function alSoltar() {
    estado.current.arrastrando = false
  }
  function alTeclear(ev: React.KeyboardEvent) {
    const e = estado.current
    if (ev.key === "ArrowLeft") e.velGiro = -0.06
    else if (ev.key === "ArrowRight") e.velGiro = 0.06
    else if (ev.key === "ArrowUp") e.velInclinacion = -0.03
    else if (ev.key === "ArrowDown") e.velInclinacion = 0.03
    else return
    ev.preventDefault()
  }

  const info = destacado !== null ? satelites[destacado] : null

  return (
    <div className={cn("relative", className)}>
      <div
        ref={escenaRef}
        role="group"
        aria-roledescription="escena 3D"
        aria-label="Globo interactivo con lo que incluye cada página. Arrastrá o usá las flechas para girarlo."
        tabIndex={0}
        onPointerDown={alBajar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        onKeyDown={alTeclear}
        className="relative aspect-square w-full cursor-grab touch-pan-y select-none focus-visible:outline-none active:cursor-grabbing"
      >
        {/* Órbitas, tramo de atrás (debajo del globo). */}
        <svg
          ref={atrasRef}
          className="pointer-events-none absolute inset-0 z-[5] size-full overflow-visible"
          aria-hidden="true"
        >
          <path
            fill="none"
            stroke="rgba(245,247,255,0.10)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <path
            fill="none"
            stroke="rgba(245,247,255,0.10)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        </svg>

        {/* Globo: el lienzo es opaco sobre la esfera y tapa lo de atrás. */}
        <canvas
          ref={lienzoRef}
          className="pointer-events-none absolute inset-[12%] z-[20] size-[76%] opacity-0 transition-opacity duration-700"
          aria-hidden="true"
        />

        {/* Órbitas, tramo de adelante (encima del globo). */}
        <svg
          ref={adelanteRef}
          className="pointer-events-none absolute inset-0 z-[25] size-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="orbita-luz" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#39d5ff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#7c5cff" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#orbita-luz)" strokeWidth="1.2" />
          <path fill="none" stroke="url(#orbita-luz)" strokeWidth="1.2" />
        </svg>

        {/* Satélites: botones con su significado. */}
        {satelites.map((s, i) => {
          const activo = destacado === i
          return (
            <button
              key={s.titulo}
              ref={(el) => {
                satRefs.current[i] = el
              }}
              type="button"
              aria-label={`${s.titulo}: ${s.descripcion}`}
              aria-pressed={fijado === i}
              onPointerEnter={(ev) =>
                ev.pointerType === "mouse" && setEncima(i)
              }
              onPointerLeave={() => setEncima(null)}
              onFocus={() => setEncima(i)}
              onBlur={() => setEncima(null)}
              onClick={() => setFijado(fijado === i ? null : i)}
              className={cn(
                "vidrio absolute top-0 left-0 flex size-11 cursor-pointer items-center justify-center rounded-full text-[var(--estrella)] transition-[box-shadow,color] duration-300 will-change-transform focus-visible:outline-none",
                activo
                  ? "text-[var(--cian)] shadow-[0_0_0_2px_rgba(57,213,255,0.7),0_0_36px_-2px_rgba(57,213,255,0.9)]"
                  : "shadow-[0_0_24px_-4px_rgba(57,213,255,0.6)]"
              )}
            >
              <s.Icono
                className={s.orbita === 0 ? "size-5" : "size-4"}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>

      {/* Ficha del satélite destacado, o la ayuda de uso. */}
      <div
        className="hud pointer-events-none absolute bottom-[2%] left-0 z-40 max-w-[15rem] rounded-xl px-4 py-3"
        aria-live="polite"
      >
        {info ? (
          <>
            <p className="mono text-[10px] tracking-widest text-[var(--cian)] uppercase">
              SAT-{String((destacado ?? 0) + 1).padStart(2, "0")}
              {fijado !== null && " · fijado"}
            </p>
            <p className="display-md mt-1 text-sm">{info.titulo}</p>
            <p className="mt-1 text-xs leading-snug text-[var(--estrella-70)]">
              {info.descripcion}
            </p>
          </>
        ) : (
          <p className="mono flex items-center gap-2 text-[10px] tracking-wider text-[var(--estrella-45)] uppercase">
            <Move3d
              className="size-3.5 text-[var(--cian)]"
              aria-hidden="true"
            />
            Arrastrá para girar · tocá un satélite
          </p>
        )}
      </div>
    </div>
  )
}
