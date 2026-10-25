import { fotosVerde } from "@/components/demos/fotos"
import type { Foto } from "@/lib/demo"

/*
 * Datos de la tienda de ejemplo. Precios, ventas y reseñas son inventados.
 * Lo de "apta para mascotas" sigue la lista de plantas tóxicas y no tóxicas
 * de la ASPCA para perros y gatos.
 */

export type CategoriaPlanta = "Interior" | "Exterior" | "Suculentas" | "Huerta"

/** Cuánta luz necesita: de menos a más. */
export type Luz = "poca" | "indirecta" | "mucha" | "sol"

/** Color de fondo de la tarjeta (tokens definidos en verde.css). */
export type ColorPlanta =
  | "lila"
  | "manteca"
  | "rosa"
  | "menta"
  | "cielo"
  | "durazno"

export type Tamano = {
  id: string
  nombre: string
  /** Altura aproximada y maceta, por ejemplo "40 a 50 cm · maceta 14". */
  detalle: string
  precio: number
}

export type Planta = {
  id: string
  nombre: string
  nombreCientifico: string
  categoria: CategoriaPlanta
  cuidado: "Fácil" | "Media" | "Atenta"
  luz: Luz
  /** Frecuencia de riego en palabras. */
  riego: string
  /** 1 = casi nunca, 3 = seguido. Lo usa el quiz. */
  sed: 1 | 2 | 3
  aptaMascotas: boolean
  notaMascotas: string
  /** Unidades vendidas (para ordenar por "más vendidas"). */
  ventas: number
  estrellas: number
  opiniones: number
  descripcion: string
  consejo: string
  /** Etiqueta tipo sticker en la tarjeta. */
  sticker?: string
  tamanos: Tamano[]
  /** Si se puede elegir maceta. Los packs y kits ya vienen con la suya. */
  conMaceta: boolean
  color: ColorPlanta
  foto: Foto
}

export const categoriasPlantas: CategoriaPlanta[] = [
  "Interior",
  "Exterior",
  "Suculentas",
  "Huerta",
]

export const textoCategoria: Record<CategoriaPlanta, string> = {
  Interior: "Para el living, el cuarto o la oficina",
  Exterior: "Balcones, patios y terrazas",
  Suculentas: "Poca agua, mucho sol",
  Huerta: "Aromáticas para cocinar",
}

export const colorCategoria: Record<CategoriaPlanta, ColorPlanta> = {
  Interior: "menta",
  Exterior: "lila",
  Suculentas: "rosa",
  Huerta: "manteca",
}

export const textoLuz: Record<Luz, string> = {
  poca: "Poca luz",
  indirecta: "Luz indirecta",
  mucha: "Mucha luz",
  sol: "Sol directo",
}

export type Maceta = {
  id: string
  nombre: string
  detalle: string
  extra: number
}

export const macetas: Maceta[] = [
  {
    id: "vivero",
    nombre: "De vivero",
    detalle: "Plástica, para pasarla a la tuya",
    extra: 0,
  },
  {
    id: "barro",
    nombre: "Barro",
    detalle: "Terracota natural con plato",
    extra: 190,
  },
  {
    id: "ceramica",
    nombre: "Cerámica",
    detalle: "Esmaltada, en cinco colores",
    extra: 450,
  },
]

