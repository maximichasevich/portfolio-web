"use client"

import dynamic from "next/dynamic"

import { TextoAnimado } from "@/components/idioma/texto-animado"
import GradientText from "@/components/GradientText"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { NumberTicker } from "@/components/ui/number-ticker"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Spotlight } from "@/components/ui/spotlight-new"
import { WordRotate } from "@/components/ui/word-rotate"
import { perfil } from "@/data/perfil"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

const Particles = dynamic(
  () => import("@/components/ui/particles").then((m) => m.Particles),
  { ssr: false }
)
const GloboOrbital = dynamic(
  () => import("@/components/inicio/globo-orbital").then((m) => m.GloboOrbital),
  { ssr: false }
)

const datos = [
  { etiqueta: "Diseño a medida", antes: "", valor: 100, despues: "%" },
  { etiqueta: "Tiempo de carga", antes: "<", valor: 2, despues: "s" },
  { etiqueta: "Días de soporte", antes: "", valor: 30, despues: "d" },
  { etiqueta: "Horas para responder", antes: "", valor: 24, despues: "h" },
]


export function Hero() {
  const reducido = useReducedMotion()

  return (
    <section
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden"
      aria-labelledby="titulo-hero"
    >
      {/* Capa 1: grilla que se enciende por sectores, fundida hacia el centro. */}
      <AnimatedGridPattern
        numSquares={28}
        maxOpacity={0.12}
        duration={3}
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full fill-[var(--violeta)]/40 stroke-[var(--estrella)]/10",
          "[mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
        )}
      />

      {/* Capa 2: partículas con parallax y haz de luz. */}
      {!reducido && (
        <>
          <div className="pointer-events-none absolute inset-0">
            <Particles
              className="absolute inset-0"
              quantity={60}
              color="#7c5cff"
              size={0.9}
              staticity={30}
              ease={40}
              vy={-0.08}
            />
            <Particles
              className="absolute inset-0"
              quantity={40}
              color="#39d5ff"
              size={0.6}
              staticity={60}
              ease={60}
              vy={-0.04}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
            <Spotlight
              gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(252, 100%, 80%, .12) 0, hsla(252, 100%, 60%, .04) 50%, hsla(252, 100%, 45%, 0) 80%)"
              gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(194, 100%, 80%, .10) 0, hsla(194, 100%, 55%, .03) 80%, transparent 100%)"
              gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(252, 100%, 85%, .06) 0, hsla(252, 100%, 45%, .02) 80%, transparent 100%)"
            />
          </div>
        </>
      )}

      {/* Fundido inferior. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--noche)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-28 pb-16 md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:px-10 md:pt-32 md:pb-24">
        {/* Columna de texto. */}
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="hud inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-[var(--estrella-70)]">
              <span className="en-vivo" aria-hidden="true" />
              Agenda abierta · respondo en el día
            </span>
            <span className="mono hidden text-[11px] text-[var(--estrella-45)] sm:inline">
              34°54′S 56°10′O
            </span>
          </div>
          <GradientText
            colors={["#39d5ff", "#7c5cff", "#f5f7ff", "#39d5ff"]}
            animationSpeed={6}
            className="mb-6 inline-block text-sm font-semibold tracking-wide md:text-base"
          >
            {perfil.rol} en {perfil.ciudad}
          </GradientText>

          <h1
            id="titulo-hero"
            className="display brillo max-w-[15ch] text-[clamp(2.3rem,4vw,3.6rem)]"
          >
            <TextoAnimado
              text="Tu negocio merece una página que impresione."
              animateBy="words"
              effect="focus"
              direction="bottom"
              delay={90}
              stepDuration={0.45}
              trigger="load"
              className="justify-start"
            />
          </h1>

          <div className="display-md mt-6 flex flex-wrap items-baseline gap-x-2 text-xl text-[var(--estrella-70)] md:text-2xl">
            <span>Páginas web para</span>
            <WordRotate
              words={[
                "negocios",
                "profesionales",
                "tiendas online",
                "emprendedores",
                "restaurantes",
              ]}
              duration={2200}
              className="inline-block py-0 text-[var(--cian)]"
            />
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--estrella-70)] md:text-lg">
            Diseño y programo sitios modernos, rápidos y perfectos en el
            celular, para que quien te busque te encuentre, te entienda en cinco
            segundos y te escriba.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contacto"
              className="rounded-full focus-visible:outline-none"
            >
              <ShimmerButton
                shimmerColor="#39d5ff"
                shimmerSize="0.08em"
                shimmerDuration="2.6s"
                background="linear-gradient(100deg, #39d5ff, #7c5cff)"
                className="px-7 py-4 text-base font-semibold text-[var(--noche)] shadow-[0_18px_50px_-12px_rgba(57,213,255,0.6)]"
              >
                Quiero mi página
              </ShimmerButton>
            </a>
            <a
              href="#trabajos"
              className="boton-fantasma rounded-full px-7 py-4 text-base font-medium"
            >
              Ver ejemplos
            </a>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--borde)] bg-[var(--borde)] sm:grid-cols-4">
            {datos.map((d) => (
              <div key={d.etiqueta} className="bg-[var(--noche)]/85 px-4 py-3">
                <dt className="mono min-h-[2.6em] text-[10px] leading-snug tracking-widest text-[var(--estrella-45)] uppercase">
                  {d.etiqueta}
                </dt>
                <dd className="display-md mt-1 text-2xl">
                  {d.antes}
                  <NumberTicker
                    value={d.valor}
                    className="text-[var(--estrella)]"
                  />
                  <span className="text-[var(--cian)]">{d.despues}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Columna visual: globo con Montevideo y satélites en órbita. */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.45),transparent)] blur-3xl" />
          {/* Lecturas tipo radar alrededor del globo. */}
          <span aria-hidden="true" className="mono pointer-events-none absolute top-[4%] left-0 text-[10px] leading-relaxed text-[var(--estrella-45)]">
            LAT -34.9011
            <br />
            LON -56.1645
          </span>
          <span aria-hidden="true" className="mono pointer-events-none absolute right-0 bottom-[4%] flex items-center gap-2 text-[10px] text-[var(--estrella-45)]">
            <span className="en-vivo" aria-hidden="true" /> SEÑAL ESTABLE
          </span>
          <GloboOrbital className="absolute inset-0" />
        </div>
      </div>
    </section>
  )
}

