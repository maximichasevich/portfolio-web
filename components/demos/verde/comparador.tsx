"use client"

import Image from "next/image"
import Link from "next/link"
import { Dialog } from "radix-ui"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeftRight, Plus, Trophy, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  buscarPlanta,
  precioDesde,
  textoLuz,
  type Planta,
} from "@/components/demos/verde/catalogo"
import { diasDeRiego } from "@/components/demos/verde/extras"
import { rutaPlanta, useTienda } from "@/components/demos/verde/estado"
import { Estrellas, capa, fondo } from "@/components/demos/verde/ui"

/** Barra flotante abajo al centro (lejos de las esquinas de "Demo" y WhatsApp). */
export function BarraComparar() {
  const { comparar, panel, vistaRapida, abrir, limpiarComparar, alternarComparar } = useTienda()
  const plantas = comparar.flatMap((id) => buscarPlanta(id) ?? [])
  const visible = plantas.length > 0 && !panel && !vistaRapida

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-[4.5rem] z-[45] flex justify-center lg:bottom-5">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="vt-capa pointer-events-auto flex w-full max-w-[34rem] items-center gap-2 rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] py-1.5 pr-1.5 pl-2 shadow-[3px_3px_0_var(--vt-tinta)]"
            role="region"
            aria-label="Comparador de plantas"
          >
            <ul className="flex -space-x-2">
              {plantas.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => alternarComparar(p.id)}
                    className={cn("group relative block size-10 overflow-hidden rounded-full border-2 border-[var(--vt-tinta)]", fondo[p.color])}
                    aria-label={`Sacar ${p.nombre} del comparador`}
                  >
                    <Image src={p.foto.src} alt="" fill sizes="40px" className="object-cover" />
                    <span className="absolute inset-0 grid place-items-center bg-[rgba(31,42,34,0.55)] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <X className="size-4" aria-hidden="true" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="min-w-0 flex-1 truncate text-sm font-bold">
              {plantas.length === 1 ? "Elegí otra para comparar" : `${plantas.length} plantas`}
            </p>
            <button type="button" className="shrink-0 px-2 text-xs font-bold underline underline-offset-4" onClick={limpiarComparar}>
              Limpiar
            </button>
            <button
              type="button"
              className="vt-boton-tinta h-10 shrink-0 px-4 text-sm"
              disabled={plantas.length < 2}
              onClick={() => abrir("comparar")}
            >
              <ArrowLeftRight className="size-4" aria-hidden="true" /> Comparar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const nivelCuidado = { Fácil: 1, Media: 2, Atenta: 3 }

export function DialogoComparar() {
  const { panel, abrir, comparar, agregar, alternarComparar } = useTienda()
  const plantas = comparar.flatMap((id) => buscarPlanta(id) ?? [])
  const masBarata = Math.min(...plantas.map(precioDesde))
  const masFacil = Math.min(...plantas.map((p) => nivelCuidado[p.cuidado]))
  const mejorPuntuada = Math.max(...plantas.map((p) => p.estrellas))

  const filas: { titulo: string; valor: (p: Planta) => React.ReactNode; gana?: (p: Planta) => boolean }[] = [
    { titulo: "Precio desde", valor: (p) => pesos(precioDesde(p)), gana: (p) => precioDesde(p) === masBarata },
    { titulo: "Cuidado", valor: (p) => p.cuidado, gana: (p) => nivelCuidado[p.cuidado] === masFacil },
    { titulo: "Luz", valor: (p) => textoLuz[p.luz] },
    { titulo: "Riego", valor: (p) => `Cada ${diasDeRiego(p.id)} días` },
    { titulo: "Mascotas", valor: (p) => (p.aptaMascotas ? "Apta" : "No apta") },
    { titulo: "Opiniones", valor: (p) => <Estrellas valor={p.estrellas} />, gana: (p) => p.estrellas === mejorPuntuada },
    { titulo: "Tamaños", valor: (p) => p.tamanos.map((t) => t.nombre).join(", ") },
    { titulo: "Categoría", valor: (p) => p.categoria },
  ]

  return (
    <Dialog.Root open={panel === "comparar"} onOpenChange={(o) => abrir(o ? "comparar" : null)}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn(capa, "vt-velo")} />
        <Dialog.Content
          className={cn(
            capa,
            "vt-modal vt-scroll fixed inset-x-0 bottom-0 z-[61] max-h-[92svh] overflow-y-auto overscroll-contain rounded-t-[32px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-crema)] p-5 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-[min(56rem,calc(100vw-3rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[36px] md:p-8"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="vt-titulo text-4xl">Comparar plantas</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-[var(--vt-tinta-70)]">
                Lado a lado, para que elijas sin dudas. Las marcadas con trofeo
                ganan en esa fila.
              </Dialog.Description>
            </div>
            <Dialog.Close className="vt-icono size-10 shrink-0 border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]" aria-label="Cerrar">
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <div className="vt-scroll mt-5 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-separate border-spacing-x-2 text-sm">
              <thead>
                <tr>
                  <th scope="col" className="w-28 text-left align-bottom text-xs font-bold text-[var(--vt-tinta-70)]">
                    <span className="sr-only">Característica</span>
                  </th>
                  {plantas.map((p) => (
                    <th key={p.id} scope="col" className="pb-3 text-left align-top font-normal">
                      <div className={cn("relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-[var(--vt-tinta)]", fondo[p.color])}>
                        <Image src={p.foto.src} alt="" fill sizes="(min-width: 768px) 14rem, 40vw" className="object-cover" />
                        <button
                          type="button"
                          onClick={() => alternarComparar(p.id)}
                          className="vt-icono absolute top-2 right-2 size-8 border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
                          aria-label={`Sacar ${p.nombre} de la comparación`}
                        >
                          <X className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <Link href={rutaPlanta(p.id)} onClick={() => abrir(null)} className="vt-titulo mt-2 block text-2xl hover:underline">
                        {p.nombre}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.titulo}>
                    <th scope="row" className="border-t-2 border-[var(--vt-tinta-15)] py-2.5 text-left text-xs font-bold text-[var(--vt-tinta-70)]">
                      {f.titulo}
                    </th>
                    {plantas.map((p) => {
                      const gana = plantas.length > 1 && f.gana?.(p)
                      return (
                        <td key={p.id} className="border-t-2 border-[var(--vt-tinta-15)] py-2.5 font-semibold">
                          <span className={cn("inline-flex items-center gap-1.5", gana && "rounded-full bg-[var(--vt-manteca)] px-2 py-0.5")}>
                            {gana && <Trophy className="size-3.5" aria-label="Gana" />}
                            {f.valor(p)}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr>
                  <td />
                  {plantas.map((p) => (
                    <td key={p.id} className="pt-3">
                      <button
                        type="button"
                        className="vt-boton h-10 w-full px-3 text-sm"
                        onClick={(e) => agregar(p.id, { origen: e.currentTarget })}
                      >
                        <Plus className="size-4" aria-hidden="true" /> Agregar
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
