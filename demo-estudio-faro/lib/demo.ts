/** Utilidades compartidas por los sitios de ejemplo del portfolio. */

/** Enlace a WhatsApp con mensaje precargado. Sin número: es una demo. */
export function whatsappDemo(mensaje: string) {
  return `https://wa.me/?text=${encodeURIComponent(mensaje)}`
}

const formatoPesos = new Intl.NumberFormat("es-UY", {
  style: "currency",
  currency: "UYU",
  maximumFractionDigits: 0,
})

export function pesos(valor: number) {
  return formatoPesos.format(valor)
}

/** Foto de un sitio de ejemplo, con los datos que pide su licencia. */
export type Foto = {
  /** Ruta dentro de /public. */
  src: string
  autor: string
  /** Nombre corto de la licencia, por ejemplo "CC BY 4.0". */
  licencia: string
  /** Página de la foto en Wikimedia Commons. */
  fuente: string
}
