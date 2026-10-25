import {
  buscarPlanta,
  catalogo,
  costoEnvio,
  type Envio,
  type Luz,
  type Planta,
} from "@/components/demos/verde/catalogo"

/*
 * Datos extra de la tienda de ejemplo: stock, riego en días, colores de
 * maceta, cupones, reseñas y preguntas por planta, planes del club y puntos.
 * Todo es ficticio.
 */

/* ---------- Stock por tamaño ---------- */

/** Unidades disponibles por planta y tamaño. Lo que no figura tiene 30. */
const stockBase: Record<string, Record<string, number>> = {
  monstera: { grande: 3 },
  ficus: { mediana: 4, grande: 0 },
  helecho: { colgante: 0 },
  lavanda: { trio: 2 },
  palo: { grande: 5 },
  cactus: { mediano: 6 },
}

export function stockDe(plantaId: string, tamanoId: string) {
  return stockBase[plantaId]?.[tamanoId] ?? 30
}

/** El stock más bajo entre los tamaños con stock (para el sticker "quedan"). */
export function stockBajo(planta: Planta) {
  const cantidades = planta.tamanos
    .map((t) => stockDe(planta.id, t.id))
    .filter((n) => n > 0 && n <= 5)
  return cantidades.length ? Math.min(...cantidades) : null
}

export function sinStock(plantaId: string, tamanoId: string) {
  return stockDe(plantaId, tamanoId) <= 0
}

/** Primer tamaño que se puede comprar. */
export function primerTamanoDisponible(planta: Planta) {
  return (
    planta.tamanos.find((t) => !sinStock(planta.id, t.id)) ?? planta.tamanos[0]
  )
}

/* ---------- Riego ---------- */

/** Cada cuántos días se riega, para el calendario y los recordatorios. */
export const cadaDias: Record<string, number> = {
  monstera: 8,
  potus: 7,
  sansevieria: 18,
  ficus: 7,
  suculentas: 12,
  cactus: 20,
  lavanda: 4,
  helecho: 3,
  palo: 10,
  huerta: 2,
}

export function diasDeRiego(plantaId: string) {
  return cadaDias[plantaId] ?? 7
}

/* ---------- Colores de la maceta de cerámica ---------- */

export type ColorMaceta = {
  id: string
  nombre: string
  /** Color del esmalte. */
  hex: string
  /** Un tono más oscuro para bordes y sombras. */
  sombra: string
}

export const coloresCeramica: ColorMaceta[] = [
  { id: "blanco", nombre: "Blanco", hex: "#f7f1e6", sombra: "#d8cdb8" },
  { id: "menta", nombre: "Menta", hex: "#8fd8b0", sombra: "#5fb388" },
  { id: "rosa", nombre: "Rosa", hex: "#ff9fc0", sombra: "#e2789d" },
  { id: "lila", nombre: "Lila", hex: "#b6a3ff", sombra: "#8d78e0" },
  { id: "manteca", nombre: "Manteca", hex: "#ffd84d", sombra: "#e0b520" },
]

export function buscarColor(id?: string) {
  return coloresCeramica.find((c) => c.id === id) ?? coloresCeramica[0]
}

/* ---------- Cupones ---------- */

export type Cupon = {
  codigo: string
  titulo: string
  tipo: "porcentaje" | "monto" | "envio"
  valor: number
  /** Subtotal mínimo para usarlo. */
  minimo: number
  /** Solo si todavía no hay pedidos. */
  primeraCompra?: boolean
}

export const cupones: Cupon[] = [
  {
    codigo: "PRIMERAPLANTA",
    titulo: "10% en tu primera compra",
    tipo: "porcentaje",
    valor: 0.1,
    minimo: 0,
    primeraCompra: true,
  },
  {
    codigo: "HOLAVERDE",
    titulo: "10% del club verde",
    tipo: "porcentaje",
    valor: 0.1,
    minimo: 0,
  },
  {
    codigo: "ENVIOGRATIS",
    titulo: "Envío gratis",
    tipo: "envio",
    valor: 0,
    minimo: 1500,
  },
  {
    codigo: "VERDE500",
    titulo: "$ 500 menos",
    tipo: "monto",
    valor: 500,
    minimo: 3000,
  },
]

