"use client"

import { useId, useState } from "react"
import { Check, Mail, RotateCcw } from "lucide-react"

import { BorderBeam } from "@/components/ui/border-beam"
import { HyperText } from "@/components/ui/hyper-text"
import { Meteors } from "@/components/ui/meteors"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { perfil } from "@/data/perfil"
import { useHoraMontevideo } from "@/hooks/use-hora-montevideo"
import { cn } from "@/lib/utils"

const tipos = [
  "Sitio para mi negocio",
  "Página de presentación",
  "Tienda online",
  "Todavía no sé",
]
const objetivos = [
  "Que me escriban por WhatsApp",
  "Vender online",
  "Aparecer en Google",
  "Mostrar mis trabajos",
  "Tomar reservas o turnos",
]
const plazos = ["Lo antes posible", "En 1 mes", "En 2 o 3 meses", "Sin apuro"]

const pasosDespues = [
  {
    t: "Te respondo en el día",
    d: "Con preguntas concretas, nada de formularios eternos.",
  },
  {
    t: "Charla de 30 minutos",
    d: "Videollamada o café en Montevideo, sin costo.",
  },
  {
    t: "Presupuesto cerrado",
    d: "Por escrito, con fecha de entrega y lo que incluye.",
  },
]

function armarMensaje(d: {
  nombre: string
  negocio: string
  tipo: string
  metas: string[]
  plazo: string
}) {
  const lineas = [
    `Hola ${perfil.nombreCorto}, ${d.nombre ? `soy ${d.nombre}` : "vi tu portfolio"}${d.negocio ? ` de ${d.negocio}` : ""}.`,
    d.tipo ? `Necesito: ${d.tipo}.` : "",
    d.metas.length ? `Quiero: ${d.metas.join(", ").toLowerCase()}.` : "",
    d.plazo ? `Plazo: ${d.plazo.toLowerCase()}.` : "",
    "¿Charlamos?",
  ]
  return lineas.filter(Boolean).join("\n")
}

