"use client"

import { Accordion, Tabs } from "radix-ui"
import { Bike, Bus, Car, Footprints, Plus } from "lucide-react"

import { comoLlegar, preguntas } from "@/components/demos/espiga/contenido"

/** Preguntas frecuentes como fichas que se despliegan. */
export function Preguntas() {
  return (
    <Accordion.Root type="single" collapsible className="grid gap-3">
      {preguntas.map((q, i) => (
        <Accordion.Item
          key={q.p}
          value={`p${i}`}
          className="ficha-pregunta rounded-md border-2 border-[var(--tinta)] bg-[#fffdf7]"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left text-[1.15rem] font-bold sm:px-5">
              {q.p}
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--tinta)] transition-transform duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-[var(--amarilla)]"
              >
                <Plus className="size-5" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=open]:duration-300">
            <p className="border-t-2 border-dashed border-[var(--tinta-20)] px-4 py-4 text-[1.08rem] leading-relaxed sm:px-5">
              {q.r}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const iconos = { pie: Footprints, omnibus: Bus, auto: Car, bici: Bike }

/** Cómo llegar, por medio de transporte. */
export function ComoLlegar() {
  return (
    <Tabs.Root defaultValue="pie">
      <Tabs.List aria-label="Cómo llegar" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {comoLlegar.map((m) => {
          const Icono = iconos[m.id as keyof typeof iconos]
          return (
            <Tabs.Trigger
              key={m.id}
              value={m.id}
              className="flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-[var(--tinta-20)] px-2 font-bold hover:border-[var(--tinta)] data-[state=active]:border-[var(--tinta)] data-[state=active]:bg-[var(--tinta)] data-[state=active]:text-[var(--papel)]"
            >
              <Icono className="size-5" aria-hidden="true" />
              {m.nombre}
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>
      {comoLlegar.map((m) => (
        <Tabs.Content key={m.id} value={m.id} className="mt-3 text-[1.05rem] outline-none">
          {m.texto}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
