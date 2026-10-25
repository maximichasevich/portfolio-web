"use client"

import { useEffect, useRef, useState } from "react"
import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Sun,
} from "lucide-react"

import "./laboratorio.css"
import { bucleVisible, type Bucle } from "@/components/demos/faro/utiles"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Geometría (en metros). El terreno mide 26 × 20 m; el norte es +y,   */
/* es decir, la fachada vidriada mira hacia quien observa.             */
/* ------------------------------------------------------------------ */

type Categoria = "estructura" | "muros" | "cubierta"
type Plano = {
  c: Categoria
  /** Nivel para la vista explotada (0 = losa de apoyo). */
  n: number
  /** h: horizontal · x: muro a lo largo de x · y: muro a lo largo de y */
  t: "h" | "x" | "y"
  x: number
  y: number
  z: number
  /** Largo del plano. */
  a: number
  /** Profundidad (horizontal) o altura (muro). */
  b: number
  k: "losa" | "macizo" | "vidrio" | "ventana" | "columna" | "techo"
}

const TERRENO = { a: 26, b: 20 }
const CENTRO = { x: 13, y: 8.2 }

const columnas: Plano[] = [5, 9.67, 14.33, 19].flatMap((x) =>
  [4, 12].flatMap((y): Plano[] => [
    { c: "estructura", n: 1, t: "x", x: x - 0.13, y, z: 0, a: 0.26, b: 3, k: "columna" },
    { c: "estructura", n: 1, t: "y", x, y: y - 0.13, z: 0, a: 0.26, b: 3, k: "columna" },
  ])
)

const planos: Plano[] = [
  // Estructura: losa de apoyo, columnas y entrepiso.
  { c: "estructura", n: 0, t: "h", x: 5, y: 4, z: 0.04, a: 14, b: 8, k: "losa" },
  ...columnas,
  { c: "estructura", n: 2, t: "h", x: 5, y: 4, z: 3.05, a: 16, b: 8, k: "losa" },
  // Muros de planta baja: maciza al sur y a los lados, vidriada al norte.
  { c: "muros", n: 1, t: "x", x: 5, y: 4, z: 0, a: 14, b: 3, k: "macizo" },
  { c: "muros", n: 1, t: "y", x: 5, y: 4, z: 0, a: 8, b: 3, k: "macizo" },
  { c: "muros", n: 1, t: "y", x: 19, y: 4, z: 0, a: 8, b: 3, k: "ventana" },
  { c: "muros", n: 1, t: "x", x: 5, y: 12, z: 0, a: 14, b: 3, k: "vidrio" },
  // Muros de planta alta: un volumen que vuela 2 m hacia el este.
  { c: "muros", n: 3, t: "x", x: 11, y: 4.5, z: 3.1, a: 10, b: 3.1, k: "macizo" },
  { c: "muros", n: 3, t: "y", x: 11, y: 4.5, z: 3.1, a: 6.5, b: 3.1, k: "vidrio" },
  { c: "muros", n: 3, t: "y", x: 21, y: 4.5, z: 3.1, a: 6.5, b: 3.1, k: "macizo" },
  { c: "muros", n: 3, t: "x", x: 11, y: 11, z: 3.1, a: 10, b: 3.1, k: "ventana" },
  // Cubierta con alero de 1,20 m al norte.
  { c: "cubierta", n: 4, t: "h", x: 10.4, y: 3.9, z: 6.25, a: 11.2, b: 8.3, k: "techo" },
]

/** Volúmenes que arrojan sombra (x0, x1, y0, y1, z0, z1). */
const volumenes: [number, number, number, number, number, number][] = [
  [5, 19, 4, 12, 0, 3.1],
  [5, 21, 4, 12, 3, 3.1],
  [11, 21, 4.5, 11, 3.1, 6.25],
  [10.4, 21.6, 3.9, 12.2, 6.25, 6.4],
]

const etiquetasCapa: Record<Categoria, string> = {
  estructura: "Estructura",
  muros: "Muros y aberturas",
  cubierta: "Cubierta",
}

/* ------------------------------------------------------------------ */
/* Sol en Montevideo (34,9° S). Hora de reloj, UTC−3: el mediodía     */
/* solar cae cerca de las 12:45.                                       */
/* ------------------------------------------------------------------ */

