/**
 * Configuración de este sitio de ejemplo.
 *
 * Las direcciones se pueden definir con variables de entorno (en Netlify:
 * Site configuration > Environment variables) o editando los valores por
 * defecto de este archivo.
 */
export const sitio = {
  /** Nombre del negocio ficticio. */
  nombre: "Verde Tienda",
  /** Dirección pública de esta demo (sin barra final). */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://verdetienda.michasevich.com",
  /** Dirección del portfolio, para el aviso "Volver al portfolio". */
  portfolio:
    process.env.NEXT_PUBLIC_PORTFOLIO_URL ??
    "https://michasevich.com",
  /** WhatsApp del desarrollador (con código de país, sin "+" ni espacios). */
  whatsapp: "59892443629",
}
