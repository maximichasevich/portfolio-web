"use client"

import { useId, useRef, useState } from "react"
import Image from "next/image"
import {
  Check,
  ClipboardList,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  UserRound,
} from "lucide-react"

import {
  abrirPanel,
  avisar,
  borrarPedidos,
  cambiarCantidad,
  datosCompletos,
  ENVIO,
  ENVIO_GRATIS_DESDE,
  guardarDatos,
  guardarPedido,
  mensajePedido,
  quitarDeBolsa,
  repetirPedido,
  resumirBolsa,
  useAhora,
  useAviso,
  useBolsa,
  useDatos,
  usePedidos,
  vaciarBolsa,
  validarDatos,
  type Datos,
  type ErroresDatos,
  type Modalidad,
  type Panel,
} from "@/components/demos/espiga/estado"
import {
  franjasRetiro,
  momentoMontevideo,
} from "@/components/demos/espiga/horario"
import { FichaProducto } from "@/components/demos/espiga/ficha"
import { PanelLateral } from "@/components/demos/espiga/panel"
import { pesos, whatsappDemo } from "@/lib/demo"
import { cn } from "@/lib/utils"

/** Panel al que se vuelve después de guardar "Mis datos". */
let volverA: Panel = null

function abrirDatosDesde(origen: Panel) {
  volverA = origen
  abrirPanel("datos")
}

function irALaCarta() {
  abrirPanel(null)
  window.setTimeout(() => {
    document.getElementById("carta")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  }, 60)
}

/* ====================== Tu bolsa ====================== */

function SelectorModalidad({
  valor,
  onChange,
  nombre,
}: {
  valor: Modalidad
  onChange: (m: Modalidad) => void
  nombre: string
}) {
  const opciones: {
    id: Modalidad
    titulo: string
    detalle: string
    Icono: typeof Store
  }[] = [
    {
      id: "local",
      titulo: "Lo paso a buscar",
      detalle: "Av. Brasil 2640, sin hacer fila",
      Icono: Store,
    },
    {
      id: "domicilio",
      titulo: "Envío a domicilio",
      detalle: `${pesos(ENVIO)} · gratis desde ${pesos(ENVIO_GRATIS_DESDE)}`,
      Icono: Truck,
    },
  ]
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {opciones.map(({ id, titulo, detalle, Icono }) => (
        <label
          key={id}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-md border-2 p-3 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--rojo)]",
            valor === id
              ? "border-[var(--tinta)] bg-[#fffdf7]"
              : "border-[var(--tinta-20)] hover:border-[var(--tinta)]"
          )}
        >
          <input
            type="radio"
            name={nombre}
            value={id}
            checked={valor === id}
            onChange={() => onChange(id)}
            className="mt-1 size-5 shrink-0 accent-[var(--rojo)]"
          />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 font-bold">
              <Icono className="size-4 shrink-0" aria-hidden="true" />
              {titulo}
            </span>
            <span className="block text-[0.95rem] text-[var(--tinta-70)]">
              {detalle}
            </span>
          </span>
        </label>
      ))}
    </div>
  )
}