export const catalogo: Planta[] = [
  {
    id: "monstera",
    nombre: "Monstera",
    nombreCientifico: "Monstera deliciosa",
    categoria: "Interior",
    cuidado: "Fácil",
    luz: "indirecta",
    riego: "Cada 7 a 10 días",
    sed: 2,
    aptaMascotas: false,
    notaMascotas: "Tóxica si la mastican perros o gatos.",
    ventas: 312,
    estrellas: 4.9,
    opiniones: 128,
    descripcion:
      "La de las hojas con agujeritos. Crece rápido, llena cualquier rincón y perdona si un día te olvidás de regarla.",
    consejo:
      "Limpiale las hojas con un paño húmedo una vez al mes: respira mejor y brilla.",
    sticker: "La de Instagram",
    tamanos: [
      { id: "chica", nombre: "Chica", detalle: "30 a 40 cm · maceta 14", precio: 890 },
      { id: "mediana", nombre: "Mediana", detalle: "50 a 70 cm · maceta 17", precio: 1490 },
      { id: "grande", nombre: "Grande", detalle: "90 a 110 cm · maceta 24", precio: 2690 },
    ],
    conMaceta: true,
    color: "menta",
    foto: fotosVerde.monstera,
  },
  {
    id: "potus",
    nombre: "Potus",
    nombreCientifico: "Epipremnum aureum",
    categoria: "Interior",
    cuidado: "Fácil",
    luz: "poca",
    riego: "Cuando la tierra está seca",
    sed: 1,
    aptaMascotas: false,
    notaMascotas: "Tóxico si lo mastican perros o gatos.",
    ventas: 420,
    estrellas: 4.8,
    opiniones: 211,
    descripcion:
      "Cuelga, trepa y aguanta todo. La planta ideal para arrancar: si tiene sed, te avisa bajando las hojas.",
    consejo: "Si ves las hojas caídas, regá. Al otro día está de nuevo arriba.",
    sticker: "Imposible de matar",
    tamanos: [
      { id: "chica", nombre: "Chica", detalle: "Maceta 12, ramas de 25 cm", precio: 350 },
      { id: "colgante", nombre: "Colgante", detalle: "Maceta colgante 17, ramas de 60 cm", precio: 590 },
    ],
    conMaceta: true,
    color: "manteca",
    foto: fotosVerde.potus,
  },
  {
    id: "sansevieria",
    nombre: "Lengua de suegra",
    nombreCientifico: "Sansevieria trifasciata",
    categoria: "Interior",
    cuidado: "Fácil",
    luz: "poca",
    riego: "Cada 15 a 20 días",
    sed: 1,
    aptaMascotas: false,
    notaMascotas: "Tóxica si la mastican perros o gatos.",
    ventas: 288,
    estrellas: 4.9,
    opiniones: 97,
    descripcion:
      "Hojas firmes y paradas que viven en un rincón oscuro y con poca agua. Perfecta si viajás seguido.",
    consejo: "El error número uno es regarla de más. Ante la duda, no.",
    sticker: "Para olvidadizos",
    tamanos: [
      { id: "chica", nombre: "Chica", detalle: "35 cm · maceta 14", precio: 620 },
      { id: "mediana", nombre: "Mediana", detalle: "60 cm · maceta 19", precio: 990 },
    ],
    conMaceta: true,
    color: "lila",
    foto: fotosVerde.sansevieria,
  },
  {
    id: "ficus",
    nombre: "Ficus lyrata",
    nombreCientifico: "Ficus lyrata",
    categoria: "Interior",
    cuidado: "Atenta",
    luz: "mucha",
    riego: "Cada 7 días",
    sed: 2,
    aptaMascotas: false,
    notaMascotas: "Tóxico si lo mastican perros o gatos.",
    ventas: 95,
    estrellas: 4.6,
    opiniones: 41,
    descripcion:
      "Hojas enormes con forma de violín. Es la estrella de cualquier living, pero pide un lugar fijo y luminoso.",
    consejo:
      "No lo cambies de lugar: se ofende y pierde hojas por unas semanas.",
    sticker: "Para valientes",
    tamanos: [
      { id: "mediana", nombre: "Mediano", detalle: "70 cm · maceta 19", precio: 1450 },
      { id: "grande", nombre: "Grande", detalle: "1,30 m · maceta 26", precio: 2890 },
    ],
    conMaceta: true,
    color: "cielo",
    foto: fotosVerde.ficus,
  },
  {
    id: "suculentas",
    nombre: "Pack de suculentas",
    nombreCientifico: "Echeveria, Haworthia y Sedum",
    categoria: "Suculentas",
    cuidado: "Fácil",
    luz: "sol",
    riego: "Cada 10 a 15 días",
    sed: 1,
    aptaMascotas: true,
    notaMascotas: "No son tóxicas para perros ni gatos.",
    ventas: 365,
    estrellas: 4.8,
    opiniones: 156,
    descripcion:
      "Tres (o seis) suculentas distintas en macetitas de barro. Ideales para la ventana de la cocina o para regalar.",
    consejo:
      "Regá solo cuando la tierra esté seca del todo, y siempre con poca agua.",
    sticker: "Para regalar",
    tamanos: [
      { id: "tres", nombre: "Pack de 3", detalle: "Macetitas de barro de 8 cm", precio: 480 },
      { id: "seis", nombre: "Pack de 6", detalle: "Macetitas de barro de 8 cm", precio: 890 },
    ],
    conMaceta: false,
    color: "rosa",
    foto: fotosVerde.suculentas,
  },
  {
    id: "cactus",
    nombre: "Cactus columnar",
    nombreCientifico: "Cereus peruvianus",
    categoria: "Suculentas",
    cuidado: "Fácil",
    luz: "sol",
    riego: "Cada 20 días, menos en invierno",
    sed: 1,
    aptaMascotas: true,
    notaMascotas: "No es tóxico, pero ojo con las espinas.",
    ventas: 140,
    estrellas: 4.7,
    opiniones: 52,
    descripcion:
      "Crece derechito como una columna y casi no pide nada. Un toque desértico para el balcón o la ventana con sol.",
    consejo:
      "Para moverlo, envolvelo con un diario doblado: las espinas no perdonan.",
    tamanos: [
      { id: "chico", nombre: "Chico", detalle: "25 cm · maceta 12", precio: 420 },
      { id: "mediano", nombre: "Mediano", detalle: "50 cm · maceta 17", precio: 790 },
    ],
    conMaceta: true,
    color: "durazno",
    foto: fotosVerde.cactus,
  },
  {
    id: "lavanda",
    nombre: "Lavanda",
    nombreCientifico: "Lavandula angustifolia",
    categoria: "Exterior",
    cuidado: "Fácil",
    luz: "sol",
    riego: "Dos veces por semana en verano",
    sed: 2,
    aptaMascotas: false,
    notaMascotas: "Levemente tóxica para perros y gatos.",
    ventas: 180,
    estrellas: 4.8,
    opiniones: 63,
    descripcion:
      "Perfuma el balcón, atrae abejas y florece en primavera y verano. Le encanta el sol y el viento.",
    consejo:
      "Cortá las flores secas a fin de verano y vuelve a brotar con más fuerza.",
    tamanos: [
      { id: "una", nombre: "Una planta", detalle: "30 cm · maceta 14", precio: 390 },
      { id: "trio", nombre: "Trío", detalle: "Tres plantas · maceta 14", precio: 990 },
    ],
    conMaceta: true,
    color: "lila",
    foto: fotosVerde.lavanda,
  },
  {
    id: "helecho",
    nombre: "Helecho serrucho",
    nombreCientifico: "Nephrolepis exaltata",
    categoria: "Exterior",
    cuidado: "Media",
    luz: "poca",
    riego: "Tierra siempre húmeda",
    sed: 3,
    aptaMascotas: true,
    notaMascotas: "No es tóxico para perros ni gatos.",
    ventas: 160,
    estrellas: 4.6,
    opiniones: 48,
    descripcion:
      "Frondoso y colgante, para patios con sombra o el baño con ventana. Le gusta la humedad y la media luz.",
    consejo:
      "Pulverizale agua en las hojas los días de calor: lo agradece al toque.",
    sticker: "Pet friendly",
    tamanos: [
      { id: "mediano", nombre: "Mediano", detalle: "Maceta 17", precio: 540 },
      { id: "colgante", nombre: "Colgante", detalle: "Maceta colgante 21", precio: 790 },
    ],
    conMaceta: true,
    color: "menta",
    foto: fotosVerde.helecho,
  },
  {
    id: "palo",
    nombre: "Palo de agua",
    nombreCientifico: "Dracaena fragrans",
    categoria: "Interior",
    cuidado: "Fácil",
    luz: "poca",
    riego: "Cada 10 días",
    sed: 2,
    aptaMascotas: false,
    notaMascotas: "Tóxico si lo mastican perros o gatos.",
    ventas: 210,
    estrellas: 4.7,
    opiniones: 74,
    descripcion:
      "Un tronco con penachos de hojas verdes y amarillas. Da altura sin ocupar lugar y aguanta los rincones con poca luz.",
    consejo:
      "Si se le secan las puntas, regá con agua que haya reposado una noche.",
    tamanos: [
      { id: "mediano", nombre: "Mediano", detalle: "80 cm · maceta 19", precio: 980 },
      { id: "grande", nombre: "Grande", detalle: "1,40 m · maceta 26", precio: 1890 },
    ],
    conMaceta: true,
    color: "manteca",
    foto: fotosVerde.palo,
  },
  {
    id: "huerta",
    nombre: "Kit de aromáticas",
    nombreCientifico: "Albahaca, perejil y ciboulette",
    categoria: "Huerta",
    cuidado: "Media",
    luz: "sol",
    riego: "Día por medio en verano",
    sed: 3,
    aptaMascotas: false,
    notaMascotas: "El perejil y la ciboulette son tóxicos para perros y gatos.",
    ventas: 230,
    estrellas: 4.7,
    opiniones: 89,
    descripcion:
      "Tu primera huerta en el balcón: plantines listos para cosechar, sustrato y un cajón de madera.",
    consejo:
      "Cortá siempre desde arriba: la planta se ramifica y te da más hojas.",
    sticker: "Huerta en casa",
    tamanos: [
      { id: "tres", nombre: "Kit de 3", detalle: "Cajón de 40 cm", precio: 750 },
      { id: "seis", nombre: "Kit de 6", detalle: "Cajón de 60 cm, suma tomillo, menta y orégano", precio: 1290 },
    ],
    conMaceta: false,
    color: "durazno",
    foto: fotosVerde.huerta,
  },
]