export function Contacto() {
  const idBase = useId()
  const hora = useHoraMontevideo()
  const [tipo, setTipo] = useState("")
  const [metas, setMetas] = useState<string[]>([])
  const [plazo, setPlazo] = useState("")
  const [nombre, setNombre] = useState("")
  const [negocio, setNegocio] = useState("")

  const mensaje = armarMensaje({ nombre, negocio, tipo, metas, plazo })
  const completo = [tipo, metas.length > 0, plazo, nombre.trim()].filter(
    Boolean
  ).length
  const porcentaje = Math.round((completo / 4) * 100)

  const texto = encodeURIComponent(mensaje)
  const urlWhatsapp = perfil.whatsapp
    ? `https://wa.me/${perfil.whatsapp}?text=${texto}`
    : `https://wa.me/?text=${texto}`
  const urlCorreo = `mailto:${perfil.email}?subject=${encodeURIComponent(
    `Proyecto web${negocio ? ` · ${negocio}` : ""}`
  )}&body=${texto}`

  function alternarMeta(m: string) {
    setMetas((v) => (v.includes(m) ? v.filter((x) => x !== m) : [...v, m]))
  }

  function reiniciar() {
    setTipo("")
    setMetas([])
    setPlazo("")
    setNombre("")
    setNegocio("")
  }

  return (
    <section
      id="contacto"
      className="relative scroll-mt-24 px-5 pt-24 pb-10 md:px-10 md:pt-32"
      aria-labelledby="titulo-contacto"
    >
      <div className="mx-auto max-w-6xl">
        <div className="hud relative overflow-hidden rounded-[2rem] px-5 py-12 md:px-12 md:py-16">
          <BorderBeam
            size={180}
            duration={9}
            colorFrom="#39d5ff"
            colorTo="#7c5cff"
            borderWidth={1.5}
          />
          <BorderBeam
            size={180}
            duration={9}
            delay={4.5}
            colorFrom="#7c5cff"
            colorTo="#39d5ff"
            borderWidth={1.5}
          />
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <Meteors number={14} minDuration={4} maxDuration={9} />
          </div>
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(57,213,255,0.22),transparent)] blur-2xl"
            aria-hidden="true"
          />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
            {/* Columna izquierda: configurador */}
            <div>
              <HyperText
                as="p"
                className="etiqueta-hud decodifica py-0 text-xs font-normal"
                startOnView
                duration={900}
              >
                [07] Contacto
              </HyperText>
              <h2
                id="titulo-contacto"
                className="display brillo mt-4 text-[clamp(1.6rem,6.5vw,2.9rem)]"
              >
                ¿Arrancamos?
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--estrella-70)] md:text-lg">
                Armá tu pedido en 30 segundos: tocá lo que se parezca a tu idea
                y te llega a mi WhatsApp ya escrito.
              </p>

              <form
                className="mt-8 flex flex-col gap-7"
                onSubmit={(e) => {
                  e.preventDefault()
                  window.open(urlWhatsapp, "_blank", "noopener,noreferrer")
                }}
              >
                <Grupo titulo="01 · ¿Qué necesitás?">
                  {tipos.map((t) => (
                    <Chip
                      key={t}
                      activo={tipo === t}
                      onClick={() => setTipo(tipo === t ? "" : t)}
                      rol="radio"
                    >
                      {t}
                    </Chip>
                  ))}
                </Grupo>
                <Grupo titulo="02 · ¿Qué querés lograr? (podés elegir varias)">
                  {objetivos.map((m) => (
                    <Chip
                      key={m}
                      activo={metas.includes(m)}
                      onClick={() => alternarMeta(m)}
                      rol="checkbox"
                    >
                      {m}
                    </Chip>
                  ))}
                </Grupo>
                <Grupo titulo="03 · ¿Para cuándo?">
                  {plazos.map((p) => (
                    <Chip
                      key={p}
                      activo={plazo === p}
                      onClick={() => setPlazo(plazo === p ? "" : p)}
                      rol="radio"
                    >
                      {p}
                    </Chip>
                  ))}
                </Grupo>

                <fieldset>
                  <legend className="mono mb-3 text-[11px] tracking-widest text-[var(--estrella-45)] uppercase">
                    04 · ¿Quién sos?
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Campo
                      id={`${idBase}-nombre`}
                      etiqueta="Tu nombre"
                      valor={nombre}
                      onCambio={setNombre}
                      autoComplete="given-name"
                    />
                    <Campo
                      id={`${idBase}-negocio`}
                      etiqueta="Tu negocio (opcional)"
                      valor={negocio}
                      onCambio={setNegocio}
                      autoComplete="organization"
                    />
                  </div>
                </fieldset>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ShimmerButton
                    type="submit"
                    shimmerColor="#39d5ff"
                    shimmerSize="0.08em"
                    shimmerDuration="2.6s"
                    background="linear-gradient(100deg, #39d5ff, #7c5cff)"
                    className="w-full gap-3 px-7 py-4 text-base font-semibold text-[var(--noche)] shadow-[0_18px_50px_-12px_rgba(57,213,255,0.6)] focus-visible:ring-2 focus-visible:ring-[var(--cian)] focus-visible:outline-none sm:w-auto"
                  >
                    <IconoWhatsapp />
                    Enviar por WhatsApp
                  </ShimmerButton>
                  <a
                    href={urlCorreo}
                    className="boton-fantasma inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-medium"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    Por correo
                  </a>
                </div>
              </form>
            </div>

            {/* Columna derecha: terminal con el resumen en vivo */}
            <div className="flex flex-col gap-5">
              <div className="overflow-hidden rounded-2xl border border-[var(--borde)] bg-[#03040b]/90 shadow-[0_30px_80px_-30px_rgba(124,92,255,0.6)]">
                <div className="flex items-center justify-between border-b border-[var(--borde)] px-4 py-3">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="mono text-[11px] text-[var(--estrella-45)]">
                    brief.txt — en vivo
                  </span>
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="mono inline-flex items-center gap-1 text-[11px] text-[var(--estrella-45)] hover:text-[var(--cian)] focus-visible:text-[var(--cian)] focus-visible:outline-none"
                  >
                    <RotateCcw className="size-3" aria-hidden="true" /> limpiar
                  </button>
                </div>
                <div
                  className="mono min-h-[15rem] p-5 text-[13px] leading-relaxed"
                  aria-live="polite"
                >
                  <p className="text-[var(--estrella-45)]">
                    $ nuevo-proyecto --cliente
                  </p>
                  <Linea etiqueta="nombre" valor={nombre} />
                  <Linea etiqueta="negocio" valor={negocio} />
                  <Linea etiqueta="tipo" valor={tipo} />
                  <Linea etiqueta="objetivo" valor={metas.join(" + ")} />
                  <Linea etiqueta="plazo" valor={plazo} />
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--borde)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--cian)] to-[var(--violeta)] transition-[width] duration-500"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[var(--estrella-45)]">
                      {porcentaje}%
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-3",
                      porcentaje === 100
                        ? "text-[#3fd68c]"
                        : "text-[var(--estrella-45)]"
                    )}
                  >
                    {porcentaje === 100
                      ? "✓ listo para enviar"
                      : "› completá los pasos para un presupuesto más preciso"}
                    <span
                      className="cursor-terminal ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-[var(--cian)]"
                      aria-hidden="true"
                    />
                  </p>
                </div>
              </div>

              <div className="hud rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="etiqueta-hud">Qué pasa después</p>
                  <span className="mono flex items-center gap-2 text-[11px] text-[#3fd68c]">
                    <span className="en-vivo" aria-hidden="true" />
                    <span suppressHydrationWarning>
                      En línea · {hora} en Montevideo
                    </span>
                  </span>
                </div>
                <ol className="mt-4 flex flex-col gap-4">
                  {pasosDespues.map((p, i) => (
                    <li key={p.t} className="flex gap-4">
                      <span className="mono flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--cian)]/50 text-xs text-[var(--cian)]">
                        {i + 1}
                      </span>
                      <span>
                        <span className="display-md block text-base">
                          {p.t}
                        </span>
                        <span className="text-sm text-[var(--estrella-70)]">
                          {p.d}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mono text-center text-xs break-all text-[var(--estrella-45)] lg:text-left">
                {perfil.email}
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--estrella-45)]">
          <p translate="no" className="notranslate">
            {perfil.nombre}, {new Date().getFullYear()}
          </p>
          <p>
            {perfil.formacion[0]}. {perfil.formacion[1]}.
          </p>
          <p>{perfil.ciudad}</p>
        </footer>
      </div>
    </section>
  )
}

