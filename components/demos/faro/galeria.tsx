"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog } from "radix-ui"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import { useFaro } from "@/components/demos/faro/contexto"
import {
  categorias,
  obras,
  type Categoria,
  type Obra,
} from "@/components/demos/faro/obras"
import { cn } from "@/lib/utils"

type Filtro = "Todas" | Categoria

/* Ritmo de la grilla asimétrica en escritorio: se repite cada cinco obras. */
const ritmo = [
  { celda: "lg:col-span-7", foto: "aspect-[4/3]" },
  { celda: "lg:col-span-4 lg:col-start-9 lg:mt-40", foto: "aspect-[3/4]" },
  { celda: "lg:col-span-5 lg:col-start-2", foto: "aspect-[4/5]" },
  { celda: "lg:col-span-5 lg:col-start-8 lg:mt-56", foto: "aspect-[4/3]" },
  { celda: "lg:col-span-8 lg:col-start-3", foto: "aspect-[16/9]" },
]
/* En celular, anchos alternados para que no sea una columna monótona. */
const ritmoMovil = ["w-full", "ml-auto w-[86%]", "w-[86%]"]

const dosDigitos = (n: number) => String(n).padStart(2, "0")

/**
 * Obras en grilla asimétrica con filtros por tipo. Cada obra abre su ficha
 * (foto grande, ficha técnica, texto) con anterior/siguiente por teclado.
 */
