"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog } from "radix-ui"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import { articulos } from "@/components/demos/faro/datos"
import { cn } from "@/lib/utils"

const temas = ["Todos", ...new Set(articulos.map((a) => a.tema))]

/**
 * Diario del estudio: notas con filtro por tema y lector en panel lateral
 * (foco atrapado, Escape y flechas para pasar de nota).
 */
export function Diario() {
  const [tema, setTema] = useState("Todos")
  const [abierto, setAbierto] = useState<number | null>(null)
  const lista = tema === "Todos" ? articulos : articulos.filter((a) => a.tema === tema)
  const nota = abierto === null ? null : lista[abierto]

  return (
    <div>
      <div role="group" aria-label="Filtrar notas por tema" className="flex flex-wrap gap-x-5 border-b border-[var(--linea)] pb-3">
        {temas.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tema === t}
            onClick={() => setTema(t)}
            className={cn(
              "mono min-h-11 text-xs transition-colors",
              tema === t ? "text-[var(--carbon)] underline underline-offset-4" : "text-[var(--piedra)] hover:text-[var(--carbon)]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <ul key={tema} className="aparece mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
        {lista.map((a, i) => (
          <li key={a.id} className={cn(i === 0 && lista.length > 2 && "md:col-span-2")}>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setAbierto(i)}
              className={cn(
                "group block w-full text-left",
                i === 0 && lista.length > 2 && "md:grid md:grid-cols-[1.3fr_1fr] md:gap-10"
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--hueso-2)]">
                <Image
                  src={a.foto.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                />
              </div>
              <div className="mt-5 md:mt-0 md:self-end">
                <p className="mono text-xs text-[var(--piedra)]">
                  {a.tema} · {a.fecha} · {a.lectura} min
                </p>
                <h3 className="serif mt-3 text-[1.9rem] leading-[1.05] sm:text-[2.3rem]">
                  <span className="subrayado">{a.titulo}</span>
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--carbon)]/75">
                  {a.bajada}
                </p>
                <p className="etiqueta mt-4 text-[var(--piedra)]">Leer nota →</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={nota !== null} onOpenChange={(v) => !v && setAbierto(null)}>
        <Dialog.Overlay className="capa fixed inset-0 z-[60] bg-[var(--carbon)]/70" />
        {nota && (
          <Dialog.Content
            className="panel-lateral fixed inset-y-0 right-0 z-[61] flex w-full flex-col bg-[var(--papel)] text-[var(--carbon)] md:w-[min(760px,94vw)]"
            onKeyDown={(e) => {
              if (abierto === null) return
              if (e.key === "ArrowRight") setAbierto((abierto + 1) % lista.length)
              if (e.key === "ArrowLeft") setAbierto((abierto - 1 + lista.length) % lista.length)
            }}
          >
            <div className="flex items-center justify-between border-b border-[var(--linea)] px-5 py-2 sm:px-10">
              <p className="etiqueta text-[var(--piedra)]">Diario · {nota.tema}</p>
              <Dialog.Close className="etiqueta inline-flex min-h-11 items-center gap-2 px-1">
                Cerrar
                <X className="size-4" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <article key={nota.id} className="aparece flex-1 overflow-y-auto">
              <div className="relative aspect-[16/9]">
                <Image src={nota.foto.src} alt="" fill sizes="(min-width: 768px) 760px, 100vw" className="object-cover" />
              </div>
              <div className="px-5 py-10 sm:px-10">
                <p className="mono text-xs text-[var(--piedra)]">
                  {nota.fecha} · {nota.autor} · {nota.lectura} min de lectura
                </p>
                <Dialog.Title className="serif mt-4 text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02]">
                  {nota.titulo}
                </Dialog.Title>
                <Dialog.Description className="serif mt-5 text-xl leading-snug text-[var(--piedra)] italic">
                  {nota.bajada}
                </Dialog.Description>
                <div className="mt-8 space-y-5 text-[1rem] leading-[1.75] text-[var(--carbon)]/85">
                  {nota.texto.map((p) => (
                    <p key={p.slice(0, 30)}>{p}</p>
                  ))}
                </div>
              </div>
            </article>
            {lista.length > 1 && abierto !== null && (
              <nav aria-label="Otras notas" className="grid grid-cols-2 border-t border-[var(--linea)]">
                <button
                  type="button"
                  onClick={() => setAbierto((abierto - 1 + lista.length) % lista.length)}
                  className="etiqueta flex min-h-14 items-center gap-2 px-5 transition-colors hover:bg-[var(--hueso)] sm:px-10"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setAbierto((abierto + 1) % lista.length)}
                  className="etiqueta flex min-h-14 items-center justify-end gap-2 border-l border-[var(--linea)] px-5 transition-colors hover:bg-[var(--hueso)] sm:px-10"
                >
                  Siguiente
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </nav>
            )}
          </Dialog.Content>
        )}
      </Dialog.Root>
    </div>
  )
}