/** Cupones que se generan al canjear puntos ("CLUB-XXXX"). */
export const VALOR_CANJE = 250
export const PUNTOS_CANJE = 500

export function cuponDeCanje(codigo: string): Cupon {
  return {
    codigo,
    titulo: `$ ${VALOR_CANJE} por tus puntos`,
    tipo: "monto",
    valor: VALOR_CANJE,
    minimo: 0,
  }
}

export function buscarCupon(codigo: string, propios: string[]) {
  const c = codigo.trim().toUpperCase().replace(/\s+/g, "")
  if (propios.includes(c)) return cuponDeCanje(c)
  return cupones.find((x) => x.codigo === c)
}

/** Descuento en pesos sobre el subtotal (los de envío se calculan aparte). */
export function descuentoDeCupon(cupon: Cupon | undefined, subtotal: number) {
  if (!cupon || subtotal < cupon.minimo) return 0
  if (cupon.tipo === "porcentaje") return Math.round(subtotal * cupon.valor)
  if (cupon.tipo === "monto") return Math.min(cupon.valor, subtotal)
  return 0
}

/** Costo de envío teniendo en cuenta un cupón de envío gratis. */
export function envioConCupon(
  envio: Envio,
  subtotal: number,
  cupon: Cupon | undefined
) {
  if (
    cupon?.tipo === "envio" &&
    subtotal >= cupon.minimo &&
    (envio.id === "mvd" || envio.id === "costa")
  )
    return 0
  return costoEnvio(envio, subtotal)
}

/* ---------- Regalo ---------- */

export const COSTO_ENVOLTORIO = 120

/* ---------- Puntos del club ---------- */

/** Un punto cada $ 10 gastados. */
export function puntosDe(total: number) {
  return Math.floor(total / 10)
}

export const niveles = [
  { nombre: "Brote", desde: 0, color: "menta" },
  { nombre: "Hoja", desde: 300, color: "manteca" },
  { nombre: "Selva", desde: 1200, color: "lila" },
] as const

export function nivelDe(puntosTotales: number) {
  let actual: (typeof niveles)[number] = niveles[0]
  for (const n of niveles) if (puntosTotales >= n.desde) actual = n
  const siguiente = niveles.find((n) => n.desde > puntosTotales)
  return { actual, siguiente }
}

/* ---------- Club de plantas (suscripción) ---------- */

export type Plan = {
  id: string
  nombre: string
  precio: number
  trae: string
  detalle: string[]
  color: "menta" | "lila" | "durazno"
  plantaId: string
}

export const planes: Plan[] = [
  {
    id: "brote",
    nombre: "Brote",
    precio: 590,
    trae: "1 planta chica sorpresa",
    detalle: ["Fácil de cuidar", "Tarjeta de cuidados", "Envío incluido en Montevideo"],
    color: "menta",
    plantaId: "potus",
  },
  {
    id: "selva",
    nombre: "Selva",
    precio: 1190,
    trae: "2 plantas + maceta de barro",
    detalle: ["Una de interior y una sorpresa", "Maceta de barro con plato", "10% en la tienda"],
    color: "lila",
    plantaId: "monstera",
  },
  {
    id: "huerta",
    nombre: "Huerta",
    precio: 690,
    trae: "3 aromáticas de estación",
    detalle: ["Plantines listos para cosechar", "Receta del mes", "Envío incluido en Montevideo"],
    color: "durazno",
    plantaId: "huerta",
  },
]

export function buscarPlan(id: string) {
  return planes.find((p) => p.id === id)
}

/* ---------- Seguimiento de pedido ---------- */

