"use client"

import { ArrowUpRight, Check, Info, Sparkles } from "lucide-react"

import { Inclinable } from "@/components/inicio/interacciones"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { ShineBorder } from "@/components/ui/shine-border"
import { linkWhatsappCon } from "@/data/perfil"
import {
  extras,
  mensajeExtra,
  mensajePaquete,
  notaPrecios,
  paquetes,
  type Paquete,
} from "@/data/precios"
import { cn } from "@/lib/utils"

/**
 * Sección "Servicios y precios": tres paquetes, servicios extra y una nota
 * sobre dominio y alojamiento. Los datos viven en data/precios.ts.
 * Cada botón abre WhatsApp con un mensaje que ya indica el paquete elegido.
 */
export function Precios() {
  return (
    <section
      id="servicios"
      className="relative scroll-mt-24 px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="titulo-servicios"
    >
      {/* Halo de fondo detrás de las tarjetas. */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(57,213,255,0.12),transparent)] blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="etiqueta-hud mb-4">[04] Servicios y precios</p>
            <h2
              id="titulo-servicios"
              className="display text-[clamp(2.4rem,6vw,4.8rem)]"
            >
              Precios claros, <span className="degradado">sin sorpresas.</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-[var(--estrella-70)] md:text-lg">
            Tres paquetes para empresas y emprendedores. Elegí el que más se
            parece a lo que necesitás y te paso un presupuesto cerrado.
          </p>
        </div>

        {/* Paquetes: uno debajo del otro en celular, en fila desde 1024 px. */}
        <ul className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {paquetes.map((p, i) => (
            <BlurFade
              key={p.id}
              inView
              delay={0.08 + i * 0.12}
              duration={0.6}
              offset={18}
              className={cn("min-w-0", p.destacado && "lg:-translate-y-4")}
            >
              <li className="h-full">
                <Inclinable className="h-full" grados={6}>
                  <TarjetaPaquete paquete={p} numero={i + 1} />
                </Inclinable>
              </li>
            </BlurFade>
          ))}
        </ul>

        {/* Servicios extra */}
        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h3 className="display-md text-2xl md:text-3xl">Servicios extra</h3>
            <p className="mono text-xs text-[var(--estrella-45)]">
              Se suman a cualquier paquete
            </p>
          </div>
          <ul className="hud mt-6 grid overflow-hidden rounded-3xl sm:grid-cols-2">
            {extras.map((e, i) => (
              <li
                key={e.nombre}
                className={cn(
                  "border-[var(--borde)]",
                  // Líneas divisorias: entre filas siempre, entre columnas desde sm.
                  i > 0 && "border-t",
                  i === 1 && "sm:border-t-0",
                  i % 2 === 1 && "sm:border-l"
                )}
              >
                <a
                  href={linkWhatsappCon(mensajeExtra(e))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-center justify-between gap-4 p-5 transition-colors hover:bg-[rgba(57,213,255,0.05)] focus-visible:bg-[rgba(57,213,255,0.05)] focus-visible:outline-none md:p-6"
                >
                  <span>
                    <span className="display-md block text-lg">{e.nombre}</span>
                    <span className="mt-1 block text-sm text-[var(--estrella-70)]">
                      {e.detalle}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-right">
                    {e.desde ? (
                      <span>
                        <span className="mono block text-[10px] tracking-widest text-[var(--estrella-45)] uppercase">
                          Desde
                        </span>
                        <span className="display-md text-xl">
                          USD {e.desde}
                        </span>
                        {e.unidad && (
                          <span className="mono block text-[11px] text-[var(--cian)]">
                            {e.unidad}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="mono rounded-full border border-[var(--borde)] px-3 py-1 text-xs text-[var(--estrella-70)] group-hover:border-[var(--cian)] group-hover:text-[var(--cian)]">
                        Consultar
                      </span>
                    )}
                    <ArrowUpRight
                      className="size-4 text-[var(--estrella-45)] transition-colors group-hover:text-[var(--cian)]"
                      aria-hidden="true"
                    />
                    <span className="sr-only">(abre WhatsApp)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Nota sobre dominio y alojamiento */}
          <p className="mt-6 flex max-w-3xl gap-3 text-sm leading-relaxed text-[var(--estrella-70)]">
            <Info
              className="mt-0.5 size-4 shrink-0 text-[var(--cian)]"
              aria-hidden="true"
            />
            {notaPrecios}
          </p>
        </div>
      </div>
    </section>
  )
}

/** Tarjeta de un paquete con su precio, lo que incluye y el botón. */
function TarjetaPaquete({
  paquete: p,
  numero,
}: {
  paquete: Paquete
  numero: number
}) {
  return (
    <article
      className={cn(
        "hud relative flex h-full flex-col overflow-hidden rounded-3xl p-7 md:p-8",
        p.destacado && "shadow-[0_30px_90px_-30px_rgba(57,213,255,0.55)]"
      )}
      // Fondo más luminoso para el destacado (en línea porque .hud define
      // su fondo fuera de las capas de Tailwind y le ganaría a una clase).
      style={
        p.destacado
          ? {
              background:
                "linear-gradient(180deg, rgba(57,213,255,0.10), rgba(124,92,255,0.06)), rgba(12,15,34,0.75)",
            }
          : undefined
      }
      aria-labelledby={`paquete-${p.id}`}
    >
      {p.destacado && (
        <ShineBorder
          borderWidth={1.5}
          duration={10}
          shineColor={["#39d5ff", "#7c5cff", "#f5f7ff"]}
          className="rounded-3xl"
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <span className="mono text-[11px] tracking-widest text-[var(--estrella-45)]">
          PAQUETE_{String(numero).padStart(2, "0")}
        </span>
        {p.destacado && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--cian)] to-[var(--violeta)] px-3 py-1 text-xs font-semibold text-[var(--noche)]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            El más elegido
          </span>
        )}
      </div>

      <h3
        id={`paquete-${p.id}`}
        className="display-md mt-5 text-2xl md:text-[1.7rem]"
      >
        {p.nombre}
      </h3>
      {p.detalle && (
        <p className="mono mt-2 text-xs text-[var(--cian)]">{p.detalle}</p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-[var(--estrella-70)]">
        {p.para}
      </p>

      {/* Precio */}
      <p className="mt-6 flex items-baseline gap-2 border-y border-[var(--borde)] py-5">
        <span className="mono text-xs tracking-widest text-[var(--estrella-45)] uppercase">
          Desde
        </span>
        <span className={cn("display text-5xl", p.destacado && "degradado")}>
          <NumberTicker value={p.desde} className="text-inherit" />
        </span>
        <span className="mono text-sm text-[var(--estrella-70)]">dólares</span>
      </p>

      {/* Qué incluye */}
      <ul className="mt-6 flex flex-1 flex-col gap-3" aria-label="Incluye">
        {p.incluye.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-snug">
            <Check
              className="mt-0.5 size-4 shrink-0 text-[var(--cian)]"
              aria-hidden="true"
            />
            <span className="text-[var(--estrella-70)]">{item}</span>
          </li>
        ))}
      </ul>

      <a
        href={linkWhatsappCon(mensajePaquete(p))}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold",
          p.destacado ? "boton-orbita" : "boton-fantasma"
        )}
      >
        Pedir presupuesto
        <ArrowUpRight className="size-4" aria-hidden="true" />
        <span className="sr-only">del paquete {p.nombre} por WhatsApp</span>
      </a>
    </article>
  )
}
