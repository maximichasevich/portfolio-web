import { JetBrains_Mono, Syne } from "next/font/google"

/**
 * Fuentes de la portada. Están en un archivo aparte porque el menú se monta
 * en un portal (fuera de la página) y también necesita las variables.
 */
export const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
  display: "swap",
})

/** Mono para etiquetas tipo consola, datos y la terminal del contacto. */
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-hud",
  display: "swap",
})

export const fuentesInicio = `${syne.variable} ${mono.variable}`
