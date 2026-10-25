"use client"

import { Accordion } from "radix-ui"
import { ArrowUpRight, Plus } from "lucide-react"

import { busquedas, estudio, preguntas } from "@/components/demos/faro/datos"

const dos = (n: number) => String(n).padStart(2, "0")

/** Preguntas frecuentes sobre honorarios y etapas, en acordeón. */
export function Preguntas() {
  return (
    <Accordion.Root type="single" collapsible className="border-t border-[var(--linea)]">
      {preguntas.map((q, i) => (
        <Accordion.Item key={q.p} value={`p${i}`} className="border-b border-[var(--linea)]">
          <Accordion.Header>
            <Accordion.Trigger className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-5 text-left">
              <span className="mono text-xs text-[var(--piedra)]">{dos(i + 1)}</span>
              <span className="serif text-[1.55rem] leading-tight sm:text-[1.8rem]">
                <span className="subrayado">{q.p}</span>
              </span>
              <Plus
                className="size-4 self-center transition-transform duration-500 group-data-[state=open]:rotate-45"
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="aparece pr-8 pb-6 pl-[3.25rem]">
            <p className="max-w-2xl text-[0.95rem] leading-relaxed text-[var(--carbon)]/80">
              {q.r}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

/** Búsquedas laborales abiertas, con postulación por correo. */
export function Busquedas() {
  return (
    <Accordion.Root type="single" collapsible className="border-t border-[var(--linea)]">
      {busquedas.map((b) => (
        <Accordion.Item key={b.puesto} value={b.puesto} className="border-b border-[var(--linea)]">
          <Accordion.Header>
            <Accordion.Trigger className="group grid w-full gap-x-6 gap-y-1 py-6 text-left md:grid-cols-[1fr_auto]">
              <span className="serif text-[1.7rem] leading-tight sm:text-[2rem]">
                {b.puesto}
              </span>
              <span className="mono flex items-center gap-3 text-xs text-[var(--piedra)] md:justify-end">
                {b.area}
                <Plus
                  className="size-4 text-[var(--carbon)] transition-transform duration-500 group-data-[state=open]:rotate-45"
                  aria-hidden="true"
                />
              </span>
              <span className="mono text-xs text-[var(--piedra)]">{b.modalidad}</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="aparece grid gap-6 pb-8 md:grid-cols-2">
            <p className="text-[0.95rem] leading-relaxed text-[var(--carbon)]/80">
              {b.descripcion}
            </p>
            <div>
              <p className="etiqueta text-[var(--piedra)]">Buscamos</p>
              <ul className="mono mt-3 space-y-1.5 text-xs text-[var(--carbon)]/80">
                {b.requisitos.map((r) => (
                  <li key={r}>— {r}</li>
                ))}
              </ul>
              <a
                href={`mailto:${estudio.correo}?subject=${encodeURIComponent(`Postulación · ${b.puesto}`)}&body=${encodeURIComponent("Hola, Estudio Faro:\n\nAdjunto mi CV y portfolio para la búsqueda.\n\nGracias.")}`}
                className="boton-linea mt-6"
              >
                Postularme
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