function Grupo({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <fieldset>
      <legend className="mono mb-3 text-[11px] tracking-widest text-[var(--estrella-45)] uppercase">
        {titulo}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}

function Chip({
  activo,
  onClick,
  rol,
  children,
}: {
  activo: boolean
  onClick: () => void
  rol: "radio" | "checkbox"
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role={rol}
      aria-checked={activo}
      onClick={onClick}
      data-activo={activo}
      className="boton-hud inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
    >
      {activo && (
        <Check className="size-3.5 text-[var(--cian)]" aria-hidden="true" />
      )}
      {children}
    </button>
  )
}

function Campo({
  id,
  etiqueta,
  valor,
  onCambio,
  autoComplete,
}: {
  id: string
  etiqueta: string
  valor: string
  onCambio: (v: string) => void
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {etiqueta}
      </label>
      <input
        id={id}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        placeholder={etiqueta}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[var(--borde)] bg-[rgba(5,6,15,0.6)] px-4 py-3 text-sm text-[var(--estrella)] placeholder:text-[var(--estrella-45)] focus:border-[var(--cian)] focus:outline-none"
      />
    </div>
  )
}

function Linea({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <p className="mt-1.5 flex gap-2">
      <span className="text-[var(--violeta)]">{etiqueta.padEnd(9, " ")}</span>
      <span className="text-[var(--estrella-45)]">=</span>
      {valor ? (
        <span className="text-[var(--cian)]">&quot;{valor}&quot;</span>
      ) : (
        <span className="text-[var(--estrella-45)]">—</span>
      )}
    </p>
  )
}

function IconoWhatsapp() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3 4.3c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.2.2 2 3.1 4.9 4.2 2.4.9 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4l-.5-.3-1.9-.9c-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.4.1-.2 0-.3 0-.5L10.7 9c-.2-.5-.4-.5-.6-.5H9Z" />
    </svg>
  )
}
