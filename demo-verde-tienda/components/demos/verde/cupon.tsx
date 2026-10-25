"use client"

import { useRef, useState } from "react"
import { TicketPercent, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import { useTienda } from "@/components/demos/verde/estado"
import { sacudir } from "@/components/demos/verde/efectos"

/** Campo para aplicar un cupón (ficticio) en el carrito o en el checkout. */
export function CampoCupon({ id, className }: { id: string; className?: string }) {
  const { cupon, cuponActivo, avisoCupon, aplicarCupon, quitarCupon, descuentoCupon } = useTienda()
  const [abierto, setAbierto] = useState(false)
  const [codigo, setCodigo] = useState("")
  const [error, setError] = useState<string | null>(null)
  const campoRef = useRef<HTMLInputElement>(null)

  if (cupon) {
    return (
      <div className={cn("rounded-2xl border-2 border-dashed border-[var(--vt-tinta)] bg-[var(--vt-manteca)] p-3", className)}>
        <div className="flex items-center gap-2">
          <TicketPercent className="size-5 shrink-0" aria-hidden="true" />
          <p className="min-w-0 flex-1 text-sm">
            <span className="font-extrabold tracking-wide">{cupon}</span>
            {cuponActivo && (
              <span className="block text-xs text-[var(--vt-tinta-70)]">
                {cuponActivo.titulo}
                {descuentoCupon > 0 && ` · −${pesos(descuentoCupon)}`}
              </span>
            )}
          </p>
          <button
            type="button"
            className="vt-icono size-8 shrink-0"
            onClick={() => {
              quitarCupon()
              setCodigo("")
            }}
            aria-label={`Quitar el cupón ${cupon}`}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        {avisoCupon && <p className="mt-1.5 text-xs font-bold text-[#8f1f0b]">{avisoCupon}</p>}
      </div>
    )
  }

  if (!abierto) {
    return (
      <button
        type="button"
        className={cn("inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4", className)}
        onClick={() => {
          setAbierto(true)
          window.requestAnimationFrame(() => campoRef.current?.focus())
        }}
      >
        <TicketPercent className="size-4" aria-hidden="true" /> ¿Tenés un cupón?
      </button>
    )
  }

  return (
    <form
      className={className}
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const r = aplicarCupon(codigo)
        if (r.ok) {
          setError(null)
          setAbierto(false)
        } else {
          setError(r.mensaje)
          if (campoRef.current) sacudir(campoRef.current)
        }
      }}
    >
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        Código de descuento
      </label>
      <div className="flex gap-2">
        <input
          ref={campoRef}
          id={id}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          placeholder="PRIMERAPLANTA"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-ayuda`}
          className="vt-campo h-11 min-h-0 flex-1 uppercase"
        />
        <button type="submit" className="vt-boton-tinta h-11 shrink-0 px-4 text-sm">
          Aplicar
        </button>
      </div>
      <p id={`${id}-ayuda`} className={cn("mt-1.5 text-xs", error ? "font-bold text-[#8f1f0b]" : "text-[var(--vt-tinta-70)]")} aria-live="polite">
        {error ?? "Probá con PRIMERAPLANTA, HOLAVERDE, ENVIOGRATIS o VERDE500 (son de ejemplo)."}
      </p>
    </form>
  )
}
