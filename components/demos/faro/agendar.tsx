"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog } from "radix-ui"
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react"

import { useFaro } from "@/components/demos/faro/contexto"
import { estudio } from "@/components/demos/faro/datos"
import { cn } from "@/lib/utils"

const tipos = [
  "Vivienda nueva",
  "Reforma o ampliación",
  "Interiorismo",
  "Local u oficinas",
  "Desarrollo inmobiliario",
  "Otro",
]
const inmuebles = ["Sí, ya lo tengo", "Lo estoy buscando", "En negociación"]
const presupuestos = [
  "Hasta USD 150.000",
  "USD 150.000 a 400.000",
  "USD 400.000 a 1.000.000",
  "Más de USD 1.000.000",
  "Prefiero conversarlo",
]
const plazos = [
  "Lo antes posible",
  "En 3 a 6 meses",
  "En 6 a 12 meses",
  "Más adelante",
]
const modalidades = ["En el estudio", "En el terreno u obra", "Videollamada"]

type Datos = {
  tipo: string
  ubicacion: string
  inmueble: string
  superficie: string
  presupuesto: string
  plazo: string
  nombre: string
  correo: string
  telefono: string
  modalidad: string
  comentario: string
}

const vacio: Datos = {
  tipo: "",
  ubicacion: "",
  inmueble: "",
  superficie: "",
  presupuesto: "",
  plazo: "",
  nombre: "",
  correo: "",
  telefono: "",
  modalidad: modalidades[0],
  comentario: "",
}

const pasos = [
  "Proyecto",
  "Lugar y superficie",
  "Presupuesto y plazo",
  "Tus datos",
  "Resumen",
] as const

type Errores = Partial<Record<keyof Datos, string>>

function validar(paso: number, d: Datos): Errores {
  const e: Errores = {}
  if (paso === 0 && !d.tipo) e.tipo = "Elegí un tipo de proyecto."
  if (paso === 1) {
    if (d.ubicacion.trim().length < 3)
      e.ubicacion = "Contanos el barrio o la ciudad."
    if (!d.inmueble) e.inmueble = "Elegí una opción."
    const m2 = Number(d.superficie)
    if (!d.superficie) e.superficie = "Indicá una superficie aproximada."
    else if (!Number.isFinite(m2) || m2 < 15 || m2 > 50000)
      e.superficie = "Ingresá un número entre 15 y 50.000 m²."
  }
  if (paso === 2) {
    if (!d.presupuesto) e.presupuesto = "Elegí un rango de presupuesto."
    if (!d.plazo) e.plazo = "Elegí un plazo."
  }
  if (paso === 3) {
    if (d.nombre.trim().length < 2) e.nombre = "Escribí tu nombre."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo.trim()))
      e.correo = "Revisá el correo: falta algo."
    if (d.telefono && !/^[+\d][\d\s-]{6,}$/.test(d.telefono.trim()))
      e.telefono = "Usá solo números, espacios o guiones."
  }
  return e
}