type Estacion = "verano" | "equinoccio" | "invierno"
const estaciones: { id: Estacion; nombre: string; fecha: string; decl: number }[] = [
  { id: "verano", nombre: "Verano", fecha: "21 de diciembre", decl: -23.44 },
  { id: "equinoccio", nombre: "Equinoccio", fecha: "21 de marzo", decl: 0 },
  { id: "invierno", nombre: "Invierno", fecha: "21 de junio", decl: 23.44 },
]

const rad = Math.PI / 180
const LAT = -34.9

function sol(hora: number, decl: number) {
  const H = 15 * (hora - 12.75) * rad
  const f = LAT * rad
  const d = decl * rad
  const alt = Math.asin(
    Math.sin(f) * Math.sin(d) + Math.cos(f) * Math.cos(d) * Math.cos(H)
  )
  const desdeSur = Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(f) - Math.tan(d) * Math.cos(f)
  )
  const az = (desdeSur / rad + 180 + 360) % 360
  return { alt: alt / rad, az }
}

const cardinales = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]
const cardinal = (az: number) => cardinales[Math.round(az / 45) % 8]
const horaTexto = (h: number) =>
  `${String(Math.floor(h)).padStart(2, "0")}:${String(
    Math.round((h % 1) * 60)
  ).padStart(2, "0")}`

/** Dirección horizontal hacia el sol, en coordenadas del modelo. */
const haciaSol = (az: number) => ({ x: -Math.sin(az * rad), y: Math.cos(az * rad) })

