"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Dialog, RadioGroup } from "radix-ui"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  Gift,
  Info,
  Loader2,
  Lock,
  MapPin,
  PartyPopper,
  Sprout,
  Star,
  Wallet,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  DESCUENTO_TRANSFERENCIA,
  buscarPlanta,
  envios,
  precioVariante,
  textoVariante,
} from "@/components/demos/verde/catalogo"
import {
  COSTO_ENVOLTORIO,
  buscarColor,
  envioConCupon,
  puntosDe,
} from "@/components/demos/verde/extras"
import { confeti } from "@/components/demos/verde/efectos"
import { CampoCupon } from "@/components/demos/verde/cupon"
import { useTienda, type Pedido } from "@/components/demos/verde/estado"
import { Campo, Logo, capa, fondo } from "@/components/demos/verde/ui"
import {
  enfocarPrimerError,
  limpiarErrores,
  validarEmail,
  validarNombre,
  validarObligatorio,
  validarTelefono,
} from "@/components/demos/verde/validar"

const pasos = ["Tus datos", "Envío", "Pago", "Listo"] as const

type MetodoPago = "mp" | "tarjeta" | "transferencia"

const metodos: {
  id: MetodoPago
  nombre: string
  detalle: string
  Icono: typeof Wallet
}[] = [
  {
    id: "mp",
    nombre: "Mercado Pago",
    detalle: "Débito, crédito o dinero en cuenta. Hasta 6 cuotas sin recargo.",
    Icono: Wallet,
  },
  {
    id: "tarjeta",
    nombre: "Tarjeta de crédito o débito",
    detalle: "Visa, Mastercard, OCA y Creditel.",
    Icono: CreditCard,
  },
  {
    id: "transferencia",
    nombre: "Transferencia bancaria",
    detalle: `${DESCUENTO_TRANSFERENCIA * 100}% de descuento. Te pasamos los datos al confirmar.`,
    Icono: Building2,
  },
]

