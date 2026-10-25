"use client"

import { useRef, useState } from "react"
import {
  ArrowRight,
  CreditCard,
  AtSign,
  MapPin,
  MessageCircle,
  Search,
  Store,
  Users,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Inclinable } from "@/components/inicio/interacciones"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { HyperText } from "@/components/ui/hyper-text"
import { compromisos, etapas } from "@/data/trabajo"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export function ComoTrabajo() {
  const reducido = useReducedMotion()
  const [activa, setActiva] = useState(0)
  const etapa = etapas[activa]
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])

  function onTecla(e: React.KeyboardEvent, i: number) {
    const sig =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (i + 1) % etapas.length
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (i - 1 + etapas.length) % etapas.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? etapas.length - 1
              : null
    if (sig === null) return
    e.preventDefault()
    setActiva(sig)
    tabsRef.current[sig]?.focus()
  }

  return (
    <section
      id="proceso"
      className="relative scroll-mt-24 px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="titulo-proceso"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <HyperText
              as="p"
              className="etiqueta-hud decodifica py-0 text-xs font-normal"
              startOnView
              duration={900}
            >
              [03] Cómo trabajo
            </HyperText>
            <h2
              id="titulo-proceso"
              className="display mt-4 text-[clamp(2.4rem,6vw,4.8rem)]"
            >
              De la primera charla a{" "}
              <span className="degradado">tu página online.</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-[var(--estrella-70)] md:text-lg">
            Cinco etapas, siempre en el mismo orden y con fecha fija desde el
            primer día. En cada una sabés qué hago yo, qué recibís vos y qué
            necesito para avanzar. Total: entre 2 y 5 semanas.
          </p>
        </div>

        {/* Recorrido por etapas */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <div
            role="tablist"
            aria-label="Etapas del trabajo"
            aria-orientation="vertical"
            className="relative flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {/* Línea de progreso (escritorio) */}
            <div
              className="absolute top-6 bottom-6 left-[1.6rem] hidden w-px bg-[var(--borde)] lg:block"
              aria-hidden="true"
            >
              <motion.div
                className="w-full origin-top bg-gradient-to-b from-[var(--cian)] to-[var(--violeta)]"
                initial={false}
                animate={{ height: `${(activa / (etapas.length - 1)) * 100}%` }}
                transition={{ duration: reducido ? 0 : 0.5 }}
              />
            </div>
            {etapas.map((e, i) => (
              <button
                key={e.codigo}
                ref={(el) => {
                  tabsRef.current[i] = el
                }}
                type="button"
                role="tab"
                id={`etapa-tab-${i}`}
                aria-selected={i === activa}
                aria-controls="etapa-panel"
                tabIndex={i === activa ? 0 : -1}
                onClick={() => setActiva(i)}
                onKeyDown={(ev) => onTecla(ev, i)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[var(--cian)]/60 focus-visible:outline-none lg:py-4",
                  i === activa
                    ? "border-[var(--cian)]/50 bg-[rgba(57,213,255,0.08)]"
                    : "border-transparent hover:border-[var(--borde)]"
                )}
              >
                <span
                  className={cn(
                    "mono relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border text-xs",
                    i <= activa
                      ? "border-[var(--cian)] bg-[var(--noche)] text-[var(--cian)]"
                      : "border-[var(--borde)] bg-[var(--noche)] text-[var(--estrella-45)]"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="display-md block text-base whitespace-nowrap md:text-lg">
                    {e.titulo}
                  </span>
                  <span className="mono block text-[11px] text-[var(--estrella-45)]">
                    {e.duracion}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div
            id="etapa-panel"
            role="tabpanel"
            aria-labelledby={`etapa-tab-${activa}`}
            className="hud barrido relative overflow-hidden rounded-3xl"
          >
            <div
              className="escaneo pointer-events-none absolute inset-0"
              aria-hidden="true"
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={etapa.codigo}
                initial={reducido ? false : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducido ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: 0.28 }}
                className="relative p-6 md:p-9"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="mono text-xs tracking-[0.2em] text-[var(--cian)]">
                    PASO {String(activa + 1).padStart(2, "0")}
                    {" // "}
                    {etapa.codigo}
                  </p>
                  <span className="mono rounded-full border border-[var(--borde)] px-3 py-1 text-[11px] text-[var(--estrella-70)]">
                    ⏱ {etapa.duracion}
                  </span>
                </div>
                <h3 className="display mt-4 text-[clamp(1.8rem,3.6vw,2.8rem)]">
                  {etapa.titulo}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--estrella-70)] md:text-lg">
                  {etapa.resumen}
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <Columna
                    titulo="Qué hacemos"
                    items={etapa.hacemos}
                    color="var(--cian)"
                  />
                  <Columna
                    titulo="Qué recibís"
                    items={etapa.recibis}
                    color="#3fd68c"
                  />
                  <Columna
                    titulo="Qué necesito de vos"
                    items={etapa.necesito}
                    color="var(--violeta)"
                  />
                </div>

                <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--borde)] pt-5">
                  <div className="flex gap-1.5" aria-hidden="true">
                    {etapas.map((x, i) => (
                      <span
                        key={x.codigo}
                        className={cn(
                          "h-1 rounded-full transition-all",
                          i === activa
                            ? "w-8 bg-[var(--cian)]"
                            : i < activa
                              ? "w-3 bg-[var(--cian)]/50"
                              : "w-3 bg-[var(--borde)]"
                        )}
                      />
                    ))}
                  </div>
                  {activa < etapas.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiva(activa + 1)}
                      className="boton-hud inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                    >
                      Siguiente: {etapas[activa + 1].titulo}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <a
                      href="#contacto"
                      className="boton-orbita inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                    >
                      Empezar el paso 01
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Diagrama: la página conectada con todo */}
        <Diagrama />

        {/* Compromisos */}
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {compromisos.map((c, i) => (
            <li key={c.titulo} className="h-full">
              <Inclinable className="h-full" grados={10}>
                <div className="hud h-full rounded-2xl p-5">
                  <span className="mono text-[11px] text-[var(--estrella-45)]">
                    REGLA_{String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="display-md mt-3 text-xl">{c.titulo}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--estrella-70)]">
                    {c.texto}
                  </p>
                </div>
              </Inclinable>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Columna({
  titulo,
  items,
  color,
}: {
  titulo: string
  items: string[]
  color: string
}) {
  return (
    <div className="rounded-2xl border border-[var(--borde)] bg-[rgba(5,6,15,0.45)] p-4">
      <p
        className="mono text-[11px] tracking-widest uppercase"
        style={{ color }}
      >
        {titulo}
      </p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((t) => (
          <li
            key={t}
            className="flex gap-2.5 text-sm leading-snug text-[var(--estrella-70)]"
          >
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full"
              style={{ background: color }}
              aria-hidden="true"
            />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

const salidas = [
  { Icono: Search, texto: "Google" },
  { Icono: MapPin, texto: "Google Maps" },
  { Icono: MessageCircle, texto: "WhatsApp" },
  { Icono: CreditCard, texto: "Mercado Pago" },
  { Icono: AtSign, texto: "Instagram" },
]

function Diagrama() {
  const contenedor = useRef<HTMLDivElement>(null)
  const negocio = useRef<HTMLDivElement>(null)
  const web = useRef<HTMLDivElement>(null)
  const clientes = useRef<HTMLDivElement>(null)
  const nodo0 = useRef<HTMLDivElement>(null)
  const nodo1 = useRef<HTMLDivElement>(null)
  const nodo2 = useRef<HTMLDivElement>(null)
  const nodo3 = useRef<HTMLDivElement>(null)
  const nodo4 = useRef<HTMLDivElement>(null)

  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="etiqueta-hud">Integraciones</p>
          <h3 className="display-md mt-3 text-[clamp(1.6rem,3vw,2.4rem)]">
            Tu página, conectada con todo.
          </h3>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[var(--estrella-70)]">
          No es una vidriera aislada: la conecto con donde ya están tus
          clientes, para que te encuentren, te escriban y te paguen.
        </p>
      </div>

      <div
        ref={contenedor}
        className="hud relative mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 overflow-hidden rounded-3xl px-4 py-10 md:gap-10 md:px-10"
        aria-label="Diagrama: tu negocio se conecta con tu página web, y la página con Google, Google Maps, WhatsApp, Mercado Pago e Instagram, que traen clientes."
        role="img"
      >
        <div className="flex flex-col items-start gap-10">
          <Nodo ref={negocio} grande>
            <Store className="size-6" aria-hidden="true" />
            <span>Tu negocio</span>
          </Nodo>
          <Nodo ref={clientes} grande>
            <Users className="size-6" aria-hidden="true" />
            <span>Clientes nuevos</span>
          </Nodo>
        </div>

        <div
          ref={web}
          className="relative z-10 flex size-24 flex-col items-center justify-center rounded-full border border-[var(--cian)]/60 bg-[var(--noche)] text-center shadow-[0_0_60px_-10px_rgba(57,213,255,0.7)] md:size-32"
        >
          <span className="display-md text-lg md:text-2xl">
            Tu web<span className="text-[var(--cian)]">.</span>
          </span>
          <span className="mono text-[10px] text-[var(--estrella-45)]">
            online 24/7
          </span>
        </div>

        <div className="flex flex-col items-end gap-3">
          <Salida ref={nodo0} indice={0} />
          <Salida ref={nodo1} indice={1} />
          <Salida ref={nodo2} indice={2} />
          <Salida ref={nodo3} indice={3} />
          <Salida ref={nodo4} indice={4} />
        </div>

        <AnimatedBeam
          containerRef={contenedor}
          fromRef={negocio}
          toRef={web}
          curvature={-30}
          gradientStartColor="#7c5cff"
          gradientStopColor="#39d5ff"
          pathColor="rgba(245,247,255,0.15)"
        />
        <AnimatedBeam
          containerRef={contenedor}
          fromRef={web}
          toRef={nodo0}
          curvature={-36}
          delay={0.0}
          gradientStartColor="#39d5ff"
          gradientStopColor="#7c5cff"
          pathColor="rgba(245,247,255,0.15)"
        />
        <AnimatedBeam
          containerRef={contenedor}
          fromRef={web}
          toRef={nodo1}
          curvature={-18}
          delay={0.4}
          gradientStartColor="#39d5ff"
          gradientStopColor="#7c5cff"
          pathColor="rgba(245,247,255,0.15)"
        />
        <AnimatedBeam
          containerRef={contenedor}
          fromRef={web}
          toRef={nodo2}
          curvature={0}
          delay={0.8}
          gradientStartColor="#39d5ff"
          gradientStopColor="#7c5cff"
          pathColor="rgba(245,247,255,0.15)"
        />
        <AnimatedBeam
          containerRef={contenedor}
          fromRef={web}
          toRef={nodo3}
          curvature={18}
          delay={1.2}
          gradientStartColor="#39d5ff"
          gradientStopColor="#7c5cff"
          pathColor="rgba(245,247,255,0.15)"
        />
        <AnimatedBeam
          containerRef={contenedor}
          fromRef={web}
          toRef={nodo4}
          curvature={36}
          delay={1.6}
          gradientStartColor="#39d5ff"
          gradientStopColor="#7c5cff"
          pathColor="rgba(245,247,255,0.15)"
        />
        <AnimatedBeam
          containerRef={contenedor}
          fromRef={web}
          toRef={clientes}
          curvature={30}
          reverse
          delay={1}
          gradientStartColor="#3fd68c"
          gradientStopColor="#39d5ff"
          pathColor="rgba(245,247,255,0.15)"
        />
      </div>
    </div>
  )
}

function Salida({
  ref,
  indice,
}: {
  ref: React.Ref<HTMLDivElement>
  indice: number
}) {
  const { Icono, texto } = salidas[indice]
  return (
    <Nodo ref={ref}>
      <Icono className="size-4" aria-hidden="true" />
      <span>{texto}</span>
    </Nodo>
  )
}

function Nodo({
  ref,
  children,
  grande = false,
}: {
  ref: React.Ref<HTMLDivElement>
  children: React.ReactNode
  grande?: boolean
}) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex items-center gap-2 rounded-full border border-[var(--borde)] bg-[var(--noche)] text-[var(--estrella)]",
        grande
          ? "flex-col rounded-2xl px-3 py-3 text-center text-xs md:flex-row md:px-4 md:text-sm"
          : "px-3 py-1.5 text-[11px] md:text-sm"
      )}
    >
      {children}
    </div>
  )
}
