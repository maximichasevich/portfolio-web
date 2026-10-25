"use client"

import Image from "next/image"
import { Dialog } from "radix-ui"
import { Heart, Minus, Plus, Star, X } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ColorPlanta, Planta } from "@/components/demos/verde/catalogo"
import { capaFuentes } from "@/components/demos/verde/fuentes"
import { useTienda } from "@/components/demos/verde/estado"

/** Clases de fondo para cada color de planta. */
export const fondo: Record<ColorPlanta, string> = {
  lila: "bg-[var(--vt-lila)]",
  manteca: "bg-[var(--vt-manteca)]",
  rosa: "bg-[var(--vt-rosa)]",
  menta: "bg-[var(--vt-menta)]",
  cielo: "bg-[var(--vt-cielo)]",
  durazno: "bg-[var(--vt-durazno)]",
}

/** Clase para los paneles que Radix monta fuera de la página. */
export const capa = cn("vt-capa", capaFuentes)

/* ---------- Logo ---------- */

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "vt-titulo inline-flex items-center gap-1.5 text-[1.7rem] leading-none",
        className
      )}
    >
      <svg
        viewBox="0 0 32 32"
        className="size-[1.1em] shrink-0"
        aria-hidden="true"
      >
        <path
          d="M16 30c0-9 2-16 12-24C26 18 22 25 16 30Z"
          fill="var(--vt-coral)"
          stroke="var(--vt-tinta)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M16 30C16 22 13 15 4 10c1 10 5 17 12 20Z"
          fill="var(--vt-menta)"
          stroke="var(--vt-tinta)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="notranslate" translate="no">
        verde<span className="text-[var(--vt-coral)]">.</span>
      </span>
    </span>
  )
}

/* ---------- Foto de planta en forma orgánica ---------- */

export function FotoPlanta({
  planta,
  sizes,
  forma = 1,
  className,
  zoom = false,
  cargaPrioritaria = false,
}: {
  planta: Planta
  sizes: string
  forma?: 1 | 2 | 3
  className?: string
  zoom?: boolean
  cargaPrioritaria?: boolean
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        `vt-blob-${forma}`,
        fondo[planta.color],
        className
      )}
    >
      <Image
        src={planta.foto.src}
        alt={planta.nombre}
        fill
        sizes={sizes}
        loading={cargaPrioritaria ? "eager" : "lazy"}
        className={cn(
          "vt-producto-foto object-cover",
          zoom && "scale-[1.8] object-[50%_35%]"
        )}
      />
    </div>
  )
}

/* ---------- Estrellas ---------- */

export function Estrellas({
  valor,
  className,
}: {
  valor: number
  className?: string
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${valor.toLocaleString("es-UY")} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "size-3.5",
            n <= Math.round(valor)
              ? "fill-[var(--vt-coral)] text-[var(--vt-tinta)]"
              : "fill-transparent text-[var(--vt-tinta-50)]"
          )}
          strokeWidth={2}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

/* ---------- Favorito ---------- */

export function BotonFavorito({
  planta,
  className,
}: {
  planta: Planta
  className?: string
}) {
  const { esFavorito, alternarFavorito } = useTienda()
  const activo = esFavorito(planta.id)
  return (
    <button
      type="button"
      onClick={() => alternarFavorito(planta.id)}
      aria-pressed={activo}
      aria-label={
        activo
          ? `Sacar ${planta.nombre} de favoritos`
          : `Guardar ${planta.nombre} en favoritos`
      }
      className={cn(
        "grid size-10 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] transition-transform hover:scale-110 active:scale-95",
        className
      )}
    >
      <Heart
        className={cn(
          "size-[18px] transition-colors",
          activo
            ? "fill-[var(--vt-coral)] text-[var(--vt-tinta)]"
            : "text-[var(--vt-tinta)]"
        )}
        strokeWidth={2.2}
        aria-hidden="true"
      />
    </button>
  )
}

/* ---------- Contador de cantidad ---------- */

export function Contador({
  valor,
  onCambio,
  nombre,
  min = 1,
  chico = false,
}: {
  valor: number
  onCambio: (n: number) => void
  nombre: string
  min?: number
  chico?: boolean
}) {
  const tam = chico ? "size-8" : "size-10"
  return (
    <div
      className="inline-flex items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
      role="group"
      aria-label={`Cantidad de ${nombre}`}
    >
      <button
        type="button"
        className={cn("vt-icono", tam)}
        onClick={() => onCambio(valor - 1)}
        disabled={valor <= min}
        aria-label={`Restar una unidad de ${nombre}`}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span
        className="min-w-7 text-center text-sm font-bold tabular-nums"
        aria-live="polite"
      >
        {valor}
      </span>
      <button
        type="button"
        className={cn("vt-icono", tam)}
        onClick={() => onCambio(valor + 1)}
        disabled={valor >= 20}
        aria-label={`Sumar una unidad de ${nombre}`}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

/* ---------- Cajón lateral (Radix Dialog) ---------- */

export function Cajon({
  abierto,
  onCambio,
  titulo,
  descripcion,
  lado = "der",
  pie,
  children,
  ancho = "max-w-[27rem]",
  icono,
}: {
  abierto: boolean
  onCambio: (abierto: boolean) => void
  titulo: string
  descripcion?: string
  lado?: "der" | "izq"
  pie?: React.ReactNode
  children: React.ReactNode
  ancho?: string
  icono?: React.ReactNode
}) {
  return (
    <Dialog.Root open={abierto} onOpenChange={onCambio}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn(capa, "vt-velo")} />
        <Dialog.Content
          className={cn(
            capa,
            "fixed top-0 bottom-0 z-[61] flex w-full flex-col bg-[var(--vt-crema)] shadow-2xl",
            ancho,
            lado === "der"
              ? "vt-cajon-der right-0 border-l-2 border-[var(--vt-tinta)]"
              : "vt-cajon-izq left-0 border-r-2 border-[var(--vt-tinta)]"
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b-2 border-[var(--vt-tinta)] px-5 py-4">
            <div className="flex min-w-0 items-center gap-2.5">
              {icono}
              <Dialog.Title className="vt-titulo truncate text-2xl">
                {titulo}
              </Dialog.Title>
            </div>
            <Dialog.Close
              className="vt-icono size-10 border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
              aria-label="Cerrar"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            {descripcion ?? titulo}
          </Dialog.Description>
          <div className="vt-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
          {pie && (
            <div className="border-t-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] px-5 py-4">
              {pie}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/* ---------- Campo de formulario con error ---------- */

export function Campo({
  id,
  etiqueta,
  error,
  ayuda,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string
  etiqueta: string
  error?: string
  ayuda?: string
}) {
  const descripcion = [error && `${id}-error`, ayuda && `${id}-ayuda`]
    .filter(Boolean)
    .join(" ")
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {etiqueta}
      </label>
      <input
        id={id}
        className="vt-campo"
        aria-invalid={error ? true : undefined}
        aria-describedby={descripcion || undefined}
        {...props}
      />
      {ayuda && !error && (
        <p
          id={`${id}-ayuda`}
          className="mt-1 text-xs text-[var(--vt-tinta-70)]"
        >
          {ayuda}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-sm font-semibold text-[#b02e14]"
        >
          {error}
        </p>
      )}
    </div>
  )
}
