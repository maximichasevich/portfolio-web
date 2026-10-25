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
import { useRouter } from "next/navigation"
import { MotionConfig } from "motion/react"

import { pesos } from "@/lib/demo"
import {
  buscarPlanta,
  precioVariante,
  type CategoriaPlanta,
} from "@/components/demos/verde/catalogo"
import {
  PUNTOS_CANJE,
  buscarCupon,
  descuentoDeCupon,
  diasDeRiego,
  primerTamanoDisponible,
  puntosDe,
  stockDe,
  type Cupon,
} from "@/components/demos/verde/extras"
import { volarAlCarrito } from "@/components/demos/verde/efectos"

/* ---------- Tipos ---------- */

export type LineaCarrito = {
  clave: string
  plantaId: string
  tamanoId: string
  macetaId: string
  /** Color de la maceta de cerámica. */
  colorId?: string
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
  cupon?: string
  descuentoCupon?: number
  envoltorio?: number
  regalo?: { para: string; mensaje: string } | null
  puntos?: number
  plantaIds?: string[]
}

export type MiPlanta = {
  id: string
  plantaId: string
  apodo: string
  cadaDias: number
  /** Fecha del último riego (ms). */
  ultimoRiego: number
}

export type AvisoStock = { plantaId: string; tamanoId: string; email: string }

export type Suscripcion = {
  planId: string
  desde: string
  pausada: boolean
}

export type ResenaPropia = {
  plantaId: string
  nombre: string
  estrellas: number
  texto: string
  fecha: string
}

export type PreguntaPropia = { plantaId: string; pregunta: string; fecha: string }

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
  | "comparar"
  | null

export type SeccionCuenta =
  | "datos"
  | "direcciones"
  | "pedidos"
  | "plantas"
  | "club"

export const filtrosVacios: Filtros = {
  categoria: null,
  mascotas: false,
  pocaLuz: false,
  facil: false,
  texto: "",
}

/** Ruta de la portada de la tienda. */
/** Ruta base de la tienda: el sitio vive en la raíz de su dominio. */
export const RUTA = ""

export function rutaPlanta(id: string) {
  return `${RUTA}/planta/${id}`
}

/* ---------- Datos guardados (localStorage) ---------- */

type Guardado = {
  carrito: LineaCarrito[]
  favoritos: string[]
  usuario: Usuario | null
  direcciones: Direccion[]
  pedidos: Pedido[]
  cupon: string | null
  cuponesPropios: string[]
  puntosCanjeados: number
  vistos: string[]
  misPlantas: MiPlanta[]
  avisosStock: AvisoStock[]
  suscripcion: Suscripcion | null
  resenasPropias: ResenaPropia[]
  preguntasPropias: PreguntaPropia[]
  comparar: string[]
  /** Pausa las animaciones continuas (brisa, giro automático). */
  pausado: boolean
}

const vacio: Guardado = {
  carrito: [],
  favoritos: [],
  usuario: null,
  direcciones: [],
  pedidos: [],
  cupon: null,
  cuponesPropios: [],
  puntosCanjeados: 0,
  vistos: [],
  misPlantas: [],
  avisosStock: [],
  suscripcion: null,
  resenasPropias: [],
  preguntasPropias: [],
  comparar: [],
  pausado: false,
}

const CLAVE = "verde-tienda:v1"

function lista<T>(valor: unknown, filtro?: (x: T) => boolean): T[] {
  if (!Array.isArray(valor)) return []
  return filtro ? (valor as T[]).filter(filtro) : (valor as T[])
}