export function Galeria() {
  const [filtro, setFiltro] = useState<Filtro>("Todas")
  const [indice, setIndice] = useState(0)
  const [abierta, setAbierta] = useState(false)

  const visibles =
    filtro === "Todas" ? obras : obras.filter((o) => o.categoria === filtro)

  const contar = (f: Filtro) =>
    f === "Todas"
      ? obras.length
      : obras.filter((o) => o.categoria === f).length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-[var(--linea)] pb-4">
        <div
          role="group"
          aria-label="Filtrar obras por tipo"
          className="flex flex-wrap gap-x-5 gap-y-1 sm:gap-x-7"
        >
          {(["Todas", ...categorias] as Filtro[]).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filtro === f}
              onClick={() => {
                setFiltro(f)
                setIndice(0)
              }}
              className={cn(
                "serif min-h-11 text-[1.6rem] transition-colors sm:text-[2rem]",
                filtro === f
                  ? "text-[var(--carbon)] italic"
                  : "text-[var(--piedra)] hover:text-[var(--carbon)]"
              )}
            >
              {f}
              <sup className="mono ml-1 text-[0.6rem] not-italic">
                {dosDigitos(contar(f))}
              </sup>
            </button>
          ))}
        </div>
        <p className="etiqueta text-[var(--piedra)]" aria-live="polite">
          {visibles.length} {visibles.length === 1 ? "obra" : "obras"}
          {filtro !== "Todas" && ` · ${filtro.toLowerCase()}`}
        </p>
      </div>

      <ul
        key={filtro}
        className="aparece mt-12 grid gap-y-16 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-24"
      >
        {visibles.map((o, i) => {
          const r = ritmo[i % ritmo.length]
          return (
            <li
              key={o.id}
              className={cn(
                ritmoMovil[i % ritmoMovil.length],
                "lg:ml-0 lg:w-auto",
                r.celda
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setIndice(i)
                  setAbierta(true)
                }}
                aria-haspopup="dialog"
                className="group block w-full text-left"
              >
                <div
                  className={cn(
                    "relative overflow-hidden bg-[var(--hueso-2)]",
                    r.foto
                  )}
                >
                  <Image
                    src={o.foto.src}
                    alt={`${o.nombre}, ${o.lugar}`}
                    fill
                    sizes="(min-width: 1024px) 60vw, 90vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                  />
                  <span className="etiqueta absolute right-3 bottom-3 bg-[var(--hueso)] px-2 py-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                    Ver ficha
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-3">
                  <span className="mono text-xs text-[var(--piedra)]">
                    {dosDigitos(i + 1)}
                  </span>
                  <h3 className="serif text-[1.75rem] sm:text-[2rem]">
                    <span className="subrayado">{o.nombre}</span>
                  </h3>
                  <span className="mono text-xs text-[var(--piedra)]">
                    {o.anio}
                  </span>
                  <p className="mono col-start-2 col-end-4 mt-1 text-xs text-[var(--piedra)]">
                    {o.categoria} · {o.lugar.split(",")[0]} · {o.m2} m²
                  </p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      <Ficha
        lista={visibles}
        indice={Math.min(indice, visibles.length - 1)}
        abierta={abierta}
        alAbrir={setAbierta}
        alMover={setIndice}
      />
    </div>
  )
}

function Ficha({
  lista,
  indice,
  abierta,
  alAbrir,
  alMover,
}: {
  lista: Obra[]
  indice: number
  abierta: boolean
  alAbrir: (v: boolean) => void
  alMover: (i: number) => void
}) {
  const { abrir, abierta: capa } = useFaro()
  const total = lista.length
  const obra = lista[indice]
  const anterior = lista[(indice - 1 + total) % total]
  const siguiente = lista[(indice + 1) % total]

  const mover = (delta: number) => alMover((indice + delta + total) % total)

  return (
    <Dialog.Root open={abierta} onOpenChange={alAbrir}>
      <Dialog.Overlay className="capa fixed inset-0 z-[60] bg-[var(--carbon)]/70" />
      <Dialog.Content
        className="panel-lateral fixed inset-y-0 right-0 z-[61] flex w-full flex-col overflow-hidden bg-[var(--papel)] text-[var(--carbon)] lg:w-[min(1280px,94vw)]"
        aria-describedby="ficha-bajada"
        onCloseAutoFocus={(e) => {
          // Si se abrió la agenda desde la ficha, el foco queda en la agenda.
          if (capa) e.preventDefault()
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault()
            mover(1)
          } else if (e.key === "ArrowLeft") {
            e.preventDefault()
            mover(-1)
          }
        }}
      >
        <div className="flex items-center justify-between border-b border-[var(--linea)] px-4 py-2 sm:px-8">
          <p className="etiqueta text-[var(--piedra)]">
            Ficha de obra ·{" "}
            <span aria-live="polite">
              {dosDigitos(indice + 1)} / {dosDigitos(total)}
            </span>
          </p>
          <Dialog.Close className="etiqueta inline-flex min-h-11 items-center gap-2 px-1">
            Cerrar
            <X className="size-4" aria-hidden="true" />
          </Dialog.Close>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.45fr_1fr] lg:overflow-hidden">
          <div className="relative aspect-[4/3] bg-[var(--hueso-2)] lg:aspect-auto lg:h-full">
            <Image
              key={obra.id}
              src={obra.foto.src}
              alt={`${obra.nombre}, ${obra.lugar}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="aparece object-cover"
            />
          </div>

          <div
            key={obra.id}
            className="aparece px-4 py-8 sm:px-8 lg:overflow-y-auto lg:py-10"
          >
            <p className="etiqueta text-[var(--piedra)]">{obra.categoria}</p>
            <Dialog.Title className="serif mt-3 text-[clamp(2.6rem,5vw,4rem)]">
              {obra.nombre}
            </Dialog.Title>
            <p
              id="ficha-bajada"
              className="serif mt-4 text-xl leading-snug text-[var(--piedra)] italic"
            >
              {obra.bajada}
            </p>

            <dl className="mono mt-8 grid grid-cols-[7rem_1fr] border-t border-[var(--linea)] text-[0.8rem]">
              {(
                [
                  ["Ubicación", obra.lugar],
                  ["Coordenadas", obra.coordenadas],
                  ["Año", String(obra.anio)],
                  ["Superficie", `${obra.m2} m²`],
                  ["Tipo", obra.tipo],
                  ["Cliente", obra.cliente],
                  ["Estado", obra.estado],
                  ["Equipo", obra.equipo.join(", ")],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="border-b border-[var(--linea)] py-2.5 text-[var(--piedra)]">
                    {k}
                  </dt>
                  <dd className="border-b border-[var(--linea)] py-2.5">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 space-y-4 text-[0.95rem] leading-relaxed text-[var(--carbon)]/85">
              {obra.texto.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>

            <button
              type="button"
              className="boton-linea mt-8"
              aria-haspopup="dialog"
              onClick={() => {
                alAbrir(false)
                abrir("agendar")
              }}
            >
              Consultar por un proyecto similar
            </button>
          </div>
        </div>

        {total > 1 && (
          <nav
            aria-label="Otras obras"
            className="grid grid-cols-2 border-t border-[var(--linea)]"
          >
            <button
              type="button"
              onClick={() => mover(-1)}
              className="group flex min-h-16 min-w-0 items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-[var(--hueso)] sm:px-8"
              aria-label={`Obra anterior: ${anterior.nombre}`}
            >
              <ArrowLeft
                className="size-4 shrink-0 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="etiqueta block text-[var(--piedra)]">
                  Anterior
                </span>
                <span className="serif block truncate text-lg">
                  {anterior.nombre}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => mover(1)}
              className="group flex min-h-16 min-w-0 items-center justify-end gap-3 border-l border-[var(--linea)] px-4 py-2 text-right transition-colors hover:bg-[var(--hueso)] sm:px-8"
              aria-label={`Obra siguiente: ${siguiente.nombre}`}
            >
              <span className="min-w-0">
                <span className="etiqueta block text-[var(--piedra)]">
                  Siguiente
                </span>
                <span className="serif block truncate text-lg">
                  {siguiente.nombre}
                </span>
              </span>
              <ArrowRight
                className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </nav>
        )}
        <p className="sr-only">
          Usá las flechas izquierda y derecha del teclado para recorrer las
          obras.
        </p>
      </Dialog.Content>
    </Dialog.Root>
  )
}
