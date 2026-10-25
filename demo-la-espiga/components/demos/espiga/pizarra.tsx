"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs } from "radix-ui"
import { FileText, Minus, Plus, X } from "lucide-react"

import {
  carta,
  categorias,
  cumpleFiltro,
  filtros,
  type Filtro,
  type Producto,
} from "@/components/demos/espiga/carta"
import {
  abrirFicha,
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
        {(producto.sinTacc || producto.vegano) && (
          <p className="mt-2 flex flex-wrap gap-1.5">
            {producto.sinTacc && (
              <span className="rounded-full border-2 border-[var(--amarilla)] px-2.5 text-[0.9rem] font-bold text-[var(--amarilla)]">
                Sin TACC
              </span>
            )}
            {producto.vegano && (
              <span className="rounded-full border-2 border-[var(--tiza-70)] px-2.5 text-[0.9rem] font-bold text-[var(--tiza)]">
                Vegano
              </span>
            )}
          </p>
        )}
        {producto.nota && (
          <p className="tiza mt-1 text-[1.15rem] text-[var(--amarilla)]">
            ↳ {producto.nota}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
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
          <button
            type="button"
            onClick={() => abrirFicha(producto.id)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 font-bold text-[var(--tiza)] underline decoration-[var(--tiza-30)] underline-offset-4 hover:decoration-current"
          >
            <FileText className="size-4" aria-hidden="true" />
            Ingredientes
            <span className="sr-only"> y alérgenos de {producto.nombre}</span>
          </button>
        </div>
      </div>
    </li>
  )
}

/** La carta: una pizarra con pestañas por categoría y filtros por alérgeno. */
export function Pizarra() {
  const bolsa = useBolsa()
  const ahora = useAhora()
  const [activos, setActivos] = useState<Filtro[]>([])

  const pasa = (p: Producto) => activos.every((f) => cumpleFiltro(p, f))
  const alternar = (f: Filtro) =>
    setActivos((a) => (a.includes(f) ? a.filter((x) => x !== f) : [...a, f]))
  const total = carta.filter((p) => p.categoria !== "promos" && pasa(p)).length

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

      <div
        role="group"
        aria-labelledby="titulo-filtros"
        className="mt-6 rounded-md border-2 border-dashed border-[var(--tiza-30)] p-3 sm:p-4"
      >
        <p id="titulo-filtros" className="tiza text-[1.3rem]">
          ¿Tenés alguna restricción? Mostrame solo lo…
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {filtros.map((f) => {
            const on = activos.includes(f.id)
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => alternar(f.id)}
                className={
                  on
                    ? "inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-[var(--amarilla)] bg-[var(--amarilla)] px-4 font-bold text-[var(--tinta)]"
                    : "inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-[var(--tiza-30)] px-4 font-bold text-[var(--tiza)] hover:border-[var(--tiza)]"
                }
              >
                {on && <X className="size-4" aria-hidden="true" />}
                {f.nombre}
              </button>
            )
          })}
        </div>
        <p role="status" className="mt-2 min-h-6 text-[var(--tiza-70)]">
          {activos.length > 0 &&
            `${total} ${total === 1 ? "producto apto" : "productos aptos"} en toda la pizarra.`}
        </p>
      </div>

      <Tabs.Root defaultValue="panes" className="mt-6">
        <Tabs.List
          aria-label="Categorías de la carta"
          className="grid grid-cols-2 gap-2 md:flex md:flex-wrap"
        >
          {categorias.map((c) => {
            const n = carta.filter(
              (p) => p.categoria === c.id && pasa(p)
            ).length
            return (
              <Tabs.Trigger
                key={c.id}
                value={c.id}
                className="min-h-13 rounded-md border-2 border-dashed border-[var(--tiza-30)] px-4 py-2 text-left text-[1.05rem] leading-tight font-bold text-[var(--tiza)] transition-colors hover:border-[var(--tiza)] data-[state=active]:border-solid data-[state=active]:border-[var(--amarilla)] data-[state=active]:bg-[var(--amarilla)] data-[state=active]:text-[var(--tinta)] md:text-center"
              >
                {c.nombre}
                {activos.length > 0 && (
                  <span className="ml-1.5 tabular-nums">({n})</span>
                )}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {categorias.map((c) => {
          const lista = carta.filter((p) => p.categoria === c.id && pasa(p))
          return (
            <Tabs.Content key={c.id} value={c.id} className="mt-6 outline-none">
              <p className="tiza text-[1.3rem] text-[var(--amarilla)]">
                {c.bajada}
              </p>
              {lista.length === 0 ? (
                <div className="mt-4 rounded-md border-2 border-dashed border-[var(--tiza-30)] p-5">
                  <p className="tiza text-[1.5rem]">
                    En esta parte de la pizarra no hay nada con ese filtro.
                  </p>
                  <p className="mt-1 text-[var(--tiza-70)]">
                    Probá en otra pestaña, o encargalo: muchas cosas las
                    hacemos a pedido.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActivos([])}
                    className="boton-tiza mt-3 rounded-md px-4"
                  >
                    Sacar los filtros
                  </button>
                </div>
              ) : (
                <ul className="mt-1 grid gap-x-12 lg:grid-cols-2">
                  {lista.map((p) => (
                    <Renglon
                      key={p.id}
                      producto={p}
                      cantidad={bolsa[p.id] ?? 0}
                    />
                  ))}
                </ul>
              )}
            </Tabs.Content>
          )
        })}
      </Tabs.Root>

      <p className="tiza mt-6 text-[1.2rem] text-[var(--tiza-70)]">
        * Tocá “Ingredientes” en cada producto para ver sus alérgenos. Si
        tenés alguna alergia, avisanos en “Mis datos”.
      </p>
    </div>
  )
}
