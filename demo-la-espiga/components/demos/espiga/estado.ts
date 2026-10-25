/**
 * Estado compartido de La Espiga: bolsa, datos del cliente, historial de
 * pedidos, preferencia de letra grande y el panel abierto.
 *
 * Cada pieza es un almacén externo leído con useSyncExternalStore: en el
 * servidor y durante la hidratación devuelve el valor inicial, y recién en
 * el cliente lee localStorage (siempre dentro de try/catch).
 */
import { useSyncExternalStore } from "react"

import { carta, productoPorId } from "@/components/demos/espiga/carta"
import {
  decoraciones,
  tortaInicial,
  type ConfigTorta,
  type Decoracion,
} from "@/components/demos/espiga/contenido"
import { pesos } from "@/lib/demo"

type Actualizar<T> = T | ((anterior: T) => T)

function crearAlmacen<T>(
  clave: string | null,
  inicial: T,
  validar: (crudo: unknown) => T | null = (v) => v as T
) {
  let valor = inicial
  let cargado = false
  const oyentes = new Set<() => void>()

  function cargar() {
    if (cargado || typeof window === "undefined") return
    cargado = true
    if (!clave) return
    try {
      const crudo = window.localStorage.getItem(clave)
      if (crudo) {
        const leido = validar(JSON.parse(crudo))
        if (leido !== null) valor = leido
      }
    } catch {
      // Sin acceso a localStorage (modo privado, bloqueado): seguimos en memoria.
    }
  }

  function avisarOyentes() {
    oyentes.forEach((o) => o())
  }

  function alCambiarOtraPestana(e: StorageEvent) {
    if (e.key !== clave) return
    valor = inicial
    cargado = false
    cargar()
    avisarOyentes()
  }

  return {
    subscribe(oyente: () => void) {
      cargar()
      oyentes.add(oyente)
      if (oyentes.size === 1 && clave) {
        window.addEventListener("storage", alCambiarOtraPestana)
      }
      return () => {
        oyentes.delete(oyente)
        if (oyentes.size === 0 && clave) {
          window.removeEventListener("storage", alCambiarOtraPestana)
        }
      }
    },
    getSnapshot() {
      cargar()
      return valor
    },
    getServerSnapshot() {
      return inicial
    },
    get() {
      cargar()
      return valor
    },
    set(siguiente: Actualizar<T>) {
      cargar()
      valor =
        typeof siguiente === "function"
          ? (siguiente as (a: T) => T)(valor)
          : siguiente
      if (clave) {
        try {
          window.localStorage.setItem(clave, JSON.stringify(valor))
        } catch {
          // Si no se puede guardar, igual funciona durante esta visita.
        }
      }
      avisarOyentes()
    },
  }
}

type Almacen<T> = ReturnType<typeof crearAlmacen<T>>

function useAlmacen<T>(a: Almacen<T>) {
  return useSyncExternalStore(a.subscribe, a.getSnapshot, a.getServerSnapshot)
}

const esObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

/* ---------- Bolsa ---------- */

export type Bolsa = Record<string, number>

const bolsa = crearAlmacen<Bolsa>("espiga:bolsa", {}, (v) => {
  if (!esObjeto(v)) return null
  const limpia: Bolsa = {}
  for (const [id, n] of Object.entries(v)) {
    if (productoPorId.has(id) && typeof n === "number" && n > 0) {
      limpia[id] = Math.min(99, Math.floor(n))
    }
  }
  return limpia
})

export const useBolsa = () => useAlmacen(bolsa)

export function cambiarCantidad(id: string, delta: number) {
  bolsa.set((prev) => {
    const nuevo = Math.min(99, Math.max(0, (prev[id] ?? 0) + delta))
    const copia = { ...prev }
    if (nuevo === 0) delete copia[id]
    else copia[id] = nuevo
    return copia
  })
  const p = productoPorId.get(id)
  if (p && delta > 0) {
    const total = Object.values(bolsa.get()).reduce((s, n) => s + n, 0)
    avisar(
      `Agregaste ${p.nombre}. Tenés ${total} ${total === 1 ? "producto" : "productos"} en tu bolsa.`
    )
  }
}

