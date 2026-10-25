/**
 * Contenido fijo de las secciones nuevas de La Espiga: torta a medida,
 * desayunos para regalar, pan de la semana, opiniones y preguntas.
 * Precios, nombres y opiniones son de ejemplo.
 */

/* ---------- Torta a medida ---------- */

export type Pisos = 1 | 2 | 3

export const pisosTorta: {
  n: Pisos
  porciones: number
  precio: number
}[] = [
  { n: 1, porciones: 12, precio: 1450 },
  { n: 2, porciones: 25, precio: 2900 },
  { n: 3, porciones: 40, precio: 4600 },
]

export type Opcion = { id: string; nombre: string; extra: number }

export const bizcochuelos: Opcion[] = [
  { id: "vainilla", nombre: "Vainilla", extra: 0 },
  { id: "chocolate", nombre: "Chocolate", extra: 0 },
  { id: "naranja", nombre: "Naranja", extra: 0 },
]

/** El extra de relleno y cobertura se cobra por piso. */
export const rellenos: Opcion[] = [
  { id: "ddl", nombre: "Dulce de leche", extra: 0 },
  { id: "ddl-nueces", nombre: "Dulce de leche y nueces", extra: 220 },
  { id: "frutillas", nombre: "Frutillas con crema", extra: 260 },
  { id: "mousse", nombre: "Mousse de chocolate", extra: 180 },
]

export type Cobertura = Opcion & { lado: string; tapa: string }

export const coberturas: Cobertura[] = [
  {
    id: "merengue",
    nombre: "Merengue italiano",
    extra: 0,
    lado: "#f7efe0",
    tapa: "#fffaf1",
  },
  {
    id: "ddl",
    nombre: "Dulce de leche",
    extra: 120,
    lado: "#bf7d40",
    tapa: "#cf8f52",
  },
  {
    id: "ganache",
    nombre: "Ganache de chocolate",
    extra: 300,
    lado: "#4a2918",
    tapa: "#5c3522",
  },
  {
    id: "rosa",
    nombre: "Crema de frutilla",
    extra: 150,
    lado: "#eeb3ad",
    tapa: "#f6c8c2",
  },
]

export type Decoracion = "frutillas" | "copos" | "confites" | "velas" | "cartel"

export const decoraciones: { id: Decoracion; nombre: string; precio: number }[] =
  [
    { id: "frutillas", nombre: "Frutillas frescas", precio: 240 },
    { id: "copos", nombre: "Copos de merengue", precio: 120 },
    { id: "confites", nombre: "Confites de colores", precio: 90 },
    { id: "velas", nombre: "Velitas", precio: 60 },
    { id: "cartel", nombre: "Cartel con un nombre", precio: 150 },
  ]

export type ConfigTorta = {
  pisos: Pisos
  bizcochuelo: string
  relleno: string
  cobertura: string
  deco: Decoracion[]
  cartel: string
}

export const tortaInicial: ConfigTorta = {
  pisos: 2,
  bizcochuelo: "chocolate",
  relleno: "ddl",
  cobertura: "merengue",
  deco: ["frutillas", "copos"],
  cartel: "Feliz cumple",
}

const buscar = <T extends { id: string }>(lista: T[], id: string) =>
  lista.find((o) => o.id === id) ?? lista[0]

export function detalleTorta(c: ConfigTorta) {
  const piso = pisosTorta.find((p) => p.n === c.pisos) ?? pisosTorta[0]
  const bizcochuelo = buscar(bizcochuelos, c.bizcochuelo)
  const relleno = buscar(rellenos, c.relleno)
  const cobertura = buscar(coberturas, c.cobertura)
  const deco = decoraciones.filter((d) => c.deco.includes(d.id))
  const precio =
    piso.precio +
    (relleno.extra + cobertura.extra) * c.pisos +
    deco.reduce((s, d) => s + d.precio, 0)
  const lineas = [
    `${c.pisos} ${c.pisos === 1 ? "piso" : "pisos"} (${piso.porciones} porciones)`,
    `Bizcochuelo de ${bizcochuelo.nombre.toLowerCase()}`,
    `Relleno de ${relleno.nombre.toLowerCase()}`,
    `Cubierta de ${cobertura.nombre.toLowerCase()}`,
  ]
  if (deco.length > 0) {
    lineas.push(
      `Con ${deco
        .map((d) =>
          d.id === "cartel" && c.cartel.trim()
            ? `cartel «${c.cartel.trim()}»`
            : d.nombre.toLowerCase()
        )
        .join(", ")}`
    )
  }
  return {
    piso,
    bizcochuelo,
    relleno,
    cobertura,
    deco,
    precio,
    lineas,
    nueces: relleno.id === "ddl-nueces",
  }
}

