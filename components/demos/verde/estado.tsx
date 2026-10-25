"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"
import { MotionConfig } from "motion/react"

import {
  buscarPlanta,
  precioVariante,
  type CategoriaPlanta,
} from "@/components/demos/verde/catalogo"

/* ---------- Tipos ---------- */

export type LineaCarrito = {
  clave: string
  plantaId: string
  tamanoId: string
  macetaId: string
  cantidad: number
}

export type Usuario = {
  nombre: string
  email: string
  telefono: string
  invitado: boolean
}

export type Direccion = {
  id: string
  alias: string
  calle: string
  apto: string
  barrio: string
  zonaId: string
  indicaciones: string
}

export type LineaPedido = {
  nombre: string
  variante: string
  cantidad: number
  precio: number
}

export type Pedido = {
  numero: string
  fecha: string
  lineas: LineaPedido[]
  subtotal: number
  envio: number
  descuento: number
  total: number
  zona: string
  direccion: string
  pago: string
}

export type Filtros = {
  categoria: CategoriaPlanta | null
  mascotas: boolean
  pocaLuz: boolean
  facil: boolean
  texto: string
}

export type Orden =
  | "destacadas"
  | "vendidas"
  | "precio-asc"
  | "precio-desc"
  | "nombre"

export type Panel =
  | "carrito"
  | "favoritos"
  | "checkout"
  | "cuenta"
  | "entrar"
  | "menu"
  | null

export type SeccionCuenta = "datos" | "direcciones" | "pedidos"

export const filtrosVacios: Filtros = {
  categoria: null,
  mascotas: false,
  pocaLuz: false,
  facil: false,
  texto: "",
}

/* ---------- Datos guardados (localStorage) ---------- */

type Guardado = {
  carrito: LineaCarrito[]
  favoritos: string[]
  usuario: Usuario | null
  direcciones: Direccion[]
  pedidos: Pedido[]
}

const vacio: Guardado = {
  carrito: [],
  favoritos: [],
  usuario: null,
  direcciones: [],
  pedidos: [],
}

const CLAVE = "verde-tienda:v1"

function leerGuardado(): Guardado {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return vacio
    const datos = JSON.parse(crudo) as Partial<Guardado>
    return {
      carrito: Array.isArray(datos.carrito)
        ? datos.carrito.filter((l) => buscarPlanta(l.plantaId))
        : [],
      favoritos: Array.isArray(datos.favoritos)
        ? datos.favoritos.filter((id) => buscarPlanta(id))
        : [],
      usuario: datos.usuario ?? null,
      direcciones: Array.isArray(datos.direcciones) ? datos.direcciones : [],
      pedidos: Array.isArray(datos.pedidos) ? datos.pedidos : [],
    }
  } catch {
    return vacio
  }
}

function escribirGuardado(datos: Guardado) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(datos))
  } catch {
    // Sin espacio o navegación privada: la tienda sigue andando en memoria.
  }
}

type Accion =
  | { tipo: "cargar"; datos: Guardado }
  | { tipo: "agregar"; linea: Omit<LineaCarrito, "clave"> }
  | { tipo: "cantidad"; clave: string; cantidad: number }
  | { tipo: "vaciar" }
  | { tipo: "favorito"; id: string }
  | { tipo: "usuario"; usuario: Usuario | null }
  | { tipo: "direccion"; direccion: Direccion }
  | { tipo: "quitarDireccion"; id: string }
  | { tipo: "pedido"; pedido: Pedido }