export function quitarDeBolsa(id: string) {
  const p = productoPorId.get(id)
  bolsa.set((prev) => {
    const copia = { ...prev }
    delete copia[id]
    return copia
  })
  if (p) avisar(`Quitaste ${p.nombre} de tu bolsa.`)
}

export function vaciarBolsa() {
  bolsa.set({})
}

export const ENVIO = 80
export const ENVIO_GRATIS_DESDE = 1200

export function resumirBolsa(b: Bolsa, domicilio = false) {
  const lineas = carta
    .filter((p) => b[p.id])
    .map((p) => ({ producto: p, cantidad: b[p.id] }))
  const subtotal = lineas.reduce(
    (s, l) => s + l.producto.precio * l.cantidad,
    0
  )
  const unidades = lineas.reduce((s, l) => s + l.cantidad, 0)
  const envio =
    domicilio && subtotal > 0 && subtotal < ENVIO_GRATIS_DESDE ? ENVIO : 0
  return { lineas, subtotal, unidades, envio, total: subtotal + envio }
}

/* ---------- Mis datos ---------- */

export type Modalidad = "local" | "domicilio"

export type Datos = {
  nombre: string
  telefono: string
  modalidad: Modalidad
  direccion: string
  notas: string
}

export const datosVacios: Datos = {
  nombre: "",
  telefono: "",
  modalidad: "local",
  direccion: "",
  notas: "",
}

const datos = crearAlmacen<Datos>("espiga:datos", datosVacios, (v) => {
  if (!esObjeto(v)) return null
  const texto = (k: string) => (typeof v[k] === "string" ? String(v[k]) : "")
  return {
    nombre: texto("nombre"),
    telefono: texto("telefono"),
    modalidad: v.modalidad === "domicilio" ? "domicilio" : "local",
    direccion: texto("direccion"),
    notas: texto("notas"),
  }
})

export const useDatos = () => useAlmacen(datos)
export const guardarDatos = (d: Datos) => datos.set(d)

export type ErroresDatos = Partial<Record<keyof Datos, string>>

export function validarDatos(d: Datos): ErroresDatos {
  const errores: ErroresDatos = {}
  if (d.nombre.trim().length < 2) {
    errores.nombre = "Escribí tu nombre, así sabemos de quién es el pedido."
  }
  const digitos = d.telefono.replace(/\D/g, "")
  if (digitos.length < 8 || digitos.length > 12) {
    errores.telefono =
      "Revisá el teléfono: tiene que tener entre 8 y 12 números, por ejemplo 099 123 456."
  }
  if (d.modalidad === "domicilio" && d.direccion.trim().length < 5) {
    errores.direccion = "Para el envío necesitamos la dirección completa."
  }
  return errores
}

export const datosCompletos = (d: Datos) =>
  Object.keys(validarDatos(d)).length === 0

/* ---------- Mis pedidos ---------- */

export type PedidoGuardado = {
  id: string
  fecha: number
  items: { id: string; nombre: string; cantidad: number; precio: number }[]
  total: number
  retiro: string
  modalidad: Modalidad
}

const pedidos = crearAlmacen<PedidoGuardado[]>("espiga:pedidos", [], (v) =>
  Array.isArray(v)
    ? (v.filter(
        (p) =>
          esObjeto(p) && Array.isArray(p.items) && typeof p.fecha === "number"
      ) as PedidoGuardado[])
    : null
)

export const usePedidos = () => useAlmacen(pedidos)

export function guardarPedido(p: Omit<PedidoGuardado, "id" | "fecha">) {
  const fecha = Date.now()
  const nuevo = { ...p, id: String(fecha), fecha }
  pedidos.set((prev) => [nuevo, ...prev].slice(0, 20))
}

export function borrarPedidos() {
  pedidos.set([])
}

