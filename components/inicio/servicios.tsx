"use client"

import { Rocket, ShoppingCart, Store } from "lucide-react"

import { TextoAnimado } from "@/components/idioma/texto-animado"
import PixelCard from "@/components/PixelCard"
import { BlurFade } from "@/components/ui/blur-fade"
import { ShineBorder } from "@/components/ui/shine-border"
import { servicios } from "@/data/perfil"

const paletas = [
  ["#7c5cff", "#a28cff", "#39d5ff"],
  ["#39d5ff", "#7cebff", "#7c5cff"],
  ["#a28cff", "#39d5ff", "#f5f7ff"],
]
const iconos = [Store, Rocket, ShoppingCart]

export function Servicios() {
  return (
    <section
      id="que-hago"
      className="relative scroll-mt-24 px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="titulo-que-hago"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="etiqueta-hud mb-4">[01] Qué hago</p>
          <h2
            id="titulo-que-hago"
            className="display text-[clamp(2.4rem,6vw,4.8rem)]"
          >
            <TextoAnimado
              text="Qué puedo hacer por tu negocio"
              animateBy="words"
              effect="blur"
              delay={60}
              trigger="view"
            />
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--estrella-70)] md:text-lg">
            Tres tipos de página, explicados sin palabras raras. En la primera
            charla te digo cuál te conviene.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {servicios.map((s, i) => {
            const Icono = iconos[i % iconos.length]
            return (
              <BlurFade
                key={s.titulo}
                inView
                delay={0.1 + i * 0.12}
                duration={0.6}
                offset={18}
                className="min-w-0"
              >
                <li className="h-full">
                  <PixelCard
                    colors={paletas[i % paletas.length]}
                    gap={6}
                    speed={30}
                    pixelSize={3}
                    origin="pointer"
                    trigger="hover"
                    intro
                    introDelay={i * 150}
                    glow={0.6}
                    radius={24}
                    theme="dark"
                    className="h-full w-full"
                  >
                    <ShineBorder
                      borderWidth={1}
                      duration={12}
                      shineColor={paletas[i % paletas.length]}
                      className="rounded-[24px]"
                    />
                    <div className="relative z-10 flex h-full flex-col p-7 md:p-8">
                      <span className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--cian)]/20 to-[var(--violeta)]/30 text-[var(--cian)] ring-1 ring-[var(--borde)]">
                        <Icono className="size-6" aria-hidden="true" />
                      </span>
                      <h3 className="display-md text-2xl md:text-3xl">
                        {s.titulo}
                      </h3>
                      <p className="mt-4 flex-1 text-base leading-relaxed text-[var(--estrella-70)]">
                        {s.descripcion}
                      </p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {s.incluye.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-[var(--borde)] px-3 py-1 text-xs text-[var(--estrella-70)]"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </PixelCard>
                </li>
              </BlurFade>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
