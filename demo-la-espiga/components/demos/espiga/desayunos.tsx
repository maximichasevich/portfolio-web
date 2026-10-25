"use client"

import { useId, useState } from "react"
import { Gift, MessageCircle, UserRound } from "lucide-react"

import {
  desayunos,
  franjasDesayuno,
  type Desayuno,
} from "@/components/demos/espiga/contenido"
import {
  abrirPanel,
  datosCompletos,
  useAhora,
  useDatos,
} from "@/components/demos/espiga/estado"
import { pesos, whatsappDemo } from "@/lib/demo"
import { cn } from "@/lib/utils"

const isoMontevideo = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Montevideo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})
const fechaLegible = new Intl.DateTimeFormat("es-UY", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
})

/** Caja de cartón kraft en CSS 3D: la tapa se abre y asoma lo que trae. */
function Caja({
  d,
  elegida,
  onElegir,
}: {
  d: Desayuno
  elegida: boolean
  onElegir: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onElegir}
        aria-pressed={elegida}
        className={cn("caja-boton group w-full rounded-md text-left", elegida && "caja-elegida")}
      >
        <span className="caja-escena" aria-hidden="true">
          <span className="caja" style={{ "--cinta": d.cinta } as React.CSSProperties}>
            <span className="caja-cara caja-fondo" />
            <span className="caja-cara caja-atras" />
            <span className="caja-cara caja-izq" />
            <span className="caja-tarjeta">
              <span className="tiza block text-[1.05rem] leading-tight">
                {d.contenido[0]}
              </span>
              <span className="mt-1 block text-[0.8rem] leading-snug text-[var(--tinta-70)]">
                y {d.contenido.length - 1} cosas más
              </span>
            </span>
            <span className="caja-cara caja-der" />
            <span className="caja-cara caja-frente">
              <span className="caja-etiqueta titulo">La Espiga</span>
            </span>
            <span className="caja-tapa">
              <span className="caja-tapa-fuera" />
              <span className="caja-tapa-dentro" />
            </span>
          </span>
        </span>
        <span className="mt-4 block px-1">
          <span className="titulo block text-[1.55rem] leading-tight">{d.nombre}</span>
          <span className="block text-[var(--tinta-70)]">{d.para}</span>
          <span className="titulo mt-1 block text-[1.6rem]">{pesos(d.precio)}</span>
          <span
            className={cn(
              "mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 px-3 font-bold",
              elegida
                ? "border-[var(--rojo)] bg-[var(--rojo)] text-[var(--papel)]"
                : "border-[var(--tinta)]"
            )}
          >
            <Gift className="size-4" aria-hidden="true" />
            {elegida ? "Elegido" : "Elegir este"}
          </span>
        </span>
      </button>
    </li>
  )
}

