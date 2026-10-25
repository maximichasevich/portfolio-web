"use client"

import { useId, useState } from "react"
import { ArrowUpRight } from "lucide-react"

import "./laboratorio.css"
import { useFaro } from "@/components/demos/faro/contexto"
import { cn } from "@/lib/utils"

type Rango = [number, number]

const tipos: {
  id: string
  nombre: string
  agenda: string
  m2: Record<Terminacion, Rango>
  honorarios: (m2: number) => number
  rubros: [string, number][]
}[] = [
  {
    id: "vivienda",
    nombre: "Vivienda nueva",
    agenda: "Vivienda nueva",
    m2: { alta: [1500, 1800], premium: [1950, 2450], excepcional: [2700, 3600] },
    honorarios: (m2) => (m2 < 200 ? 12 : m2 < 400 ? 10 : 8.5),
    rubros: [
      ["Obra gruesa", 38],
      ["Terminaciones", 22],
      ["Instalaciones", 18],
      ["Aberturas", 14],
      ["Equipamiento fijo", 8],
    ],
  },
  {
    id: "reforma",
    nombre: "Reforma integral",
    agenda: "Reforma o ampliación",
    m2: { alta: [900, 1150], premium: [1250, 1600], excepcional: [1750, 2400] },
    honorarios: (m2) => (m2 < 120 ? 13 : 11),
    rubros: [
      ["Demoliciones y albañilería", 26],
      ["Terminaciones", 28],
      ["Instalaciones", 22],
      ["Aberturas", 12],
      ["Equipamiento fijo", 12],
    ],
  },
  {
    id: "comercial",
    nombre: "Oficinas o local",
    agenda: "Local u oficinas",
    m2: { alta: [1100, 1400], premium: [1450, 1900], excepcional: [2000, 2700] },
    honorarios: (m2) => (m2 < 300 ? 10 : 8),
    rubros: [
      ["Instalaciones", 30],
      ["Terminaciones", 26],
      ["Tabiques y cielorrasos", 18],
      ["Mobiliario a medida", 16],
      ["Iluminación", 10],
    ],
  },
  {
    id: "interiores",
    nombre: "Interiorismo",
    agenda: "Interiorismo",
    m2: { alta: [380, 520], premium: [600, 900], excepcional: [1000, 1500] },
    honorarios: () => 14,
    rubros: [
      ["Mobiliario a medida", 34],
      ["Terminaciones", 26],
      ["Iluminación", 16],
      ["Piezas y textiles", 14],
      ["Instalaciones", 10],
    ],
  },
]

type Terminacion = "alta" | "premium" | "excepcional"
const terminaciones: { id: Terminacion; nombre: string; detalle: string }[] = [
  { id: "alta", nombre: "Alta", detalle: "Porcelanato, aluminio línea media, roble ingeniería" },
  { id: "premium", nombre: "Premium", detalle: "Piedra natural, DVH de alta prestación, madera maciza" },
  { id: "excepcional", nombre: "Excepcional", detalle: "Diseño a medida en cada rubro, importados y domótica" },
]

const ubicaciones: { id: string; nombre: string; factor: number }[] = [
  { id: "mvd", nombre: "Montevideo", factor: 1 },
  { id: "can", nombre: "Canelones · Costa de Oro", factor: 0.97 },
  { id: "mal", nombre: "Maldonado · Punta del Este", factor: 1.12 },
  { id: "int", nombre: "Interior del país", factor: 0.93 },
]

const extras: { id: string; nombre: string; rango: Rango }[] = [
  { id: "piscina", nombre: "Piscina", rango: [38000, 62000] },
  { id: "paisaje", nombre: "Paisajismo", rango: [15000, 38000] },
  { id: "domotica", nombre: "Domótica", rango: [12000, 30000] },
  { id: "energia", nombre: "Paneles solares y bomba de calor", rango: [14000, 26000] },
]

const usd = (n: number) =>
  `USD ${(Math.round(n / 1000) * 1000).toLocaleString("es-UY")}`

function presupuestoAgenda(medio: number) {
  if (medio <= 150000) return "Hasta USD 150.000"
  if (medio <= 400000) return "USD 150.000 a 400.000"
  if (medio <= 1000000) return "USD 400.000 a 1.000.000"
  return "Más de USD 1.000.000"
}