/** Envolvente convexa (cadena monótona). */
function envolvente(p: [number, number][]) {
  const pts = [...p].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cruz = (o: number[], a: number[], b: number[]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const abajo: [number, number][] = []
  for (const q of pts) {
    while (abajo.length >= 2 && cruz(abajo[abajo.length - 2], abajo[abajo.length - 1], q) <= 0) abajo.pop()
    abajo.push(q)
  }
  const arriba: [number, number][] = []
  for (const q of pts.reverse()) {
    while (arriba.length >= 2 && cruz(arriba[arriba.length - 2], arriba[arriba.length - 1], q) <= 0) arriba.pop()
    arriba.push(q)
  }
  return abajo.slice(0, -1).concat(arriba.slice(0, -1))
}

function recorridoSolar(decl: number) {
  const pts: string[] = []
  for (let h = 4; h <= 22; h += 0.25) {
    const s = sol(h, decl)
    if (s.alt <= 0) continue
    const d = haciaSol(s.az)
    const r = 8 * Math.cos(s.alt * rad)
    pts.push(`${(CENTRO.x + d.x * r).toFixed(2)},${(CENTRO.y + d.y * r).toFixed(2)}`)
  }
  return pts.join(" ")
}

/* ------------------------------------------------------------------ */

type Vista = "axo" | "planta" | "fachada"
const vistas: { id: Vista; nombre: string; rx: number; rz: number }[] = [
  { id: "axo", nombre: "Axonométrica", rx: 58, rz: -34 },
  { id: "planta", nombre: "Planta", rx: 0, rz: 0 },
  { id: "fachada", nombre: "Fachada norte", rx: 90, rz: 0 },
]

const SEPARACION_MAX = 2.4

/**
 * Maqueta axonométrica de una casa hecha con planos CSS 3D, en estilo de
 * dibujo técnico. Se gira arrastrando (con el dedo, solo en horizontal),
 * con las flechas del teclado o con botones; cambia entre vistas, explota
 * sus capas y muestra la sombra real según la hora y la estación.
 */
export default function Maqueta() {
  const escenaRef = useRef<HTMLDivElement>(null)
  const modeloRef = useRef<HTMLDivElement>(null)
  const sombraRef = useRef<SVGGElement>(null)
  const solRef = useRef<SVGGElement>(null)
  const horaRef = useRef<HTMLInputElement>(null)
  const separarRef = useRef<HTMLInputElement>(null)
  const lecturaRef = useRef<HTMLDivElement>(null)
  const bucleRef = useRef<Bucle | null>(null)
  const suaveRef = useRef(0)
  const estadoRef = useRef({
    rx: 58,
    rz: -34,
    vx: 0,
    vz: 0,
    arrastre: false,
    tactil: false,
    px: 0,
    py: 0,
    t: 0,
    girar: true,
    recorrer: false,
    hora: 15.5,
    decl: 23.44,
    tocada: false,
  })

  const [vista, setVista] = useState<Vista | null>("axo")
  const [girando, setGirando] = useState(true)
  const [recorriendo, setRecorriendo] = useState(false)
  const [estacion, setEstacion] = useState<Estacion>("invierno")
  const [capas, setCapas] = useState<Record<Categoria, boolean>>({
    estructura: true,
    muros: true,
    cubierta: true,
  })
  const [tocada, setTocada] = useState(false)

  /* ---- Escritura directa en el DOM (sin re-render) ---- */

  function escribirGiro() {
    const m = modeloRef.current
    const s = estadoRef.current
    if (!m) return
    m.style.setProperty("--rx", `${s.rx.toFixed(2)}deg`)
    m.style.setProperty("--rz", `${s.rz.toFixed(2)}deg`)
  }

  function aplicarSol() {
    const s = estadoRef.current
    const { alt, az } = sol(s.hora, s.decl)
    const g = sombraRef.current
    const marca = solRef.current
    const lectura = lecturaRef.current
    if (!g || !marca || !lectura) return
    const arriba = alt > 0.5
    g.style.opacity = arriba ? "1" : "0"
    marca.style.opacity = arriba ? "1" : "0.25"
    const d = haciaSol(az)
    if (arriba) {
      const largo = 1 / Math.tan(Math.max(alt, 4) * rad)
      const polis = g.querySelectorAll("polygon")
      volumenes.forEach(([x0, x1, y0, y1, z0, z1], i) => {
        const pts: [number, number][] = []
        for (const z of [z0, z1])
          for (const [x, y] of [
            [x0, y0],
            [x1, y0],
            [x1, y1],
            [x0, y1],
          ])
            pts.push([x - d.x * z * largo, y - d.y * z * largo])
        polis[i]?.setAttribute(
          "points",
          envolvente(pts)
            .map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`)
            .join(" ")
        )
      })
    }
    const r = 8 * Math.cos(Math.max(alt, 0) * rad)
    marca.setAttribute(
      "transform",
      `translate(${(CENTRO.x + d.x * r).toFixed(2)} ${(CENTRO.y + d.y * r).toFixed(2)})`
    )
    const [hora, altura, azimut] = lectura.querySelectorAll("[data-dato]")
    hora.textContent = horaTexto(s.hora)
    altura.textContent = arriba ? `${Math.round(alt)}°` : "bajo el horizonte"
    azimut.textContent = `${Math.round(az)}° ${cardinal(az)}`
    const control = horaRef.current
    if (control) {
      control.setAttribute(
        "aria-valuetext",
        `${horaTexto(s.hora)}, sol a ${arriba ? `${Math.round(alt)} grados` : "bajo el horizonte"}`
      )
    }
  }

  function suavizar(ms = 950) {
    const m = modeloRef.current
    if (!m) return
    m.dataset.suave = "true"
    window.clearTimeout(suaveRef.current)
    suaveRef.current = window.setTimeout(() => {
      delete m.dataset.suave
    }, ms)
  }

  /* ---- Bucle: inercia, giro automático y recorrido del sol ---- */

  useEffect(() => {
    const escena = escenaRef.current
    if (!escena) return
    const bucle = bucleVisible(escena, (dt) => {
      const s = estadoRef.current
      let sigue = s.arrastre
      if (!s.arrastre) {
        if (Math.abs(s.vz) > 0.001 || Math.abs(s.vx) > 0.001) {
          s.rz += s.vz * dt
          s.rx = Math.min(90, Math.max(0, s.rx + s.vx * dt))
          const roce = Math.pow(0.92, dt / 16)
          s.vz *= roce
          s.vx *= roce
          sigue = true
        }
        if (s.girar) {
          s.rz += dt * 0.0045
          sigue = true
        }
      }
      if (s.recorrer) {
        s.hora += (dt / 1000) * 0.85
        if (s.hora > 20) s.hora = 6
        if (horaRef.current) horaRef.current.value = String(s.hora)
        aplicarSol()
        sigue = true
      }
      escribirGiro()
      return sigue
    })
    bucleRef.current = bucle
    escribirGiro()
    aplicarSol()
    bucle.iniciar()

    // Al entrar en pantalla por primera vez, las capas se separan un poco
    // para mostrar que la maqueta se puede explotar.
    const modelo = modeloRef.current
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || !modelo) return
        io.disconnect()
        window.setTimeout(() => {
          modelo.style.setProperty("--e", "0.9")
          if (separarRef.current) separarRef.current.value = "38"
        }, 350)
      },
      { threshold: 0.4 }
    )
    io.observe(escena)

    return () => {
      bucle.destruir()
      io.disconnect()
      window.clearTimeout(suaveRef.current)
    }
  }, [])

  /* ---- Acciones ---- */

  function marcarTocada() {
    if (!estadoRef.current.tocada) {
      estadoRef.current.tocada = true
      setTocada(true)
    }
  }

  function cambiarGiro(v: boolean) {
    estadoRef.current.girar = v
    setGirando(v)
    if (v) bucleRef.current?.iniciar()
  }

  function irAVista(v: (typeof vistas)[number]) {
    const s = estadoRef.current
    s.vx = s.vz = 0
    s.rx = v.rx
    // Llega por el camino más corto, sin dar vueltas de más.
    s.rz = v.rz + 360 * Math.round((s.rz - v.rz) / 360)
    cambiarGiro(false)
    setVista(v.id)
    suavizar()
    escribirGiro()
  }

  function girarPaso(drz: number, drx = 0) {
    const s = estadoRef.current
    s.vx = s.vz = 0
    s.rz += drz
    s.rx = Math.min(90, Math.max(0, s.rx + drx))
    cambiarGiro(false)
    setVista(null)
    marcarTocada()
    suavizar(600)
    escribirGiro()
  }

  function cambiarRecorrido(v: boolean) {
    estadoRef.current.recorrer = v
    setRecorriendo(v)
    if (v) bucleRef.current?.iniciar()
  }

  function elegirEstacion(e: (typeof estaciones)[number]) {
    estadoRef.current.decl = e.decl
    setEstacion(e.id)
    aplicarSol()
  }

  /* ---- Arrastre ---- */

  function alBajar(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    const s = estadoRef.current
    s.arrastre = true
    s.tactil = e.pointerType !== "mouse"
    s.px = e.clientX
    s.py = e.clientY
    s.t = e.timeStamp
    s.vx = s.vz = 0
    e.currentTarget.setPointerCapture(e.pointerId)
    delete modeloRef.current?.dataset.suave
    if (s.girar) cambiarGiro(false)
    setVista(null)
    marcarTocada()
    bucleRef.current?.iniciar()
  }

  function alMover(e: React.PointerEvent<HTMLDivElement>) {
    const s = estadoRef.current
    if (!s.arrastre) return
    const dx = e.clientX - s.px
    const dy = s.tactil ? 0 : e.clientY - s.py
    const dt = Math.max(e.timeStamp - s.t, 8)
    s.px = e.clientX
    s.py = e.clientY
    s.t = e.timeStamp
    const drz = dx * 0.38
    const drx = -dy * 0.3
    s.rz += drz
    s.rx = Math.min(90, Math.max(0, s.rx + drx))
    s.vz = drz / dt
    s.vx = drx / dt
  }

  function alSoltar() {
    const s = estadoRef.current
    if (!s.arrastre) return
    s.arrastre = false
    bucleRef.current?.iniciar()
  }

  function alTeclado(e: React.KeyboardEvent<HTMLDivElement>) {
    const mapa: Record<string, [number, number]> = {
      ArrowLeft: [-12, 0],
      ArrowRight: [12, 0],
      ArrowUp: [0, 8],
      ArrowDown: [0, -8],
    }
    const m = mapa[e.key]
    if (!m) return
    e.preventDefault()
    girarPaso(m[0], m[1])
  }

  const est = estaciones.find((e) => e.id === estacion)!

  return (
    <div className="grid gap-px border border-[var(--linea)] bg-[var(--linea)] lg:grid-cols-12">
      {/* Lámina con la maqueta */}
      <div className="relative bg-[var(--papel)] lg:col-span-8">
        <div
          ref={escenaRef}
          tabIndex={0}
          role="group"
          aria-roledescription="maqueta 3D"
          aria-label="Maqueta de una casa de dos plantas. Arrastrá para girarla o usá las flechas del teclado."
          aria-describedby="maqueta-descripcion"
          className="maqueta-escena relative h-[440px] cursor-grab overflow-hidden outline-none select-none active:cursor-grabbing sm:h-[540px] lg:h-[640px]"
          onPointerDown={alBajar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alSoltar}
          onLostPointerCapture={alSoltar}
          onKeyDown={alTeclado}
        >
          <p id="maqueta-descripcion" className="sr-only">
            Casa de dos plantas sobre un terreno de 26 por 20 metros. La planta
            baja, de 14 por 8 metros, es vidriada hacia el norte. La planta
            alta vuela 2 metros hacia el este y la cubierta tiene un alero de
            1,20 metros. La sombra cambia según la hora y la estación elegidas
            en el estudio solar.
          </p>
          <div className="maqueta-centro" aria-hidden="true">
            <div
              ref={modeloRef}
              className="maqueta-modelo"
              data-sin-estructura={!capas.estructura || undefined}
              data-sin-muros={!capas.muros || undefined}
              data-sin-cubierta={!capas.cubierta || undefined}
              style={
                {
                  "--a": TERRENO.a,
                  "--b": TERRENO.b,
                } as React.CSSProperties
              }
            >
              {/* Terreno con grilla de 1 m, sombras y recorrido solar */}
              <div className="maqueta-terreno">
                <svg
                  viewBox={`0 0 ${TERRENO.a} ${TERRENO.b}`}
                  className="absolute inset-0 size-full overflow-hidden"
                >
                  <polyline
                    points={recorridoSolar(est.decl)}
                    fill="none"
                    stroke="#b08f55"
                    strokeWidth="0.05"
                    strokeDasharray="0.25 0.2"
                  />
                  <circle
                    cx={CENTRO.x}
                    cy={CENTRO.y}
                    r="8"
                    fill="none"
                    stroke="rgba(15,15,13,0.22)"
                    strokeWidth="0.03"
                  />
                  <g ref={sombraRef} className="maqueta-sombra" opacity="1">
                    <g opacity="0.17">
                      {volumenes.map((_, i) => (
                        <polygon key={i} fill="#0f0f0d" />
                      ))}
                    </g>
                  </g>
                  {/* Piscina, árboles y cota */}
                  <rect
                    x="6"
                    y="14.4"
                    width="8"
                    height="2.6"
                    fill="rgba(201,169,110,0.08)"
                    stroke="rgba(15,15,13,0.5)"
                    strokeWidth="0.04"
                  />
                  {[
                    [2.4, 3.2, 1.6],
                    [23.4, 15.6, 1.9],
                    [2.8, 16.4, 1.3],
                  ].map(([cx, cy, r]) => (
                    <g key={cx} fill="none" stroke="rgba(15,15,13,0.4)" strokeWidth="0.04">
                      <circle cx={cx} cy={cy} r={r} />
                      <circle cx={cx} cy={cy} r={r * 0.12} />
                    </g>
                  ))}
                  <g stroke="rgba(15,15,13,0.55)" strokeWidth="0.03">
                    <line x1="5" y1="13.4" x2="19" y2="13.4" />
                    <line x1="5" y1="13.1" x2="5" y2="13.7" />
                    <line x1="19" y1="13.1" x2="19" y2="13.7" />
                  </g>
                  <text
                    x="12"
                    y="13.25"
                    textAnchor="middle"
                    fontSize="0.42"
                    fill="rgba(15,15,13,0.7)"
                    fontFamily="var(--faro-mono), monospace"
                  >
                    14,00
                  </text>
                  {/* Norte: hacia +y */}
                  <g transform="translate(23.2 3)" stroke="rgba(15,15,13,0.7)" strokeWidth="0.04" fill="none">
                    <circle r="0.9" />
                    <path d="M0 -0.9 L0 0.9 M-0.3 0.4 L0 0.9 L0.3 0.4" />
                    <text
                      y="1.75"
                      textAnchor="middle"
                      fontSize="0.5"
                      stroke="none"
                      fill="rgba(15,15,13,0.8)"
                      fontFamily="var(--faro-mono), monospace"
                    >
                      N
                    </text>
                  </g>
                  <g ref={solRef}>
                    <circle r="0.42" fill="#c9a96e" />
                    <circle r="0.75" fill="none" stroke="#c9a96e" strokeWidth="0.04" />
                  </g>
                </svg>
              </div>

              {planos.map((p, i) => (
                <div
                  key={i}
                  className={cn("pl", `pl-${p.t}`, `k-${p.k}`, `cat-${p.c}`)}
                  style={
                    {
                      "--x": p.x,
                      "--y": p.y,
                      "--z": p.z,
                      "--n": p.n,
                      "--a": p.a,
                      "--b": p.b,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          {/* Rótulo de lámina */}
          <div className="pointer-events-none absolute top-4 left-4 sm:top-6 sm:left-6">
            <p className="etiqueta text-[var(--piedra)]">Lámina L-03</p>
            <p className="serif mt-1 text-2xl italic">Casa en dos bandas</p>
          </div>
          <dl className="mono pointer-events-none absolute right-4 bottom-4 hidden border border-[var(--linea)] bg-[var(--papel)]/90 text-[0.65rem] text-[var(--piedra)] sm:grid sm:grid-cols-[auto_auto]">
            {[
              ["Vista", vistas.find((v) => v.id === vista)?.nombre ?? "Libre"],
              ["Escala", "1:200"],
              ["Sup.", "174 m²"],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="border-b border-[var(--linea)] px-2 py-1 last:border-0">{k}</dt>
                <dd className="border-b border-l border-[var(--linea)] px-2 py-1 text-[var(--carbon)]">{v}</dd>
              </div>
            ))}
          </dl>
          <p
            className={cn(
              "etiqueta pointer-events-none absolute inset-x-0 bottom-5 text-center text-[var(--piedra)] transition-opacity duration-700 sm:bottom-auto sm:top-7 sm:right-6 sm:left-auto",
              tocada && "opacity-0"
            )}
          >
            ↔ Arrastrá para girar
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col bg-[var(--papel)] lg:col-span-4">
        <fieldset className="border-b border-[var(--linea)] p-5 sm:p-6">
          <legend className="etiqueta float-left mb-3 w-full text-[var(--piedra)]">
            Vista
          </legend>
          <div className="clear-both grid grid-cols-3 border border-[var(--linea)]">
            {vistas.map((v, i) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={vista === v.id}
                onClick={() => irAVista(v)}
                className={cn(
                  "mono min-h-11 px-1 text-[0.7rem] transition-colors",
                  i > 0 && "border-l border-[var(--linea)]",
                  vista === v.id
                    ? "bg-[var(--carbon)] text-[var(--hueso)]"
                    : "hover:bg-[var(--hueso)]"
                )}
              >
                {v.nombre.split(" ")[0]}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              className="grid size-11 place-items-center border border-[var(--linea)] transition-colors hover:bg-[var(--hueso)]"
              aria-label="Girar a la izquierda"
              onClick={() => girarPaso(-20)}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="grid size-11 place-items-center border border-[var(--linea)] transition-colors hover:bg-[var(--hueso)]"
              aria-label="Girar a la derecha"
              onClick={() => girarPaso(20)}
            >
              <RotateCw className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-pressed={girando}
              onClick={() => cambiarGiro(!girando)}
              className="mono ml-auto inline-flex min-h-11 items-center gap-2 border border-[var(--linea)] px-3 text-[0.7rem] transition-colors hover:bg-[var(--hueso)]"
            >
              {girando ? (
                <Pause className="size-3.5" aria-hidden="true" />
              ) : (
                <Play className="size-3.5" aria-hidden="true" />
              )}
              {girando ? "Pausar giro" : "Girar sola"}
            </button>
          </div>
        </fieldset>

        <fieldset className="border-b border-[var(--linea)] p-5 sm:p-6">
          <legend className="etiqueta float-left mb-3 w-full text-[var(--piedra)]">
            Capas
          </legend>
          <ul className="clear-both border-t border-[var(--linea)]">
            {(Object.keys(etiquetasCapa) as Categoria[]).map((c) => (
              <li key={c} className="border-b border-[var(--linea)]">
                <button
                  type="button"
                  aria-pressed={capas[c]}
                  onClick={() => setCapas((v) => ({ ...v, [c]: !v[c] }))}
                  className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block size-3 border border-[var(--carbon)] transition-colors",
                        capas[c] && "bg-[var(--carbon)]"
                      )}
                    />
                    {etiquetasCapa[c]}
                  </span>
                  <span className="mono text-[0.65rem] text-[var(--piedra)]">
                    {capas[c] ? "visible" : "oculta"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <label className="mt-5 block">
            <span className="etiqueta flex justify-between text-[var(--piedra)]">
              <span>Separar capas</span>
              <span aria-hidden="true">explotada</span>
            </span>
            <input
              ref={separarRef}
              type="range"
              min="0"
              max="100"
              defaultValue="0"
              className="rango mt-3 w-full"
              onInput={(e) => {
                const v = Number(e.currentTarget.value)
                modeloRef.current?.style.setProperty(
                  "--e",
                  ((v / 100) * SEPARACION_MAX).toFixed(2)
                )
              }}
            />
          </label>
        </fieldset>

        <fieldset className="flex-1 p-5 sm:p-6">
          <legend className="etiqueta float-left mb-3 flex w-full items-center gap-2 text-[var(--piedra)]">
            <Sun className="size-3.5" aria-hidden="true" />
            Estudio solar · Montevideo
          </legend>
          <div className="clear-both grid grid-cols-3 border border-[var(--linea)]">
            {estaciones.map((e, i) => (
              <button
                key={e.id}
                type="button"
                aria-pressed={estacion === e.id}
                onClick={() => elegirEstacion(e)}
                className={cn(
                  "mono min-h-11 px-1 text-[0.7rem] transition-colors",
                  i > 0 && "border-l border-[var(--linea)]",
                  estacion === e.id
                    ? "bg-[var(--carbon)] text-[var(--hueso)]"
                    : "hover:bg-[var(--hueso)]"
                )}
              >
                {e.nombre}
              </button>
            ))}
          </div>
          <label className="mt-5 block">
            <span className="etiqueta flex justify-between text-[var(--piedra)]">
              <span>Hora del día</span>
              <span>{est.fecha}</span>
            </span>
            <input
              ref={horaRef}
              type="range"
              min="6"
              max="20"
              step="0.25"
              defaultValue="15.5"
              className="rango mt-3 w-full"
              onInput={(e) => {
                estadoRef.current.hora = Number(e.currentTarget.value)
                aplicarSol()
              }}
            />
            <span className="mono mt-1 flex justify-between text-[0.6rem] text-[var(--piedra)]" aria-hidden="true">
              <span>06:00</span>
              <span>13:00</span>
              <span>20:00</span>
            </span>
          </label>
          <div
            ref={lecturaRef}
            className="mono mt-5 grid grid-cols-3 border-y border-[var(--linea)] text-[0.7rem]"
            aria-live="off"
          >
            {["Hora", "Altura", "Azimut"].map((k, i) => (
              <div key={k} className={cn("py-3", i > 0 && "border-l border-[var(--linea)] pl-3")}>
                <p className="text-[var(--piedra)]">{k}</p>
                <p data-dato className="mt-1 text-[0.85rem] text-[var(--carbon)]">
                  —
                </p>
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={recorriendo}
            onClick={() => cambiarRecorrido(!recorriendo)}
            className="boton-linea mt-5 w-full"
          >
            {recorriendo ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="size-4" aria-hidden="true" />
            )}
            {recorriendo ? "Pausar el recorrido" : "Recorrer el día"}
          </button>
          <p className="mt-4 text-xs leading-relaxed text-[var(--piedra)]">
            En invierno el sol del mediodía sube apenas 32°: el alero lo deja
            entrar hasta el fondo del estar. En verano llega a 78° y la
            fachada norte queda en sombra.
          </p>
        </fieldset>
      </div>
    </div>
  )
}
