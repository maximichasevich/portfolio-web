"use client"

import { Headphones, Key, MessageSquareText, Zap } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { MagicCard } from "@/components/ui/magic-card"
import { Inclinable } from "@/components/inicio/interacciones"
import { AnatomiaWeb } from "@/components/inicio/modelos-3d"
import { razones } from "@/data/perfil"

const iconos = [MessageSquareText, Key, Zap, Headphones]

/** Argumentos de confianza en tarjetas con foco que sigue al mouse. */
export function Razones() {
  return (
    <section
      id="por-que"
      className="relative scroll-mt-24 px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="titulo-por-que"
    >
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[50vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(57,213,255,0.12),transparent)] blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div className="md:sticky md:top-32 md:self-start">
            <p className="etiqueta-hud mb-4">[05] Por qué conmigo</p>
            <h2
              id="titulo-por-que"
              className="display text-[clamp(2.4rem,6vw,4.8rem)]"
            >
              Por qué trabajar conmigo
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--estrella-70)] md:text-lg">
              Tres años de carrera en Programación, bachillerato en Diseño Web y
              una regla: que vos entiendas todo lo que pasa con tu página.
            </p>
            {/* Modelo 3D: las capas de una web. */}
            <AnatomiaWeb className="mt-8" />
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {razones.map((r, i) => {
              const Icono = iconos[i % iconos.length]
              return (
                <BlurFade
                  key={r.titulo}
                  inView
                  delay={0.08 + i * 0.1}
                  duration={0.6}
                  offset={16}
                >
                  <li className="h-full">
                    <Inclinable className="h-full" grados={8}>
                      <MagicCard
                        className="h-full rounded-3xl border border-[var(--borde)] bg-[var(--nebulosa)]"
                        gradientColor="rgba(124,92,255,0.35)"
                        gradientFrom="#39d5ff"
                        gradientTo="#7c5cff"
                        gradientSize={260}
                        gradientOpacity={0.6}
                      >
                        <div className="flex h-full flex-col p-6 md:p-7">
                          <Icono
                            className="size-6 text-[var(--cian)]"
                            aria-hidden="true"
                          />
                          <h3 className="display-md mt-5 text-xl">
                            {r.titulo}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-[var(--estrella-70)]">
                            {r.descripcion}
                          </p>
                        </div>
                      </MagicCard>
                    </Inclinable>
                  </li>
                </BlurFade>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
