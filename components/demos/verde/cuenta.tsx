"use client"

import { useState } from "react"
import { Dialog, DropdownMenu, Tabs } from "radix-ui"
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  Trash2,
  User,
  UserRound,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import { envios } from "@/components/demos/verde/catalogo"
import {
  useTienda,
  type Direccion,
  type SeccionCuenta,
} from "@/components/demos/verde/estado"
import { Cajon, Campo, capa } from "@/components/demos/verde/ui"
import {
  enfocarPrimerError,
  limpiarErrores,
  validarEmail,
  validarNombre,
  validarObligatorio,
  validarTelefono,
} from "@/components/demos/verde/validar"

function inicial(nombre: string) {
  return nombre.trim().charAt(0).toUpperCase() || "?"
}

/* ---------- Menú desplegable del ícono de cuenta ---------- */

export function MenuCuenta() {
  const { usuario, pedidos, direcciones, favoritos, abrir, abrirCuenta, salir, avisar } =
    useTienda()

  const item =
    "vt-item flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold"

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className="vt-icono relative size-11"
        aria-label={usuario ? `Mi cuenta (${usuario.nombre})` : "Mi cuenta"}
      >
        {usuario ? (
          <span className="grid size-8 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-lila)] text-sm font-extrabold">
            {inicial(usuario.nombre)}
          </span>
        ) : (
          <UserRound className="size-[22px]" strokeWidth={2.2} aria-hidden="true" />
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          collisionPadding={12}
          className={cn(
            capa,
            "vt-menu z-[55] w-[min(20rem,calc(100vw-1.5rem))] rounded-3xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-2 shadow-[0_18px_40px_-20px_rgba(31,42,34,0.5)]"
          )}
        >
          {usuario ? (
            <>
              <div className="mb-1 flex items-center gap-3 rounded-2xl bg-[var(--vt-lila)] p-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] text-lg font-extrabold">
                  {inicial(usuario.nombre)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-extrabold">Hola, {usuario.nombre.split(" ")[0]}</p>
                  <p className="truncate text-xs text-[var(--vt-tinta-70)]">
                    {usuario.email || "Sesión de invitado"}
                  </p>
                </div>
              </div>
              <DropdownMenu.Label className="px-3 pt-2 pb-1 text-[11px] font-bold tracking-wider text-[var(--vt-tinta-70)] uppercase">
                Mi cuenta
              </DropdownMenu.Label>
              <DropdownMenu.Item className={item} onSelect={() => abrirCuenta("datos")}>
                <User className="size-4" aria-hidden="true" /> Mis datos
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className={item}
                onSelect={() => abrirCuenta("direcciones")}
              >
                <MapPin className="size-4" aria-hidden="true" /> Direcciones
                guardadas
                <Contador n={direcciones.length} />
              </DropdownMenu.Item>
              <DropdownMenu.Item className={item} onSelect={() => abrirCuenta("pedidos")}>
                <Package className="size-4" aria-hidden="true" /> Mis pedidos
                <Contador n={pedidos.length} />
              </DropdownMenu.Item>
              <DropdownMenu.Item className={item} onSelect={() => abrir("favoritos")}>
                <Heart className="size-4" aria-hidden="true" /> Favoritos
                <Contador n={favoritos.length} />
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1.5 h-0.5 bg-[var(--vt-tinta-15)]" />
              <DropdownMenu.Item
                className={item}
                onSelect={() => {
                  salir()
                  avisar("Cerraste sesión. Tu carrito sigue guardado.")
                }}
              >
                <LogOut className="size-4" aria-hidden="true" /> Cerrar sesión
              </DropdownMenu.Item>
            </>
          ) : (
            <>
              <div className="rounded-2xl bg-[var(--vt-manteca)] p-4">
                <p className="vt-titulo text-2xl">Tu rincón verde</p>
                <p className="mt-1.5 text-sm leading-snug text-[var(--vt-tinta-70)]">
                  Guardá tus datos, direcciones y pedidos para comprar en dos
                  toques.
                </p>
              </div>
              <DropdownMenu.Item
                className={cn(item, "mt-2 justify-center bg-[var(--vt-tinta)] text-[var(--vt-papel)] data-[highlighted]:bg-[var(--vt-hoja)]")}
                onSelect={() => abrir("entrar")}
              >
                Entrar o crear cuenta
              </DropdownMenu.Item>
              <DropdownMenu.Item className={item} onSelect={() => abrir("favoritos")}>
                <Heart className="size-4" aria-hidden="true" /> Favoritos
                <Contador n={favoritos.length} />
              </DropdownMenu.Item>
              <DropdownMenu.Item className={item} onSelect={() => abrir("entrar")}>
                <Package className="size-4" aria-hidden="true" /> Seguir mi pedido
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function Contador({ n }: { n: number }) {
  if (!n) return null
  return (
    <span className="ml-auto rounded-full bg-[var(--vt-tinta)] px-2 py-0.5 text-xs font-bold text-[var(--vt-papel)] tabular-nums">
      {n}
    </span>
  )
}

/* ---------- Entrar / crear cuenta (sin credenciales reales) ---------- */

export function DialogoEntrar() {
  const { panel, abrir, entrar, avisar } = useTienda()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [errores, setErrores] = useState<{ nombre?: string; email?: string }>({})

  function crear(e: React.FormEvent) {
    e.preventDefault()
    const nuevos = limpiarErrores({
      nombre: validarNombre(nombre),
      email: validarEmail(email),
    })
    setErrores(nuevos)
    if (Object.keys(nuevos).length) {
      enfocarPrimerError(Object.keys(nuevos).map((k) => `entrar-${k}`))
      return
    }
    entrar({ nombre: nombre.trim(), email: email.trim(), telefono: "", invitado: false })
    abrir(null)
    avisar(`¡Hola, ${nombre.trim().split(" ")[0]}! Ya tenés tu cuenta.`)
  }

  function invitado() {
    entrar({ nombre: "Invitado", email: "", telefono: "", invitado: true })
    abrir(null)
    avisar("Entraste como invitado. Tus pedidos quedan en este navegador.")
  }

  return (
    <Dialog.Root open={panel === "entrar"} onOpenChange={(o) => abrir(o ? "entrar" : null)}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn(capa, "vt-velo")} />
        <Dialog.Content
          className={cn(
            capa,
            "vt-modal vt-scroll fixed inset-x-0 bottom-0 z-[61] max-h-[92svh] overflow-y-auto rounded-t-[32px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-crema)] p-6 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-[28rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[32px] md:p-8"
          )}
        >
          <Dialog.Close
            className="vt-icono absolute top-4 right-4 size-10 border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
            aria-label="Cerrar"
          >
            <X className="size-5" aria-hidden="true" />
          </Dialog.Close>
          <span className="vt-sticker bg-[var(--vt-rosa)]" style={{ "--giro": "-3deg" } as React.CSSProperties}>
            Cuenta de demostración
          </span>
          <Dialog.Title className="vt-titulo mt-4 text-4xl">
            Creá tu cuenta en 10 segundos
          </Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-relaxed text-[var(--vt-tinta-70)]">
            Es un sitio de ejemplo: no hay contraseñas ni se envía nada. Tus
            datos quedan guardados solo en este navegador.
          </Dialog.Description>

          <form onSubmit={crear} noValidate className="mt-6 space-y-4">
            <Campo
              id="entrar-nombre"
              etiqueta="Nombre"
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={errores.nombre}
            />
            <Campo
              id="entrar-email"
              etiqueta="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errores.email}
            />
            <button type="submit" className="vt-boton h-12 w-full text-base">
              Crear cuenta
            </button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs font-bold text-[var(--vt-tinta-50)] uppercase">
            <span className="h-0.5 flex-1 bg-[var(--vt-tinta-15)]" /> o{" "}
            <span className="h-0.5 flex-1 bg-[var(--vt-tinta-15)]" />
          </div>
          <button type="button" onClick={invitado} className="vt-boton-linea h-12 w-full text-base">
            Entrar como invitado
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/* ---------- Panel "Mi cuenta" ---------- */

export function PanelCuenta() {
  const { panel, abrir, usuario, seccionCuenta, setSeccionCuenta } = useTienda()

  const pestana =
    "vt-chip h-10 shrink-0 px-4 text-sm data-[state=active]:bg-[var(--vt-tinta)] data-[state=active]:text-[var(--vt-papel)]"

  return (
    <Cajon
      abierto={panel === "cuenta"}
      onCambio={(o) => abrir(o ? "cuenta" : null)}
      titulo="Mi cuenta"
      descripcion="Tus datos, direcciones guardadas y pedidos"
      ancho="max-w-[34rem]"
      icono={<UserRound className="size-6" aria-hidden="true" />}
    >
      {!usuario ? (
        <div className="p-6">
          <p className="text-[var(--vt-tinta-70)]">
            Entrá para ver tus datos y pedidos.
          </p>
          <button type="button" className="vt-boton mt-4 h-12 px-6" onClick={() => abrir("entrar")}>
            Entrar o crear cuenta
          </button>
        </div>
      ) : (
        <Tabs.Root
          value={seccionCuenta}
          onValueChange={(v) => setSeccionCuenta(v as SeccionCuenta)}
          className="p-5"
        >
          <Tabs.List
            aria-label="Secciones de mi cuenta"
            className="vt-sin-barra -mx-5 flex gap-2 overflow-x-auto px-5 pb-1"
          >
            <Tabs.Trigger value="datos" className={pestana}>
              Mis datos
            </Tabs.Trigger>
            <Tabs.Trigger value="direcciones" className={pestana}>
              Direcciones
            </Tabs.Trigger>
            <Tabs.Trigger value="pedidos" className={pestana}>
              Mis pedidos
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="datos" className="mt-5 outline-none">
            <MisDatos key={usuario.email + usuario.nombre} />
          </Tabs.Content>
          <Tabs.Content value="direcciones" className="mt-5 outline-none">
            <MisDirecciones />
          </Tabs.Content>
          <Tabs.Content value="pedidos" className="mt-5 outline-none">
            <MisPedidos />
          </Tabs.Content>
        </Tabs.Root>
      )}
    </Cajon>
  )
}

function MisDatos() {
  const { usuario, entrar, avisar } = useTienda()
  const [nombre, setNombre] = useState(usuario?.invitado ? "" : (usuario?.nombre ?? ""))
  const [email, setEmail] = useState(usuario?.email ?? "")
  const [telefono, setTelefono] = useState(usuario?.telefono ?? "")
  const [errores, setErrores] = useState<Record<string, string | undefined>>({})

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    const nuevos = limpiarErrores({
      nombre: validarNombre(nombre),
      email: validarEmail(email),
      telefono: validarTelefono(telefono, false),
    })
    setErrores(nuevos)
    if (Object.keys(nuevos).length) {
      enfocarPrimerError(Object.keys(nuevos).map((k) => `datos-${k}`))
      return
    }
    entrar({
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      invitado: false,
    })
    avisar("Guardamos tus datos")
  }

  return (
    <form onSubmit={guardar} noValidate className="space-y-4">
      {usuario?.invitado && (
        <p className="rounded-2xl bg-[var(--vt-manteca)] p-4 text-sm leading-snug">
          Estás como invitado. Completá tus datos y los usamos para
          precargar el checkout la próxima vez.
        </p>
      )}
      <Campo
        id="datos-nombre"
        etiqueta="Nombre y apellido"
        autoComplete="name"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        error={errores.nombre}
      />
      <Campo
        id="datos-email"
        etiqueta="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errores.email}
      />
      <Campo
        id="datos-telefono"
        etiqueta="Celular (opcional)"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="099 123 456"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        error={errores.telefono}
        ayuda="Solo para avisarte cuando sale tu pedido."
      />
      <button type="submit" className="vt-boton h-12 px-7">
        Guardar cambios
      </button>
    </form>
  )
}

const direccionVacia: Direccion = {
  id: "",
  alias: "",
  calle: "",
  apto: "",
  barrio: "",
  zonaId: "mvd",
  indicaciones: "",
}

function MisDirecciones() {
  const { direcciones, quitarDireccion, avisar } = useTienda()
  const [editando, setEditando] = useState<Direccion | null>(null)

  if (editando) {
    return (
      <FormularioDireccion
        inicial={editando}
        onListo={() => setEditando(null)}
      />
    )
  }

  return (
    <div>
      {direcciones.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-[var(--vt-tinta-15)] p-5 text-sm text-[var(--vt-tinta-70)]">
          Todavía no guardaste direcciones. Agregá la de tu casa o la del
          trabajo y aparecen solas en el checkout.
        </p>
      ) : (
        <ul className="space-y-3">
          {direcciones.map((d) => (
            <li key={d.id} className="vt-tarjeta flex items-start gap-3 p-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-[var(--vt-hoja)]" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold">{d.alias || "Dirección"}</p>
                <p className="text-sm text-[var(--vt-tinta-70)]">
                  {d.calle}
                  {d.apto && `, ${d.apto}`} · {d.barrio}
                </p>
                <p className="text-xs text-[var(--vt-tinta-70)]">
                  {envios.find((z) => z.id === d.zonaId)?.nombre}
                </p>
              </div>
              <button
                type="button"
                className="vt-icono size-9"
                aria-label={`Editar ${d.alias || "dirección"}`}
                onClick={() => setEditando(d)}
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="vt-icono size-9"
                aria-label={`Borrar ${d.alias || "dirección"}`}
                onClick={() => {
                  quitarDireccion(d.id)
                  avisar("Borramos la dirección")
                }}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="vt-boton-linea mt-4 h-11 px-5 text-sm"
        onClick={() => setEditando(direccionVacia)}
      >
        <Plus className="size-4" aria-hidden="true" /> Agregar dirección
      </button>
    </div>
  )
}

export function FormularioDireccion({
  inicial,
  onListo,
}: {
  inicial: Direccion
  onListo: () => void
}) {
  const { guardarDireccion, avisar } = useTienda()
  const [d, setD] = useState(inicial)
  const [errores, setErrores] = useState<Record<string, string | undefined>>({})
  const zonas = envios.filter((z) => z.id !== "retiro")

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    const nuevos = limpiarErrores({
      calle: validarObligatorio(d.calle, "Poné la calle y el número."),
      barrio: validarObligatorio(d.barrio, "Poné el barrio o la ciudad."),
    })
    setErrores(nuevos)
    if (Object.keys(nuevos).length) {
      enfocarPrimerError(Object.keys(nuevos).map((k) => `dir-${k}`))
      return
    }
    guardarDireccion({ ...d, id: d.id || `dir-${Date.now()}` })
    avisar("Dirección guardada")
    onListo()
  }

  return (
    <form onSubmit={guardar} noValidate className="space-y-4">
      <Campo
        id="dir-alias"
        etiqueta="Nombre (opcional)"
        placeholder="Casa, trabajo, lo de mamá…"
        value={d.alias}
        onChange={(e) => setD({ ...d, alias: e.target.value })}
      />
      <Campo
        id="dir-calle"
        etiqueta="Calle y número"
        autoComplete="street-address"
        placeholder="Av. Brasil 2840"
        value={d.calle}
        onChange={(e) => setD({ ...d, calle: e.target.value })}
        error={errores.calle}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          id="dir-apto"
          etiqueta="Apto o casa (opcional)"
          value={d.apto}
          onChange={(e) => setD({ ...d, apto: e.target.value })}
        />
        <Campo
          id="dir-barrio"
          etiqueta="Barrio o ciudad"
          value={d.barrio}
          onChange={(e) => setD({ ...d, barrio: e.target.value })}
          error={errores.barrio}
        />
      </div>
      <div>
        <label htmlFor="dir-zona" className="mb-1.5 block text-sm font-bold">
          Zona de envío
        </label>
        <select
          id="dir-zona"
          className="vt-campo"
          value={d.zonaId}
          onChange={(e) => setD({ ...d, zonaId: e.target.value })}
        >
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>
              {z.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="vt-boton h-12 px-6">
          Guardar dirección
        </button>
        <button type="button" className="vt-boton-linea h-12 px-6" onClick={onListo}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

const formatoFecha = new Intl.DateTimeFormat("es-UY", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
})

function MisPedidos() {
  const { pedidos, irAlCatalogo } = useTienda()
  if (pedidos.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-[var(--vt-tinta-15)] p-5">
        <p className="text-sm text-[var(--vt-tinta-70)]">
          Todavía no hiciste pedidos. Cuando confirmes uno en el checkout,
          aparece acá con su número.
        </p>
        <button type="button" className="vt-boton mt-4 h-11 px-5 text-sm" onClick={() => irAlCatalogo()}>
          Ver plantas
        </button>
      </div>
    )
  }
  return (
    <ul className="space-y-3">
      {pedidos.map((p) => (
        <li key={p.numero} className="vt-tarjeta overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-menta)]">
                <Package className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">Pedido {p.numero}</span>
                <span className="block text-xs text-[var(--vt-tinta-70)]">
                  {formatoFecha.format(new Date(p.fecha))} ·{" "}
                  {p.lineas.reduce((s, l) => s + l.cantidad, 0)} productos
                </span>
              </span>
              <span className="text-right">
                <span className="block font-extrabold tabular-nums">{pesos(p.total)}</span>
                <span className="mt-0.5 inline-block rounded-full bg-[var(--vt-manteca)] px-2 py-0.5 text-[11px] font-bold">
                  Preparando
                </span>
              </span>
            </summary>
            <div className="border-t-2 border-[var(--vt-tinta-15)] p-4 text-sm">
              <ul className="space-y-1.5">
                {p.lineas.map((l, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span className="min-w-0">
                      {l.cantidad} × {l.nombre}{" "}
                      <span className="text-[var(--vt-tinta-70)]">({l.variante})</span>
                    </span>
                    <span className="shrink-0 tabular-nums">{pesos(l.precio * l.cantidad)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1 border-t-2 border-dashed border-[var(--vt-tinta-15)] pt-3 text-[var(--vt-tinta-70)]">
                <div className="flex justify-between">
                  <dt>Envío · {p.zona}</dt>
                  <dd className="tabular-nums">{p.envio ? pesos(p.envio) : "Gratis"}</dd>
                </div>
                {p.descuento > 0 && (
                  <div className="flex justify-between">
                    <dt>Descuento transferencia</dt>
                    <dd className="tabular-nums">−{pesos(p.descuento)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Pago</dt>
                  <dd>{p.pago}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Entrega</dt>
                  <dd className="text-right">{p.direccion}</dd>
                </div>
              </dl>
            </div>
          </details>
        </li>
      ))}
    </ul>
  )
}
