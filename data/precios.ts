/**
 * Paquetes, servicios extra y nota de precios de la sección
 * "Servicios y precios" de la portada.
 *
 * Para cambiar un precio o un ítem, editá este archivo: el diseño se
 * actualiza solo. Los precios están en dólares estadounidenses.
 */

export type Paquete = {
  /** Identificador corto, sin espacios. */
  id: string
  nombre: string
  /** Aclaración que va junto al nombre, por ejemplo "4 a 6 secciones". */
  detalle?: string
  /** Para quién es, en una línea. */
  para: string
  incluye: string[]
  /** Precio "desde", en dólares. */
  desde: number
  /** Marca la tarjeta como "El más elegido". */
  destacado?: boolean
}

export const paquetes: Paquete[] = [
  {
    id: "landing",
    nombre: "Página de una sección",
    detalle: "Landing page",
    para: "Ideal para emprendedores y negocios que arrancan.",
    incluye: [
      "Diseño a medida con logo, colores y textos del cliente",
      "Adaptada a celulares y tablets",
      "Formulario de contacto y botón de WhatsApp",
      "Mapa de ubicación y links a redes sociales",
    ],
    desde: 150,
  },
  {
    id: "institucional",
    nombre: "Sitio institucional",
    detalle: "4 a 6 secciones",
    para: "Para negocios que quieren presencia profesional completa.",
    incluye: [
      "Todo lo del paquete anterior",
      "Secciones: Inicio, Nosotros, Servicios, Galería y Contacto",
      "Configuración básica para aparecer en Google",
      "Ayuda para conectar dominio y correo profesional",
    ],
    desde: 300,
    destacado: true,
  },
  {
    id: "tienda",
    nombre: "Tienda online",
    para: "Para vender productos por internet.",
    incluye: [
      "Catálogo de productos con fotos y precios",
      "Carrito de compras",
      "Pagos con Mercado Pago",
    ],
    desde: 500,
  },
]

export type Extra = {
  nombre: string
  detalle: string
  /** Precio en dólares; si no tiene, se muestra "Consultar". */
  desde?: number
  /** Unidad del precio, por ejemplo "por mes". */
  unidad?: string
}

export const extras: Extra[] = [
  {
    nombre: "Mantenimiento mensual",
    detalle: "Cambios de textos, fotos y precios.",
    desde: 25,
    unidad: "por mes",
  },
  {
    nombre: "Rediseño de páginas existentes",
    detalle: "Tu sitio actual, renovado.",
  },
  {
    nombre: "Diseño de logo básico",
    detalle: "Para arrancar con una identidad clara.",
  },
  {
    nombre: "Redacción de textos para la web",
    detalle: "Textos que se entienden y venden.",
  },
]

export const notaPrecios =
  "Los precios no incluyen dominio ni alojamiento web, que corren por cuenta del cliente. Te asesoro para elegir la opción más económica. Cada proyecto se presupuesta según lo que necesites."

/** Mensaje de WhatsApp ya escrito con el paquete elegido. */
export function mensajePaquete(p: Paquete) {
  const nombre = p.detalle ? `${p.nombre} (${p.detalle})` : p.nombre
  return `Hola Maxi, vi tu portfolio y me interesa el paquete "${nombre}", desde ${p.desde} dólares. ¿Me pasás un presupuesto?`
}

/** Mensaje de WhatsApp para consultar por un servicio extra. */
export function mensajeExtra(e: Extra) {
  return `Hola Maxi, quiero consultar por el servicio "${e.nombre}".`
}