/** Vuelve a cargar un pedido viejo en la bolsa (solo lo que sigue en la carta). */
export function repetirPedido(p: PedidoGuardado) {
  const nueva: Bolsa = {}
  for (const item of p.items) {
    if (productoPorId.has(item.id)) nueva[item.id] = item.cantidad
  }
  bolsa.set(nueva)
  return Object.keys(nueva).length
}

/* ---------- Mensaje de WhatsApp ---------- */

export function mensajePedido(b: Bolsa, d: Datos, retiro: string): string {
  const domicilio = d.modalidad === "domicilio"
  const r = resumirBolsa(b, domicilio)
  const lineas = [
    "¡Hola, La Espiga! Quiero hacer un pedido:",
    "",
    ...r.lineas.map(
      (l) =>
        `• ${l.cantidad} × ${l.producto.nombre} (${pesos(l.producto.precio * l.cantidad)})`
    ),
    "",
  ]
  if (domicilio) {
    lineas.push(`Envío: ${r.envio === 0 ? "sin costo" : pesos(r.envio)}`)
  }
  lineas.push(`Total: ${pesos(r.total)}`, "")
  lineas.push(
    domicilio ? `Entrega a domicilio: ${retiro}` : `Paso a retirar: ${retiro}`
  )
  if (domicilio) lineas.push(`Dirección: ${d.direccion.trim()}`)
  lineas.push(`Nombre: ${d.nombre.trim()}`, `Teléfono: ${d.telefono.trim()}`)
  if (d.notas.trim()) lineas.push(`Notas y alergias: ${d.notas.trim()}`)
  lineas.push("", "Pago al recibir. ¡Gracias!")
  return lineas.join("\n")
}

/* ---------- Letra grande ---------- */

const letra = crearAlmacen<boolean>("espiga:letra-grande", false, (v) =>
  typeof v === "boolean" ? v : null
)
export const useLetraGrande = () => useAlmacen(letra)
export const alternarLetra = () => letra.set((v) => !v)

/* ---------- Panel abierto ---------- */

export type Panel = "bolsa" | "datos" | "pedidos" | "menu" | null

const panel = crearAlmacen<Panel>(null, null)
export const usePanel = () => useAlmacen(panel)
export const abrirPanel = (p: Panel) => panel.set(p)

/* ---------- Avisos (lector de pantalla y cartelito visible) ---------- */

export type Aviso = { id: number; texto: string } | null

const aviso = crearAlmacen<Aviso>(null, null)
export const useAviso = () => useAlmacen(aviso)
let idAviso = 0
let temporizador: ReturnType<typeof setTimeout> | undefined

export function avisar(texto: string) {
  idAviso += 1
  aviso.set({ id: idAviso, texto })
  clearTimeout(temporizador)
  temporizador = setTimeout(() => aviso.set(null), 3200)
}

/* ---------- Reloj (hora real, se actualiza cada 20 s) ---------- */

function suscribirReloj(cambio: () => void) {
  const id = window.setInterval(cambio, 20_000)
  document.addEventListener("visibilitychange", cambio)
  return () => {
    window.clearInterval(id)
    document.removeEventListener("visibilitychange", cambio)
  }
}
const leerReloj = () => Math.floor(Date.now() / 60_000) * 60_000
const relojServidor = () => null

/** Marca de tiempo redondeada al minuto, o null en el servidor. */
export function useAhora(): number | null {
  return useSyncExternalStore(suscribirReloj, leerReloj, relojServidor)
}

/* ---------- Movimiento: pausa general de animaciones ---------- */

const quieto = crearAlmacen<boolean>("espiga:quieto", false, (v) =>
  typeof v === "boolean" ? v : null
)
export const useQuieto = () => useAlmacen(quieto)
export const alternarQuieto = () => quieto.set((v) => !v)
/** Para los bucles de animación, que no re-renderizan React. */
export const estaQuieto = () => quieto.get()
export const suscribirQuieto = (o: () => void) => quieto.subscribe(o)

