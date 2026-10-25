"use client"

import dynamic from "next/dynamic"
import { ArrowDown } from "lucide-react"

import {
  bizcochuelos,
  coberturas,
  decoraciones,
  detalleTorta,
  pisosTorta,
  rellenos,
  type Decoracion,
  type Opcion,
} from "@/components/demos/espiga/contenido"
import {
  cambiarTorta,
  elegirTipoEncargo,
  useTorta,
} from "@/components/demos/espiga/estado"
import { Diferido } from "@/components/demos/espiga/tres-d"
import { pesos } from "@/lib/demo"
import { cn } from "@/lib/utils"

const TortaEscena = dynamic(
  () =>
    import("@/components/demos/espiga/torta-escena").then(
      (m) => m.TortaEscena
    ),
  { ssr: false, loading: () => <ReservaTorta /> }
)

function ReservaTorta() {
  return <div className="torta-reserva" aria-hidden="true" />
}

const chip =
  "flex min-h-12 cursor-pointer items-center gap-2 rounded-md border-2 px-3 py-2 leading-tight has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--rojo)]"
const chipOn = "border-[var(--tinta)] bg-[var(--amarilla)]"
const chipOff = "border-[var(--tinta-20)] bg-[#fffdf7] hover:border-[var(--tinta)]"