export const estadosPedido = [
  { id: "confirmado", nombre: "Confirmado", detalle: "Recibimos tu pedido" },
  { id: "preparando", nombre: "Preparando", detalle: "La elegimos y le sacamos una foto" },
  { id: "camino", nombre: "En camino", detalle: "Va en la camioneta verde" },
  { id: "entregado", nombre: "Entregado", detalle: "¡Ya está en su casa nueva!" },
] as const

/**
 * Estado según los minutos desde la compra. En la demo va acelerado: en la
 * tienda real serían horas.
 */
export function estadoDePedido(fechaIso: string, ahora: number | null) {
  if (ahora === null) return 0
  const minutos = (ahora - new Date(fechaIso).getTime()) / 60000
  if (minutos < 1) return 0
  if (minutos < 3) return 1
  if (minutos < 6) return 2
  return 3
}

/* ---------- Medidor de luz ---------- */

export const zonasLuz: {
  luz: Luz
  desde: number
  titulo: string
  sombra: string
  lugar: string
}[] = [
  {
    luz: "poca",
    desde: 0,
    titulo: "Rincón tranquilo",
    sombra: "Casi no hay sombra",
    lugar: "Un pasillo, el baño o lejos de la ventana",
  },
  {
    luz: "indirecta",
    desde: 30,
    titulo: "Luz clarita",
    sombra: "Sombra borrosa",
    lugar: "A uno o dos metros de una ventana",
  },
  {
    luz: "mucha",
    desde: 55,
    titulo: "Muy luminoso",
    sombra: "Sombra marcada pero suave",
    lugar: "Al lado de una ventana grande",
  },
  {
    luz: "sol",
    desde: 80,
    titulo: "Sol directo",
    sombra: "Sombra nítida",
    lugar: "Balcón, terraza o ventana al norte",
  },
]

export function zonaDeLuz(valor: number) {
  let z = zonasLuz[0]
  for (const zona of zonasLuz) if (valor >= zona.desde) z = zona
  return z
}

const ordenLuz: Luz[] = ["poca", "indirecta", "mucha", "sol"]

/** Qué tan bien le va a una planta con cierta luz: 2 ideal, 1 aguanta, 0 no. */
export function afinidadLuz(planta: Planta, luz: Luz) {
  const d = ordenLuz.indexOf(luz) - ordenLuz.indexOf(planta.luz)
  if (d === 0) return 2
  // Un escalón de diferencia: aguanta (las de poca luz andan con luz indirecta).
  if (Math.abs(d) === 1) return 1
  return 0
}

export function plantasParaLuz(luz: Luz) {
  return catalogo
    .map((p) => ({ planta: p, afinidad: afinidadLuz(p, luz) }))
    .filter((x) => x.afinidad > 0)
    .sort((a, b) => b.afinidad - a.afinidad || b.planta.ventas - a.planta.ventas)
}

/* ---------- Comprados juntos ---------- */

const juntos: Record<string, string[]> = {
  monstera: ["potus", "sansevieria"],
  potus: ["helecho", "palo"],
  sansevieria: ["potus", "suculentas"],
  ficus: ["monstera", "palo"],
  suculentas: ["cactus", "lavanda"],
  cactus: ["suculentas", "sansevieria"],
  lavanda: ["huerta", "suculentas"],
  helecho: ["potus", "monstera"],
  palo: ["sansevieria", "potus"],
  huerta: ["lavanda", "suculentas"],
}

export function compradosJuntos(plantaId: string) {
  return (juntos[plantaId] ?? []).flatMap((id) => buscarPlanta(id) ?? [])
}

/* ---------- Reseñas y preguntas por planta ---------- */

export type ResenaPlanta = {
  nombre: string
  barrio: string
  estrellas: number
  texto: string
  fecha: string
  tamano?: string
}

