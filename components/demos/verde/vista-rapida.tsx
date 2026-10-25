"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Dialog, RadioGroup } from "radix-ui"
import {
  ArrowRight,
  Droplets,
  PawPrint,
  Ruler,
  ShoppingBag,
  Sparkles,
  Sun,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  buscarPlanta,
  macetas,
  precioVariante,
  textoLuz,
  type Planta,
} from "@/components/demos/verde/catalogo"
import { rutaPlanta, useTienda } from "@/components/demos/verde/estado"
import { primerTamanoDisponible, sinStock, stockDe } from "@/components/demos/verde/extras"
import { EstadoStock, SelectorColor } from "@/components/demos/verde/opciones"
import {
  BotonFavorito,
  Contador,
  Estrellas,
  capa,
  fondo,
} from "@/components/demos/verde/ui"

/** Vista rápida de producto: fotos, cuidados y selector de variante. */
export function VistaRapida() {
  const { vistaRapida, abrirVistaRapida } = useTienda()
  const planta = vistaRapida ? buscarPlanta(vistaRapida) : undefined

  return (
    <Dialog.Root
      open={!!planta}
      onOpenChange={(o) => {
        if (!o) abrirVistaRapida(null)
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={cn(capa, "vt-velo")} />
        <Dialog.Content
          className={cn(
            capa,
            "vt-modal vt-scroll fixed inset-x-0 bottom-0 z-[61] max-h-[94svh] overflow-y-auto overscroll-contain rounded-t-[32px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-crema)] md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:max-h-[90svh] md:w-[min(60rem,calc(100vw-3rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[36px]"
          )}
        >
          {planta && <Ficha key={planta.id} planta={planta} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Ficha({ planta }: { planta: Planta }) {
  const { agregar, abrir, abrirVistaRapida } = useTienda()
  const [tamanoId, setTamanoId] = useState(primerTamanoDisponible(planta).id)
  const [macetaId, setMacetaId] = useState(macetas[0].id)
  const [colorId, setColorId] = useState("blanco")
  const [cantidad, setCantidad] = useState(1)
  const [foto, setFoto] = useState(0)
  const precio = precioVariante(planta, tamanoId, macetaId)
  const tamano = planta.tamanos.find((t) => t.id === tamanoId)!

  const cuidados = [
    { Icono: Sun, titulo: "Luz", texto: textoLuz[planta.luz] },
    { Icono: Droplets, titulo: "Riego", texto: planta.riego },
    { Icono: Ruler, titulo: "Tamaño", texto: tamano.detalle },
    {
      Icono: PawPrint,
      titulo: "Mascotas",
      texto: planta.aptaMascotas ? "Apta" : "No apta",
      nota: planta.notaMascotas,
    },
  ]

  const agotado = sinStock(planta.id, tamanoId)

  function comprar() {
    agregar(planta.id, { tamanoId, macetaId, colorId, cantidad })
    abrirVistaRapida(null)
    abrir("carrito")
  }

  return (
    <div className="grid md:grid-cols-[1fr_1.05fr]">
      {/* Fotos */}
      <div
        className={cn(
          "relative flex flex-col gap-3 p-4 pt-5 md:sticky md:top-0 md:self-start md:p-6",
          fondo[planta.color],
          "rounded-t-[30px] md:rounded-l-[34px] md:rounded-tr-none"
        )}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[var(--vt-tinta-50)] md:hidden" aria-hidden="true" />
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] md:aspect-[4/5]">
          <Image
            src={planta.foto.src}
            alt={foto === 0 ? planta.nombre : `Detalle de las hojas de ${planta.nombre}`}
            fill
            sizes="(min-width: 768px) 28rem, 100vw"
            className={cn(
              "object-cover transition-transform duration-500",
              foto === 1 && "scale-[1.9]"
            )}
          />
          {planta.sticker && (
            <span
              className="vt-sticker absolute top-3 left-3 bg-[var(--vt-manteca)]"
              style={{ "--giro": "-5deg" } as React.CSSProperties}
            >
              <Sparkles className="size-3" aria-hidden="true" /> {planta.sticker}
            </span>
          )}
        </div>
        <div className="flex gap-2" role="group" aria-label="Fotos">
          {["Foto completa", "Detalle de hojas"].map((nombre, i) => (
            <button
              key={nombre}
              type="button"
              onClick={() => setFoto(i)}
              aria-pressed={foto === i}
              aria-label={nombre}
              className={cn(
                "relative size-16 overflow-hidden rounded-2xl border-2 bg-[var(--vt-papel)] transition-transform",
                foto === i ? "border-[var(--vt-tinta)] -rotate-3" : "border-transparent opacity-80 hover:opacity-100"
              )}
            >
              <Image
                src={planta.foto.src}
                alt=""
                fill
                sizes="64px"
                className={cn("object-cover", i === 1 && "scale-[1.9]")}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Datos */}
      <div className="p-5 pb-7 md:p-8">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full border-2 border-[var(--vt-tinta)] px-3 py-1 text-xs font-bold">
            {planta.categoria}
          </span>
          <div className="flex gap-2">
            <BotonFavorito planta={planta} />
            <Dialog.Close
              className="vt-icono size-10 border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
              aria-label="Cerrar"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
        </div>
        <Dialog.Title className="vt-titulo mt-3 text-[2.6rem] md:text-5xl">
          {planta.nombre}
        </Dialog.Title>
        <p className="mt-1 text-sm text-[var(--vt-tinta-70)] italic">
          {planta.nombreCientifico}
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <Estrellas valor={planta.estrellas} />
          <span className="font-bold">{planta.estrellas.toLocaleString("es-UY")}</span>
          <span className="text-[var(--vt-tinta-70)]">({planta.opiniones} opiniones)</span>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={precio}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="vt-titulo text-4xl tabular-nums"
            >
              {pesos(precio)}
            </motion.span>
          </AnimatePresence>
          <span className="text-sm text-[var(--vt-tinta-70)]">
            o 3 × {pesos(Math.ceil(precio / 3))} sin recargo
          </span>
        </div>

        <Dialog.Description className="mt-4 leading-relaxed text-[var(--vt-tinta-70)]">
          {planta.descripcion}
        </Dialog.Description>

        <dl className="mt-5 grid grid-cols-2 gap-2.5">
          {cuidados.map((c) => (
            <div key={c.titulo} className="rounded-2xl border-2 border-[var(--vt-tinta-15)] bg-[var(--vt-papel)] p-3">
              <dt className="flex items-center gap-1.5 text-xs font-bold text-[var(--vt-tinta-70)]">
                <c.Icono className="size-4 text-[var(--vt-hoja)]" aria-hidden="true" />
                {c.titulo}
              </dt>
              <dd className="mt-1 text-sm leading-snug font-bold">
                {c.texto}
                {c.nota && (
                  <span className="mt-0.5 block text-xs font-normal text-[var(--vt-tinta-70)]">
                    {c.nota}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <fieldset className="mt-6">
          <legend className="text-sm font-extrabold">
            Tamaño <span className="font-normal text-[var(--vt-tinta-70)]">· {tamano.nombre}</span>
          </legend>
          <RadioGroup.Root
            value={tamanoId}
            onValueChange={setTamanoId}
            className="mt-2 flex flex-wrap gap-2"
            aria-label="Tamaño"
          >
            {planta.tamanos.map((t) => (
              <RadioGroup.Item
                key={t.id}
                value={t.id}
                className="vt-opcion px-4 py-2.5 text-left"
                onClick={() => setCantidad(1)}
              >
                <span className="block text-sm font-extrabold">{t.nombre}</span>
                <span className="block text-xs text-[var(--vt-tinta-70)] tabular-nums">
                  {sinStock(planta.id, t.id) ? "Sin stock" : pesos(t.precio)}
                </span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </fieldset>

        {planta.conMaceta && (
          <fieldset className="mt-5">
            <legend className="text-sm font-extrabold">Maceta</legend>
            <RadioGroup.Root
              value={macetaId}
              onValueChange={setMacetaId}
              className="mt-2 grid gap-2 sm:grid-cols-3"
              aria-label="Maceta"
            >
              {macetas.map((m) => (
                <RadioGroup.Item key={m.id} value={m.id} className="vt-opcion p-3 text-left">
                  <span className="flex items-center justify-between gap-2 text-sm font-extrabold">
                    {m.nombre}
                    <span className="text-xs font-bold tabular-nums">
                      {m.extra ? `+${pesos(m.extra)}` : "Incluida"}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-[var(--vt-tinta-70)]">
                    {m.detalle}
                  </span>
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          </fieldset>
        )}

        {planta.conMaceta && macetaId === "ceramica" && (
          <div className="mt-4">
            <SelectorColor valor={colorId} onCambio={setColorId} chico />
          </div>
        )}

        <div className="mt-5">
          <EstadoStock planta={planta} tamanoId={tamanoId} />
        </div>

        <p className="mt-5 rounded-2xl bg-[var(--vt-manteca)] p-3.5 text-sm leading-snug">
          <strong className="font-extrabold">Tip de la casa:</strong> {planta.consejo}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Contador valor={cantidad} onCambio={setCantidad} nombre={planta.nombre} max={Math.max(1, stockDe(planta.id, tamanoId))} />
          <button type="button" className="vt-boton h-12 flex-1 px-6 text-base" onClick={comprar} disabled={agotado}>
            <ShoppingBag className="size-5" aria-hidden="true" />
            {agotado ? "Sin stock" : <>Agregar · {pesos(precio * cantidad)}</>}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-[var(--vt-tinta-70)]">
            Garantía de 30 días: si no prende, te la cambiamos.
          </p>
          <Link
            href={rutaPlanta(planta.id)}
            onClick={() => abrirVistaRapida(null)}
            className="inline-flex items-center gap-1 text-sm font-extrabold underline underline-offset-4"
          >
            Ver ficha completa, reseñas y 3D <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
