"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Pause,
  Play,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Inclinable } from "@/components/inicio/interacciones"
import { HyperText } from "@/components/ui/hyper-text"
import { Iphone } from "@/components/ui/iphone"
import { Safari } from "@/components/ui/safari"
import { capturas, ejemplos } from "@/data/trabajo"
import { cn } from "@/lib/utils"

const INTERVALO = 7000

/** Posición relativa de cada tarjeta respecto de la activa: -1, 0 o 1. */
function desfase(i: number, activo: number, total: number) {
  let d = i - activo
  if (d > total / 2) d -= total
  if (d < -total / 2) d += total
  return d
}

export function Ejemplos() {
  const [activo, setActivo] = useState(0)
  const [pausado, setPausado] = useState(false)
  /** Pausa elegida con el botón: tiene prioridad sobre el mouse y el foco. */
  const [detenido, setDetenido] = useState(false)
  /**
   * Las capturas del carrusel se piden recién cuando la sección está cerca
   * de la pantalla: así no compiten con la carga inicial de la portada.
   */
  const seccionRef = useRef<HTMLElement>(null)
  const [cerca, setCerca] = useState(false)
  useEffect(() => {
    const el = seccionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCerca(true)
          io.disconnect()
        }
      },
      { rootMargin: "600px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  /** Tarjeta bajo el mouse: se destaca en su lugar sin cambiar la activa. */
  const [resaltado, setResaltado] = useState<number | null>(null)
  const total = ejemplos.length
  const destacado = resaltado ?? activo
  const actual = ejemplos[destacado]

  const ir = useCallback(
    (paso: number) => setActivo((a) => (a + paso + total) % total),
    [total]
  )

  // Avance automático lento: se frena con el mouse encima, con foco adentro,
  // con la pestaña oculta o con el botón de pausa. Corre aunque el sistema
  // pida reducir movimiento (decisión del dueño del sitio), por eso el botón
  // de pausa está siempre visible.
  useEffect(() => {
    if (pausado || detenido) return
    const id = window.setTimeout(() => {
      if (!document.hidden) ir(1)
    }, INTERVALO)
    return () => window.clearTimeout(id)
  }, [activo, pausado, detenido, ir])

  function onTecla(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      ir(1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      ir(-1)
    }
  }

  return (
    <section
      ref={seccionRef}
      id="trabajos"
      className="relative scroll-mt-24 overflow-hidden px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="titulo-trabajos"
    >
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.2),transparent)] blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <HyperText
              as="p"
              className="etiqueta-hud decodifica py-0 text-xs font-normal"
              startOnView
              duration={900}
            >
              [02] Ejemplos en vivo
            </HyperText>
            <h2
              id="titulo-trabajos"
              className="display mt-4 text-[clamp(2.4rem,6vw,4.8rem)]"
            >
              Tres negocios. <span className="degradado">Tres mundos.</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-[var(--estrella-70)]">
            Cada demo está pensada para un público distinto y funciona de
            verdad: podés comprar, reservar o pedir. Abrilas y probalas.
          </p>
        </div>

        {/* Carrusel */}
        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Sitios de ejemplo"
          tabIndex={0}
          onKeyDown={onTecla}
          onFocus={() => setPausado(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPausado(false)
            }
          }}
          className="mt-14 rounded-3xl focus-visible:ring-2 focus-visible:ring-[var(--cian)]/60 focus-visible:outline-none"
        >
          <motion.div
            className="relative mx-auto aspect-[16/11] w-full max-w-4xl [perspective:1600px] sm:aspect-[16/10]"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => {
              setPausado(false)
              setResaltado(null)
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) ir(1)
              else if (info.offset.x > 60) ir(-1)
            }}
          >
            {ejemplos.map((e, i) => {
              const d = desfase(i, activo, total)
              const centro = d === 0
              const brilla = i === destacado
              return (
                <motion.div
                  key={e.slug}
                  className="absolute inset-x-[6%] top-0 sm:inset-x-[10%]"
                  initial={false}
                  onPointerEnter={(ev) => {
                    if (ev.pointerType === "mouse") setResaltado(i)
                  }}
                  animate={{
                    x: `${d * 62}%`,
                    // La destacada se endereza y crece, pero no se mueve de su lugar.
                    rotateY: brilla ? d * -10 : d * -38,
                    scale: brilla ? (centro ? 1 : 0.88) : centro ? 0.9 : 0.72,
                    opacity: brilla ? 1 : centro ? 0.4 : 0.35,
                    zIndex: brilla ? 3 : centro ? 2 : 1,
                    filter: brilla ? "saturate(1)" : "saturate(0.6)",
                    // La destacada de un costado sube apenas, como si se acercara.
                    y: brilla && !centro ? "-3%" : "0%",
                  }}
                  // Transición lenta y elástica para que el cambio de primer plano
                  // se sienta fluido. Corre aunque el sistema pida reducir
                  // movimiento (decisión del dueño del sitio).
                  transition={{
                    x: {
                      type: "spring",
                      stiffness: 55,
                      damping: 18,
                      mass: 1.1,
                    },
                    rotateY: {
                      type: "spring",
                      stiffness: 45,
                      damping: 16,
                      mass: 1.2,
                    },
                    scale: {
                      type: "spring",
                      stiffness: 55,
                      damping: 15,
                      mass: 1.1,
                    },
                    y: {
                      type: "spring",
                      stiffness: 50,
                      damping: 14,
                      mass: 1.1,
                    },
                    opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                    filter: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                    zIndex: { delay: 0.05 },
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  aria-hidden={!centro}
                >
                  <button
                    type="button"
                    tabIndex={centro ? -1 : 0}
                    onClick={() => !centro && setActivo(i)}
                    aria-label={centro ? undefined : `Ver ${e.nombre}`}
                    className={cn(
                      "block w-full text-left",
                      centro
                        ? "cursor-grab active:cursor-grabbing"
                        : "cursor-pointer"
                    )}
                  >
                    <Inclinable grados={5} reflejo={false}>
                      <div
                        className="relative rounded-xl shadow-[0_40px_120px_-30px_rgba(57,213,255,0.45)] transition-shadow duration-1000 ease-out"
                        style={{
                          boxShadow: brilla
                            ? `0 40px 120px -30px ${e.color}88`
                            : undefined,
                        }}
                      >
                        <Safari
                          url={`${e.slug}.uy`}
                          imageSrc={cerca ? e.escritorio : undefined}
                          className="pointer-events-none select-none"
                        />
                        <div className="pointer-events-none absolute -right-[4%] -bottom-[14%] w-[22%] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                          <Iphone src={cerca ? e.celular : undefined} />
                        </div>
                      </div>
                    </Inclinable>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Controles */}
          <div className="mt-[12%] flex flex-wrap items-center justify-between gap-4 sm:mt-[9%]">
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Elegí un ejemplo"
            >
              {ejemplos.map((e, i) => (
                <button
                  key={e.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === activo}
                  onClick={() => setActivo(i)}
                  className="boton-hud relative flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ background: e.color }}
                    aria-hidden="true"
                  />
                  {e.nombre}
                  {i === activo && !detenido && (
                    <span
                      key={activo}
                      className={cn(
                        "progreso-carrusel absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-[var(--cian)] to-[var(--violeta)]",
                        pausado && "[animation-play-state:paused]"
                      )}
                      style={{ animationDuration: `${INTERVALO}ms` }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDetenido((v) => !v)}
                aria-pressed={detenido}
                className="boton-hud flex size-11 items-center justify-center rounded-full"
                aria-label={
                  detenido
                    ? "Reanudar el pase automático"
                    : "Pausar el pase automático"
                }
              >
                {detenido ? (
                  <Play className="size-4" aria-hidden="true" />
                ) : (
                  <Pause className="size-4" aria-hidden="true" />
                )}
              </button>
              <span className="mono mx-2 text-xs text-[var(--estrella-45)]">
                {String(activo + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => ir(-1)}
                className="boton-hud flex size-11 items-center justify-center rounded-full"
                aria-label="Ejemplo anterior"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => ir(1)}
                className="boton-hud flex size-11 items-center justify-center rounded-full"
                aria-label="Ejemplo siguiente"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Ficha del ejemplo activo */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={actual.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="hud barrido relative mt-8 grid gap-8 overflow-hidden rounded-3xl p-6 md:grid-cols-[1fr_1.2fr_auto] md:items-center md:p-8"
              aria-live="polite"
            >
              <div>
                <p className="mono text-xs tracking-widest text-[var(--estrella-45)] uppercase">
                  {actual.rubro}
                </p>
                <h3 className="display-md mt-2 text-3xl md:text-4xl">
                  {actual.nombre}
                </h3>
                <p className="mt-3 text-sm text-[var(--estrella-70)]">
                  <span className="text-[var(--cian)]">Público:</span>{" "}
                  {actual.publico}
                </p>
              </div>
              <ul className="grid gap-2.5 text-sm sm:grid-cols-2">
                {actual.funciones.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--cian)]"
                      aria-hidden="true"
                    />
                    <span className="text-[var(--estrella-70)]">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-6 md:flex-col md:items-end">
                <p className="text-right">
                  <span
                    className="display block text-5xl"
                    style={{ color: actual.color }}
                  >
                    {actual.dato.valor}
                  </span>
                  <span className="mono text-[11px] text-[var(--estrella-45)] uppercase">
                    {actual.dato.etiqueta}
                  </span>
                </p>
                <a
                  href={actual.ruta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="boton-orbita inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold whitespace-nowrap"
                >
                  Abrir demo
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Muro 3D de pantallas */}
        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="etiqueta-hud">Archivo de pantallas</p>
            <p className="mono text-xs text-[var(--estrella-45)]">
              {capturas.length} pantallas reales · 3 sitios · 0 plantillas
            </p>
          </div>
          <MontarCerca className="mt-6 h-[420px] md:h-[560px]">
            <MuroPantallas />
          </MontarCerca>
        </div>
      </div>
    </section>
  )
}

/** Renderiza el contenido recién cuando el bloque se acerca a la pantalla. */
function MontarCerca({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: "400px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {visible ? children : null}
    </div>
  )
}

/**
 * Muro de pantallas en perspectiva: 4 columnas (3 en celular) que suben y
 * bajan en sentidos alternados. Cada columna repite sus imágenes dos veces
 * para que el recorrido sea continuo. Se frena al pasar el mouse.
 */
function MuroPantallas() {
  const columnas = [0, 1, 2, 3].map((c) =>
    capturas.filter((_, i) => i % 4 === c)
  )
  return (
    <div className="muro relative h-full overflow-hidden rounded-3xl [mask-image:radial-gradient(70%_75%_at_50%_50%,black_55%,transparent)] [perspective:1400px]">
      <div className="absolute inset-x-[-15%] top-[-30%] bottom-[-30%] grid [transform:rotateX(32deg)_rotateZ(-14deg)] grid-cols-3 gap-4 md:grid-cols-4 md:gap-6">
        {columnas.map((imgs, c) => (
          <div
            key={c}
            className={cn(
              "muro-col flex flex-col gap-4 md:gap-6",
              c === 3 && "hidden md:flex"
            )}
            data-sentido={c % 2 === 0 ? "sube" : "baja"}
            style={{ "--duracion": `${38 + c * 7}s` } as React.CSSProperties}
          >
            {[...imgs, ...imgs].map((src, i) => (
              <div
                key={src + i}
                className="relative aspect-[970/700] w-full shrink-0 overflow-hidden rounded-xl border border-[var(--borde)] shadow-[0_20px_60px_-20px_rgba(57,213,255,0.35)]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 33vw"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        className="escaneo pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
    </div>
  )
}
