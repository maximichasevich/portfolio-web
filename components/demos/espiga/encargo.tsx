"use client"

import { useId, useState } from "react"
import { ArrowUp, MessageCircle, UserRound } from "lucide-react"

import { detalleTorta } from "@/components/demos/espiga/contenido"
import {
  abrirPanel,
  datosCompletos,
  elegirTipoEncargo,
  useAhora,
  useDatos,
  useTipoEncargo,
  useTorta,
} from "@/components/demos/espiga/estado"
import { pesos } from "@/lib/demo"
import { whatsappDemo } from "@/lib/demo"
import { cn } from "@/lib/utils"

const tipos = ["Torta", "Mesa dulce", "Sándwiches de miga", "Pan para eventos"]
const personas = ["8 a 10", "12 a 15", "20", "30", "40 o más"]

const isoMontevideo = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Montevideo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})
const fechaLegible = new Intl.DateTimeFormat("es-UY", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
})

/** Nota de encargo en papel rayado: arma el mensaje con los datos guardados. */
export function NotaEncargo() {
  const ahora = useAhora()
  const datos = useDatos()
  const base = useId()
  const tipo = useTipoEncargo()
  const setTipo = elegirTipoEncargo
  const torta = detalleTorta(useTorta())
  const esTorta = tipo === "Torta"
  const [cantidad, setCantidad] = useState(personas[0])
  const [fecha, setFecha] = useState("")
  const [detalle, setDetalle] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Pedimos al menos 48 horas de anticipación.
  const minimo =
    ahora === null ? undefined : isoMontevideo.format(ahora + 2 * 86_400_000)
  const completos = datosCompletos(datos)

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!fecha) {
      setError("Elegí para qué día lo necesitás.")
      document.getElementById(`${base}-fecha`)?.focus()
      return
    }
    if (minimo && fecha < minimo) {
      setError("Necesitamos al menos 48 horas: elegí una fecha más adelante.")
      document.getElementById(`${base}-fecha`)?.focus()
      return
    }
    if (!completos) {
      setError(null)
      abrirPanel("datos")
      return
    }
    setError(null)
    const dia = fechaLegible.format(new Date(`${fecha}T12:00:00Z`))
    const mensaje = [
      "¡Hola, La Espiga! Quiero hacer un encargo:",
      "",
      ...(esTorta
        ? [
            "• Torta a medida:",
            ...torta.lineas.map((l) => `   – ${l}`),
            `   – Precio estimado: ${pesos(torta.precio)}`,
          ]
        : [`• ${tipo} para ${cantidad} personas`]),
      `• Para el ${dia}`,
      detalle.trim() ? `• Detalle: ${detalle.trim()}` : "",
      "",
      `Nombre: ${datos.nombre}`,
      `Teléfono: ${datos.telefono}`,
      datos.notas.trim() ? `Notas y alergias: ${datos.notas.trim()}` : "",
      "",
      "¿Me pasan presupuesto? ¡Gracias!",
    ]
      .filter((l, i, arr) => l !== "" || arr[i - 1] !== "")
      .join("\n")
    window.open(whatsappDemo(mensaje), "_blank", "noopener,noreferrer")
  }

  return (
    <form
      id="nota-encargo"
      onSubmit={enviar}
      noValidate
      className="rayado sombra-papel relative rotate-[0.6deg] rounded-sm px-5 pt-8 pb-7 pl-[3.4rem] sm:px-8 sm:pl-[3.8rem]"
      aria-labelledby={`${base}-titulo`}
    >
      <span
        className="cinta -top-3 left-1/2 -translate-x-1/2 rotate-2"
        aria-hidden="true"
      />
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={`${base}-titulo`} className="titulo text-[1.9rem]">
          Nota de encargo
        </h3>
        <p className="tiza text-[1.2rem] text-[var(--rojo)]">N.º 0417</p>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 font-bold">¿Qué necesitás?</legend>
        <div className="grid grid-cols-2 gap-2">
          {tipos.map((t) => (
            <label
              key={t}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-2 rounded-md border-2 px-3 py-2 leading-tight has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--rojo)]",
                tipo === t
                  ? "border-[var(--tinta)] bg-[var(--amarilla)]"
                  : "border-[var(--tinta-20)] bg-[#fffdf7]"
              )}
            >
              <input
                type="radio"
                name={`${base}-tipo`}
                value={t}
                checked={tipo === t}
                onChange={() => setTipo(t)}
                className="size-4 shrink-0 accent-[var(--rojo)]"
              />
              <span className="font-bold">{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {esTorta && (
        <div className="mt-5 rounded-md border-2 border-[var(--tinta)] bg-[#fffdf7] p-3">
          <p className="font-bold">Tu torta</p>
          <ul className="mt-1 text-[0.98rem]">
            {torta.lineas.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-1 font-bold">
            Precio estimado: {pesos(torta.precio)}
          </p>
          <a
            href="#torta"
            className="mt-1 inline-flex min-h-11 items-center gap-1.5 font-bold text-[var(--rojo)] underline underline-offset-4"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
            Cambiarla en el modelo 3D
          </a>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className={esTorta ? "hidden" : undefined}>
          <label
            htmlFor={`${base}-personas`}
            className="mb-1.5 block font-bold"
          >
            ¿Para cuántas personas?
          </label>
          <select
            id={`${base}-personas`}
            className="campo"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          >
            {personas.map((p) => (
              <option key={p} value={p}>
                {p} personas
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${base}-fecha`} className="mb-1.5 block font-bold">
            ¿Para qué día?
          </label>
          <input
            id={`${base}-fecha`}
            type="date"
            className="campo"
            min={minimo}
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value)
              setError(null)
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${base}-fecha-ayuda${error ? ` ${base}-error` : ""}`}
          />
          <p
            id={`${base}-fecha-ayuda`}
            className="mt-1 text-[0.95rem] text-[var(--tinta-70)]"
          >
            Con 48 horas de anticipación.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`${base}-detalle`} className="mb-1.5 block font-bold">
          Contanos un poco más (opcional)
        </label>
        <textarea
          id={`${base}-detalle`}
          className="campo min-h-24 resize-y"
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          placeholder="Ej.: torta de chocolate con dulce de leche, que diga «Feliz cumple, Pocha»"
        />
      </div>

      <div className="mt-5 rounded-md bg-[rgba(214,185,141,0.35)] p-3">
        {completos ? (
          <p>
            Te contestamos a <strong>{datos.nombre}</strong> al{" "}
            <strong>{datos.telefono}</strong>.{" "}
            <button
              type="button"
              onClick={() => abrirPanel("datos")}
              className="font-bold text-[var(--rojo)] underline underline-offset-4"
            >
              Cambiar
            </button>
          </p>
        ) : (
          <p className="flex flex-wrap items-center gap-x-2">
            Para responderte usamos “Mis datos”.
            <button
              type="button"
              onClick={() => abrirPanel("datos")}
              className="inline-flex min-h-11 items-center gap-1.5 font-bold text-[var(--rojo)] underline underline-offset-4"
            >
              <UserRound className="size-4" aria-hidden="true" />
              Completar mis datos
            </button>
          </p>
        )}
      </div>

      <p
        id={`${base}-error`}
        role="alert"
        className="mt-3 min-h-6 font-bold text-[var(--rojo)]"
      >
        {error}
      </p>

      <button
        type="submit"
        className="boton-rojo mt-1 w-full rounded-md px-5 text-[1.05rem]"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
        Pedir presupuesto por WhatsApp
      </button>
    </form>
  )
}