/**
 * Estimador orientativo de costo de obra en USD: tipo, superficie,
 * terminación, ubicación y extras. Muestra rango, honorarios, plazo y la
 * incidencia de cada rubro. Puede pasar la estimación a la agenda.
 */
export default function Estimador() {
  const { abrir } = useFaro()
  const id = useId()
  const [tipo, setTipo] = useState("vivienda")
  const [m2, setM2] = useState(280)
  const [terminacion, setTerminacion] = useState<Terminacion>("premium")
  const [ubicacion, setUbicacion] = useState("mvd")
  const [elegidos, setElegidos] = useState<string[]>(["energia"])

  const t = tipos.find((x) => x.id === tipo)!
  const u = ubicaciones.find((x) => x.id === ubicacion)!
  const base = t.m2[terminacion]
  const suma = extras
    .filter((e) => elegidos.includes(e.id))
    .reduce<Rango>((s, e) => [s[0] + e.rango[0], s[1] + e.rango[1]], [0, 0])
  const obra: Rango = [
    base[0] * m2 * u.factor + suma[0],
    base[1] * m2 * u.factor + suma[1],
  ]
  const pct = t.honorarios(m2)
  const honorarios: Rango = [obra[0] * (pct - 1) / 100, obra[1] * (pct + 1) / 100]
  const mesesObra = Math.round(
    Math.min(30, Math.max(3, (m2 / (tipo === "interiores" ? 60 : 24)) * (terminacion === "excepcional" ? 1.25 : terminacion === "premium" ? 1.1 : 1) + 3))
  )
  const mesesProyecto = tipo === "interiores" ? "2 a 3" : tipo === "reforma" ? "3 a 5" : "5 a 8"
  const medio = (obra[0] + obra[1]) / 2

  function agendar() {
    const ter = terminaciones.find((x) => x.id === terminacion)!.nombre
    abrir("agendar", {
      tipo: t.agenda,
      superficie: String(m2),
      ubicacion: u.nombre.split(" · ")[0],
      presupuesto: presupuestoAgenda(medio),
      comentario: `Estimación orientativa del sitio: ${usd(obra[0])} a ${usd(obra[1])} de obra (${t.nombre.toLowerCase()}, ${m2} m², terminación ${ter.toLowerCase()}${elegidos.length ? `, con ${extras.filter((e) => elegidos.includes(e.id)).map((e) => e.nombre.toLowerCase()).join(", ")}` : ""}).`,
    })
  }

  return (
    <div className="grid gap-px border border-[var(--linea)] bg-[var(--linea)] lg:grid-cols-12">
      <form
        className="space-y-8 bg-[var(--papel)] p-5 sm:p-8 lg:col-span-7"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Datos para estimar el costo"
      >
        <fieldset>
          <legend className="etiqueta mb-3 text-[var(--piedra)]">01 · Tipo de obra</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tipos.map((x) => (
              <label key={x.id} className="opcion min-h-14 justify-center text-center text-sm">
                <input
                  type="radio"
                  name={`${id}-tipo`}
                  value={x.id}
                  checked={tipo === x.id}
                  onChange={() => setTipo(x.id)}
                />
                {x.nombre}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="etiqueta mb-3 flex w-full items-baseline justify-between text-[var(--piedra)]">
            <span>02 · Superficie</span>
          </legend>
          <div className="flex items-end gap-4">
            <input
              type="range"
              min="40"
              max="1200"
              step="5"
              value={m2}
              onChange={(e) => setM2(Number(e.target.value))}
              aria-label="Superficie en metros cuadrados"
              aria-valuetext={`${m2} metros cuadrados`}
              className="rango flex-1"
            />
            <label className="flex items-baseline gap-1">
              <span className="sr-only">Superficie exacta</span>
              <input
                type="number"
                min="40"
                max="1200"
                inputMode="numeric"
                value={m2}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isFinite(v)) setM2(Math.min(1200, Math.max(0, v)))
                }}
                onBlur={() => setM2((v) => Math.min(1200, Math.max(40, v)))}
                className="campo serif w-24 text-right text-3xl"
              />
              <span className="mono text-xs text-[var(--piedra)]">m²</span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="etiqueta mb-3 text-[var(--piedra)]">03 · Terminación</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {terminaciones.map((x) => (
              <label key={x.id} className="opcion flex-col items-start gap-1">
                <input
                  type="radio"
                  name={`${id}-term`}
                  value={x.id}
                  checked={terminacion === x.id}
                  onChange={() => setTerminacion(x.id)}
                />
                <span className="serif text-xl">{x.nombre}</span>
                <span className="text-xs leading-snug opacity-70">{x.detalle}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-8 sm:grid-cols-2">
          <label className="block">
            <span className="etiqueta mb-1 block text-[var(--piedra)]">04 · Ubicación</span>
            <select
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="campo cursor-pointer"
            >
              {ubicaciones.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.nombre}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="etiqueta mb-2 text-[var(--piedra)]">05 · Extras</legend>
            <ul className="space-y-1">
              {extras.map((x) => (
                <li key={x.id}>
                  <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={elegidos.includes(x.id)}
                      onChange={(e) =>
                        setElegidos((v) =>
                          e.target.checked ? [...v, x.id] : v.filter((y) => y !== x.id)
                        )
                      }
                      className="size-4 accent-[var(--carbon)]"
                    />
                    {x.nombre}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </div>
      </form>

      <div className="sobre-oscuro flex flex-col bg-[var(--carbon)] p-5 text-[var(--hueso)] sm:p-8 lg:col-span-5">
        <p className="etiqueta text-[var(--piedra-claro)]">Costo de obra estimado</p>
        <p className="serif mt-4 text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.02]" aria-live="polite">
          {usd(obra[0])}
          <span className="block text-[var(--hueso)]/55 italic">a {usd(obra[1]).replace("USD ", "")}</span>
        </p>
        <p className="mono mt-3 text-xs text-[var(--piedra-claro)]">
          {usd(obra[0] / m2)} a {usd(obra[1] / m2).replace("USD ", "")} por m² · IVA y leyes sociales incluidos
        </p>

        <dl className="mono mt-8 grid grid-cols-2 border-t border-[var(--linea-clara)] text-xs">
          <div className="border-b border-[var(--linea-clara)] py-3">
            <dt className="text-[var(--piedra-claro)]">Honorarios ({pct - 1}–{pct + 1} %)</dt>
            <dd className="mt-1 text-sm">
              {usd(honorarios[0])} a {usd(honorarios[1]).replace("USD ", "")}
            </dd>
          </div>
          <div className="border-b border-l border-[var(--linea-clara)] py-3 pl-3">
            <dt className="text-[var(--piedra-claro)]">Plazo estimado</dt>
            <dd className="mt-1 text-sm">
              {mesesProyecto} meses de proyecto · {mesesObra} de obra
            </dd>
          </div>
        </dl>

        <p className="etiqueta mt-8 text-[var(--piedra-claro)]">Incidencia por rubro</p>
        <ul className="mt-3 space-y-2.5">
          {t.rubros.map(([nombre, p]) => (
            <li key={nombre} className="grid grid-cols-[1fr_auto] gap-x-4 text-xs">
              <span>{nombre}</span>
              <span className="mono text-[var(--piedra-claro)]">{p} %</span>
              <span className="col-span-2 mt-1 block h-px bg-[var(--linea-clara)]">
                <span
                  className="avance block h-px bg-[var(--luz)]"
                  style={{ transform: `scaleX(${p / 40})` }}
                />
              </span>
            </li>
          ))}
        </ul>

        <button type="button" className="boton mt-10" aria-haspopup="dialog" onClick={agendar}>
          Agendar reunión con esta estimación
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
        <p className={cn("mt-5 text-[0.7rem] leading-relaxed text-[var(--hueso)]/60")}>
          Valores orientativos de octubre de 2026 para obras dirigidas por el
          estudio. No incluyen terreno, tasas municipales ni mobiliario suelto.
          El presupuesto real surge del proyecto y de la cotización de las
          empresas constructoras.
        </p>
      </div>
    </div>
  )
}