function PanelBolsa() {
  const bolsa = useBolsa()
  const datos = useDatos()
  const pedidos = usePedidos()
  const ahora = useAhora()
  const idHora = useId()
  const [horaElegida, setHoraElegida] = useState("")
  const [enviado, setEnviado] = useState<string | null>(null)

  const domicilio = datos.modalidad === "domicilio"
  const r = resumirBolsa(bolsa, domicilio)
  const vacia = r.lineas.length === 0
  const { dia, franjas } =
    ahora === null
      ? { dia: "", franjas: [] }
      : franjasRetiro(momentoMontevideo(ahora))
  const hora = franjas.some((f) => f.valor === horaElegida)
    ? horaElegida
    : (franjas[0]?.valor ?? "")
  const completos = datosCompletos(datos)
  const listo = !vacia && completos && hora !== ""
  const mensaje = listo ? mensajePedido(bolsa, datos, hora) : ""
  const mostrarEnviado = vacia && enviado !== null

  function enviar() {
    const url = whatsappDemo(mensaje)
    window.open(url, "_blank", "noopener,noreferrer")
    guardarPedido({
      items: r.lineas.map((l) => ({
        id: l.producto.id,
        nombre: l.producto.nombre,
        cantidad: l.cantidad,
        precio: l.producto.precio,
      })),
      total: r.total,
      retiro: hora,
      modalidad: datos.modalidad,
    })
    setEnviado(url)
    vaciarBolsa()
  }

  const pie = mostrarEnviado ? (
    <button
      type="button"
      onClick={() => {
        setEnviado(null)
        irALaCarta()
      }}
      className="boton-borde w-full rounded-md px-4"
    >
      Volver a la pizarra
    </button>
  ) : vacia ? null : (
    <div>
      <dl className="grid gap-1 text-[1rem]">
        <div className="flex justify-between gap-4">
          <dt>Productos</dt>
          <dd className="tabular-nums">{pesos(r.subtotal)}</dd>
        </div>
        {domicilio && (
          <div className="flex justify-between gap-4">
            <dt>Envío</dt>
            <dd className="tabular-nums">
              {r.envio === 0 ? "Sin costo" : pesos(r.envio)}
            </dd>
          </div>
        )}
        <div className="titulo flex justify-between gap-4 pt-1 text-[1.7rem]">
          <dt>Total</dt>
          <dd className="tabular-nums">{pesos(r.total)}</dd>
        </div>
      </dl>
      {listo ? (
        <a
          href={whatsappDemo(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault()
            enviar()
          }}
          className="boton-rojo mt-3 w-full rounded-md px-4 text-[1.05rem]"
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          Enviar pedido por WhatsApp
        </a>
      ) : (
        <button
          type="button"
          onClick={() => abrirDatosDesde("bolsa")}
          className="boton-rojo mt-3 w-full rounded-md px-4 text-[1.05rem]"
        >
          <UserRound className="size-5" aria-hidden="true" />
          Completar mis datos para enviar
        </button>
      )}
      <p className="mt-2 text-center text-[0.9rem] text-[var(--tinta-70)]">
        Pagás al recibir: efectivo, débito o Mercado Pago.
      </p>
    </div>
  )

  return (
    <PanelLateral
      nombre="bolsa"
      titulo="Tu bolsa"
      descripcion={
        vacia
          ? "Acá se junta lo que elegís de la pizarra."
          : `${r.unidades} ${r.unidades === 1 ? "producto" : "productos"} · elegí la hora y mandá el pedido.`
      }
      pie={pie}
    >
      {mostrarEnviado ? (
        <div className="py-6 text-center">
          <div className="mx-auto flex size-20 -rotate-6 items-center justify-center rounded-full border-4 border-[var(--rojo)] text-[var(--rojo)]">
            <Check className="size-10" strokeWidth={3} aria-hidden="true" />
          </div>
          <p className="titulo mt-5 text-[2rem]">¡Pedido armado!</p>
          <p className="mx-auto mt-2 max-w-xs text-[var(--tinta-70)]">
            Se abrió WhatsApp con tu pedido listo. Mandalo y te confirmamos
            enseguida por el mismo chat.
          </p>
          <a
            href={enviado ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-bold text-[var(--rojo)] underline underline-offset-4"
          >
            ¿No se abrió? Tocá acá
          </a>
          <p className="mt-6 text-[0.95rem] text-[var(--tinta-70)]">
            Lo guardamos en{" "}
            <button
              type="button"
              onClick={() => abrirPanel("pedidos")}
              className="font-bold text-[var(--tinta)] underline underline-offset-4"
            >
              Mis pedidos
            </button>{" "}
            para que lo repitas cuando quieras.
          </p>
        </div>
      ) : vacia ? (
        <div className="py-6 text-center">
          <div className="kraft mx-auto flex size-24 items-center justify-center rounded-md border-2 border-[var(--tinta)]">
            <ShoppingBag
              className="size-11"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <p className="titulo mt-5 text-[1.8rem]">Tu bolsa está vacía</p>
          <p className="mx-auto mt-2 max-w-xs text-[var(--tinta-70)]">
            Elegí en la pizarra lo que quieras llevar. Lo guardamos acá aunque
            cierres la página.
          </p>
          <button
            type="button"
            onClick={irALaCarta}
            className="boton-rojo mt-5 rounded-md px-5"
          >
            Ver la pizarra
          </button>
          {pedidos[0] && (
            <div className="mt-8 border-t-2 border-dashed border-[var(--tinta-20)] pt-6">
              <p className="font-bold">¿Lo mismo de la otra vez?</p>
              <p className="mt-1 text-[0.95rem] text-[var(--tinta-70)]">
                {pedidos[0].items
                  .map((i) => `${i.cantidad} × ${i.nombre}`)
                  .join(", ")}
              </p>
              <button
                type="button"
                onClick={() => {
                  repetirPedido(pedidos[0])
                  avisar("Cargamos tu último pedido en la bolsa.")
                }}
                className="boton-borde mt-3 rounded-md px-4"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Repetir mi último pedido
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-7">
          <section aria-label="Productos">
            <ul className="border-t-2 border-[var(--tinta)]">
              {r.lineas.map(({ producto: p, cantidad }) => {
                const Icono = p.icono
                return (
                  <li
                    key={p.id}
                    className="flex gap-3 border-b border-dashed border-[var(--tinta-20)] py-4"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md border-2 border-[var(--tinta)] bg-[var(--kraft)]">
                      {p.foto ? (
                        <Image
                          src={p.foto.src}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <Icono
                          className="absolute inset-0 m-auto size-7"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="leading-snug font-bold">{p.nombre}</p>
                        <p className="shrink-0 font-bold tabular-nums">
                          {pesos(p.precio * cantidad)}
                        </p>
                      </div>
                      <p className="text-[0.95rem] text-[var(--tinta-70)]">
                        {pesos(p.precio)} c/u
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div
                          className="inline-flex items-center rounded-md border-2 border-[var(--tinta)]"
                          role="group"
                          aria-label={`Cantidad de ${p.nombre}`}
                        >
                          <button
                            type="button"
                            onClick={() => cambiarCantidad(p.id, -1)}
                            aria-label={`Uno menos de ${p.nombre}`}
                            className="flex size-11 items-center justify-center hover:bg-[var(--papel-2)]"
                          >
                            <Minus className="size-5" aria-hidden="true" />
                          </button>
                          <span className="w-8 text-center font-bold tabular-nums">
                            {cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => cambiarCantidad(p.id, 1)}
                            aria-label={`Uno más de ${p.nombre}`}
                            className="flex size-11 items-center justify-center hover:bg-[var(--papel-2)]"
                          >
                            <Plus className="size-5" aria-hidden="true" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => quitarDeBolsa(p.id)}
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-[0.95rem] font-bold text-[var(--rojo)] hover:bg-[var(--papel-2)]"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          Quitar
                          <span className="sr-only"> {p.nombre}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <fieldset>
            <legend className="titulo mb-3 text-[1.4rem]">
              ¿Cómo lo recibís?
            </legend>
            <SelectorModalidad
              nombre="modalidad-bolsa"
              valor={datos.modalidad}
              onChange={(m) => guardarDatos({ ...datos, modalidad: m })}
            />
          </fieldset>

          <div>
            <label htmlFor={idHora} className="titulo mb-1 block text-[1.4rem]">
              {domicilio ? "Hora de entrega" : "Hora de retiro"}
            </label>
            <p className="mb-2 text-[0.95rem] text-[var(--tinta-70)]">
              {dia === "Hoy"
                ? "Franjas que quedan hoy. Preparamos todo en 30 minutos."
                : `Hoy ya cerramos: te ofrecemos ${dia.toLowerCase()}.`}
            </p>
            <select
              id={idHora}
              value={hora}
              onChange={(e) => setHoraElegida(e.target.value)}
              className="campo appearance-auto"
            >
              {franjas.map((f) => (
                <option key={f.valor} value={f.valor}>
                  {dia}, de {f.etiqueta}
                </option>
              ))}
            </select>
          </div>

          <section
            aria-label="Tus datos"
            className={cn(
              "rounded-md border-2 p-4",
              completos
                ? "border-[var(--tinta-20)] bg-[#fffdf7]"
                : "border-[var(--rojo)] bg-[#fff3ef]"
            )}
          >
            <p className="titulo text-[1.4rem]">Tus datos</p>
            {completos ? (
              <>
                <p className="mt-1">
                  {datos.nombre} · {datos.telefono}
                  {domicilio && (
                    <>
                      <br />
                      {datos.direccion}
                    </>
                  )}
                </p>
                {datos.notas.trim() && (
                  <p className="mt-1 text-[0.95rem] text-[var(--tinta-70)]">
                    Notas: {datos.notas}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-1">
                Antes de enviar necesitamos tu nombre y teléfono
                {domicilio ? ", y la dirección para el envío" : ""}. Se guardan
                en este dispositivo para la próxima.
              </p>
            )}
            <button
              type="button"
              onClick={() => abrirDatosDesde("bolsa")}
              className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-bold text-[var(--rojo)] underline underline-offset-4"
            >
              <UserRound className="size-4" aria-hidden="true" />
              {completos ? "Cambiar mis datos" : "Completar mis datos"}
            </button>
          </section>

          <button
            type="button"
            onClick={() => {
              vaciarBolsa()
              avisar("Vaciaste tu bolsa.")
            }}
            className="justify-self-start text-[0.95rem] font-bold text-[var(--tinta-70)] underline underline-offset-4"
          >
            Vaciar la bolsa
          </button>
        </div>
      )}
    </PanelLateral>
  )
}

/* ====================== Mis datos ====================== */

function Campo({
  id,
  etiqueta,
  ayuda,
  error,
  children,
}: {
  id: string
  etiqueta: string
  ayuda?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-bold">
        {etiqueta}
      </label>
      {ayuda && (
        <p
          id={`${id}-ayuda`}
          className="mb-1.5 text-[0.95rem] text-[var(--tinta-70)]"
        >
          {ayuda}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 font-bold text-[var(--rojo)]">
          {error}
        </p>
      )}
    </div>
  )
}

function FormularioDatos() {
  const guardados = useDatos()
  const [form, setForm] = useState<Datos>(guardados)
  const [errores, setErrores] = useState<ErroresDatos>({})
  const [guardadoOk, setGuardadoOk] = useState(false)
  const refForm = useRef<HTMLFormElement>(null)
  const base = useId()
  const id = (k: string) => `${base}-${k}`

  function cambiar<K extends keyof Datos>(k: K, v: Datos[K]) {
    setForm((f) => ({ ...f, [k]: v }))
    setGuardadoOk(false)
    if (errores[k]) setErrores((e) => ({ ...e, [k]: undefined }))
  }

  function describir(k: keyof Datos, ayuda = false) {
    const ids = [
      ayuda ? id(`${k}-ayuda`) : "",
      errores[k] ? id(`${k}-error`) : "",
    ]
      .filter(Boolean)
      .join(" ")
    return ids || undefined
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const nuevos = validarDatos(form)
    setErrores(nuevos)
    const primero = (Object.keys(nuevos) as (keyof Datos)[])[0]
    if (primero) {
      refForm.current
        ?.querySelector<HTMLElement>(`#${CSS.escape(id(primero))}`)
        ?.focus()
      return
    }
    guardarDatos({
      ...form,
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      notas: form.notas.trim(),
    })
    setGuardadoOk(true)
    avisar("Guardamos tus datos.")
    if (volverA) {
      const destino = volverA
      volverA = null
      window.setTimeout(() => abrirPanel(destino), 700)
    }
  }

  function borrar() {
    const vacio: Datos = {
      nombre: "",
      telefono: "",
      modalidad: "local",
      direccion: "",
      notas: "",
    }
    setForm(vacio)
    setErrores({})
    guardarDatos(vacio)
    avisar("Borramos tus datos de este dispositivo.")
  }

  return (
    <form
      id="form-datos"
      ref={refForm}
      onSubmit={enviar}
      noValidate
      className="grid gap-5"
    >
      <Campo
        id={id("nombre")}
        etiqueta="Nombre y apellido"
        error={errores.nombre}
      >
        <input
          id={id("nombre")}
          className="campo"
          autoComplete="name"
          value={form.nombre}
          onChange={(e) => cambiar("nombre", e.target.value)}
          aria-invalid={errores.nombre ? true : undefined}
          aria-describedby={describir("nombre")}
          placeholder="Ej.: Marta Rodríguez"
        />
      </Campo>
      <Campo
        id={id("telefono")}
        etiqueta="Teléfono o celular"
        ayuda="Te escribimos a este número para confirmar."
        error={errores.telefono}
      >
        <input
          id={id("telefono")}
          className="campo"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.telefono}
          onChange={(e) => cambiar("telefono", e.target.value)}
          aria-invalid={errores.telefono ? true : undefined}
          aria-describedby={describir("telefono", true)}
          placeholder="Ej.: 099 123 456"
        />
      </Campo>
      <fieldset>
        <legend className="mb-1.5 font-bold">
          ¿Cómo preferís recibir tus pedidos?
        </legend>
        <SelectorModalidad
          nombre="modalidad-datos"
          valor={form.modalidad}
          onChange={(m) => cambiar("modalidad", m)}
        />
      </fieldset>
      {form.modalidad === "domicilio" && (
        <Campo
          id={id("direccion")}
          etiqueta="Dirección de entrega"
          ayuda="Llegamos a Pocitos, Punta Carretas y Buceo."
          error={errores.direccion}
        >
          <input
            id={id("direccion")}
            className="campo"
            autoComplete="street-address"
            value={form.direccion}
            onChange={(e) => cambiar("direccion", e.target.value)}
            aria-invalid={errores.direccion ? true : undefined}
            aria-describedby={describir("direccion", true)}
            placeholder="Ej.: Benito Blanco 1020, apto. 3"
          />
        </Campo>
      )}
      <Campo
        id={id("notas")}
        etiqueta="Notas y alergias (opcional)"
        ayuda="Celiaquía, alergias, o cómo encontrarte. Lo leemos en cada pedido."
      >
        <textarea
          id={id("notas")}
          className="campo min-h-28 resize-y"
          value={form.notas}
          onChange={(e) => cambiar("notas", e.target.value)}
          aria-describedby={describir("notas", true)}
          placeholder="Ej.: sin sésamo; tocar timbre 2"
        />
      </Campo>

      <p role="status" className="min-h-6 font-bold text-[#2f6b3f]">
        {guardadoOk && (
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-5" aria-hidden="true" />
            Listo, guardamos tus datos.
          </span>
        )}
      </p>

      <p className="rounded-md bg-[var(--papel-2)] p-3 text-[0.95rem] text-[var(--tinta-70)]">
        Tus datos quedan guardados solo en este dispositivo. No los mandamos a
        ningún lado hasta que envíes un pedido.
      </p>
      <button
        type="button"
        onClick={borrar}
        className="justify-self-start text-[0.95rem] font-bold text-[var(--tinta-70)] underline underline-offset-4"
      >
        Borrar mis datos
      </button>
    </form>
  )
}

function PanelDatos() {
  return (
    <PanelLateral
      nombre="datos"
      titulo="Mis datos"
      descripcion="Los usamos para armar tus pedidos. Los cargás una sola vez."
      pie={
        <button
          type="submit"
          form="form-datos"
          className="boton-rojo w-full rounded-md px-4"
        >
          <Check className="size-5" aria-hidden="true" />
          Guardar mis datos
        </button>
      }
    >
      <FormularioDatos />
    </PanelLateral>
  )
}

/* ====================== Mis pedidos ====================== */

const fechaPedido = new Intl.DateTimeFormat("es-UY", {
  timeZone: "America/Montevideo",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
})

function PanelPedidos() {
  const pedidos = usePedidos()
  const [confirmar, setConfirmar] = useState(false)

  return (
    <PanelLateral
      nombre="pedidos"
      titulo="Mis pedidos"
      descripcion="Los pedidos que mandaste desde este dispositivo."
      pie={
        pedidos.length > 0 ? (
          confirmar ? (
            <div className="flex flex-wrap items-center gap-2">
              <p className="mr-auto font-bold">¿Borrar todo el historial?</p>
              <button
                type="button"
                onClick={() => setConfirmar(false)}
                className="boton-borde rounded-md px-4"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  borrarPedidos()
                  setConfirmar(false)
                  avisar("Borramos tu historial de pedidos.")
                }}
                className="boton-tinta rounded-md px-4"
              >
                Sí, borrar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmar(true)}
              className="inline-flex min-h-11 items-center gap-1.5 font-bold text-[var(--tinta-70)] underline underline-offset-4"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Borrar historial
            </button>
          )
        ) : undefined
      }
    >
      {pedidos.length === 0 ? (
        <div className="py-6 text-center">
          <div className="kraft mx-auto flex size-24 items-center justify-center rounded-md border-2 border-[var(--tinta)]">
            <ClipboardList
              className="size-11"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <p className="titulo mt-5 text-[1.8rem]">Todavía no hay pedidos</p>
          <p className="mx-auto mt-2 max-w-xs text-[var(--tinta-70)]">
            Cuando mandes tu primer pedido lo vas a ver acá, y vas a poder
            repetirlo con un toque.
          </p>
          <button
            type="button"
            onClick={irALaCarta}
            className="boton-rojo mt-5 rounded-md px-5"
          >
            Ver la pizarra
          </button>
        </div>
      ) : (
        <ol className="grid gap-5">
          {pedidos.map((p) => (
            <li key={p.id} className="ticket sombra-papel px-5 py-6">
              <p className="volanta text-[var(--rojo)] first-letter:uppercase">
                {fechaPedido.format(p.fecha)}
              </p>
              <ul className="mt-3 grid gap-1">
                {p.items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3">
                    <span>
                      {i.cantidad} × {i.nombre}
                    </span>
                    <span className="shrink-0 tabular-nums">
                      {pesos(i.precio * i.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between gap-3 border-t-2 border-dashed border-[var(--tinta-20)] pt-2 font-bold">
                <span>Total</span>
                <span className="tabular-nums">{pesos(p.total)}</span>
              </p>
              <p className="mt-1 text-[0.95rem] text-[var(--tinta-70)]">
                {p.modalidad === "domicilio" ? "Entrega" : "Retiro"}: {p.retiro}
              </p>
              <button
                type="button"
                onClick={() => {
                  const n = repetirPedido(p)
                  avisar(
                    n > 0
                      ? "Cargamos ese pedido en tu bolsa."
                      : "Esos productos ya no están en la carta."
                  )
                  if (n > 0) abrirPanel("bolsa")
                }}
                className="boton-tinta mt-4 w-full rounded-md px-4"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Repetir pedido
              </button>
            </li>
          ))}
        </ol>
      )}
    </PanelLateral>
  )
}

/* ====================== Barra del celular y avisos ====================== */

function BarraBolsa() {
  const bolsa = useBolsa()
  const { unidades, subtotal } = resumirBolsa(bolsa)
  if (unidades === 0) return null
  return (
    <div className="fixed inset-x-3 bottom-16 z-40 lg:hidden">
      <button
        type="button"
        onClick={() => abrirPanel("bolsa")}
        className="boton-tinta sombra-papel flex w-full justify-between rounded-md py-2 pr-2 pl-4 text-left"
      >
        <span className="flex items-center gap-2.5">
          <ShoppingBag className="size-5" aria-hidden="true" />
          <span>
            {unidades} {unidades === 1 ? "producto" : "productos"} ·{" "}
            <span className="tabular-nums">{pesos(subtotal)}</span>
          </span>
        </span>
        <span className="rounded bg-[var(--rojo)] px-3 py-2">Ver mi bolsa</span>
      </button>
    </div>
  )
}

function Aviso() {
  const aviso = useAviso()
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-[8.5rem] z-[70] flex justify-center lg:top-6 lg:bottom-auto"
    >
      {aviso && (
        <p
          key={aviso.id}
          className="kraft sombra-papel flex max-w-md animate-in items-center gap-2 rounded-md border-2 border-[var(--tinta)] px-4 py-3 font-bold duration-300 fade-in slide-in-from-bottom-2"
        >
          <Check
            className="size-5 shrink-0 text-[var(--rojo)]"
            aria-hidden="true"
          />
          {aviso.texto}
        </p>
      )}
    </div>
  )
}

export function Paneles() {
  return (
    <>
      <PanelBolsa />
      <PanelDatos />
      <PanelPedidos />
      <FichaProducto />
      <BarraBolsa />
      <Aviso />
    </>
  )
}