export function buscarPlanta(id: string) {
  return catalogo.find((p) => p.id === id)
}

export function precioDesde(planta: Planta) {
  return Math.min(...planta.tamanos.map((t) => t.precio))
}

/** Precio final de una variante: tamaño + maceta. */
export function precioVariante(
  planta: Planta,
  tamanoId: string,
  macetaId: string
) {
  const tamano =
    planta.tamanos.find((t) => t.id === tamanoId) ?? planta.tamanos[0]
  const maceta = planta.conMaceta
    ? (macetas.find((m) => m.id === macetaId) ?? macetas[0])
    : macetas[0]
  return tamano.precio + maceta.extra
}

export function textoVariante(
  planta: Planta,
  tamanoId: string,
  macetaId: string,
  colorNombre?: string
) {
  const tamano =
    planta.tamanos.find((t) => t.id === tamanoId) ?? planta.tamanos[0]
  if (!planta.conMaceta) return tamano.nombre
  const maceta = macetas.find((m) => m.id === macetaId) ?? macetas[0]
  const color = macetaId === "ceramica" && colorNombre ? ` ${colorNombre.toLowerCase()}` : ""
  return `${tamano.nombre} · maceta ${maceta.nombre.toLowerCase()}${color}`
}

/** Saca tildes y mayúsculas para buscar. */
export function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
}