export function Checkout() {
  const { panel, abrir } = useTienda()
  return (
    <Dialog.Root
      open={panel === "checkout"}
      onOpenChange={(o) => abrir(o ? "checkout" : null)}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={cn(capa, "vt-velo")} />
        <Dialog.Content
          className={cn(
            capa,
            "vt-modal vt-scroll fixed inset-0 z-[61] overflow-y-auto overscroll-contain bg-[var(--vt-crema)] md:inset-4 md:rounded-[36px] md:border-2 md:border-[var(--vt-tinta)]"
          )}
        >
          <Flujo />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Flujo() {
  const tienda = useTienda()
  const {
    usuario,
    carrito,
    subtotal,
    descuentoCupon,
    cuponActivo,
    direcciones,
    registrarPedido,
    vaciarCarrito,
    guardarDireccion,
    entrar,
    abrir,
    abrirCuenta,
  } = tienda

  const [paso, setPaso] = useState(0)
  const [datos, setDatos] = useState({
    nombre: usuario && !usuario.invitado ? usuario.nombre : "",
    email: usuario?.email ?? "",
    telefono: usuario?.telefono ?? "",
  })
  const [zonaId, setZonaId] = useState(direcciones[0]?.zonaId ?? "mvd")
  const [dir, setDir] = useState({
    calle: direcciones[0]?.calle ?? "",
    apto: direcciones[0]?.apto ?? "",
    barrio: direcciones[0]?.barrio ?? "",
    indicaciones: direcciones[0]?.indicaciones ?? "",
  })
  const [guardarDir, setGuardarDir] = useState(direcciones.length === 0)
  const [metodo, setMetodo] = useState<MetodoPago>("mp")
  const [cuotas, setCuotas] = useState("1")
  const [errores, setErrores] = useState<Record<string, string | undefined>>({})
  const [procesando, setProcesando] = useState(false)
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [regalo, setRegalo] = useState(false)
  const [para, setPara] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [envolver, setEnvolver] = useState(true)

  const zona = envios.find((z) => z.id === zonaId) ?? envios[1]
  const envio = envioConCupon(zona, subtotal, cuponActivo)
  const conCupon = subtotal - descuentoCupon
  const descuento =
    metodo === "transferencia" ? Math.round(conCupon * DESCUENTO_TRANSFERENCIA) : 0
  const envoltorio = regalo && envolver ? COSTO_ENVOLTORIO : 0
  const totalFinal = conCupon + envio + envoltorio - descuento
  const total = conCupon + (paso >= 1 ? envio + envoltorio : 0) - (paso >= 2 ? descuento : 0)
  const esRetiro = zona.id === "retiro"

  function validar(): boolean {
    let nuevos: Record<string, string | undefined> = {}
    let prefijo = ""
    if (paso === 0) {
      prefijo = "co-"
      nuevos = limpiarErrores({
        nombre: validarNombre(datos.nombre),
        email: validarEmail(datos.email),
        telefono: validarTelefono(datos.telefono),
      })
    } else if (paso === 1) {
      prefijo = "co-"
      nuevos = limpiarErrores({
        calle: esRetiro ? undefined : validarObligatorio(dir.calle, "Poné la calle y el número de la entrega."),
        barrio: esRetiro ? undefined : validarObligatorio(dir.barrio, "Poné el barrio o la ciudad."),
        para: regalo ? validarObligatorio(para, "¿Para quién es el regalo?") : undefined,
      })
    }
    setErrores(nuevos)
    const claves = Object.keys(nuevos)
    if (claves.length) enfocarPrimerError(claves.map((k) => prefijo + k))
    return claves.length === 0
  }

  function siguiente(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return
    if (paso < 2) {
      setPaso(paso + 1)
      document.getElementById("co-arriba")?.scrollIntoView({ block: "start" })
      return
    }
    confirmar()
  }

  function confirmar() {
    setProcesando(true)
    window.setTimeout(() => {
      const numero = `VT-${String(Date.now()).slice(-6)}`
      const nuevo: Pedido = {
        numero,
        fecha: new Date().toISOString(),
        lineas: carrito.flatMap((l) => {
          const p = buscarPlanta(l.plantaId)
          if (!p) return []
          return [
            {
              nombre: p.nombre,
              variante: textoVariante(p, l.tamanoId, l.macetaId, l.colorId ? buscarColor(l.colorId).nombre : undefined),
              cantidad: l.cantidad,
              precio: precioVariante(p, l.tamanoId, l.macetaId),
            },
          ]
        }),
        subtotal,
        envio,
        descuento,
        total: totalFinal,
        cupon: cuponActivo?.codigo,
        descuentoCupon,
        envoltorio,
        regalo: regalo ? { para: para.trim(), mensaje: mensaje.trim() } : null,
        puntos: puntosDe(totalFinal),
        plantaIds: [...new Set(carrito.map((l) => l.plantaId))],
        zona: zona.nombre,
        direccion: esRetiro
          ? "Retiro en Camino Carrasco 5120"
          : `${dir.calle}${dir.apto ? `, ${dir.apto}` : ""}, ${dir.barrio}`,
        pago:
          metodo === "transferencia"
            ? "Transferencia"
            : `${metodo === "mp" ? "Mercado Pago" : "Tarjeta"}${cuotas !== "1" ? ` en ${cuotas} cuotas` : ""}`,
      }
      registrarPedido(nuevo)
      if (usuario && !esRetiro && guardarDir) {
        guardarDireccion({
          id: `dir-${Date.now()}`,
          alias: direcciones.length ? "Otra dirección" : "Casa",
          ...dir,
          zonaId: zona.id,
        })
      }
      if (usuario?.invitado) {
        entrar({ ...datos, invitado: false })
      }
      vaciarCarrito()
      setPedido(nuevo)
      setProcesando(false)
      setPaso(3)
    }, 1100)
  }

  return (
    <div id="co-arriba" className="flex min-h-full flex-col">
      {/* Encabezado del checkout */}
      <div className="sticky top-0 z-10 border-b-2 border-[var(--vt-tinta)] bg-[var(--vt-crema)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Logo className="text-2xl" />
          <p className="hidden items-center gap-1.5 text-xs font-bold text-[var(--vt-tinta-70)] sm:flex">
            <Lock className="size-3.5" aria-hidden="true" /> Compra segura · sitio de ejemplo
          </p>
          <Dialog.Close
            className="vt-icono size-10 border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
            aria-label="Cerrar el checkout"
          >
            <X className="size-5" aria-hidden="true" />
          </Dialog.Close>
        </div>
        <ol className="mx-auto flex max-w-3xl items-center gap-1.5 px-4 pb-3 md:gap-3">
          {pasos.map((nombre, i) => (
            <li
              key={nombre}
              aria-current={i === paso ? "step" : undefined}
              className="flex flex-1 items-center gap-1.5 md:gap-2"
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] text-xs font-extrabold",
                  i < paso && "bg-[var(--vt-hoja)] text-[var(--vt-papel)]",
                  i === paso && "bg-[var(--vt-coral)]",
                  i > paso && "bg-[var(--vt-papel)]"
                )}
              >
                {i < paso ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={cn(
                  "truncate text-xs font-bold sm:text-sm",
                  i !== paso && "hidden sm:inline",
                  i > paso && "text-[var(--vt-tinta-50)]"
                )}
              >
                {nombre}
                {i < paso && <span className="sr-only"> (completo)</span>}
              </span>
              {i < pasos.length - 1 && (
                <span className="h-0.5 min-w-3 flex-1 rounded bg-[var(--vt-tinta-15)]" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>

      <Dialog.Title className="sr-only">Finalizar compra</Dialog.Title>
      <Dialog.Description className="sr-only">
        Checkout en cuatro pasos: datos personales, envío, pago y confirmación.
        Es una demo, no se cobra nada.
      </Dialog.Description>

      {paso === 3 && pedido ? (
        <Confirmacion
          pedido={pedido}
          metodo={metodo}
          datos={datos}
          onPedidos={() => abrirCuenta("pedidos")}
          onSeguir={() => abrir(null)}
        />
      ) : carrito.length === 0 ? (
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <p className="vt-titulo text-4xl">No hay nada para pagar</p>
          <p className="mt-3 text-[var(--vt-tinta-70)]">
            Tu carrito está vacío. Volvé a la tienda y elegí tu próxima planta.
          </p>
          <button type="button" className="vt-boton mt-6 h-12 px-6" onClick={() => abrir(null)}>
            Volver a la tienda
          </button>
        </div>
      ) : (
        <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 md:px-8 md:py-10 lg:grid-cols-[1fr_24rem] lg:gap-10">
          {/* Resumen plegable en celular */}
          <details className="vt-tarjeta group lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
              <span className="font-bold">
                Ver resumen ({carrito.reduce((s, l) => s + l.cantidad, 0)} productos)
              </span>
              <span className="flex items-center gap-2 font-extrabold tabular-nums">
                {pesos(total)}
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
              </span>
            </summary>
            <div className="border-t-2 border-[var(--vt-tinta-15)] p-4">
              <Resumen paso={paso} envio={envio} descuento={descuento} envoltorio={envoltorio} zonaNombre={zona.nombre} />
            </div>
          </details>

          <form onSubmit={siguiente} noValidate className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={paso}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                {paso === 0 && (
                  <section aria-labelledby="co-t0">
                    <h2 id="co-t0" className="vt-titulo text-4xl md:text-5xl">
                      ¿A quién le mandamos el pedido?
                    </h2>
                    <p className="mt-2 text-[var(--vt-tinta-70)]">
                      Te mandamos el comprobante por email y te avisamos por
                      WhatsApp cuando sale.
                    </p>
                    {!usuario && (
                      <p className="mt-4 rounded-2xl bg-[var(--vt-lila)] p-3.5 text-sm">
                        ¿Ya tenés cuenta?{" "}
                        <button type="button" className="font-extrabold underline underline-offset-4" onClick={() => abrir("entrar")}>
                          Entrá
                        </button>{" "}
                        y completamos todo por vos.
                      </p>
                    )}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Campo
                        id="co-nombre"
                        etiqueta="Nombre y apellido"
                        autoComplete="name"
                        className="sm:col-span-2"
                        value={datos.nombre}
                        onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                        error={errores.nombre}
                      />
                      <Campo
                        id="co-email"
                        etiqueta="Email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="nombre@correo.com"
                        value={datos.email}
                        onChange={(e) => setDatos({ ...datos, email: e.target.value })}
                        error={errores.email}
                      />
                      <Campo
                        id="co-telefono"
                        etiqueta="Celular"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="099 123 456"
                        value={datos.telefono}
                        onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
                        error={errores.telefono}
                      />
                    </div>
                  </section>
                )}

                {paso === 1 && (
                  <section aria-labelledby="co-t1">
                    <h2 id="co-t1" className="vt-titulo text-4xl md:text-5xl">
                      ¿Dónde la recibís?
                    </h2>
                    <p className="mt-2 text-[var(--vt-tinta-70)]">
                      Viajan en cajas con separadores para que lleguen enteras.
                    </p>
                    <RadioGroup.Root
                      value={zonaId}
                      onValueChange={setZonaId}
                      aria-label="Zona de envío"
                      className="mt-6 grid gap-2.5"
                    >
                      {envios.map((z) => {
                        const costo = envioConCupon(z, subtotal, cuponActivo)
                        return (
                          <RadioGroup.Item
                            key={z.id}
                            value={z.id}
                            className="vt-opcion flex items-center gap-3 p-4 text-left"
                          >
                            <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
                              <RadioGroup.Indicator className="size-2.5 rounded-full bg-[var(--vt-tinta)]" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-extrabold">{z.nombre}</span>
                              <span className="block text-sm text-[var(--vt-tinta-70)]">
                                {z.detalle}
                                {z.gratisDesde > 0 && costo > 0 && ` · gratis desde ${pesos(z.gratisDesde)}`}
                              </span>
                            </span>
                            <span className="shrink-0 text-right font-extrabold tabular-nums">
                              {costo === 0 ? (
                                <>
                                  {z.costo > 0 && (
                                    <s className="mr-1.5 text-xs font-normal text-[var(--vt-tinta-50)]">
                                      {pesos(z.costo)}
                                    </s>
                                  )}
                                  Gratis
                                </>
                              ) : (
                                pesos(costo)
                              )}
                            </span>
                          </RadioGroup.Item>
                        )
                      })}
                    </RadioGroup.Root>

                    {!esRetiro && (
                      <div className="mt-6">
                        {direcciones.length > 0 && (
                          <div className="mb-5">
                            <p className="text-sm font-extrabold">Tus direcciones</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {direcciones.map((d) => (
                                <button
                                  key={d.id}
                                  type="button"
                                  className="vt-chip px-3.5 py-2 text-sm"
                                  aria-pressed={dir.calle === d.calle && dir.barrio === d.barrio}
                                  onClick={() => {
                                    setDir({ calle: d.calle, apto: d.apto, barrio: d.barrio, indicaciones: d.indicaciones })
                                    setZonaId(d.zonaId)
                                    setGuardarDir(false)
                                  }}
                                >
                                  <MapPin className="size-4" aria-hidden="true" />
                                  {d.alias || d.calle}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Campo
                            id="co-calle"
                            etiqueta="Calle y número"
                            autoComplete="street-address"
                            placeholder="Av. Brasil 2840"
                            className="sm:col-span-2"
                            value={dir.calle}
                            onChange={(e) => setDir({ ...dir, calle: e.target.value })}
                            error={errores.calle}
                          />
                          <Campo
                            id="co-apto"
                            etiqueta="Apto o casa (opcional)"
                            value={dir.apto}
                            onChange={(e) => setDir({ ...dir, apto: e.target.value })}
                          />
                          <Campo
                            id="co-barrio"
                            etiqueta="Barrio o ciudad"
                            placeholder="Pocitos"
                            value={dir.barrio}
                            onChange={(e) => setDir({ ...dir, barrio: e.target.value })}
                            error={errores.barrio}
                          />
                          <Campo
                            id="co-indicaciones"
                            etiqueta="Indicaciones para el envío (opcional)"
                            placeholder="Timbre 3, dejar en portería…"
                            className="sm:col-span-2"
                            value={dir.indicaciones}
                            onChange={(e) => setDir({ ...dir, indicaciones: e.target.value })}
                          />
                        </div>
                        {usuario && (
                          <label className="mt-4 flex items-center gap-2.5 text-sm font-semibold">
                            <input
                              type="checkbox"
                              checked={guardarDir}
                              onChange={(e) => setGuardarDir(e.target.checked)}
                              className="size-5 accent-[var(--vt-hoja)]"
                            />
                            Guardar esta dirección en mi cuenta
                          </label>
                        )}
                      </div>
                    )}

                    <OpcionRegalo
                      activo={regalo}
                      onActivo={setRegalo}
                      para={para}
                      onPara={setPara}
                      mensaje={mensaje}
                      onMensaje={setMensaje}
                      envolver={envolver}
                      onEnvolver={setEnvolver}
                      error={errores.para}
                      remitente={datos.nombre}
                    />
                  </section>
                )}

                {paso === 2 && (
                  <section aria-labelledby="co-t2">
                    <h2 id="co-t2" className="vt-titulo text-4xl md:text-5xl">
                      ¿Cómo pagás?
                    </h2>
                    <p className="mt-4 flex gap-2.5 rounded-2xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)] p-3.5 text-sm leading-snug">
                      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span>
                        <strong className="font-extrabold">Es una demo:</strong> no
                        se cobra nada y no te pedimos datos de tarjeta. En la
                        tienda real, el pago se hace en la página segura de
                        Mercado Pago.
                      </span>
                    </p>
                    <RadioGroup.Root
                      value={metodo}
                      onValueChange={(v) => setMetodo(v as MetodoPago)}
                      aria-label="Medio de pago"
                      className="mt-5 grid gap-2.5"
                    >
                      {metodos.map((m) => (
                        <RadioGroup.Item
                          key={m.id}
                          value={m.id}
                          className="vt-opcion flex items-center gap-3 p-4 text-left"
                        >
                          <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
                            <m.Icono className="size-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-extrabold">{m.nombre}</span>
                            <span className="block text-sm text-[var(--vt-tinta-70)]">
                              {m.detalle}
                            </span>
                          </span>
                          <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
                            <RadioGroup.Indicator className="size-2.5 rounded-full bg-[var(--vt-tinta)]" />
                          </span>
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>

                    {metodo !== "transferencia" ? (
                      <div className="mt-5">
                        <label htmlFor="co-cuotas" className="mb-1.5 block text-sm font-bold">
                          Cuotas
                        </label>
                        <select
                          id="co-cuotas"
                          className="vt-campo sm:max-w-xs"
                          value={cuotas}
                          onChange={(e) => setCuotas(e.target.value)}
                        >
                          {["1", "3", "6"].map((c) => (
                            <option key={c} value={c}>
                              {c === "1"
                                ? `1 pago de ${pesos(total)}`
                                : `${c} cuotas de ${pesos(Math.ceil(total / Number(c)))} sin recargo`}
                            </option>
                          ))}
                        </select>
                        {metodo === "tarjeta" && (
                          <p className="mt-3 text-sm text-[var(--vt-tinta-70)]">
                            Al confirmar se abriría el formulario seguro de
                            Mercado Pago para cargar la tarjeta. En esta demo
                            ese paso se simula.
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-5 rounded-2xl bg-[var(--vt-menta)] p-3.5 text-sm">
                        Ahorrás <strong className="font-extrabold">{pesos(descuento)}</strong>.
                        Reservamos tu pedido 48 horas mientras hacés la transferencia.
                      </p>
                    )}
                  </section>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {paso > 0 && (
                <button
                  type="button"
                  className="vt-boton-linea h-12 px-5"
                  onClick={() => {
                    setErrores({})
                    setPaso(paso - 1)
                  }}
                  disabled={procesando}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" /> Volver
                </button>
              )}
              <button
                type="submit"
                className="vt-boton h-12 flex-1 px-6 text-base sm:flex-none"
                disabled={procesando}
              >
                {procesando ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                    Procesando pago de prueba…
                  </>
                ) : paso === 2 ? (
                  <>Confirmar · {pesos(totalFinal)}</>
                ) : (
                  <>
                    Continuar <ArrowRight className="size-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {procesando ? "Procesando el pago de prueba" : `Paso ${paso + 1} de 4: ${pasos[paso]}`}
            </p>
          </form>

          <aside className="hidden lg:block" aria-label="Resumen del pedido">
            <div className="vt-tarjeta sticky top-36 p-5">
              <p className="vt-titulo text-2xl">Tu pedido</p>
              <div className="mt-4">
                <Resumen paso={paso} envio={envio} descuento={descuento} envoltorio={envoltorio} zonaNombre={zona.nombre} />
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function Resumen({
  paso,
  envio,
  descuento,
  envoltorio,
  zonaNombre,
}: {
  paso: number
  envio: number
  descuento: number
  envoltorio: number
  zonaNombre: string
}) {
  const { carrito, subtotal, descuentoCupon, cuponActivo } = useTienda()
  const total =
    subtotal - descuentoCupon + (paso >= 1 ? envio + envoltorio : 0) - (paso >= 2 ? descuento : 0)
  return (
    <div>
      <ul className="space-y-3">
        {carrito.map((l) => {
          const p = buscarPlanta(l.plantaId)
          if (!p) return null
          return (
            <li key={l.clave} className="flex items-center gap-3">
              <span className={cn("vt-blob-2 relative size-14 shrink-0 overflow-hidden", fondo[p.color])}>
                <Image src={p.foto.src} alt="" fill sizes="56px" className="object-cover" />
                <span className="absolute -top-0 -right-0 grid size-5 place-items-center rounded-full bg-[var(--vt-tinta)] text-[10px] font-bold text-[var(--vt-papel)]">
                  {l.cantidad}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{p.nombre}</span>
                <span className="block truncate text-xs text-[var(--vt-tinta-70)]">
                  {textoVariante(p, l.tamanoId, l.macetaId, l.colorId ? buscarColor(l.colorId).nombre : undefined)}
                </span>
              </span>
              <span className="text-sm font-bold tabular-nums">
                {pesos(precioVariante(p, l.tamanoId, l.macetaId) * l.cantidad)}
              </span>
            </li>
          )
        })}
      </ul>
      <CampoCupon id="co-cupon" className="mt-4" />
      <dl className="mt-4 space-y-1.5 border-t-2 border-dashed border-[var(--vt-tinta-15)] pt-4 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{pesos(subtotal)}</dd>
        </div>
        {descuentoCupon > 0 && (
          <div className="flex justify-between text-[var(--vt-hoja)]">
            <dt>Cupón {cuponActivo?.codigo}</dt>
            <dd className="tabular-nums">−{pesos(descuentoCupon)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-3">
          <dt>Envío{paso >= 1 && ` · ${zonaNombre}`}</dt>
          <dd className="tabular-nums">
            {paso < 1 ? "Se calcula después" : envio === 0 ? "Gratis" : pesos(envio)}
          </dd>
        </div>
        {paso >= 1 && envoltorio > 0 && (
          <div className="flex justify-between">
            <dt>Envoltorio de regalo</dt>
            <dd className="tabular-nums">{pesos(envoltorio)}</dd>
          </div>
        )}
        {paso >= 2 && descuento > 0 && (
          <div className="flex justify-between text-[var(--vt-hoja)]">
            <dt>Descuento transferencia</dt>
            <dd className="tabular-nums">−{pesos(descuento)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t-2 border-[var(--vt-tinta)] pt-3">
          <dt className="font-extrabold">Total</dt>
          <dd className="vt-titulo text-3xl tabular-nums">{pesos(total)}</dd>
        </div>
      </dl>
    </div>
  )
}

function Confirmacion({
  pedido,
  metodo,
  datos,
  onPedidos,
  onSeguir,
}: {
  pedido: Pedido
  metodo: MetodoPago
  datos: { nombre: string; email: string; telefono: string }
  onPedidos: () => void
  onSeguir: () => void
}) {
  const { usuario, entrar, abrirCuenta } = useTienda()
  const tiradoRef = useRef(false)
  useEffect(() => {
    if (tiradoRef.current) return
    tiradoRef.current = true
    confeti()
  }, [])
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 md:py-16">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative overflow-hidden rounded-[36px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-menta)] p-6 text-center md:p-10"
      >
        <span
          className="vt-sticker bg-[var(--vt-manteca)] text-sm"
          style={{ "--giro": "-4deg" } as React.CSSProperties}
        >
          <PartyPopper className="size-4" aria-hidden="true" /> ¡Pedido confirmado!
        </span>
        <h2 className="vt-titulo mt-5 text-5xl md:text-6xl">Tu planta ya tiene casa</h2>
        <p className="mt-4 text-[var(--vt-tinta-70)]">
          Número de pedido
        </p>
        <p className="vt-titulo mt-1 text-4xl tracking-wide" aria-live="polite">
          {pedido.numero}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-[var(--vt-tinta-70)]">
          En la tienda real te llegaría el comprobante a {datos.email}.{" "}
          Es una demo: no se cobró nada.
        </p>
        {pedido.puntos ? (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] px-3 py-1.5 text-sm font-extrabold">
            <Star className="size-4 fill-[var(--vt-coral)]" aria-hidden="true" /> Sumaste {pedido.puntos} puntos verdes
          </p>
        ) : null}
      </motion.div>

      {pedido.regalo && (
        <div className="vt-tarjeta mt-5 flex gap-3 p-5 text-sm">
          <Gift className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>
            <strong className="font-extrabold">Va de regalo para {pedido.regalo.para}.</strong>{" "}
            {pedido.regalo.mensaje ? `La tarjeta dice: “${pedido.regalo.mensaje}”.` : "Sin mensaje en la tarjeta."} La caja no lleva el precio.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (!usuario) entrar({ ...datos, invitado: false })
          abrirCuenta("plantas")
        }}
        className="mt-5 flex w-full items-center gap-3 rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-cielo)] p-4 text-left text-sm transition-transform hover:-rotate-1"
      >
        <Sprout className="size-6 shrink-0" aria-hidden="true" />
        <span>
          <strong className="block font-extrabold">Te activamos los recordatorios de riego</strong>
          Tus plantas nuevas ya están en «Mis plantas», con su calendario.
        </span>
      </button>

      {metodo === "transferencia" && (
        <div className="vt-tarjeta mt-5 p-5 text-sm">
          <p className="font-extrabold">Datos para transferir (ficticios)</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="text-[var(--vt-tinta-70)]">Banco</dt>
            <dd>BROU · caja de ahorro en pesos</dd>
            <dt className="text-[var(--vt-tinta-70)]">Cuenta</dt>
            <dd className="tabular-nums">000123456-00001</dd>
            <dt className="text-[var(--vt-tinta-70)]">Titular</dt>
            <dd>Verde Tienda (demo)</dd>
            <dt className="text-[var(--vt-tinta-70)]">Monto</dt>
            <dd className="font-extrabold tabular-nums">{pesos(pedido.total)}</dd>
          </dl>
        </div>
      )}

      <div className="vt-tarjeta mt-5 p-5">
        <p className="vt-titulo text-2xl">¿Y ahora?</p>
        <ol className="mt-3 space-y-3 text-sm">
          {[
            "Elegimos tu planta en el vivero y le sacamos una foto antes de embalarla.",
            pedido.zona.startsWith("Retiro")
              ? "Te avisamos por WhatsApp cuando está lista para retirar."
              : `Sale hacia ${pedido.direccion}. Te escribimos cuando está en camino.`,
            "Te llega con su tarjeta de cuidados. Cualquier duda, nos escribís.",
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)] text-xs font-extrabold">
                {i + 1}
              </span>
              <span className="pt-1">{t}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex justify-between border-t-2 border-dashed border-[var(--vt-tinta-15)] pt-4 text-sm">
          <span>
            Total · {pedido.pago}
          </span>
          <span className="font-extrabold tabular-nums">{pesos(pedido.total)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {usuario ? (
          <button type="button" className="vt-boton h-12 px-6" onClick={onPedidos}>
            Ver en Mis pedidos
          </button>
        ) : (
          <button
            type="button"
            className="vt-boton h-12 px-6"
            onClick={() => {
              entrar({ ...datos, invitado: false })
              onPedidos()
            }}
          >
            Ver en Mis pedidos
          </button>
        )}
        <button type="button" className="vt-boton-linea h-12 px-6" onClick={onSeguir}>
          Seguir comprando
        </button>
      </div>
    </div>
  )
}

/* ---------- Envío para regalar ---------- */

function OpcionRegalo({
  activo,
  onActivo,
  para,
  onPara,
  mensaje,
  onMensaje,
  envolver,
  onEnvolver,
  error,
  remitente,
}: {
  activo: boolean
  onActivo: (v: boolean) => void
  para: string
  onPara: (v: string) => void
  mensaje: string
  onMensaje: (v: string) => void
  envolver: boolean
  onEnvolver: (v: boolean) => void
  error?: string
  remitente: string
}) {
  const max = 160
  return (
    <div className="mt-6 rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-rosa)] p-4 sm:p-5">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => onActivo(e.target.checked)}
          className="size-5 accent-[var(--vt-hoja)]"
        />
        <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
          <Gift className="size-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block font-extrabold">Es para regalar</span>
          <span className="block text-sm text-[var(--vt-tinta-70)]">Con tarjeta escrita a mano y sin precio en la caja.</span>
        </span>
      </label>
      <AnimatePresence initial={false}>
        {activo && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-4 grid gap-4 md:grid-cols-[1fr_15rem]"
          >
            <div className="space-y-4">
              <Campo
                id="co-para"
                etiqueta="¿Para quién es?"
                placeholder="Nombre de quien la recibe"
                value={para}
                onChange={(e) => onPara(e.target.value)}
                error={error}
              />
              <div>
                <label htmlFor="co-mensaje" className="mb-1.5 block text-sm font-bold">
                  Mensaje para la tarjeta (opcional)
                </label>
                <textarea
                  id="co-mensaje"
                  rows={3}
                  maxLength={max}
                  value={mensaje}
                  onChange={(e) => onMensaje(e.target.value)}
                  placeholder="¡Feliz cumple! Que crezca tanto como nuestra amistad."
                  aria-describedby="co-mensaje-cuenta"
                  className="vt-campo resize-none"
                />
                <p id="co-mensaje-cuenta" className="mt-1 text-right text-xs text-[var(--vt-tinta-70)] tabular-nums">
                  {mensaje.length}/{max}
                </p>
              </div>
              <label className="flex items-center gap-2.5 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={envolver}
                  onChange={(e) => onEnvolver(e.target.checked)}
                  className="size-5 accent-[var(--vt-hoja)]"
                />
                Envolver con papel kraft y moño (+{pesos(COSTO_ENVOLTORIO)})
              </label>
            </div>
            {/* Vista previa de la tarjeta */}
            <div aria-hidden="true" className="relative self-start">
              <div className="rotate-2 rounded-2xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-4 shadow-[3px_3px_0_var(--vt-tinta)]">
                <p className="text-[11px] font-extrabold tracking-wider text-[var(--vt-tinta-70)] uppercase">Tarjeta</p>
                <p className="vt-titulo mt-2 text-xl">Para {para.trim() || "…"}</p>
                <p className="mt-2 min-h-12 text-sm leading-snug break-words">
                  {mensaje.trim() || "Tu mensaje va acá."}
                </p>
                <p className="mt-3 text-right text-sm font-bold">— {remitente.trim().split(" ")[0] || "Vos"}</p>
              </div>
              {envolver && (
                <span className="vt-sticker absolute -top-3 -right-1 bg-[var(--vt-manteca)]" style={{ "--giro": "8deg" } as React.CSSProperties}>
                  Con moño
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