/* ---------- Desayunos para regalar ---------- */

export type Desayuno = {
  id: string
  nombre: string
  para: string
  precio: number
  contenido: string[]
  /** Color de la cinta de la caja. */
  cinta: string
}

export const desayunos: Desayuno[] = [
  {
    id: "barrio",
    nombre: "Desayuno de barrio",
    para: "Para 1 o 2 personas",
    precio: 1290,
    contenido: [
      "Termo de café de especialidad (500 ml)",
      "4 medialunas de manteca",
      "2 alfajores de maicena",
      "Jugo de naranja exprimido",
      "Mermelada casera de frutilla",
    ],
    cinta: "#a3301c",
  },
  {
    id: "campo",
    nombre: "Desayuno de campo",
    para: "Para 2 personas",
    precio: 1890,
    contenido: [
      "Pan de campo chico y manteca",
      "Queso colonia y dulce de leche",
      "Café o té, a elección",
      "Jugo de naranja exprimido",
      "4 facturas surtidas",
    ],
    cinta: "#26332b",
  },
  {
    id: "merienda",
    nombre: "Merienda dulce",
    para: "Para 2 o 3 personas",
    precio: 1590,
    contenido: [
      "2 porciones de torta de ricota",
      "Pasta frola chica de membrillo",
      "6 alfajorcitos",
      "Té en hebras de la casa",
      "Ramito de flores secas",
    ],
    cinta: "#c58a2b",
  },
]

export const franjasDesayuno = ["8:00 a 9:30", "9:30 a 11:00", "16:00 a 18:00"]

/* ---------- Pan de la semana (suscripción) ---------- */

export const panesSuscripcion = [
  { id: "campo", nombre: "Pan de campo", precio: 180 },
  { id: "semillas", nombre: "Pan integral de semillas", precio: 220 },
  { id: "flautas", nombre: "Dos flautas", precio: 140 },
  { id: "molde", nombre: "Pan de molde casero", precio: 160 },
  { id: "sintacc", nombre: "Pan sin TACC", precio: 240 },
]

export const diasSuscripcion = [
  { n: 1, corto: "Lun", largo: "lunes" },
  { n: 2, corto: "Mar", largo: "martes" },
  { n: 3, corto: "Mié", largo: "miércoles" },
  { n: 4, corto: "Jue", largo: "jueves" },
  { n: 5, corto: "Vie", largo: "viernes" },
  { n: 6, corto: "Sáb", largo: "sábado" },
]

export const franjasSuscripcion = [
  "7:00 a 8:30",
  "8:30 a 10:00",
  "16:30 a 18:00",
]

export const DESCUENTO_SUSCRIPCION = 0.1

/* ---------- Opiniones de vecinos ---------- */

