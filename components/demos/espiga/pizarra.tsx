"use client"

import Image from "next/image"
import { Tabs } from "radix-ui"
import { Minus, Plus } from "lucide-react"

import {
  carta,
  categorias,
  type Producto,
} from "@/components/demos/espiga/carta"
import {
  cambiarCantidad,
  useAhora,
  useBolsa,
} from "@/components/demos/espiga/estado"
import { pesos } from "@/lib/demo"

const fechaLarga = new Intl.DateTimeFormat("es-UY", {
  timeZone: "America/Montevideo",
  weekday: "long",
  day: "numeric",
  month: "long",
})

function Miniatura({ producto }: { producto: Producto }) {
  const Icono = producto.icono
  return (
    <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-[var(--tiza-30)] sm:size-24">
      {producto.foto ? (
        <Image
          src={producto.foto.src}
          alt=""
          fill
          sizes="96px"
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center border-2 border-dashed border-transparent">
          <Icono
            className="size-9 text-[var(--tiza-70)] sm:size-10"
            strokeWidth={1.4}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

function Renglon({
  producto,
  cantidad,
}: {
  producto: Producto
  cantidad: number
}) {
  return (
    <li className="flex gap-4 border-b-2 border-dashed border-[var(--tiza-30)] py-5 sm:gap-5">
      <Miniatura producto={producto} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="titulo text-[1.3rem] text-[var(--tiza)] sm:text-[1.45rem]">
            {producto.nombre}
          </h3>
          <span className="puntos hidden sm:block" aria-hidden="true" />
          <p className="tiza ml-auto shrink-0 text-[1.55rem] font-bold text-[var(--amarilla)] tabular-nums sm:ml-0">
            {pesos(producto.precio)}
          </p>
        </div>
        <p className="mt-1 text-[var(--tiza-70)]">{producto.detalle}</p>
        {producto.nota && (
          <p className="tiza mt-1 text-[1.15rem] text-[var(--amarilla)]">
            ↳ {producto.nota}
          </p>
        )}
        <div className="mt-3">
          {cantidad === 0 ? (
            <button
              type="button"
              onClick={() => cambiarCantidad(producto.id, 1)}
              className="boton-tiza rounded-md px-4 text-[1rem]"
            >
              <Plus className="size-5" aria-hidden="true" />
              Agregar a la bolsa
              <span className="sr-only">: {producto.nombre}</span>
            </button>
          ) : (
            <div
              className="inline-flex items-center gap-1 rounded-md bg-[var(--tiza)] p-1 text-[var(--tinta)]"
              role="group"
              aria-label={`Cantidad de ${producto.nombre}`}
            >
              <button
                type="button"
                onClick={() => cambiarCantidad(producto.id, -1)}
                aria-label={
                  cantidad === 1
                    ? `Quitar ${producto.nombre} de la bolsa`
                    : `Uno menos de ${producto.nombre}`
                }
                className="flex size-11 items-center justify-center rounded-md hover:bg-[var(--papel-2)]"
              >
                <Minus className="size-5" aria-hidden="true" />
              </button>
              <span className="min-w-[4.5rem] text-center font-bold tabular-nums">
                {cantidad} en la bolsa
              </span>
              <button
                type="button"
                onClick={() => cambiarCantidad(producto.id, 1)}
                aria-label={`Uno más de ${producto.nombre}`}
                className="flex size-11 items-center justify-center rounded-md bg-[var(--rojo)] text-[var(--papel)] hover:bg-[var(--rojo-2)]"
              >
                <Plus className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

/** La carta: una pizarra con pestañas por categoría. */
export function Pizarra() {
  const bolsa = useBolsa()
  const ahora = useAhora()

  return (
    <div className="pizarra marco px-4 py-7 sm:px-8 md:px-10 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h2 className="tiza text-[2.6rem] font-bold sm:text-[3.4rem]">
          La pizarra de hoy
        </h2>
        <p className="tiza pb-2 text-[1.35rem] text-[var(--tiza-70)] first-letter:uppercase">
          {ahora === null
            ? "Precios en pesos uruguayos"
            : fechaLarga.format(ahora)}
        </p>
      </div>
      <p className="mt-2 max-w-2xl text-[var(--tiza-70)]">
        Elegí lo que quieras llevar y sumalo a tu bolsa. Después elegís a qué
        hora pasás y nos mandás el pedido por WhatsApp.
      </p>

      <Tabs.Root defaultValue="panes" className="mt-7">
        <Tabs.List
          aria-label="Categorías de la carta"
          className="grid grid-cols-2 gap-2 md:flex md:flex-wrap"
        >
          {categorias.map((c) => (
            <Tabs.Trigger
              key={c.id}
              value={c.id}
              className="min-h-13 rounded-md border-2 border-dashed border-[var(--tiza-30)] px-4 py-2 text-left text-[1.05rem] leading-tight font-bold text-[var(--tiza)] transition-colors hover:border-[var(--tiza)] data-[state=active]:border-solid data-[state=active]:border-[var(--amarilla)] data-[state=active]:bg-[var(--amarilla)] data-[state=active]:text-[var(--tinta)] md:text-center"
            >
              {c.nombre}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {categorias.map((c) => (
          <Tabs.Content key={c.id} value={c.id} className="mt-6 outline-none">
            <p className="tiza text-[1.3rem] text-[var(--amarilla)]">
              {c.bajada}
            </p>
            <ul className="mt-1 grid gap-x-12 lg:grid-cols-2">
              {carta
                .filter((p) => p.categoria === c.id)
                .map((p) => (
                  <Renglon
                    key={p.id}
                    producto={p}
                    cantidad={bolsa[p.id] ?? 0}
                  />
                ))}
            </ul>
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <p className="tiza mt-6 text-[1.2rem] text-[var(--tiza-70)]">
        * Si tenés alguna alergia, avisanos en “Mis datos” y lo tenemos en
        cuenta.
      </p>
    </div>
  )
}