export type Envio = {
  id: string
  nombre: string
  detalle: string
  costo: number
  /** Monto a partir del cual el envío es gratis (0 = nunca). */
  gratisDesde: number
}

export const envios: Envio[] = [
  {
    id: "retiro",
    nombre: "Retiro en el vivero",
    detalle: "Camino Carrasco 5120, de 9 a 18",
    costo: 0,
    gratisDesde: 0,
  },
  {
    id: "mvd",
    nombre: "Montevideo",
    detalle: "En el día si comprás antes de las 14",
    costo: 190,
    gratisDesde: 2500,
  },
  {
    id: "costa",
    nombre: "Ciudad de la Costa",
    detalle: "24 a 48 horas",
    costo: 290,
    gratisDesde: 3500,
  },
  {
    id: "interior",
    nombre: "Resto del país",
    detalle: "Por agencia, 2 a 4 días",
    costo: 390,
    gratisDesde: 0,
  },
]

/** Monto para envío gratis en Montevideo (el que se muestra en el anuncio). */
export const ENVIO_GRATIS =
  envios.find((e) => e.id === "mvd")?.gratisDesde ?? 2500

export function costoEnvio(envio: Envio, subtotal: number) {
  if (envio.gratisDesde > 0 && subtotal >= envio.gratisDesde) return 0
  return envio.costo
}

/** Descuento por pagar con transferencia. */
export const DESCUENTO_TRANSFERENCIA = 0.05

export type Resena = {
  nombre: string
  barrio: string
  plantaId: string
  estrellas: number
  texto: string
  fecha: string
}

export const resenas: Resena[] = [
  {
    nombre: "Camila R.",
    barrio: "Pocitos",
    plantaId: "monstera",
    estrellas: 5,
    texto:
      "Llegó el mismo día, re bien embalada y con una tarjetita de cuidados. Ya le salió una hoja nueva.",
    fecha: "hace 2 semanas",
  },
  {
    nombre: "Joaquín M.",
    barrio: "Cordón",
    plantaId: "sansevieria",
    estrellas: 5,
    texto:
      "Mato todo lo que toco y esta sigue viva hace cuatro meses. Hice el quiz y le pegó.",
    fecha: "hace 1 mes",
  },
  {
    nombre: "Flor B.",
    barrio: "Parque Batlle",
    plantaId: "helecho",
    estrellas: 5,
    texto:
      "Tengo dos gatos y quería algo que no les hiciera mal. Me encantó que lo aclaren en cada planta.",
    fecha: "hace 3 semanas",
  },
  {
    nombre: "Agus P.",
    barrio: "Ciudad de la Costa",
    plantaId: "suculentas",
    estrellas: 4,
    texto:
      "Las compré para regalar y quedaron divinas. Tardó un día más por la zona, pero me avisaron por WhatsApp.",
    fecha: "hace 2 meses",
  },
  {
    nombre: "Sofi L.",
    barrio: "Malvín",
    plantaId: "huerta",
    estrellas: 5,
    texto:
      "Ya cociné tres veces con la albahaca. El cajón es lindo de verdad, no parece de plástico.",
    fecha: "hace 5 días",
  },
  {
    nombre: "Nico G.",
    barrio: "Centro",
    plantaId: "potus",
    estrellas: 5,
    texto:
      "Pagué en 3 cuotas con Mercado Pago y en dos horas lo tenía en la oficina. Atención de diez.",
    fecha: "hace 1 semana",
  },
]