const resenasPorPlanta: Record<string, ResenaPlanta[]> = {
  monstera: [
    { nombre: "Camila R.", barrio: "Pocitos", estrellas: 5, texto: "Llegó el mismo día, re bien embalada y con una tarjetita de cuidados. Ya le salió una hoja nueva.", fecha: "hace 2 semanas", tamano: "Mediana" },
    { nombre: "Martín S.", barrio: "Buceo", estrellas: 5, texto: "Más linda que en la foto. La puse al lado de la ventana del living y está feliz.", fecha: "hace 1 mes", tamano: "Grande" },
    { nombre: "Valen D.", barrio: "Prado", estrellas: 4, texto: "Hermosa, aunque la chica es bastante chica. Igual crece rápido.", fecha: "hace 2 meses", tamano: "Chica" },
  ],
  potus: [
    { nombre: "Nico G.", barrio: "Centro", estrellas: 5, texto: "Pagué en 3 cuotas y en dos horas lo tenía en la oficina. Atención de diez.", fecha: "hace 1 semana", tamano: "Colgante" },
    { nombre: "Lu M.", barrio: "Cordón", estrellas: 5, texto: "Es verdad que te avisa cuando tiene sed. Mi primera planta y sigue viva.", fecha: "hace 3 semanas", tamano: "Chica" },
  ],
  sansevieria: [
    { nombre: "Joaquín M.", barrio: "Cordón", estrellas: 5, texto: "Mato todo lo que toco y esta sigue viva hace cuatro meses. Hice el quiz y le pegó.", fecha: "hace 1 mes", tamano: "Mediana" },
    { nombre: "Paula F.", barrio: "Malvín", estrellas: 5, texto: "Viajo mucho por trabajo y no me reclama nada. Ideal.", fecha: "hace 2 meses", tamano: "Chica" },
  ],
  ficus: [
    { nombre: "Rodri A.", barrio: "Carrasco", estrellas: 5, texto: "Es la estrella del living. Seguí el consejo de no moverlo y no perdió ni una hoja.", fecha: "hace 3 semanas", tamano: "Grande" },
    { nombre: "Sofía P.", barrio: "Punta Carretas", estrellas: 4, texto: "Divino, pero pide luz de verdad. Me ayudaron por WhatsApp a elegir dónde ponerlo.", fecha: "hace 1 mes", tamano: "Mediano" },
  ],
  suculentas: [
    { nombre: "Agus P.", barrio: "Ciudad de la Costa", estrellas: 4, texto: "Las compré para regalar y quedaron divinas. Tardó un día más por la zona, pero me avisaron.", fecha: "hace 2 meses", tamano: "Pack de 3" },
    { nombre: "Meli C.", barrio: "Aguada", estrellas: 5, texto: "Las macetitas de barro son un amor. Las tengo en la ventana de la cocina.", fecha: "hace 2 semanas", tamano: "Pack de 6" },
  ],
  cactus: [
    { nombre: "Fede R.", barrio: "La Blanqueada", estrellas: 5, texto: "Vino envuelto con cartón para las espinas, re bien pensado. Le da el sol todo el día.", fecha: "hace 1 mes", tamano: "Mediano" },
  ],
  lavanda: [
    { nombre: "Ceci B.", barrio: "Parque Rodó", estrellas: 5, texto: "El balcón tiene otro perfume. Ya vinieron las abejas.", fecha: "hace 3 semanas", tamano: "Trío" },
    { nombre: "Tomás V.", barrio: "Sayago", estrellas: 4, texto: "Linda y sana. Ojo que pide bastante agua en verano.", fecha: "hace 2 meses", tamano: "Una planta" },
  ],
  helecho: [
    { nombre: "Flor B.", barrio: "Parque Batlle", estrellas: 5, texto: "Tengo dos gatos y quería algo que no les hiciera mal. Me encantó que lo aclaren en cada planta.", fecha: "hace 3 semanas", tamano: "Mediano" },
    { nombre: "Juli K.", barrio: "Tres Cruces", estrellas: 4, texto: "Lo tengo en el baño con ventana y está frondoso. Hay que pulverizarlo seguido.", fecha: "hace 1 mes", tamano: "Mediano" },
  ],
  palo: [
    { nombre: "Ana L.", barrio: "Jacinto Vera", estrellas: 5, texto: "Da un montón de altura sin ocupar lugar. Perfecto para el monoambiente.", fecha: "hace 2 semanas", tamano: "Mediano" },
  ],
  huerta: [
    { nombre: "Sofi L.", barrio: "Malvín", estrellas: 5, texto: "Ya cociné tres veces con la albahaca. El cajón es lindo de verdad, no parece de plástico.", fecha: "hace 5 días", tamano: "Kit de 3" },
    { nombre: "Gonza T.", barrio: "Pocitos", estrellas: 4, texto: "Buen kit para arrancar. La ciboulette tardó en agarrar, pero ahora está bárbara.", fecha: "hace 1 mes", tamano: "Kit de 6" },
  ],
}

