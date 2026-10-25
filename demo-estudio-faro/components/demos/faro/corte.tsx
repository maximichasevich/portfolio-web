"use client"

import { useState } from "react"
import { Pause, Play, Wind } from "lucide-react"

import "./laboratorio.css"
import { cn } from "@/lib/utils"

/* Corte transversal de Casa Carrasco a escala 1:50 (50 unidades = 1 m). */
const PISO = 420
const LOSA_ARRIBA = 255
const LOSA_ABAJO = 275
const PUNTA_ALERO = 340
const VIDRIO = 400
const techos: [number, number][] = [
  [PUNTA_ALERO, 680],
  [760, 920],
]

const estaciones = [
  { id: "verano", nombre: "Verano", fecha: "21 dic · 12:45", alt: 78.5 },
  { id: "equinoccio", nombre: "Equinoccio", fecha: "21 mar · 12:45", alt: 55.1 },
  { id: "invierno", nombre: "Invierno", fecha: "21 jun · 12:45", alt: 31.7 },
] as const
type Estacion = (typeof estaciones)[number]["id"]

const rad = Math.PI / 180

function rayos(alt: number) {
  const t = Math.tan(alt * rad)
  const lista: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (let xf = 40; xf <= 1100; xf += 44) {
    const x1 = xf - (PISO - 10) / t
    const xTecho = xf - (PISO - LOSA_ARRIBA) / t
    const golpea = techos.some(([a, b]) => xTecho >= a && xTecho <= b)
    lista.push(
      golpea
        ? { x1, y1: 10, x2: xTecho, y2: LOSA_ARRIBA }
        : { x1, y1: 10, x2: xf, y2: PISO }
    )
  }
  const xPunta = PUNTA_ALERO + (PISO - LOSA_ABAJO) / t
  const entra = Math.max(0, (xPunta - VIDRIO) / 50)
  const yVidrio = LOSA_ABAJO + (VIDRIO - PUNTA_ALERO) * t
  return { lista, xPunta, entra, yVidrio }
}

const notas = [
  {
    n: 1,
    x: 368,
    y: 246,
    titulo: "Alero de 1,20 m",
    texto:
      "Calculado para el sol de Montevideo: da sombra a toda la carpintería entre noviembre y febrero y deja pasar el sol bajo de invierno.",
  },
  {
    n: 2,
    x: 402,
    y: 352,
    titulo: "Carpintería con DVH",
    texto:
      "Aluminio con ruptura de puente térmico y doble vidrio hermético. Corredizas de piso a techo que abren el estar a la terraza.",
  },
  {
    n: 3,
    x: 560,
    y: 266,
    titulo: "Losa de hormigón visto",
    texto:
      "Encofrado de tablas de pino. La masa de la losa guarda el calor del sol de invierno y lo devuelve de noche.",
  },
  {
    n: 4,
    x: 720,
    y: 320,
    titulo: "Patio de luz",
    texto:
      "Separa el estar de la franja de servicios. Ilumina el centro de la casa y permite la ventilación cruzada en verano.",
  },
  {
    n: 5,
    x: 620,
    y: 432,
    titulo: "Piso radiante",
    texto:
      "Serpentina de agua caliente bajo el roble. Un calor parejo, sin equipos a la vista, alimentado por una bomba de calor.",
  },
  {
    n: 6,
    x: 830,
    y: 330,
    titulo: "Franja de servicios",
    texto:
      "Cocina, baños y lavadero contra la calle, con una ventana alta corrida que da privacidad y ventila.",
  },
]

/**
 * Corte interactivo: muestra cómo el alero controla el sol en cada estación,
 * el recorrido del aire y las decisiones de proyecto con notas numeradas.
 */