/* ---------- Ficha de producto abierta ---------- */

const ficha = crearAlmacen<string | null>(null, null)
export const useFicha = () => useAlmacen(ficha)
export const abrirFicha = (id: string | null) => ficha.set(id)

/* ---------- Torta a medida ---------- */

const torta = crearAlmacen<ConfigTorta>("espiga:torta", tortaInicial, (v) => {
  if (!esObjeto(v)) return null
  const texto = (k: string, d: string) =>
    typeof v[k] === "string" ? String(v[k]) : d
  const pisos = v.pisos === 1 || v.pisos === 3 ? v.pisos : 2
  const ids = decoraciones.map((d) => d.id as string)
  return {
    pisos,
    bizcochuelo: texto("bizcochuelo", tortaInicial.bizcochuelo),
    relleno: texto("relleno", tortaInicial.relleno),
    cobertura: texto("cobertura", tortaInicial.cobertura),
    deco: Array.isArray(v.deco)
      ? (v.deco.filter(
          (d) => typeof d === "string" && ids.includes(d)
        ) as Decoracion[])
      : tortaInicial.deco,
    cartel: texto("cartel", tortaInicial.cartel).slice(0, 18),
  }
})
export const useTorta = () => useAlmacen(torta)
export const cambiarTorta = (c: Partial<ConfigTorta>) =>
  torta.set((t) => ({ ...t, ...c }))

/* ---------- Tarjeta de la casa (sellos) ---------- */

export type Tarjeta = { mostrador: number; canjeados: number }

const tarjeta = crearAlmacen<Tarjeta>(
  "espiga:tarjeta",
  { mostrador: 0, canjeados: 0 },
  (v) =>
    esObjeto(v)
      ? {
          mostrador: Math.max(0, Number(v.mostrador) || 0),
          canjeados: Math.max(0, Number(v.canjeados) || 0),
        }
      : null
)
export const useTarjeta = () => useAlmacen(tarjeta)
export const sellarEnMostrador = () =>
  tarjeta.set((t) => ({ ...t, mostrador: t.mostrador + 1 }))
export const canjearTarjeta = () =>
  tarjeta.set((t) => ({ ...t, canjeados: t.canjeados + 1 }))

/** Panes comprados en los pedidos guardados: cada uno es un sello. */
export function panesEnPedidos(lista: PedidoGuardado[]) {
  let n = 0
  for (const p of lista) {
    for (const i of p.items) {
      if (productoPorId.get(i.id)?.categoria === "panes") n += i.cantidad
    }
  }
  return n
}

/* ---------- Pan de la semana (suscripción) ---------- */

export type Suscripcion = {
  pan: string
  dias: number[]
  franja: string
  modalidad: Modalidad
  pausada: boolean
  desde: number
}

const suscripcion = crearAlmacen<Suscripcion | null>(
  "espiga:suscripcion",
  null,
  (v) => {
    if (!esObjeto(v) || !Array.isArray(v.dias)) return null
    return {
      pan: typeof v.pan === "string" ? v.pan : "campo",
      dias: v.dias.filter(
        (d): d is number => typeof d === "number" && d >= 1 && d <= 6
      ),
      franja: typeof v.franja === "string" ? v.franja : "",
      modalidad: v.modalidad === "domicilio" ? "domicilio" : "local",
      pausada: v.pausada === true,
      desde: typeof v.desde === "number" ? v.desde : Date.now(),
    }
  }
)
export const useSuscripcion = () => useAlmacen(suscripcion)
export const guardarSuscripcion = (
  s: (Omit<Suscripcion, "desde"> & { desde?: number }) | null
) => suscripcion.set(s ? { ...s, desde: s.desde ?? Date.now() } : null)

/* ---------- Tipo de encargo elegido en la nota ---------- */

const tipoEncargo = crearAlmacen<string>(null, "Torta")
export const useTipoEncargo = () => useAlmacen(tipoEncargo)
export const elegirTipoEncargo = (t: string) => tipoEncargo.set(t)