export const opiniones = [
  {
    nombre: "Marta R.",
    barrio: "vecina de Benito Blanco",
    texto:
      "Hace treinta años que compro acá. El pan de campo es el mismo de siempre y Lucía te atiende como Nilda: por el nombre.",
    estrellas: 5,
  },
  {
    nombre: "Don Julio",
    barrio: "jubilado, de Chucarro",
    texto:
      "Me cuesta caminar y les pido por WhatsApp. Me lo traen a las 8 en punto, con los bizcochos calentitos para el mate.",
    estrellas: 5,
  },
  {
    nombre: "Ana P.",
    barrio: "celíaca, de Punta Carretas",
    texto:
      "Por fin una panadería de barrio con pan sin TACC hecho aparte y bien rotulado. Los alfajores son un vicio.",
    estrellas: 5,
  },
  {
    nombre: "Sofía y Mateo",
    barrio: "del Buceo",
    texto:
      "Les encargamos la torta del cumple de Juana con frutillas y cartel. Llegó perfecta y sobró para el otro día.",
    estrellas: 5,
  },
  {
    nombre: "Gustavo L.",
    barrio: "trabaja en la zona",
    texto:
      "El combo mate de la tarde salva la oficina. Los viernes de pizza ya son una tradición del equipo.",
    estrellas: 4,
  },
  {
    nombre: "Rosario M.",
    barrio: "abuela de cuatro",
    texto:
      "Me regalaron el desayuno de campo para mi cumpleaños. Hasta la tarjetita escrita a mano. Lloré un poco, lo confieso.",
    estrellas: 5,
  },
]

/* ---------- Preguntas frecuentes ---------- */

export const preguntas = [
  {
    p: "¿Hasta qué hora puedo hacer un pedido para hoy?",
    r: "Hasta media hora antes de cerrar: hasta las 19:30 de lunes a sábado y hasta las 12:30 los domingos. Te lo preparamos en 30 minutos.",
  },
  {
    p: "¿Tienen productos sin TACC?",
    r: "Sí. El pan sin TACC y los alfajores sin TACC se hacen con premezcla certificada, en un sector exclusivo y con utensilios propios. Vienen cerrados y rotulados. En la pizarra podés filtrar por “Sin TACC”.",
  },
  {
    p: "¿Hacen envíos? ¿Cuánto cuestan?",
    r: "Llevamos a Pocitos, Punta Carretas y Buceo. El envío cuesta $ 80 y es gratis en pedidos desde $ 1.200. Los desayunos para regalar ya incluyen el envío.",
  },
  {
    p: "¿Cómo pago?",
    r: "Pagás al recibir o al retirar: efectivo, débito, crédito o Mercado Pago. No te pedimos datos de tarjeta en la página.",
  },
  {
    p: "¿Cómo funciona la tarjeta de la casa?",
    r: "Cada pan que comprás suma un sello. Con 10 sellos, el próximo pan de campo va de regalo. Los pedidos que mandás desde esta página suman solos; en el mostrador te sellamos la tarjeta de papel.",
  },
  {
    p: "¿Con cuánta anticipación encargo una torta?",
    r: "Con 48 horas. Para mesas dulces de más de 40 personas, mejor con una semana. Si es urgente, llamanos al 2709 4512 y vemos qué podemos hacer.",
  },
  {
    p: "¿Puedo pedir para otra persona, por ejemplo para mi madre?",
    r: "Claro. En “Mis datos” poné la dirección de ella y en las notas cómo encontrarla. Muchos hijos les mandan el pan de la semana a sus padres.",
  },
  {
    p: "¿Cuánto dura el pan de masa madre?",
    r: "Entre 4 y 5 días en una bolsa de tela, fuera de la heladera. Si sobra, cortalo en rodajas y congelalo: se tuesta directo del freezer.",
  },
]

/* ---------- Cómo llegar ---------- */

export const comoLlegar = [
  {
    id: "pie",
    nombre: "A pie",
    texto:
      "Estamos en Av. Brasil 2640, entre Benito Blanco y Chucarro, a tres cuadras de la rambla. La vereda es ancha y la entrada, a nivel.",
  },
  {
    id: "omnibus",
    nombre: "En ómnibus",
    texto:
      "Las líneas 121, 183 y 187 paran en Av. Brasil y Benito Blanco, a media cuadra. Desde 18 de Julio son unos 20 minutos.",
  },
  {
    id: "auto",
    nombre: "En auto",
    texto:
      "Hay lugar para estacionar sobre Chucarro. Si te cuesta bajar, avisanos al llegar y te alcanzamos el pedido al auto.",
  },
  {
    id: "bici",
    nombre: "En bici",
    texto:
      "Tenemos bicicletero en la puerta. La bicisenda de la rambla queda a tres cuadras.",
  },
]