export default function Corte() {
  const [estacion, setEstacion] = useState<Estacion>("invierno")
  const [aire, setAire] = useState(false)
  const [pausaAire, setPausaAire] = useState(false)
  const [nota, setNota] = useState(1)

  const actual = estaciones.find((e) => e.id === estacion)!
  const datos = rayos(actual.alt)
  const activa = notas.find((x) => x.n === nota)!

  return (
    <div className="grid gap-px border border-[var(--linea)] bg-[var(--linea)] lg:grid-cols-12">
      <div className="relative bg-[var(--papel)] lg:col-span-8">
        <div className="relative">
          <svg
            viewBox="0 0 1000 560"
            className="block h-auto w-full"
            role="img"
            aria-labelledby="corte-titulo corte-desc"
          >
            <title id="corte-titulo">Corte transversal de Casa Carrasco</title>
            <desc id="corte-desc">
              {`Al mediodía de ${actual.nombre.toLowerCase()}, el sol está a ${Math.round(actual.alt)} grados. ${
                datos.entra > 0.05
                  ? `Entra ${datos.entra.toFixed(1).replace(".", ",")} metros dentro del estar.`
                  : "El alero deja toda la fachada vidriada en sombra."
              }`}
            </desc>
            <defs>
              <pattern id="corte-tierra" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(15,15,13,0.22)" strokeWidth="1" />
              </pattern>
              <pattern id="corte-hormigon" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="0.7" fill="rgba(15,15,13,0.35)" />
                <circle cx="4.5" cy="4" r="0.5" fill="rgba(15,15,13,0.25)" />
              </pattern>
            </defs>

            {/* Rayos de sol por estación (fundido entre grupos) */}
            {estaciones.map((e) => {
              const r = rayos(e.alt)
              return (
                <g
                  key={e.id}
                  className="corte-grupo"
                  style={{ opacity: e.id === estacion ? 1 : 0 }}
                  aria-hidden="true"
                >
                  {r.xPunta > VIDRIO && (
                    <polygon
                      points={`${VIDRIO},${r.yVidrio} ${VIDRIO},${PISO} ${r.xPunta},${PISO}`}
                      fill="rgba(201,169,110,0.16)"
                    />
                  )}
                  {r.lista.map((l) => (
                    <line
                      key={l.x2}
                      {...l}
                      stroke="#c9a96e"
                      strokeWidth="1"
                      opacity="0.75"
                    />
                  ))}
                  {r.xPunta > VIDRIO && (
                    <rect x={VIDRIO} y={PISO - 3} width={r.xPunta - VIDRIO} height="3" fill="#c9a96e" />
                  )}
                </g>
              )
            })}

            {/* Sol que gira alrededor de la punta del alero */}
            <g
              className="corte-sol"
              style={{
                transform: `rotate(${actual.alt}deg)`,
                transformOrigin: `${PUNTA_ALERO}px ${LOSA_ABAJO}px`,
              }}
              aria-hidden="true"
            >
              <circle cx={PUNTA_ALERO - 250} cy={LOSA_ABAJO} r="13" fill="#c9a96e" />
              <circle cx={PUNTA_ALERO - 250} cy={LOSA_ABAJO} r="22" fill="none" stroke="#c9a96e" />
            </g>

            {/* Terreno */}
            <rect x="0" y={PISO} width="1000" height="140" fill="url(#corte-tierra)" />
            <line x1="0" y1={PISO} x2="1000" y2={PISO} stroke="#0f0f0d" strokeWidth="1.5" />

            {/* Contrapiso con piso radiante */}
            <rect x={VIDRIO} y={PISO} width="520" height="22" fill="#f7f5f0" stroke="#0f0f0d" strokeWidth="1" />
            {Array.from({ length: 21 }, (_, i) => (
              <circle key={i} cx={VIDRIO + 14 + i * 24.5} cy={PISO + 12} r="3" fill="none" stroke="#0f0f0d" strokeWidth="0.8" />
            ))}

            {/* Cubiertas */}
            {techos.map(([a, b]) => (
              <rect key={a} x={a} y={LOSA_ARRIBA} width={b - a} height={LOSA_ABAJO - LOSA_ARRIBA} fill="url(#corte-hormigon)" stroke="#0f0f0d" strokeWidth="1.2" />
            ))}

            {/* Carpinterías: fachada norte y patio */}
            {[VIDRIO, 680, 760].map((x) => (
              <g key={x} stroke="#0f0f0d" strokeWidth="0.9">
                <line x1={x - 2} y1={LOSA_ABAJO} x2={x - 2} y2={PISO} />
                <line x1={x + 2} y1={LOSA_ABAJO} x2={x + 2} y2={PISO} />
                <line x1={x - 6} y1={LOSA_ABAJO + 4} x2={x + 6} y2={LOSA_ABAJO + 4} />
              </g>
            ))}
            {/* Muro sur con ventana alta */}
            <rect x="900" y={LOSA_ABAJO} width="20" height={PISO - LOSA_ABAJO} fill="url(#corte-hormigon)" stroke="#0f0f0d" strokeWidth="1.2" />
            <rect x="900" y={LOSA_ABAJO + 8} width="20" height="26" fill="#f7f5f0" stroke="#0f0f0d" strokeWidth="0.9" />
            {/* Mesada y equipamiento */}
            <rect x="790" y="376" width="110" height="44" fill="none" stroke="rgba(15,15,13,0.55)" />
            <path d="M462 420 v-34 h120 v34 M462 398 h120" fill="none" stroke="rgba(15,15,13,0.55)" />
            {/* Árbol del patio */}
            <g fill="none" stroke="rgba(15,15,13,0.5)">
              <line x1="720" y1={PISO} x2="720" y2="300" />
              <ellipse cx="720" cy="250" rx="34" ry="60" />
            </g>
            {/* Figura humana de escala (1,75 m) */}
            <g fill="none" stroke="#0f0f0d" strokeWidth="1">
              <circle cx="630" cy="340" r="7" />
              <path d="M630 347 v40 M630 387 l-9 33 M630 387 l9 33 M630 356 l-12 24 M630 356 l12 24" />
            </g>
            {/* Árbol del jardín */}
            <g fill="none" stroke="rgba(15,15,13,0.4)">
              <line x1="150" y1={PISO} x2="150" y2="330" />
              <circle cx="150" cy="300" r="46" />
            </g>

            {/* Cotas */}
            <g stroke="rgba(15,15,13,0.7)" strokeWidth="0.8" fontFamily="var(--faro-mono), monospace" fontSize="13" fill="rgba(15,15,13,0.75)">
              <line x1={PUNTA_ALERO} y1="232" x2={VIDRIO} y2="232" />
              <line x1={PUNTA_ALERO} y1="226" x2={PUNTA_ALERO} y2="238" />
              <line x1={VIDRIO} y1="226" x2={VIDRIO} y2="238" />
              <text x="370" y="222" textAnchor="middle" stroke="none">1,20</text>
              <line x1="955" y1={LOSA_ABAJO} x2="955" y2={PISO} />
              <line x1="949" y1={LOSA_ABAJO} x2="961" y2={LOSA_ABAJO} />
              <line x1="949" y1={PISO} x2="961" y2={PISO} />
              <text x="966" y="352" stroke="none">2,90</text>
              <text x="30" y="540" stroke="none">N ←</text>
              <text x="970" y="540" textAnchor="end" stroke="none">→ S · calle</text>
            </g>

            {/* Aire: ventilación cruzada */}
            {aire && (
              <g aria-hidden="true" stroke="#77736a" strokeWidth="1.4" fill="none">
                {[0, 1.2, 2.4].map((d, i) => (
                  <path
                    key={d}
                    d={`M150 ${352 + i * 18} h30 m-10 -6 l10 6 l-10 6`}
                    className="corte-aire"
                    data-pausa={pausaAire}
                    style={
                      {
                        animationDelay: `${-d}s`,
                        "--viaje": "700px",
                      } as React.CSSProperties
                    }
                  />
                ))}
              </g>
            )}
          </svg>

          {/* Notas numeradas sobre el dibujo */}
          {notas.map((x) => (
            <button
              key={x.n}
              type="button"
              aria-pressed={nota === x.n}
              aria-label={`Nota ${x.n}: ${x.titulo}`}
              onClick={() => setNota(x.n)}
              onMouseEnter={() => setNota(x.n)}
              onFocus={() => setNota(x.n)}
              className={cn(
                "mono absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[0.65rem] transition-colors after:absolute after:-inset-2 sm:size-8",
                nota === x.n
                  ? "border-[var(--carbon)] bg-[var(--carbon)] text-[var(--hueso)]"
                  : "border-[var(--carbon)] bg-[var(--papel)] hover:bg-[var(--hueso)]"
              )}
              style={{ left: `${x.x / 10}%`, top: `${(x.y / 560) * 100}%` }}
            >
              {x.n}
            </button>
          ))}
        </div>
        <p className="etiqueta absolute top-4 left-4 text-[var(--piedra)] sm:top-6 sm:left-6">
          Corte A-A · Casa Carrasco
        </p>
      </div>

      <div className="flex flex-col bg-[var(--papel)] lg:col-span-4">
        <div className="border-b border-[var(--linea)] p-5 sm:p-6">
          <p className="etiqueta text-[var(--piedra)]">Sol al mediodía</p>
          <div className="mt-3 grid grid-cols-3 border border-[var(--linea)]">
            {estaciones.map((e, i) => (
              <button
                key={e.id}
                type="button"
                aria-pressed={estacion === e.id}
                onClick={() => setEstacion(e.id)}
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
          <dl className="mono mt-4 grid grid-cols-2 border-y border-[var(--linea)] text-[0.7rem]" aria-live="polite">
            <div className="py-3">
              <dt className="text-[var(--piedra)]">Altura del sol</dt>
              <dd className="mt-1 text-[0.85rem]">{Math.round(actual.alt)}°</dd>
            </div>
            <div className="border-l border-[var(--linea)] py-3 pl-3">
              <dt className="text-[var(--piedra)]">Entra al estar</dt>
              <dd className="mt-1 text-[0.85rem]">
                {datos.entra > 0.05
                  ? `${datos.entra.toFixed(1).replace(".", ",")} m`
                  : "en sombra"}
              </dd>
            </div>
          </dl>
          <p className="mono mt-2 text-[0.65rem] text-[var(--piedra)]">{actual.fecha}</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              aria-pressed={aire}
              onClick={() => {
                setAire(!aire)
                setPausaAire(false)
              }}
              className="mono inline-flex min-h-11 flex-1 items-center justify-center gap-2 border border-[var(--linea)] px-3 text-[0.7rem] transition-colors hover:bg-[var(--hueso)] aria-pressed:bg-[var(--carbon)] aria-pressed:text-[var(--hueso)]"
            >
              <Wind className="size-3.5" aria-hidden="true" />
              Ventilación cruzada
            </button>
            {aire && (
              <button
                type="button"
                onClick={() => setPausaAire(!pausaAire)}
                aria-label={pausaAire ? "Reanudar la animación del aire" : "Pausar la animación del aire"}
                className="grid size-11 place-items-center border border-[var(--linea)] transition-colors hover:bg-[var(--hueso)]"
              >
                {pausaAire ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 p-5 sm:p-6" aria-live="polite">
          <p className="mono text-xs text-[var(--piedra)]">
            Nota {String(activa.n).padStart(2, "0")} / {String(notas.length).padStart(2, "0")}
          </p>
          <p key={activa.n} className="aparece serif mt-2 text-3xl leading-tight">
            {activa.titulo}
          </p>
          <p key={`t${activa.n}`} className="aparece mt-3 text-sm leading-relaxed text-[var(--carbon)]/80">
            {activa.texto}
          </p>
          <p className="mt-6 text-xs text-[var(--piedra)]">
            Tocá o pasá el mouse por los números del dibujo.
          </p>
        </div>
      </div>
    </div>
  )
}