/** Desayunos y meriendas para regalar, con envío y tarjeta escrita a mano. */
export function Desayunos() {
  const ahora = useAhora()
  const datos = useDatos()
  const base = useId()
  const [elegidoId, setElegidoId] = useState("barrio")
  const [para, setPara] = useState("")
  const [direccion, setDireccion] = useState("")
  const [fecha, setFecha] = useState("")
  const [franja, setFranja] = useState(franjasDesayuno[0])
  const [tarjeta, setTarjeta] = useState("")
  const [error, setError] = useState<string | null>(null)

  const elegido = desayunos.find((d) => d.id === elegidoId) ?? desayunos[0]
  const minimo =
    ahora === null ? undefined : isoMontevideo.format(ahora + 86_400_000)
  const completos = datosCompletos(datos)

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const foco = (k: string) => document.getElementById(`${base}-${k}`)?.focus()
    if (para.trim().length < 2) {
      setError("Escribí el nombre de quien lo recibe.")
      return foco("para")
    }
    if (direccion.trim().length < 5) {
      setError("Necesitamos la dirección de entrega.")
      return foco("direccion")
    }
    if (!fecha || (minimo && fecha < minimo)) {
      setError("Elegí un día, con al menos 24 horas de anticipación.")
      return foco("fecha")
    }
    if (!completos) {
      setError(null)
      abrirPanel("datos")
      return
    }
    setError(null)
    const dia = fechaLegible.format(new Date(`${fecha}T12:00:00Z`))
    const mensaje = [
      "¡Hola, La Espiga! Quiero regalar un desayuno:",
      "",
      `• ${elegido.nombre} (${pesos(elegido.precio)}, envío incluido)`,
      `• Para: ${para.trim()}`,
      `• Dirección: ${direccion.trim()}`,
      `• Día: ${dia}, de ${franja}`,
      tarjeta.trim() ? `• Tarjeta: «${tarjeta.trim()}»` : "",
      "",
      `Lo regala: ${datos.nombre} (${datos.telefono})`,
      "",
      "¡Gracias!",
    ]
      .filter((l, i, arr) => l !== "" || arr[i - 1] !== "")
      .join("\n")
    window.open(whatsappDemo(mensaje), "_blank", "noopener,noreferrer")
  }

  return (
    <div>
      <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6">
        {desayunos.map((d) => (
          <Caja
            key={d.id}
            d={d}
            elegida={d.id === elegido.id}
            onElegir={() => setElegidoId(d.id)}
          />
        ))}
      </ul>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="kraft sombra-papel rounded-md border-2 border-[var(--tinta)] p-5" aria-live="polite">
          <p className="volanta text-[var(--rojo)]">Qué trae</p>
          <p className="titulo mt-1 text-[1.7rem]">{elegido.nombre}</p>
          <ul className="mt-3 grid gap-1.5">
            {elegido.contenido.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden="true" className="text-[var(--rojo)]">✦</span>
                {c}
              </li>
            ))}
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-[var(--rojo)]">✦</span>
              Tarjeta escrita a mano por Lucía
            </li>
          </ul>
          <p className="mt-4 text-[0.95rem]">
            Envío incluido a Pocitos, Punta Carretas y Buceo. Llega en caja
            de cartón con cinta, listo para regalar.
          </p>
        </div>

        <form
          onSubmit={enviar}
          noValidate
          className="rayado sombra-papel rounded-sm px-5 pt-7 pb-6 pl-[3.4rem] sm:px-8 sm:pl-[3.8rem]"
          aria-labelledby={`${base}-titulo`}
        >
          <h3 id={`${base}-titulo`} className="titulo text-[1.8rem]">
            ¿A quién se lo mandamos?
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${base}-para`} className="mb-1.5 block font-bold">
                Nombre de quien lo recibe
              </label>
              <input
                id={`${base}-para`}
                className="campo"
                value={para}
                onChange={(e) => setPara(e.target.value)}
                placeholder="Ej.: Mi madre, Elena"
              />
            </div>
            <div>
              <label htmlFor={`${base}-direccion`} className="mb-1.5 block font-bold">
                Dirección
              </label>
              <input
                id={`${base}-direccion`}
                className="campo"
                autoComplete="street-address"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej.: Chucarro 1150, apto. 2"
              />
            </div>
            <div>
              <label htmlFor={`${base}-fecha`} className="mb-1.5 block font-bold">
                ¿Qué día?
              </label>
              <input
                id={`${base}-fecha`}
                type="date"
                className="campo"
                min={minimo}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`${base}-franja`} className="mb-1.5 block font-bold">
                ¿A qué hora?
              </label>
              <select
                id={`${base}-franja`}
                className="campo"
                value={franja}
                onChange={(e) => setFranja(e.target.value)}
              >
                {franjasDesayuno.map((f) => (
                  <option key={f} value={f}>
                    De {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor={`${base}-tarjeta`} className="mb-1.5 block font-bold">
              Lo que dice la tarjeta (opcional)
            </label>
            <textarea
              id={`${base}-tarjeta`}
              className="campo min-h-20 resize-y"
              maxLength={160}
              value={tarjeta}
              onChange={(e) => setTarjeta(e.target.value)}
              placeholder="Ej.: ¡Feliz día, mamá! Te queremos mucho."
            />
          </div>
          {!completos && (
            <p className="mt-3 flex flex-wrap items-center gap-x-2 rounded-md bg-[rgba(214,185,141,0.35)] p-3">
              Para avisarte cuando llegue usamos “Mis datos”.
              <button
                type="button"
                onClick={() => abrirPanel("datos")}
                className="inline-flex min-h-11 items-center gap-1.5 font-bold text-[var(--rojo)] underline underline-offset-4"
              >
                <UserRound className="size-4" aria-hidden="true" />
                Completar mis datos
              </button>
            </p>
          )}
          <p role="alert" className="mt-3 min-h-6 font-bold text-[var(--rojo)]">
            {error}
          </p>
          <button type="submit" className="boton-rojo mt-1 w-full rounded-md px-5 text-[1.05rem]">
            <MessageCircle className="size-5" aria-hidden="true" />
            Pedir el {elegido.nombre.toLowerCase()} · {pesos(elegido.precio)}
          </button>
        </form>
      </div>
    </div>
  )
}
