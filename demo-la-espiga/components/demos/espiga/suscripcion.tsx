"use client"

import { useState } from "react"
import { CalendarCheck, MessageCircle, Pause, Play, UserRound, X } from "lucide-react"

import {
  DESCUENTO_SUSCRIPCION,
  diasSuscripcion,
  franjasSuscripcion,
  panesSuscripcion,
} from "@/components/demos/espiga/contenido"
import {
  abrirPanel,
  avisar,
  datosCompletos,
  guardarSuscripcion,
  useDatos,
  useSuscripcion,
  type Suscripcion,
} from "@/components/demos/espiga/estado"
import { pesos, whatsappDemo } from "@/lib/demo"
import { cn } from "@/lib/utils"

function calcular(pan: string, dias: number[]) {
  const p = panesSuscripcion.find((x) => x.id === pan) ?? panesSuscripcion[0]
  const lista = p.precio * dias.length
  const semana = Math.round(lista * (1 - DESCUENTO_SUSCRIPCION))
  return { p, lista, semana, ahorro: lista - semana }
}

const listarDias = (dias: number[]) => {
  const nombres = diasSuscripcion.filter((d) => dias.includes(d.n)).map((d) => d.largo)
  if (nombres.length <= 1) return nombres.join("")
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`
}

/** Pan de la semana: el mismo pan, los días que elijas, con 10 % menos. */
export function PanDeLaSemana() {
  const datos = useDatos()
  const activa = useSuscripcion()
  const [pan, setPan] = useState("campo")
  const [dias, setDias] = useState<number[]>([2, 4, 6])
  const [franja, setFranja] = useState(franjasSuscripcion[0])
  const [error, setError] = useState<string | null>(null)
  const c = calcular(pan, dias)
  const completos = datosCompletos(datos)

  function alternarDia(n: number) {
    setError(null)
    setDias((d) => (d.includes(n) ? d.filter((x) => x !== n) : [...d, n].sort()))
  }

  function suscribir(e: React.FormEvent) {
    e.preventDefault()
    if (dias.length === 0) {
      setError("Elegí al menos un día de la semana.")
      return
    }
    if (!completos) {
      abrirPanel("datos")
      return
    }
    const nueva: Omit<Suscripcion, "desde"> = {
      pan,
      dias,
      franja,
      modalidad: datos.modalidad,
      pausada: false,
    }
    const mensaje = [
      "¡Hola, La Espiga! Quiero suscribirme al pan de la semana:",
      "",
      `• ${c.p.nombre}, los ${listarDias(dias)}`,
      `• ${datos.modalidad === "domicilio" ? `Envío a ${datos.direccion}` : "Lo paso a buscar"}, de ${franja}`,
      `• ${pesos(c.semana)} por semana (10 % menos)`,
      "",
      `Nombre: ${datos.nombre}`,
      `Teléfono: ${datos.telefono}`,
      "",
      "¡Gracias!",
    ].join("\n")
    window.open(whatsappDemo(mensaje), "_blank", "noopener,noreferrer")
    guardarSuscripcion(nueva)
    avisar("Guardamos tu suscripción. Te confirmamos por WhatsApp.")
  }

  if (activa) {
    const a = calcular(activa.pan, activa.dias)
    return (
      <div className="ticket sombra-papel px-6 py-8">
        <p className="volanta flex items-center gap-2 text-[var(--rojo)]">
          <CalendarCheck className="size-4" aria-hidden="true" />
          Tu suscripción {activa.pausada ? "está en pausa" : "está activa"}
        </p>
        <p className="titulo mt-2 text-[1.8rem] leading-tight">{a.p.nombre}</p>
        <p className="mt-1 text-[1.1rem]">
          Los {listarDias(activa.dias)}, de {activa.franja}.{" "}
          {activa.modalidad === "domicilio" ? "Te lo llevamos." : "Lo pasás a buscar."}
        </p>
        <p className="titulo mt-3 text-[1.6rem]">{pesos(a.semana)} por semana</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              guardarSuscripcion({ ...activa, pausada: !activa.pausada })
              avisar(activa.pausada ? "Reactivamos tu pan de la semana." : "Pausamos tu pan de la semana.")
            }}
            className="boton-tinta rounded-md px-4"
          >
            {activa.pausada ? (
              <Play className="size-5" aria-hidden="true" />
            ) : (
              <Pause className="size-5" aria-hidden="true" />
            )}
            {activa.pausada ? "Reactivar" : "Pausar (me voy de viaje)"}
          </button>
          <button
            type="button"
            onClick={() => {
              guardarSuscripcion(null)
              avisar("Cancelaste tu suscripción.")
            }}
            className="boton-borde rounded-md px-4"
          >
            <X className="size-5" aria-hidden="true" />
            Cancelar
          </button>
        </div>
        <p className="mt-3 text-[0.95rem] text-[var(--tinta-70)]">
          Podés pausarla o cancelarla cuando quieras, sin costo.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={suscribir}
      noValidate
      className="rayado sombra-papel rounded-sm px-5 pt-7 pb-6 pl-[3.4rem] sm:px-8 sm:pl-[3.8rem]"
    >
      <fieldset>
        <legend className="mb-2 font-bold">¿Qué pan?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {panesSuscripcion.map((p) => (
            <label
              key={p.id}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-2 rounded-md border-2 px-3 py-2 leading-tight has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--rojo)]",
                pan === p.id
                  ? "border-[var(--tinta)] bg-[var(--amarilla)]"
                  : "border-[var(--tinta-20)] bg-[#fffdf7]"
              )}
            >
              <input
                type="radio"
                name="suscripcion-pan"
                checked={pan === p.id}
                onChange={() => setPan(p.id)}
                className="size-4 shrink-0 accent-[var(--rojo)]"
              />
              <span className="font-bold">{p.nombre}</span>
              <span className="ml-auto shrink-0 tabular-nums">{pesos(p.precio)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="mb-2 font-bold">¿Qué días?</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {diasSuscripcion.map((d) => {
            const on = dias.includes(d.n)
            return (
              <label
                key={d.n}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center justify-center gap-1.5 rounded-md border-2 font-bold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--rojo)]",
                  on
                    ? "border-[var(--tinta)] bg-[var(--tinta)] text-[var(--papel)]"
                    : "border-[var(--tinta-20)] bg-[#fffdf7]"
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => alternarDia(d.n)}
                  className="sr-only"
                />
                <span aria-hidden="true">{d.corto}</span>
                <span className="sr-only">{d.largo}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="suscripcion-franja" className="mb-1.5 block font-bold">
          ¿A qué hora?
        </label>
        <select
          id="suscripcion-franja"
          className="campo"
          value={franja}
          onChange={(e) => setFranja(e.target.value)}
        >
          {franjasSuscripcion.map((f) => (
            <option key={f} value={f}>
              De {f}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[0.95rem] text-[var(--tinta-70)]">
          {datos.modalidad === "domicilio"
            ? "Te lo llevamos a la dirección de “Mis datos”, sin costo de envío."
            : "Lo dejamos apartado con tu nombre. Si preferís envío, cambialo en “Mis datos”."}
        </p>
      </div>

      <div className="kraft mt-5 rounded-md border-2 border-[var(--tinta)] p-4" aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-bold">Por semana</p>
          <p className="titulo text-[2.2rem] leading-none tabular-nums">
            {pesos(c.semana)}
          </p>
        </div>
        {c.ahorro > 0 && (
          <p className="mt-1 text-[0.95rem]">
            <s>{pesos(c.lista)}</s> · ahorrás {pesos(c.ahorro)} cada semana
          </p>
        )}
      </div>

      <p role="alert" className="mt-3 min-h-6 font-bold text-[var(--rojo)]">
        {error}
      </p>
      <button type="submit" className="boton-rojo mt-1 w-full rounded-md px-5 text-[1.05rem]">
        {completos ? (
          <MessageCircle className="size-5" aria-hidden="true" />
        ) : (
          <UserRound className="size-5" aria-hidden="true" />
        )}
        {completos ? "Suscribirme por WhatsApp" : "Completar mis datos para suscribirme"}
      </button>
    </form>
  )
}
