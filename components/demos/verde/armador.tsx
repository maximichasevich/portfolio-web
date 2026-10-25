"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { RadioGroup } from "radix-ui"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Check, ShoppingBag, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  catalogo,
  macetas,
  precioVariante,
  textoLuz,
} from "@/components/demos/verde/catalogo"
import {
  coloresCeramica,
  primerTamanoDisponible,
  sinStock,
  stockDe,
} from "@/components/demos/verde/extras"
import { rutaPlanta, useTienda } from "@/components/demos/verde/estado"
import { Maceta3D } from "@/components/demos/verde/maceta-3d"
import { BotonPausa } from "@/components/demos/verde/ui"

const conMaceta = catalogo.filter((p) => p.conMaceta)

const fondoMaceta: Record<string, string> = {
  vivero: "bg-[var(--vt-cielo)]",
  barro: "bg-[var(--vt-durazno)]",
  ceramica: "bg-[var(--vt-lila)]",
}

/** Escala de la maceta según el tamaño elegido. */
function escalaDe(indice: number, total: number) {
  if (total <= 1) return 1
  return 0.84 + (indice / (total - 1)) * 0.3
}

export function Armador() {
  const { agregar, pausado } = useTienda()
  const [plantaId, setPlantaId] = useState("monstera")
  const planta = conMaceta.find((p) => p.id === plantaId) ?? conMaceta[0]
  const [tamanoId, setTamanoId] = useState(primerTamanoDisponible(planta).id)
  const [macetaId, setMacetaId] = useState("ceramica")
  const [colorId, setColorId] = useState("rosa")

  const tamano = planta.tamanos.find((t) => t.id === tamanoId) ?? planta.tamanos[0]
  const indice = planta.tamanos.indexOf(tamano)
  const precio = precioVariante(planta, tamano.id, macetaId)
  const color = coloresCeramica.find((c) => c.id === colorId)
  const stock = stockDe(planta.id, tamano.id)

  function elegirPlanta(id: string) {
    const nueva = conMaceta.find((p) => p.id === id)
    if (!nueva) return
    setPlantaId(id)
    setTamanoId(primerTamanoDisponible(nueva).id)
  }

  const resumen = `${planta.nombre} ${tamano.nombre.toLowerCase()} en maceta ${
    macetas.find((m) => m.id === macetaId)?.nombre.toLowerCase() ?? ""
  }${macetaId === "ceramica" && color ? ` ${color.nombre.toLowerCase()}` : ""}`

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      {/* Escenario 3D */}
      <div
        className={cn(
          "relative flex min-w-0 flex-col overflow-hidden rounded-[36px] border-2 border-[var(--vt-tinta)] p-4 transition-colors duration-500 sm:p-6 lg:sticky lg:top-40 lg:self-start",
          fondoMaceta[macetaId]
        )}
      >
        <div className="vt-blob-1 pointer-events-none absolute -top-16 -right-16 size-56 bg-[var(--vt-papel)] opacity-50" aria-hidden="true" />
        <div className="vt-blob-3 pointer-events-none absolute -bottom-20 -left-12 size-52 bg-[var(--vt-manteca)] opacity-60" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <span className="vt-sticker bg-[var(--vt-papel)]" style={{ "--giro": "-3deg" } as React.CSSProperties}>
            <Sparkles className="size-3.5" aria-hidden="true" /> Vista 3D
          </span>
          <BotonPausa />
        </div>
        <Maceta3D
          plantaId={planta.id}
          macetaId={macetaId}
          colorId={colorId}
          escala={escalaDe(indice, planta.tamanos.length)}
          pausado={pausado}
          etiqueta={`Modelo 3D: ${resumen}`}
          className="relative pt-2"
        />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={precio}
            initial={{ scale: 0.6, rotate: -14, opacity: 0 }}
            animate={{ scale: 1, rotate: 6, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
            className="vt-titulo absolute top-16 right-4 grid size-24 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-coral)] text-center text-xl leading-none shadow-[3px_3px_0_var(--vt-tinta)] tabular-nums sm:right-6 sm:size-28 sm:text-2xl"
            aria-hidden="true"
          >
            {pesos(precio)}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Opciones */}
      <div className="flex min-w-0 flex-col gap-6">
        <fieldset className="min-w-0">
          <legend className="vt-titulo text-2xl">1. Elegí la planta</legend>
          <RadioGroup.Root
            value={plantaId}
            onValueChange={elegirPlanta}
            aria-label="Planta"
            className="vt-sin-barra -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {conMaceta.map((p) => (
              <RadioGroup.Item
                key={p.id}
                value={p.id}
                className="vt-chip h-12 shrink-0 gap-2 py-1 pr-4 pl-1 text-sm"
                aria-label={p.nombre}
              >
                <span className="relative size-9 overflow-hidden rounded-full border-2 border-[var(--vt-tinta)]">
                  <Image src={p.foto.src} alt="" fill sizes="36px" className="object-cover" />
                </span>
                {p.nombre}
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <p className="mt-2 text-sm text-[var(--vt-tinta-70)]">
            {textoLuz[planta.luz]} · {planta.riego.toLowerCase()} · cuidado {planta.cuidado.toLowerCase()}
          </p>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="vt-titulo text-2xl">2. El tamaño</legend>
          <RadioGroup.Root
            value={tamano.id}
            onValueChange={setTamanoId}
            aria-label="Tamaño"
            className="mt-3 flex flex-wrap gap-2"
          >
            {planta.tamanos.map((t) => {
              const agotado = sinStock(planta.id, t.id)
              return (
                <RadioGroup.Item
                  key={t.id}
                  value={t.id}
                  disabled={agotado}
                  className="vt-opcion px-4 py-2.5 text-left disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="block text-sm font-extrabold">{t.nombre}</span>
                  <span className="block text-xs text-[var(--vt-tinta-70)]">
                    {agotado ? "Sin stock" : t.detalle.split(" · ")[0]}
                  </span>
                </RadioGroup.Item>
              )
            })}
          </RadioGroup.Root>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="vt-titulo text-2xl">3. La maceta</legend>
          <RadioGroup.Root
            value={macetaId}
            onValueChange={setMacetaId}
            aria-label="Maceta"
            className="mt-3 grid grid-cols-3 gap-2"
          >
            {macetas.map((m) => (
              <RadioGroup.Item key={m.id} value={m.id} className="vt-opcion p-3 text-left">
                <span className="block text-sm font-extrabold">{m.nombre}</span>
                <span className="block text-xs font-bold text-[var(--vt-tinta-70)] tabular-nums">
                  {m.extra ? `+${pesos(m.extra)}` : "Incluida"}
                </span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </fieldset>

        <AnimatePresence initial={false}>
          {macetaId === "ceramica" && (
            <motion.fieldset
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <legend className="vt-titulo text-2xl">
                4. El color <span className="text-base font-bold text-[var(--vt-tinta-70)]">· {color?.nombre}</span>
              </legend>
              <RadioGroup.Root
                value={colorId}
                onValueChange={setColorId}
                aria-label="Color de la maceta"
                className="mt-3 flex flex-wrap gap-2.5"
              >
                {coloresCeramica.map((c) => (
                  <RadioGroup.Item
                    key={c.id}
                    value={c.id}
                    aria-label={c.nombre}
                    className="group grid size-12 place-items-center rounded-full border-2 border-[var(--vt-tinta)] transition-transform hover:-rotate-6 data-[state=checked]:scale-110 data-[state=checked]:shadow-[0_3px_0_var(--vt-tinta)]"
                    style={{ background: c.hex }}
                  >
                    <Check className="size-5 opacity-0 group-data-[state=checked]:opacity-100" strokeWidth={3} aria-hidden="true" />
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </motion.fieldset>
          )}
        </AnimatePresence>

        <div className="vt-tarjeta mt-auto p-4 sm:p-5">
          <p className="text-sm text-[var(--vt-tinta-70)]">Tu combinación</p>
          <p className="mt-0.5 font-extrabold">{resumen}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="vt-titulo text-4xl tabular-nums" aria-live="polite">
              {pesos(precio)}
            </p>
            {stock <= 5 && (
              <span className="vt-quedan vt-anim rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-rosa)] px-2.5 py-1 text-xs font-extrabold">
                ¡Quedan {stock}!
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="vt-boton h-12 flex-1 px-5 text-base"
              onClick={(e) =>
                agregar(planta.id, {
                  tamanoId: tamano.id,
                  macetaId,
                  colorId,
                  origen: e.currentTarget,
                })
              }
            >
              <ShoppingBag className="size-5" aria-hidden="true" /> Agregar al carrito
            </button>
            <Link href={rutaPlanta(planta.id)} className="vt-boton-linea h-12 px-5 text-sm">
              Ver ficha <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