export function resenasDe(plantaId: string) {
  return resenasPorPlanta[plantaId] ?? []
}

/** Reparto inventado de estrellas a partir del promedio y la cantidad. */
export function repartoEstrellas(planta: Planta) {
  const cinco = Math.round(planta.opiniones * (planta.estrellas - 3.9))
  const cuatro = Math.round((planta.opiniones - cinco) * 0.7)
  const tres = Math.round((planta.opiniones - cinco - cuatro) * 0.7)
  const dos = Math.round((planta.opiniones - cinco - cuatro - tres) * 0.6)
  const una = Math.max(0, planta.opiniones - cinco - cuatro - tres - dos)
  return [cinco, cuatro, tres, dos, una]
}

export type PreguntaPlanta = { pregunta: string; respuesta: string; quien: string }

const preguntasComunes: PreguntaPlanta[] = [
  {
    pregunta: "¿La puedo mandar de regalo con una tarjeta?",
    respuesta: "¡Sí! En el checkout marcá «Es para regalar», escribí el mensaje y la mandamos sin precio en la caja.",
    quien: "Equipo Verde",
  },
  {
    pregunta: "¿Viene con la maceta de la foto?",
    respuesta: "Viene en la maceta que elijas: de vivero (para pasarla a la tuya), de barro o de cerámica esmaltada.",
    quien: "Equipo Verde",
  },
]

const preguntasPorPlanta: Record<string, PreguntaPlanta[]> = {
  monstera: [{ pregunta: "¿Cuánto crece por año?", respuesta: "En interior con buena luz, entre 30 y 60 cm por año. Le salen 5 o 6 hojas nuevas.", quien: "Equipo Verde" }],
  potus: [{ pregunta: "¿Se puede tener en agua?", respuesta: "Sí, las ramas enraízan en un frasco con agua. Cambiala cada semana.", quien: "Equipo Verde" }],
  sansevieria: [{ pregunta: "¿Sirve para un cuarto sin ventana?", respuesta: "Aguanta muy poca luz, pero necesita algo. Con la luz de la puerta abierta durante el día alcanza.", quien: "Equipo Verde" }],
  ficus: [{ pregunta: "Se le caen hojas, ¿es normal?", respuesta: "Las primeras semanas sí, por el cambio de lugar. Si sigue, escribinos con una foto.", quien: "Equipo Verde" }],
  cactus: [{ pregunta: "¿Florece?", respuesta: "De adulto y con mucho sol puede dar flores blancas de noche en verano.", quien: "Equipo Verde" }],
  lavanda: [{ pregunta: "¿Anda en un balcón con viento?", respuesta: "Le encanta el viento y el sol. Es de las mejores para balcones altos.", quien: "Equipo Verde" }],
  helecho: [{ pregunta: "¿Puede ir adentro?", respuesta: "Sí, en un lugar luminoso sin sol directo y con humedad, como el baño con ventana.", quien: "Equipo Verde" }],
  huerta: [{ pregunta: "¿Cuándo puedo empezar a cosechar?", respuesta: "Desde el primer día: cortá siempre desde arriba y la planta se ramifica.", quien: "Equipo Verde" }],
}

export function preguntasDe(plantaId: string) {
  return [...(preguntasPorPlanta[plantaId] ?? []), ...preguntasComunes]
}

