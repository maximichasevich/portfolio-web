import { Bricolage_Grotesque, Figtree } from "next/font/google"

/**
 * Tipografías propias de Verde Tienda: Bricolage Grotesque (display gruesa y
 * simpática, con eje de ancho) para títulos y Figtree (sans limpia) para
 * texto. Se aplican con variables CSS en la capa de la tienda y en los
 * paneles que Radix monta fuera de ella (portales).
 */
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--vt-display",
  axes: ["wdth", "opsz"],
  display: "swap",
})

export const texto = Figtree({
  subsets: ["latin"],
  variable: "--vt-texto",
  display: "swap",
})

/** Clases para cualquier capa que tenga que verse como la tienda. */
export const capaFuentes = `${display.variable} ${texto.variable}`
