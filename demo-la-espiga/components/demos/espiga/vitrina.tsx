"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { FileText, Minus, Plus, Tag } from "lucide-react"

import { productoPorId, promoDelDia } from "@/components/demos/espiga/carta"
import {
  abrirFicha,
  cambiarCantidad,
  useAhora,
  useBolsa,
} from "@/components/demos/espiga/estado"
import { momentoMontevideo } from "@/components/demos/espiga/horario"
import { Diferido, Inclinable } from "@/components/demos/espiga/tres-d"
import { pesos } from "@/lib/demo"
import { cn } from "@/lib/utils"

const VitrinaEscena = dynamic(
  () =>
    import("@/components/demos/espiga/vitrina-escena").then(
      (m) => m.VitrinaEscena
    ),
  { ssr: false, loading: () => <ReservaVitrina /> }
)

function ReservaVitrina() {
  return <div className="vitrina-reserva" aria-hidden="true" />
}

const semana = [
  { dia: "Lunes", id: "promo-budin" },
  { dia: "Martes", id: "promo-bizcochos" },
  { dia: "Miércoles", id: "promo-miga" },
  { dia: "Jueves", id: "promo-ricota" },
  { dia: "Viernes", id: "promo-pizza" },
  { dia: "Sábado", id: "promo-alfajores" },
  { dia: "Domingo", id: "promo-domingo" },
]

/** "Hoy en el mostrador": vitrina 3D con las promos y su ficha al lado. */
export function Vitrina() {
  const ahora = useAhora()
  const bolsa = useBolsa()
  const dia = ahora === null ? 1 : momentoMontevideo(ahora).dia
  const delDia = promoDelDia[dia]
  const ids = [delDia, "ayer", "combo-mate", "docena-medialunas"]
  const items = ids.flatMap((id) => {
    const p = productoPorId.get(id)
    return p ? [p] : []
  })
  const [elegidoId, setElegidoId] = useState<string | null>(null)
  const elegido =
    items.find((p) => p.id === elegidoId) ?? items[0]
  const cantidad = bolsa[elegido.id] ?? 0
  const ahorro = elegido.antes ? elegido.antes - elegido.precio : 0

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
      <div>
        <Diferido reserva={<ReservaVitrina />}>
          <VitrinaEscena
            items={items}
            elegido={elegido.id}
            onElegir={setElegidoId}
            delDia={delDia}
          />
        </Diferido>
        <p className="mt-3 text-center text-[var(--tinta-70)]">
          Pasá el mouse o tocá una bandeja para verla de cerca.
        </p>
      </div>

      <div>
        <Inclinable
          as="article"
          aria-live="polite"
          className="ticket sombra-papel px-6 py-8 sm:px-8"
        >
          <p className="volanta flex items-center gap-2 text-[var(--rojo)]">
            <Tag className="size-4" aria-hidden="true" />
            {elegido.id === delDia ? "La promo de hoy" : "En el mostrador"}
          </p>
          <h3 className="titulo mt-2 text-[2rem] leading-tight">
            {elegido.nombre}
          </h3>
          <p className="mt-2 text-[1.1rem]">{elegido.detalle}</p>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
            <span className="titulo text-[2.6rem] leading-none tabular-nums">
              {pesos(elegido.precio)}
            </span>
            {elegido.antes && (
              <s className="text-[1.15rem] text-[var(--tinta-70)] tabular-nums">
                {pesos(elegido.antes)}
              </s>
            )}
          </p>
          {ahorro > 0 && (
            <p className="mt-2 inline-block -rotate-2 rounded-sm bg-[var(--amarilla)] px-2 py-0.5 font-bold">
              Ahorrás {pesos(ahorro)}
            </p>
          )}
          {elegido.nota && (
            <p className="tiza mt-2 text-[1.3rem] text-[var(--rojo)]">
              ↳ {elegido.nota}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {cantidad === 0 ? (
              <button
                type="button"
                onClick={() => cambiarCantidad(elegido.id, 1)}
                className="boton-rojo rounded-md px-5"
              >
                <Plus className="size-5" aria-hidden="true" />
                Agregar a la bolsa
              </button>
            ) : (
              <div
                className="inline-flex items-center rounded-md border-2 border-[var(--tinta)]"
                role="group"
                aria-label={`Cantidad de ${elegido.nombre}`}
              >
                <button
                  type="button"
                  onClick={() => cambiarCantidad(elegido.id, -1)}
                  aria-label={`Uno menos de ${elegido.nombre}`}
                  className="flex size-12 items-center justify-center hover:bg-[var(--papel-2)]"
                >
                  <Minus className="size-5" aria-hidden="true" />
                </button>
                <span className="min-w-[6rem] text-center font-bold tabular-nums">
                  {cantidad} en la bolsa
                </span>
                <button
                  type="button"
                  onClick={() => cambiarCantidad(elegido.id, 1)}
                  aria-label={`Uno más de ${elegido.nombre}`}
                  className="flex size-12 items-center justify-center bg-[var(--rojo)] text-[var(--papel)] hover:bg-[var(--rojo-2)]"
                >
                  <Plus className="size-5" aria-hidden="true" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => abrirFicha(elegido.id)}
              className="inline-flex min-h-12 items-center gap-1.5 rounded-md px-2 font-bold underline underline-offset-4"
            >
              <FileText className="size-4" aria-hidden="true" />
              Ingredientes
            </button>
          </div>
        </Inclinable>

        <div className="mt-6">
          <p className="font-bold">La promo de cada día</p>
          <ul className="mt-2 grid grid-cols-1 gap-x-6 text-[1rem] sm:grid-cols-2 lg:grid-cols-1">
            {semana.map((s) => {
              const p = productoPorId.get(s.id)
              if (!p) return null
              const hoy = s.id === delDia
              return (
                <li
                  key={s.id}
                  className={cn(
                    "flex items-baseline gap-2 border-b border-dashed border-[var(--tinta-20)] py-1.5",
                    hoy && "font-bold text-[var(--rojo)]"
                  )}
                >
                  <span className="w-24 shrink-0">{s.dia}</span>
                  <span className="min-w-0 flex-1">
                    {p.detalle.split(".")[0]}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {pesos(p.precio)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
