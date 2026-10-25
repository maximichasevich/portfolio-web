"use client"

import Image from "next/image"
import { Dialog } from "radix-ui"
import { Check, Minus, Plus, ShieldAlert, X } from "lucide-react"

import {
  cumpleFiltro,
  filtros,
  nombresAlergenos,
  productoPorId,
  type Alergeno,
} from "@/components/demos/espiga/carta"
import {
  abrirFicha,
  cambiarCantidad,
  useBolsa,
  useFicha,
} from "@/components/demos/espiga/estado"
import { pesos } from "@/lib/demo"

function contenedor() {
  if (typeof document === "undefined") return undefined
  return document.querySelector<HTMLElement>(".espiga") ?? undefined
}

const todos = Object.keys(nombresAlergenos) as Alergeno[]

/** Ficha del producto: ingredientes, alérgenos y para quién es apto. */
export function FichaProducto() {
  const id = useFicha()
  const bolsa = useBolsa()
  const p = id ? productoPorId.get(id) : undefined
  const cantidad = p ? (bolsa[p.id] ?? 0) : 0
  const Icono = p?.icono

  return (
    <Dialog.Root open={!!p} onOpenChange={(o) => !o && abrirFicha(null)}>
      <Dialog.Portal container={contenedor()}>
        <Dialog.Overlay className="panel-velo fixed inset-0 z-[60] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="panel fixed top-1/2 left-1/2 z-[61] flex max-h-[min(92svh,46rem)] w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md border-4 shadow-2xl duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          {p && Icono && (
            <>
              <div className="flex items-start gap-4 border-b-2 border-[var(--tinta)] p-4 sm:p-5">
                <div className="kraft relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-[var(--tinta)] sm:size-24">
                  {p.foto ? (
                    <Image
                      src={p.foto.src}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <Icono
                      className="absolute inset-0 m-auto size-10"
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="volanta text-[var(--rojo)]">Ficha del producto</p>
                  <Dialog.Title className="titulo mt-1 text-[1.8rem] leading-tight">
                    {p.nombre}
                  </Dialog.Title>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2 font-bold">
                    <span className="titulo text-[1.5rem]">
                      {pesos(p.precio)}
                    </span>
                    {p.antes && (
                      <s className="text-[var(--tinta-70)]">
                        {pesos(p.antes)}
                      </s>
                    )}
                  </p>
                </div>
                <Dialog.Close
                  className="boton-borde -mr-1 flex size-12 shrink-0 items-center justify-center rounded-md"
                  aria-label="Cerrar la ficha"
                >
                  <X className="size-6" aria-hidden="true" />
                </Dialog.Close>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
                <Dialog.Description className="text-[1.1rem]">
                  {p.detalle}
                </Dialog.Description>

                <h3 className="titulo mt-5 text-[1.3rem]">Ingredientes</h3>
                <p className="mt-1">{p.ingredientes}</p>

                <h3 className="titulo mt-5 text-[1.3rem]">Alérgenos</h3>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {todos.map((a) => {
                    const tiene = p.alergenos.includes(a)
                    return (
                      <li
                        key={a}
                        className={
                          tiene
                            ? "flex items-center gap-2 rounded-md border-2 border-[var(--rojo)] bg-[#fff3ef] px-2.5 py-1.5 font-bold text-[var(--rojo-2)]"
                            : "flex items-center gap-2 rounded-md border-2 border-dashed border-[var(--tinta-20)] px-2.5 py-1.5 text-[var(--tinta-70)]"
                        }
                      >
                        {tiene ? (
                          <ShieldAlert
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <Check className="size-4 shrink-0" aria-hidden="true" />
                        )}
                        {tiene ? "Contiene" : "Sin"}{" "}
                        {nombresAlergenos[a].toLowerCase()}
                      </li>
                    )
                  })}
                </ul>

                <p className="mt-4 flex flex-wrap gap-2">
                  {filtros
                    .filter((f) => cumpleFiltro(p, f.id))
                    .map((f) => (
                      <span
                        key={f.id}
                        className="rounded-full bg-[var(--pizarra)] px-3 py-1 text-[0.95rem] font-bold text-[var(--tiza)]"
                      >
                        Apto {f.nombre.toLowerCase()}
                      </span>
                    ))}
                </p>

                {p.conservacion && (
                  <>
                    <h3 className="titulo mt-5 text-[1.3rem]">
                      Cómo conservarlo
                    </h3>
                    <p className="mt-1">{p.conservacion}</p>
                  </>
                )}

                <p className="mt-5 rounded-md bg-[var(--papel-2)] p-3 text-[0.95rem] text-[var(--tinta-70)]">
                  {p.sinTacc
                    ? "Elaborado con premezcla certificada, en un sector exclusivo y con utensilios propios. Se entrega cerrado y rotulado."
                    : "En el local trabajamos con harina de trigo, leche, huevo, frutos secos y sésamo: puede haber trazas. Si tenés una alergia, avisanos en tus notas."}
                </p>
              </div>

              <div className="border-t-2 border-dashed border-[var(--tinta-20)] p-4 sm:px-5">
                {cantidad === 0 ? (
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(p.id, 1)}
                    className="boton-rojo w-full rounded-md px-4"
                  >
                    <Plus className="size-5" aria-hidden="true" />
                    Agregar a la bolsa
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">
                      {cantidad} en tu bolsa ·{" "}
                      <span className="tabular-nums">
                        {pesos(p.precio * cantidad)}
                      </span>
                    </p>
                    <div
                      className="inline-flex items-center rounded-md border-2 border-[var(--tinta)]"
                      role="group"
                      aria-label={`Cantidad de ${p.nombre}`}
                    >
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(p.id, -1)}
                        aria-label={`Uno menos de ${p.nombre}`}
                        className="flex size-12 items-center justify-center hover:bg-[var(--papel-2)]"
                      >
                        <Minus className="size-5" aria-hidden="true" />
                      </button>
                      <span className="w-9 text-center font-bold tabular-nums">
                        {cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(p.id, 1)}
                        aria-label={`Uno más de ${p.nombre}`}
                        className="flex size-12 items-center justify-center bg-[var(--rojo)] text-[var(--papel)] hover:bg-[var(--rojo-2)]"
                      >
                        <Plus className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