function reductor(estado: Guardado, accion: Accion): Guardado {
  switch (accion.tipo) {
    case "cargar":
      return accion.datos
    case "agregar": {
      const { plantaId, tamanoId, macetaId, cantidad } = accion.linea
      const clave = `${plantaId}|${tamanoId}|${macetaId}`
      const existe = estado.carrito.find((l) => l.clave === clave)
      const carrito = existe
        ? estado.carrito.map((l) =>
            l.clave === clave
              ? { ...l, cantidad: Math.min(20, l.cantidad + cantidad) }
              : l
          )
        : [
            ...estado.carrito,
            { clave, plantaId, tamanoId, macetaId, cantidad },
          ]
      return { ...estado, carrito }
    }
    case "cantidad":
      return {
        ...estado,
        carrito:
          accion.cantidad <= 0
            ? estado.carrito.filter((l) => l.clave !== accion.clave)
            : estado.carrito.map((l) =>
                l.clave === accion.clave
                  ? { ...l, cantidad: Math.min(20, accion.cantidad) }
                  : l
              ),
      }
    case "vaciar":
      return { ...estado, carrito: [] }
    case "favorito":
      return {
        ...estado,
        favoritos: estado.favoritos.includes(accion.id)
          ? estado.favoritos.filter((f) => f !== accion.id)
          : [...estado.favoritos, accion.id],
      }
    case "usuario":
      return { ...estado, usuario: accion.usuario }
    case "direccion": {
      const existe = estado.direcciones.some(
        (d) => d.id === accion.direccion.id
      )
      return {
        ...estado,
        direcciones: existe
          ? estado.direcciones.map((d) =>
              d.id === accion.direccion.id ? accion.direccion : d
            )
          : [...estado.direcciones, accion.direccion],
      }
    }
    case "quitarDireccion":
      return {
        ...estado,
        direcciones: estado.direcciones.filter((d) => d.id !== accion.id),
      }
    case "pedido":
      return { ...estado, pedidos: [accion.pedido, ...estado.pedidos] }
  }
}

/* ---------- Contexto ---------- */

type Tienda = Guardado & {
  listo: boolean
  cantidadCarrito: number
  subtotal: number
  agregar: (
    plantaId: string,
    opciones?: { tamanoId?: string; macetaId?: string; cantidad?: number }
  ) => void
  cambiarCantidad: (clave: string, cantidad: number) => void
  vaciarCarrito: () => void
  alternarFavorito: (id: string) => void
  esFavorito: (id: string) => boolean
  entrar: (usuario: Usuario) => void
  salir: () => void
  guardarDireccion: (direccion: Direccion) => void
  quitarDireccion: (id: string) => void
  registrarPedido: (pedido: Pedido) => void

  panel: Panel
  abrir: (panel: Panel) => void
  seccionCuenta: SeccionCuenta
  setSeccionCuenta: (s: SeccionCuenta) => void
  abrirCuenta: (seccion: SeccionCuenta) => void
  vistaRapida: string | null
  abrirVistaRapida: (id: string | null) => void

  filtros: Filtros
  setFiltros: (f: Filtros) => void
  orden: Orden
  setOrden: (o: Orden) => void
  /** Aplica filtros y baja hasta el catálogo. */
  irAlCatalogo: (f?: Partial<Filtros>) => void

  aviso: { id: number; texto: string } | null
  avisar: (texto: string) => void
}

const Contexto = createContext<Tienda | null>(null)

export function useTienda() {
  const valor = useContext(Contexto)
  if (!valor) throw new Error("useTienda va dentro de <ProveedorTienda>")
  return valor
}

