"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  Armchair,
  CalendarCheck,
  Cat,
  Cloud,
  CloudSun,
  Flower2,
  Heart,
  Hourglass,
  RotateCcw,
  ShieldCheck,
  Sun,
  Trees,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  catalogo,
  precioDesde,
  textoLuz,
  type Planta,
} from "@/components/demos/verde/catalogo"
import { useTienda } from "@/components/demos/verde/estado"
import { FotoPlanta } from "@/components/demos/verde/ui"

type Respuestas = {
  luz?: "poca" | "indirecta" | "sol"
  tiempo?: 1 | 2 | 3
  mascotas?: boolean
  lugar?: "adentro" | "afuera"
}

type Pregunta = {
  clave: keyof Respuestas
  titulo: string
  opciones: { valor: Respuestas[keyof Respuestas]; texto: string; detalle: string; Icono: typeof Sun }[]
}

const preguntas: Pregunta[] = [
  {
    clave: "lugar",
    titulo: "¿Dónde va a vivir tu planta?",
    opciones: [
      { valor: "adentro", texto: "Adentro", detalle: "Living, cuarto, oficina", Icono: Armchair },
      { valor: "afuera", texto: "Afuera", detalle: "Balcón, patio o terraza", Icono: Trees },
    ],
  },
  {
    clave: "luz",
    titulo: "¿Cuánta luz entra en ese lugar?",
    opciones: [
      { valor: "poca", texto: "Poquita", detalle: "Lejos de la ventana o un rincón", Icono: Cloud },
      { valor: "indirecta", texto: "Bastante", detalle: "Clarito, pero sin sol directo", Icono: CloudSun },
      { valor: "sol", texto: "Sol directo", detalle: "Le da el sol varias horas", Icono: Sun },
    ],
  },
  {
    clave: "tiempo",
    titulo: "Sinceridad total: ¿cuánto la vas a mimar?",
    opciones: [
      { valor: 1, texto: "Me olvido de regar", detalle: "O viajo seguido", Icono: Hourglass },
      { valor: 2, texto: "Una vez por semana", detalle: "Me pongo una alarma", Icono: CalendarCheck },
      { valor: 3, texto: "Todo lo que pida", detalle: "Le voy a hablar y todo", Icono: Heart },
    ],
  },
  {
    clave: "mascotas",
    titulo: "¿Hay perros o gatos curiosos en casa?",
    opciones: [
      { valor: true, texto: "Sí, y muerden todo", detalle: "Solo plantas no tóxicas", Icono: Cat },
      { valor: false, texto: "No, o no se acercan", detalle: "Vale cualquiera", Icono: Flower2 },
    ],
  },
]

const nivelLuz = { poca: 0, indirecta: 1, mucha: 2, sol: 3 } as const

function puntuar(p: Planta, r: Required<Respuestas>) {
  if (r.mascotas && !p.aptaMascotas) return -100
  let puntos = 0
  const nivel = nivelLuz[p.luz]
  if (r.luz === "poca") puntos += nivel === 0 ? 4 : nivel === 1 ? 1 : -4
  if (r.luz === "indirecta") puntos += nivel === 1 || nivel === 2 ? 4 : nivel === 0 ? 3 : -1
  if (r.luz === "sol") puntos += nivel === 3 ? 4 : nivel === 2 ? 2 : nivel === 0 ? 0 : -1
  puntos += 3 - Math.abs(r.tiempo - p.sed) * 1.5
  if (p.cuidado === "Atenta" && r.tiempo < 3) puntos -= 3
  if (p.cuidado === "Fácil" && r.tiempo === 1) puntos += 1
  if (r.lugar === "adentro") {
    if (p.categoria === "Exterior" && p.luz === "sol") puntos -= 3
    if (p.categoria === "Interior") puntos += 1.5
  } else {
    if (p.categoria === "Interior") puntos -= 2
    if (p.categoria === "Exterior" || p.categoria === "Huerta" || p.categoria === "Suculentas") puntos += 1.5
  }
  return puntos + p.ventas / 1000
}

function recomendar(r: Required<Respuestas>) {
  return catalogo
    .map((p) => ({ p, puntos: puntuar(p, r) }))
    .filter((x) => x.puntos > -50)
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, 3)
    .map((x) => x.p)
}