function leerGuardado(): Guardado {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return vacio
    const datos = JSON.parse(crudo) as Partial<Guardado>
    const existe = (id: string) => !!buscarPlanta(id)
    return {
      carrito: lista<LineaCarrito>(datos.carrito, (l) => existe(l.plantaId)),
      favoritos: lista<string>(datos.favoritos, existe),
      usuario: datos.usuario ?? null,
      direcciones: lista<Direccion>(datos.direcciones),
      pedidos: lista<Pedido>(datos.pedidos),
      cupon: typeof datos.cupon === "string" ? datos.cupon : null,
      cuponesPropios: lista<string>(datos.cuponesPropios),
      puntosCanjeados: Number(datos.puntosCanjeados) || 0,
      vistos: lista<string>(datos.vistos, existe),
      misPlantas: lista<MiPlanta>(datos.misPlantas, (p) => existe(p.plantaId)),
      avisosStock: lista<AvisoStock>(datos.avisosStock),
      suscripcion: datos.suscripcion ?? null,
      resenasPropias: lista<ResenaPropia>(datos.resenasPropias),
      preguntasPropias: lista<PreguntaPropia>(datos.preguntasPropias),
      comparar: lista<string>(datos.comparar, existe).slice(0, 3),
      pausado: datos.pausado === true,
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
  | { tipo: "cupon"; codigo: string | null }
  | { tipo: "canje"; codigo: string }
  | { tipo: "visto"; id: string }
  | { tipo: "miPlanta"; planta: MiPlanta }
  | { tipo: "quitarMiPlanta"; id: string }
  | { tipo: "regar"; id: string; cuando: number }
  | { tipo: "avisoStock"; aviso: AvisoStock }
  | { tipo: "suscripcion"; suscripcion: Suscripcion | null }
  | { tipo: "resena"; resena: ResenaPropia }
  | { tipo: "pregunta"; pregunta: PreguntaPropia }
  | { tipo: "comparar"; id: string }
  | { tipo: "limpiarComparar" }
  | { tipo: "pausar"; pausado: boolean }

function reductor(estado: Guardado, accion: Accion): Guardado {
  switch (accion.tipo) {
    case "cargar":
      return accion.datos
    case "agregar": {
      const { plantaId, tamanoId, macetaId, colorId, cantidad } = accion.linea
      const clave = `${plantaId}|${tamanoId}|${macetaId}${colorId ? `|${colorId}` : ""}`
      const tope = Math.min(20, stockDe(plantaId, tamanoId))
      const existe = estado.carrito.find((l) => l.clave === clave)
      const carrito = existe
        ? estado.carrito.map((l) =>
            l.clave === clave
              ? { ...l, cantidad: Math.min(tope, l.cantidad + cantidad) }
              : l
          )
        : [
            ...estado.carrito,
            {
              clave,
              plantaId,
              tamanoId,
              macetaId,
              ...(colorId ? { colorId } : {}),
              cantidad: Math.min(tope, cantidad),
            },
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
                  ? {
                      ...l,
                      cantidad: Math.min(
                        20,
                        stockDe(l.plantaId, l.tamanoId),
                        accion.cantidad
                      ),
                    }
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
    case "pedido": {
      // Las plantas compradas se suman a "Mis plantas" con su recordatorio.
      const fecha = new Date(accion.pedido.fecha).getTime()
      const nuevas = (accion.pedido.plantaIds ?? [])
        .filter((id) => !estado.misPlantas.some((m) => m.plantaId === id))
        .map((id) => ({
          id: `mp-${id}-${fecha}`,
          plantaId: id,
          apodo: buscarPlanta(id)?.nombre ?? "Mi planta",
          cadaDias: diasDeRiego(id),
          ultimoRiego: fecha,
        }))
      return {
        ...estado,
        pedidos: [accion.pedido, ...estado.pedidos],
        cupon: null,
        misPlantas: [...estado.misPlantas, ...nuevas],
      }
    }
    case "cupon":
      return { ...estado, cupon: accion.codigo }
    case "canje":
      return {
        ...estado,
        cuponesPropios: [...estado.cuponesPropios, accion.codigo],
        puntosCanjeados: estado.puntosCanjeados + PUNTOS_CANJE,
        cupon: accion.codigo,
      }
    case "visto":
      return {
        ...estado,
        vistos: [accion.id, ...estado.vistos.filter((v) => v !== accion.id)].slice(0, 8),
      }
    case "miPlanta":
      return { ...estado, misPlantas: [...estado.misPlantas, accion.planta] }
    case "quitarMiPlanta":
      return {
        ...estado,
        misPlantas: estado.misPlantas.filter((m) => m.id !== accion.id),
      }
    case "regar":
      return {
        ...estado,
        misPlantas: estado.misPlantas.map((m) =>
          m.id === accion.id ? { ...m, ultimoRiego: accion.cuando } : m
        ),
      }
    case "avisoStock":
      return {
        ...estado,
        avisosStock: [
          ...estado.avisosStock.filter(
            (a) =>
              !(
                a.plantaId === accion.aviso.plantaId &&
                a.tamanoId === accion.aviso.tamanoId
              )
          ),
          accion.aviso,
        ],
      }
    case "suscripcion":
      return { ...estado, suscripcion: accion.suscripcion }
    case "resena":
      return { ...estado, resenasPropias: [accion.resena, ...estado.resenasPropias] }
    case "pregunta":
      return {
        ...estado,
        preguntasPropias: [accion.pregunta, ...estado.preguntasPropias],
      }
    case "comparar":
      return {
        ...estado,
        comparar: estado.comparar.includes(accion.id)
          ? estado.comparar.filter((c) => c !== accion.id)
          : [...estado.comparar, accion.id].slice(-3),
      }
    case "limpiarComparar":
      return { ...estado, comparar: [] }
    case "pausar":
      return { ...estado, pausado: accion.pausado }
  }
}

/* ---------- Contexto ---------- */

type Tienda = Guardado & {
  listo: boolean
  cantidadCarrito: number
  subtotal: number
  /** Cupón aplicado, si es válido para el carrito actual. */
  cuponActivo: Cupon | undefined
  /** Mensaje si el cupón guardado no aplica (por ejemplo, falta monto). */
  avisoCupon: string | null
  descuentoCupon: number
  aplicarCupon: (codigo: string) => { ok: boolean; mensaje: string }
  quitarCupon: () => void
  puntosGanados: number
  puntosDisponibles: number
  canjearPuntos: () => string | null
  agregar: (
    plantaId: string,
    opciones?: {
      tamanoId?: string
      macetaId?: string
      colorId?: string
      cantidad?: number
      /** Elemento desde donde "vuela" la planta al carrito. */
      origen?: Element | null
      silencioso?: boolean
    }
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
  registrarVisto: (id: string) => void
  agregarMiPlanta: (plantaId: string, apodo?: string) => void
  quitarMiPlanta: (id: string) => void
  regar: (id: string) => void
  pedirAvisoStock: (aviso: AvisoStock) => void
  suscribir: (planId: string | null) => void
  pausarSuscripcion: (pausada: boolean) => void
  publicarResena: (r: ResenaPropia) => void
  publicarPregunta: (p: PreguntaPropia) => void
  alternarComparar: (id: string) => void
  limpiarComparar: () => void
  pausar: (pausado: boolean) => void

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
  const router = useRouter()

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

  // El portfolio usa scroll suave: este dato le pide a Next que no lo use al
  // navegar entre la portada y las fichas (si no, avisa en la consola).
  useEffect(() => {
    const raiz = document.documentElement
    const antes = raiz.dataset.scrollBehavior
    raiz.dataset.scrollBehavior = "smooth"
    return () => {
      if (antes === undefined) delete raiz.dataset.scrollBehavior
      else raiz.dataset.scrollBehavior = antes
    }
  }, [])

  // Pausa global de animaciones continuas: el CSS y los bucles leen este dato.
  useEffect(() => {
    const raiz = document.documentElement
    if (datos.pausado) raiz.dataset.vtQuieto = "true"
    else delete raiz.dataset.vtQuieto
    return () => {
      delete raiz.dataset.vtQuieto
    }
  }, [datos.pausado])

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
      const tamanoId = opciones.tamanoId ?? primerTamanoDisponible(planta).id
      const stock = stockDe(plantaId, tamanoId)
      if (stock <= 0) {
        avisar("Ese tamaño está sin stock por ahora")
        return
      }
      const macetaId = planta.conMaceta ? (opciones.macetaId ?? "vivero") : "vivero"
      const colorId =
        macetaId === "ceramica" ? (opciones.colorId ?? "blanco") : undefined
      const yaHay = datos.carrito
        .filter((l) => l.plantaId === plantaId && l.tamanoId === tamanoId)
        .reduce((s, l) => s + l.cantidad, 0)
      if (yaHay >= stock) {
        avisar(`No quedan más de ese tamaño: ya tenés ${yaHay} en el carrito`)
        return
      }
      despachar({
        tipo: "agregar",
        linea: {
          plantaId,
          tamanoId,
          macetaId,
          colorId,
          cantidad: Math.min(opciones.cantidad ?? 1, stock - yaHay),
        },
      })
      volarAlCarrito(opciones.origen, planta.foto.src)
      if (!opciones.silencioso) avisar(`${planta.nombre} ya está en tu carrito`)
    },
    [avisar, datos.carrito]
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

  const irAlCatalogo = useCallback(
    (f: Partial<Filtros> = {}) => {
      setFiltros({ ...filtrosVacios, ...f })
      setPanel(null)
      setVistaRapida(null)
      // En la ficha de producto no hay catálogo: volver a la portada.
      if (!document.getElementById("catalogo")) {
        router.push(`${RUTA}/#catalogo`)
        return
      }
      // Esperar a que se cierre cualquier panel (y se libere el scroll).
      window.setTimeout(() => {
        document.getElementById("catalogo")?.scrollIntoView({ block: "start" })
      }, 60)
    },
    [router]
  )

  const aplicarCupon = useCallback<Tienda["aplicarCupon"]>(
    (codigo) => {
      const limpio = codigo.trim().toUpperCase()
      if (!limpio) return { ok: false, mensaje: "Escribí un código." }
      const cupon = buscarCupon(limpio, datos.cuponesPropios)
      if (!cupon)
        return {
          ok: false,
          mensaje: "Ese código no existe. Probá con PRIMERAPLANTA.",
        }
      if (cupon.primeraCompra && datos.pedidos.length > 0)
        return { ok: false, mensaje: "Ese código es solo para tu primera compra." }
      despachar({ tipo: "cupon", codigo: cupon.codigo })
      return { ok: true, mensaje: `¡Listo! ${cupon.titulo}.` }
    },
    [datos.cuponesPropios, datos.pedidos.length]
  )

  const valor = useMemo<Tienda>(() => {
    const cantidadCarrito = datos.carrito.reduce((s, l) => s + l.cantidad, 0)
    const subtotal = datos.carrito.reduce((s, l) => {
      const planta = buscarPlanta(l.plantaId)
      return planta
        ? s + precioVariante(planta, l.tamanoId, l.macetaId) * l.cantidad
        : s
    }, 0)
    const cupon = datos.cupon
      ? buscarCupon(datos.cupon, datos.cuponesPropios)
      : undefined
    const faltaMonto = cupon ? subtotal < cupon.minimo : false
    const puntosGanados = datos.pedidos.reduce(
      (s, p) => s + (p.puntos ?? puntosDe(p.total)),
      0
    )
    const puntosDisponibles = Math.max(0, puntosGanados - datos.puntosCanjeados)
    return {
      ...datos,
      listo,
      cantidadCarrito,
      subtotal,
      cuponActivo: cupon && !faltaMonto ? cupon : undefined,
      avisoCupon:
        cupon && faltaMonto
          ? `El código ${cupon.codigo} vale para compras desde ${pesos(cupon.minimo)}.`
          : null,
      descuentoCupon: descuentoDeCupon(cupon, subtotal),
      aplicarCupon,
      quitarCupon: () => despachar({ tipo: "cupon", codigo: null }),
      puntosGanados,
      puntosDisponibles,
      canjearPuntos: () => {
        if (puntosDisponibles < PUNTOS_CANJE) return null
        const codigo = `CLUB-${1000 + (datos.cuponesPropios.length + 1) * 37}`
        despachar({ tipo: "canje", codigo })
        return codigo
      },
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
      registrarVisto: (id) => despachar({ tipo: "visto", id }),
      agregarMiPlanta: (plantaId, apodo) => {
        const planta = buscarPlanta(plantaId)
        if (!planta) return
        const cuando = Date.now()
        despachar({
          tipo: "miPlanta",
          planta: {
            id: `mp-${plantaId}-${cuando}`,
            plantaId,
            apodo: apodo?.trim() || planta.nombre,
            cadaDias: diasDeRiego(plantaId),
            ultimoRiego: cuando,
          },
        })
      },
      quitarMiPlanta: (id) => despachar({ tipo: "quitarMiPlanta", id }),
      regar: (id) => despachar({ tipo: "regar", id, cuando: Date.now() }),
      pedirAvisoStock: (aviso) => despachar({ tipo: "avisoStock", aviso }),
      suscribir: (planId) =>
        despachar({
          tipo: "suscripcion",
          suscripcion: planId
            ? { planId, desde: new Date().toISOString(), pausada: false }
            : null,
        }),
      pausarSuscripcion: (pausada) => {
        if (datos.suscripcion)
          despachar({
            tipo: "suscripcion",
            suscripcion: { ...datos.suscripcion, pausada },
          })
      },
      publicarResena: (resena) => despachar({ tipo: "resena", resena }),
      publicarPregunta: (pregunta) => despachar({ tipo: "pregunta", pregunta }),
      alternarComparar: (id) => despachar({ tipo: "comparar", id }),
      limpiarComparar: () => despachar({ tipo: "limpiarComparar" }),
      pausar: (pausado) => despachar({ tipo: "pausar", pausado }),
      panel,
      abrir: setPanel,
      seccionCuenta,
      setSeccionCuenta,
      abrirCuenta,
      vistaRapida,
      abrirVistaRapida: (id) => {
        // Un panel por vez: la vista rápida cierra el cajón que estaba abierto.
        if (id) {
          setPanel(null)
          despachar({ tipo: "visto", id })
        }
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
    aplicarCupon,
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

/**
 * Hora actual que se actualiza cada `cada` ms. Devuelve null en el primer
 * render (servidor e hidratación) para no desfasar el HTML.
 */
export function useAhora(cada = 30000) {
  const [ahora, setAhora] = useState<number | null>(null)
  useEffect(() => {
    const primero = window.requestAnimationFrame(() => setAhora(Date.now()))
    const t = window.setInterval(() => setAhora(Date.now()), cada)
    return () => {
      window.cancelAnimationFrame(primero)
      window.clearInterval(t)
    }
  }, [cada])
  return ahora
}