function Grupo({
  titulo,
  nombre,
  opciones,
  valor,
  onChange,
  porPiso = false,
  muestra,
}: {
  titulo: string
  nombre: string
  opciones: Opcion[]
  valor: string
  onChange: (id: string) => void
  porPiso?: boolean
  muestra?: (id: string) => string
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-bold">{titulo}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {opciones.map((o) => (
          <label key={o.id} className={cn(chip, valor === o.id ? chipOn : chipOff)}>
            <input
              type="radio"
              name={nombre}
              value={o.id}
              checked={valor === o.id}
              onChange={() => onChange(o.id)}
              className="size-4 shrink-0 accent-[var(--rojo)]"
            />
            {muestra && (
              <span
                aria-hidden="true"
                className="size-5 shrink-0 rounded-full border-2 border-[var(--tinta)]"
                style={{ background: muestra(o.id) }}
              />
            )}
            <span className="min-w-0">
              <span className="block font-bold">{o.nombre}</span>
              {o.extra > 0 && (
                <span className="block text-[0.9rem] text-[var(--tinta-70)]">
                  + {pesos(o.extra)}
                  {porPiso ? " por piso" : ""}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** Torta a medida: el modelo 3D cambia con cada opción y el precio también. */
export function TortaAMedida() {
  const c = useTorta()
  const d = detalleTorta(c)

  function alternarDeco(id: Decoracion) {
    cambiarTorta({
      deco: c.deco.includes(id)
        ? c.deco.filter((x) => x !== id)
        : [...c.deco, id],
    })
  }

  function seguir() {
    elegirTipoEncargo("Torta")
    const nota = document.getElementById("nota-encargo")
    if (!nota) return
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    nota.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "start" })
    window.setTimeout(
      () => nota.querySelector<HTMLElement>("input[type=date]")?.focus({ preventScroll: true }),
      reducir ? 0 : 600
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div className="lg:sticky lg:top-24">
        <div className="papel sombra-papel rounded-md border-2 border-[var(--tinta)] p-3 sm:p-4">
          <Diferido reserva={<ReservaTorta />}>
            <TortaEscena config={c} />
          </Diferido>
        </div>
        <p className="mt-3 text-center text-[var(--tinta-70)]">
          Arrastrala de costado para verla de todos lados.
        </p>
      </div>

      <div className="rayado sombra-papel rounded-sm px-5 pt-7 pb-6 pl-[3.4rem] sm:px-8 sm:pl-[3.8rem]">
        <h3 className="titulo text-[1.9rem]">Armá tu torta</h3>
        <p className="mt-1 text-[var(--tinta-70)]">
          Elegí y mirala cambiar. El precio es estimado: te lo confirmamos por
          WhatsApp.
        </p>

        <fieldset className="mt-5">
          <legend className="mb-2 font-bold">¿De cuántos pisos?</legend>
          <div className="grid grid-cols-3 gap-2">
            {pisosTorta.map((p) => (
              <label
                key={p.n}
                className={cn(
                  chip,
                  "flex-col items-start gap-0.5",
                  c.pisos === p.n ? chipOn : chipOff
                )}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="torta-pisos"
                    value={p.n}
                    checked={c.pisos === p.n}
                    onChange={() => cambiarTorta({ pisos: p.n })}
                    className="size-4 shrink-0 accent-[var(--rojo)]"
                  />
                  <span className="font-bold">
                    {p.n} {p.n === 1 ? "piso" : "pisos"}
                  </span>
                </span>
                <span className="text-[0.9rem] text-[var(--tinta-70)]">
                  {p.porciones} porciones
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-5">
          <Grupo
            titulo="Bizcochuelo"
            nombre="torta-bizcochuelo"
            opciones={bizcochuelos}
            valor={d.bizcochuelo.id}
            onChange={(id) => cambiarTorta({ bizcochuelo: id })}
          />
          <Grupo
            titulo="Relleno"
            nombre="torta-relleno"
            opciones={rellenos}
            valor={d.relleno.id}
            onChange={(id) => cambiarTorta({ relleno: id })}
            porPiso
          />
          <Grupo
            titulo="Cubierta"
            nombre="torta-cobertura"
            opciones={coberturas}
            valor={d.cobertura.id}
            onChange={(id) => cambiarTorta({ cobertura: id })}
            porPiso
            muestra={(id) => coberturas.find((x) => x.id === id)?.lado ?? ""}
          />

          <fieldset>
            <legend className="mb-2 font-bold">Decoración (podés elegir varias)</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {decoraciones.map((o) => {
                const on = c.deco.includes(o.id)
                return (
                  <label key={o.id} className={cn(chip, on ? chipOn : chipOff)}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => alternarDeco(o.id)}
                      className="size-4 shrink-0 accent-[var(--rojo)]"
                    />
                    <span className="min-w-0">
                      <span className="block font-bold">{o.nombre}</span>
                      <span className="block text-[0.9rem] text-[var(--tinta-70)]">
                        + {pesos(o.precio)}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
            {c.deco.includes("cartel") && (
              <div className="mt-3">
                <label htmlFor="torta-cartel" className="mb-1.5 block font-bold">
                  ¿Qué dice el cartel?
                </label>
                <input
                  id="torta-cartel"
                  className="campo"
                  maxLength={18}
                  value={c.cartel}
                  onChange={(e) => cambiarTorta({ cartel: e.target.value })}
                  placeholder="Ej.: Feliz cumple, Pocha"
                />
                <p className="mt-1 text-[0.9rem] text-[var(--tinta-70)]">
                  Hasta 18 letras.
                </p>
              </div>
            )}
          </fieldset>
        </div>

        <div className="kraft mt-6 rounded-md border-2 border-[var(--tinta)] p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-bold">Precio estimado</p>
            <p
              key={d.precio}
              aria-live="polite"
              className="precio-cambia titulo text-[2.4rem] leading-none tabular-nums"
            >
              {pesos(d.precio)}
            </p>
          </div>
          <p className="mt-1 text-[0.95rem]">
            {d.piso.porciones} porciones · unos{" "}
            {pesos(Math.round(d.precio / d.piso.porciones))} la porción
          </p>
          <p className="mt-2 text-[0.95rem]">
            <strong>Contiene:</strong> gluten, lactosa, huevo
            {d.nueces ? " y frutos secos (nueces)" : ""}.
          </p>
          <button
            type="button"
            onClick={seguir}
            className="boton-rojo mt-4 w-full rounded-md px-4 text-[1.05rem]"
          >
            <ArrowDown className="size-5" aria-hidden="true" />
            Seguir: elegir el día y pedirla
          </button>
        </div>
      </div>
    </div>
  )
}