export function ProveedorTienda({ children }: { children: React.ReactNode }) {
  const [datos, despachar] = useReducer(reductor, vacio)
  const [listo, setListo] = useState(false)
  const [panel, setPanel] = useState<Panel>(null)
  const [seccionCuenta, setSeccionCuenta] = useState<SeccionCuenta>("datos")
  const [vistaRapida, setVistaRapida] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<Filtros>(filtrosVacios)
  const [orden, setOrden] = useState<Orden>("destacadas")
  const [aviso, setAviso] = useState<Tienda["aviso"]>(null)
  const contadorAviso = useRef(0)

  // Leer lo guardado después de hidratar, para que el HTML del servidor y el
  // primer render del cliente coincidan.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      despachar({ tipo: "cargar", datos: leerGuardado() })
      setListo(true)
    })
    return () => window.cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (listo) escribirGuardado(datos)
  }, [datos, listo])

  useEffect(() => {
    if (!aviso) return
    const t = window.setTimeout(() => setAviso(null), 2600)
    return () => window.clearTimeout(t)
  }, [aviso])

  const avisar = useCallback((texto: string) => {
    contadorAviso.current += 1
    setAviso({ id: contadorAviso.current, texto })
  }, [])

  const agregar = useCallback<Tienda["agregar"]>(
    (plantaId, opciones = {}) => {
      const planta = buscarPlanta(plantaId)
      if (!planta) return
      despachar({
        tipo: "agregar",
        linea: {
          plantaId,
          tamanoId: opciones.tamanoId ?? planta.tamanos[0].id,
          macetaId: planta.conMaceta
            ? (opciones.macetaId ?? "vivero")
            : "vivero",
          cantidad: opciones.cantidad ?? 1,
        },
      })
      avisar(`${planta.nombre} ya está en tu carrito`)
    },
    [avisar]
  )

  const alternarFavorito = useCallback(
    (id: string) => {
      const planta = buscarPlanta(id)
      const yaEra = datos.favoritos.includes(id)
      despachar({ tipo: "favorito", id })
      if (planta)
        avisar(
          yaEra
            ? `Sacaste ${planta.nombre} de favoritos`
            : `${planta.nombre} se guardó en favoritos`
        )
    },
    [avisar, datos.favoritos]
  )

  const abrirCuenta = useCallback((s: SeccionCuenta) => {
    setSeccionCuenta(s)
    setPanel("cuenta")
  }, [])

  const irAlCatalogo = useCallback((f: Partial<Filtros> = {}) => {
    setFiltros({ ...filtrosVacios, ...f })
    setPanel(null)
    // Esperar a que se cierre cualquier panel (y se libere el scroll).
    window.setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ block: "start" })
    }, 60)
  }, [])

  const valor = useMemo<Tienda>(() => {
    const cantidadCarrito = datos.carrito.reduce((s, l) => s + l.cantidad, 0)
    const subtotal = datos.carrito.reduce((s, l) => {
      const planta = buscarPlanta(l.plantaId)
      return planta
        ? s + precioVariante(planta, l.tamanoId, l.macetaId) * l.cantidad
        : s
    }, 0)
    return {
      ...datos,
      listo,
      cantidadCarrito,
      subtotal,
      agregar,
      cambiarCantidad: (clave, cantidad) =>
        despachar({ tipo: "cantidad", clave, cantidad }),
      vaciarCarrito: () => despachar({ tipo: "vaciar" }),
      alternarFavorito,
      esFavorito: (id) => datos.favoritos.includes(id),
      entrar: (usuario) => despachar({ tipo: "usuario", usuario }),
      salir: () => despachar({ tipo: "usuario", usuario: null }),
      guardarDireccion: (direccion) =>
        despachar({ tipo: "direccion", direccion }),
      quitarDireccion: (id) => despachar({ tipo: "quitarDireccion", id }),
      registrarPedido: (pedido) => despachar({ tipo: "pedido", pedido }),
      panel,
      abrir: setPanel,
      seccionCuenta,
      setSeccionCuenta,
      abrirCuenta,
      vistaRapida,
      abrirVistaRapida: (id) => {
        // Un panel por vez: la vista rápida cierra el cajón que estaba abierto.
        if (id) setPanel(null)
        setVistaRapida(id)
      },
      filtros,
      setFiltros,
      orden,
      setOrden,
      irAlCatalogo,
      aviso,
      avisar,
    }
  }, [
    datos,
    listo,
    agregar,
    alternarFavorito,
    panel,
    seccionCuenta,
    abrirCuenta,
    vistaRapida,
    filtros,
    orden,
    irAlCatalogo,
    aviso,
    avisar,
  ])

  return (
    <Contexto.Provider value={valor}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Contexto.Provider>
  )
}
