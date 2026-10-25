"use client"

import { useState } from "react"
import { RadioGroup } from "radix-ui"
import { BellRing, Check, PackageCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Planta } from "@/components/demos/verde/catalogo"
import { coloresCeramica, stockDe } from "@/components/demos/verde/extras"
import { useTienda } from "@/components/demos/verde/estado"
import { validarEmail } from "@/components/demos/verde/validar"

/** Muestras de color para la maceta de cerámica. */
export function SelectorColor({
  valor,
  onCambio,
  chico = false,
}: {
  valor: string
  onCambio: (id: string) => void
  chico?: boolean
}) {
  const actual = coloresCeramica.find((c) => c.id === valor)
  return (
    <fieldset>
      <legend className="text-sm font-extrabold">
        Color de la cerámica <span className="font-normal text-[var(--vt-tinta-70)]">· {actual?.nombre}</span>
      </legend>
      <RadioGroup.Root
        value={valor}
        onValueChange={onCambio}
        aria-label="Color de la maceta"
        className="mt-2 flex flex-wrap gap-2"
      >
        {coloresCeramica.map((c) => (
          <RadioGroup.Item
            key={c.id}
            value={c.id}
            aria-label={c.nombre}
            className={cn(
              "group grid place-items-center rounded-full border-2 border-[var(--vt-tinta)] transition-transform hover:-rotate-6 data-[state=checked]:scale-110 data-[state=checked]:shadow-[0_3px_0_var(--vt-tinta)]",
              chico ? "size-9" : "size-11"
            )}
            style={{ background: c.hex }}
          >
            <Check className="size-4 opacity-0 group-data-[state=checked]:opacity-100" strokeWidth={3} aria-hidden="true" />
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </fieldset>
  )
}

/** "Quedan 3", "En stock" o el formulario de "Avisame cuando haya". */
export function EstadoStock({ planta, tamanoId }: { planta: Planta; tamanoId: string }) {
  const stock = stockDe(planta.id, tamanoId)
  if (stock <= 0) return <AvisameStock planta={planta} tamanoId={tamanoId} />
  return (
    <p className="flex items-center gap-2 text-sm font-bold">
      <PackageCheck className="size-4 text-[var(--vt-hoja)]" aria-hidden="true" />
      {stock <= 5 ? (
        <span>
          <span className="vt-quedan vt-anim mr-1.5 inline-block rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-rosa)] px-2 py-0.5 text-xs font-extrabold">
            ¡Quedan {stock}!
          </span>
          Llevala antes de que se vaya
        </span>
      ) : (
        <span>En stock · sale hoy si comprás antes de las 14</span>
      )}
    </p>
  )
}

function AvisameStock({ planta, tamanoId }: { planta: Planta; tamanoId: string }) {
  const { avisosStock, pedirAvisoStock, usuario, avisar } = useTienda()
  const [email, setEmail] = useState(usuario?.email ?? "")
  const [error, setError] = useState<string>()
  const tamano = planta.tamanos.find((t) => t.id === tamanoId)
  const pedido = avisosStock.find((a) => a.plantaId === planta.id && a.tamanoId === tamanoId)
  const id = `aviso-${planta.id}-${tamanoId}`

  if (pedido) {
    return (
      <p className="flex items-start gap-2 rounded-2xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-menta)] p-3 text-sm" role="status">
        <BellRing className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-extrabold">Listo:</strong> te avisamos a {pedido.email} cuando vuelva{" "}
          {planta.nombre.toLowerCase()} {tamano?.nombre.toLowerCase()}.
        </span>
      </p>
    )
  }

  return (
    <form
      noValidate
      className="rounded-2xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-rosa)] p-3.5"
      onSubmit={(e) => {
        e.preventDefault()
        const err = validarEmail(email)
        setError(err)
        if (err) return
        pedirAvisoStock({ plantaId: planta.id, tamanoId, email: email.trim() })
        avisar("Te vamos a avisar apenas vuelva")
      }}
    >
      <p className="text-sm font-extrabold">Sin stock en {tamano?.nombre.toLowerCase()} por ahora</p>
      <p className="text-xs text-[var(--vt-tinta-70)]">Vuelve en unos días. Dejanos tu email y te avisamos (es una demo: no se manda nada).</p>
      <label htmlFor={id} className="sr-only">
        Tu email
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="vt-campo h-11 min-h-0 flex-1"
        />
        <button type="submit" className="vt-boton-tinta h-11 shrink-0 px-4 text-sm">
          <BellRing className="size-4" aria-hidden="true" /> Avisame
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-bold text-[#8f1f0b]">
          {error}
        </p>
      )}
    </form>
  )
}