/** "Agendar primera reunión": formulario por pasos que arma un correo. */
export function Agendar() {
  const { abierta, abrir, cerrar, alCerrar } = useFaro()
  const [paso, setPaso] = useState(0)
  const [datos, setDatos] = useState<Datos>(vacio)
  const [errores, setErrores] = useState<Errores>({})
  const [enviado, setEnviado] = useState(false)
  const titulo = useRef<HTMLHeadingElement>(null)
  const primerPaso = useRef(true)

  // Al cambiar de paso, el foco va al título del paso (lectores de pantalla).
  useEffect(() => {
    if (primerPaso.current) {
      primerPaso.current = false
      return
    }
    titulo.current?.focus()
  }, [paso, enviado])

  const poner = (k: keyof Datos, v: string) => {
    setDatos((d) => ({ ...d, [k]: v }))
    if (errores[k]) setErrores((e) => ({ ...e, [k]: undefined }))
  }

  function avanzar() {
    const e = validar(paso, datos)
    setErrores(e)
    const primero = Object.keys(e)[0]
    if (primero) {
      document
        .querySelector<HTMLElement>(`[data-campo="${primero}"]`)
        ?.focus()
      return
    }
    setPaso((p) => Math.min(p + 1, pasos.length - 1))
  }

  const asunto = `Primera reunión · ${datos.tipo} · ${datos.nombre}`
  const resumen: [string, string, number][] = [
    ["Tipo de proyecto", datos.tipo, 0],
    ["Ubicación", datos.ubicacion, 1],
    ["Terreno o inmueble", datos.inmueble, 1],
    ["Superficie aproximada", datos.superficie && `${datos.superficie} m²`, 1],
    ["Presupuesto", datos.presupuesto, 2],
    ["Plazo", datos.plazo, 2],
    ["Nombre", datos.nombre, 3],
    ["Correo", datos.correo, 3],
    ["Teléfono", datos.telefono || "—", 3],
    ["Reunión", datos.modalidad, 3],
    ["Comentarios", datos.comentario || "—", 3],
  ]
  const cuerpo = [
    "Hola, Estudio Faro:",
    "",
    "Quiero agendar una primera reunión. Estos son los datos del proyecto:",
    "",
    ...resumen.map(([k, v]) => `${k}: ${v}`),
    "",
    "Gracias.",
  ].join("\n")
  const mailto = `mailto:${estudio.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`

  function reiniciar() {
    setDatos(vacio)
    setPaso(0)
    setErrores({})
    setEnviado(false)
  }

  return (
    <Dialog.Root
      open={abierta === "agendar"}
      onOpenChange={(v) => (v ? abrir("agendar") : cerrar())}
    >
      <Dialog.Overlay className="capa fixed inset-0 z-[60] bg-[var(--carbon)]/70" />
      <Dialog.Content
        className="panel-lateral fixed inset-y-0 right-0 z-[61] flex w-full flex-col bg-[var(--papel)] text-[var(--carbon)] sm:w-[min(680px,100vw)]"
        onCloseAutoFocus={alCerrar}
      >
        <div className="flex items-center justify-between border-b border-[var(--linea)] px-5 py-2 sm:px-10">
          <p className="etiqueta text-[var(--piedra)]">Primera reunión</p>
          <Dialog.Close className="etiqueta inline-flex min-h-11 items-center gap-2 px-1">
            Cerrar
            <X className="size-4" aria-hidden="true" />
          </Dialog.Close>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-10 sm:py-10">
          <Dialog.Title className="serif text-[clamp(2.4rem,6vw,3.4rem)]">
            Agendá una primera reunión
          </Dialog.Title>
          <Dialog.Description className="mt-3 max-w-md text-sm leading-relaxed text-[var(--piedra)]">
            Es sin cargo y dura una hora. Con estos datos llegamos preparados y
            te damos una primera idea de plazos y costos.
          </Dialog.Description>

          {/* Indicador de pasos */}
          <ol className="mt-8 grid grid-cols-5 gap-1.5" aria-label="Pasos">
            {pasos.map((p, i) => (
              <li key={p} aria-current={i === paso ? "step" : undefined}>
                <span
                  className={cn(
                    "block h-px transition-colors duration-500",
                    i <= paso ? "bg-[var(--carbon)]" : "bg-[var(--linea)]"
                  )}
                />
                <span className="sr-only">
                  {p}
                  {i < paso ? " (completo)" : ""}
                </span>
              </li>
            ))}
          </ol>
          <p className="etiqueta mt-3 text-[var(--piedra)]">
            Paso {paso + 1} de {pasos.length}
          </p>

          {enviado ? (
            <div className="aparece mt-6">
              <h3
                ref={titulo}
                tabIndex={-1}
                className="serif text-3xl outline-none"
              >
                Se abrió tu correo con la solicitud
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--carbon)]/80">
                Revisá el mensaje y envialo. Te respondemos en menos de dos días
                hábiles para coordinar día y hora. Si no se abrió ningún
                programa, escribinos a{" "}
                <a href={mailto} className="underline underline-offset-4">
                  {estudio.correo}
                </a>
                .
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Dialog.Close className="boton">Volver al sitio</Dialog.Close>
                <button type="button" className="boton-linea" onClick={reiniciar}>
                  Empezar otra solicitud
                </button>
              </div>
            </div>
          ) : (
            <form
              noValidate
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault()
                if (paso < pasos.length - 1) return avanzar()
                window.location.href = mailto
                setEnviado(true)
              }}
            >
              <h3
                ref={titulo}
                tabIndex={-1}
                className="serif text-3xl outline-none"
              >
                {pasos[paso]}
              </h3>

              <div key={paso} className="aparece mt-6 grid gap-8">
                {paso === 0 && (
                  <Opciones
                    nombre="tipo"
                    leyenda="¿Qué querés proyectar?"
                    opciones={tipos}
                    valor={datos.tipo}
                    error={errores.tipo}
                    alElegir={(v) => poner("tipo", v)}
                    columnas
                  />
                )}

                {paso === 1 && (
                  <>
                    <Campo
                      nombre="ubicacion"
                      etiqueta="Ubicación"
                      ayuda="Barrio, ciudad o balneario."
                      valor={datos.ubicacion}
                      error={errores.ubicacion}
                      alCambiar={(v) => poner("ubicacion", v)}
                      autoComplete="address-level2"
                    />
                    <Opciones
                      nombre="inmueble"
                      leyenda="¿Tenés el terreno o el inmueble?"
                      opciones={inmuebles}
                      valor={datos.inmueble}
                      error={errores.inmueble}
                      alElegir={(v) => poner("inmueble", v)}
                    />
                    <Campo
                      nombre="superficie"
                      etiqueta="Superficie aproximada (m²)"
                      ayuda="Del terreno o de lo que querés construir o reformar."
                      valor={datos.superficie}
                      error={errores.superficie}
                      alCambiar={(v) => poner("superficie", v.replace(/[^\d]/g, ""))}
                      inputMode="numeric"
                    />
                  </>
                )}

                {paso === 2 && (
                  <>
                    <Opciones
                      nombre="presupuesto"
                      leyenda="Rango de presupuesto para la obra"
                      opciones={presupuestos}
                      valor={datos.presupuesto}
                      error={errores.presupuesto}
                      alElegir={(v) => poner("presupuesto", v)}
                    />
                    <Opciones
                      nombre="plazo"
                      leyenda="¿Cuándo te gustaría empezar?"
                      opciones={plazos}
                      valor={datos.plazo}
                      error={errores.plazo}
                      alElegir={(v) => poner("plazo", v)}
                      columnas
                    />
                  </>
                )}

                {paso === 3 && (
                  <>
                    <div className="grid gap-8 sm:grid-cols-2">
                      <Campo
                        nombre="nombre"
                        etiqueta="Nombre y apellido"
                        valor={datos.nombre}
                        error={errores.nombre}
                        alCambiar={(v) => poner("nombre", v)}
                        autoComplete="name"
                      />
                      <Campo
                        nombre="correo"
                        etiqueta="Correo"
                        tipo="email"
                        valor={datos.correo}
                        error={errores.correo}
                        alCambiar={(v) => poner("correo", v)}
                        autoComplete="email"
                      />
                    </div>
                    <Campo
                      nombre="telefono"
                      etiqueta="Teléfono (opcional)"
                      tipo="tel"
                      valor={datos.telefono}
                      error={errores.telefono}
                      alCambiar={(v) => poner("telefono", v)}
                      autoComplete="tel"
                    />
                    <Opciones
                      nombre="modalidad"
                      leyenda="¿Dónde preferís la reunión?"
                      opciones={modalidades}
                      valor={datos.modalidad}
                      alElegir={(v) => poner("modalidad", v)}
                    />
                    <label className="grid gap-1">
                      <span className="etiqueta text-[var(--piedra)]">
                        Algo más que quieras contarnos (opcional)
                      </span>
                      <textarea
                        rows={3}
                        value={datos.comentario}
                        onChange={(e) => poner("comentario", e.target.value)}
                        className="campo resize-none"
                      />
                    </label>
                  </>
                )}

                {paso === 4 && (
                  <dl className="mono border-t border-[var(--linea)] text-[0.8rem]">
                    {resumen.map(([k, v, p]) => (
                      <div
                        key={k}
                        className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-[var(--linea)] py-2.5 sm:grid-cols-[11rem_1fr_auto]"
                      >
                        <dt className="text-[var(--piedra)]">{k}</dt>
                        <dd className="col-start-1 row-start-2 break-words sm:col-start-2 sm:row-start-1">
                          {v}
                        </dd>
                        <dd className="col-start-2 row-span-2 row-start-1 sm:col-start-3">
                          <button
                            type="button"
                            onClick={() => setPaso(p)}
                            className="underline underline-offset-4"
                            aria-label={`Editar ${k.toLowerCase()}`}
                          >
                            Editar
                          </button>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--linea)] pt-6">
                {paso > 0 ? (
                  <button
                    type="button"
                    className="boton-linea"
                    onClick={() => {
                      setErrores({})
                      setPaso((p) => p - 1)
                    }}
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Atrás
                  </button>
                ) : (
                  <span />
                )}
                <button type="submit" className="boton">
                  {paso === pasos.length - 1 ? (
                    <>
                      Enviar solicitud por correo
                      <Check className="size-4" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

function Campo({
  nombre,
  etiqueta,
  ayuda,
  valor,
  error,
  alCambiar,
  tipo = "text",
  autoComplete,
  inputMode,
}: {
  nombre: string
  etiqueta: string
  ayuda?: string
  valor: string
  error?: string
  alCambiar: (v: string) => void
  tipo?: string
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
}) {
  const id = `agenda-${nombre}`
  const describe = [ayuda && `${id}-ayuda`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ")
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="etiqueta text-[var(--piedra)]">
        {etiqueta}
      </label>
      <input
        id={id}
        data-campo={nombre}
        type={tipo}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe || undefined}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="campo"
      />
      {ayuda && (
        <p id={`${id}-ayuda`} className="text-xs text-[var(--piedra)]">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="error text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function Opciones({
  nombre,
  leyenda,
  opciones,
  valor,
  error,
  alElegir,
  columnas = false,
}: {
  nombre: string
  leyenda: string
  opciones: string[]
  valor: string
  error?: string
  alElegir: (v: string) => void
  columnas?: boolean
}) {
  const id = `agenda-${nombre}`
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="etiqueta mb-3 text-[var(--piedra)]">{leyenda}</legend>
      <div className={cn("grid gap-2", columnas && "sm:grid-cols-2")}>
        {opciones.map((o, i) => (
          <label key={o} className="opcion text-sm">
            <input
              type="radio"
              name={nombre}
              value={o}
              checked={valor === o}
              onChange={() => alElegir(o)}
              data-campo={i === 0 ? nombre : undefined}
            />
            <span
              aria-hidden="true"
              className="grid size-3.5 shrink-0 place-items-center rounded-full border border-current"
            >
              {valor === o && (
                <span className="size-1.5 rounded-full bg-current" />
              )}
            </span>
            {o}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="error mt-2 text-xs" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