export function Quiz() {
  const { agregar, abrirVistaRapida } = useTienda()
  const [paso, setPaso] = useState(0)
  const [r, setR] = useState<Respuestas>({})

  const terminado = paso >= preguntas.length
  const resultado = terminado ? recomendar(r as Required<Respuestas>) : []
  const pregunta = preguntas[paso]

  function responder(valor: Respuestas[keyof Respuestas]) {
    setR({ ...r, [pregunta.clave]: valor })
    setPaso(paso + 1)
  }

  return (
    <div className="relative overflow-hidden rounded-[36px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-lila)] p-5 sm:p-8 lg:p-12">
      {/* Formas decorativas */}
      <div className="vt-blob-1 pointer-events-none absolute -top-16 -right-16 size-56 bg-[var(--vt-rosa)] opacity-70" aria-hidden="true" />
      <div className="vt-blob-3 pointer-events-none absolute -bottom-20 -left-10 size-48 bg-[var(--vt-cielo)] opacity-70" aria-hidden="true" />

      <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
        <div>
          <span className="vt-sticker bg-[var(--vt-manteca)]">Quiz · 30 segundos</span>
          <h2 id="quiz-titulo" className="vt-titulo mt-5 text-[clamp(2.6rem,7vw,4.6rem)]">
            ¿Qué planta va con vos?
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-[var(--vt-tinta-70)]">
            Contestá cuatro preguntas sobre tu casa y tu ritmo, y te mostramos
            las plantas que mejor te van. Sin culpa si sos de los que se olvidan
            de regar.
          </p>
          {!terminado && (
            <div className="mt-6 flex items-center gap-2" aria-hidden="true">
              {preguntas.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-2.5 rounded-full border-2 border-[var(--vt-tinta)] transition-all",
                    i < paso ? "w-8 bg-[var(--vt-tinta)]" : i === paso ? "w-12 bg-[var(--vt-coral)]" : "w-8 bg-[var(--vt-papel)]"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0 rounded-[30px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5 sm:p-7" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {!terminado ? (
              <motion.div
                key={paso}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22 }}
              >
                <p className="text-sm font-bold text-[var(--vt-tinta-70)]">
                  Pregunta {paso + 1} de {preguntas.length}
                </p>
                <h3 className="vt-titulo mt-1 text-3xl sm:text-4xl">{pregunta.titulo}</h3>
                <div
                  className={cn(
                    "mt-5 grid gap-3",
                    pregunta.opciones.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
                  )}
                >
                  {pregunta.opciones.map((o) => (
                    <button
                      key={String(o.valor)}
                      type="button"
                      onClick={() => responder(o.valor)}
                      aria-pressed={r[pregunta.clave] === o.valor}
                      className="vt-opcion group flex items-center gap-3 p-4 text-left sm:flex-col sm:items-start sm:p-5"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)] transition-transform group-hover:-rotate-12">
                        <o.Icono className="size-6" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-lg font-extrabold leading-tight">{o.texto}</span>
                        <span className="mt-0.5 block text-sm text-[var(--vt-tinta-70)]">{o.detalle}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {paso > 0 && (
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4"
                    onClick={() => setPaso(paso - 1)}
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" /> Pregunta anterior
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="resultado"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-bold text-[var(--vt-tinta-70)]">Tu match ideal</p>
                {resultado[0] && (
                  <div className="mt-3 grid gap-5 sm:grid-cols-[11rem_1fr] sm:items-center">
                    <FotoPlanta
                      planta={resultado[0]}
                      forma={2}
                      sizes="(min-width: 640px) 11rem, 80vw"
                      className="mx-auto aspect-square w-44 border-2 border-[var(--vt-tinta)] sm:w-full"
                    />
                    <div>
                      <h3 className="vt-titulo text-4xl">{resultado[0].nombre}</h3>
                      <ul className="mt-3 flex flex-wrap gap-1.5 text-xs font-bold">
                        <li className="rounded-full bg-[var(--vt-cielo)] px-2.5 py-1">{textoLuz[resultado[0].luz]}</li>
                        <li className="rounded-full bg-[var(--vt-menta)] px-2.5 py-1">Riego: {resultado[0].riego.toLowerCase()}</li>
                        {resultado[0].aptaMascotas && (
                          <li className="inline-flex items-center gap-1 rounded-full bg-[var(--vt-rosa)] px-2.5 py-1">
                            <ShieldCheck className="size-3.5" aria-hidden="true" /> Apta mascotas
                          </li>
                        )}
                      </ul>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--vt-tinta-70)]">
                        {resultado[0].descripcion}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button type="button" className="vt-boton h-11 px-5 text-sm" onClick={(e) => agregar(resultado[0].id, { origen: e.currentTarget })}>
                          Agregar · {pesos(precioDesde(resultado[0]))}
                        </button>
                        <button type="button" className="vt-boton-linea h-11 px-5 text-sm" onClick={() => abrirVistaRapida(resultado[0].id)}>
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {resultado.length > 1 && (
                  <div className="mt-6 border-t-2 border-dashed border-[var(--vt-tinta-15)] pt-5">
                    <p className="text-sm font-bold">También te pueden ir bien</p>
                    <ul className="mt-3 grid grid-cols-2 gap-3">
                      {resultado.slice(1).map((p, i) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => abrirVistaRapida(p.id)}
                            className="flex w-full items-center gap-3 rounded-2xl p-1.5 text-left hover:bg-[var(--vt-crema)]"
                          >
                            <FotoPlanta planta={p} forma={i === 0 ? 1 : 3} sizes="56px" className="size-14 shrink-0" />
                            <span className="min-w-0">
                              <span className="block truncate font-extrabold">{p.nombre}</span>
                              <span className="block text-xs text-[var(--vt-tinta-70)] tabular-nums">
                                desde {pesos(precioDesde(p))}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4"
                  onClick={() => {
                    setR({})
                    setPaso(0)
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden="true" /> Hacer el quiz de nuevo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
