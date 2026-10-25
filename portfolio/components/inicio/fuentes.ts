import { JetBrains_Mono, Syne } from "next/font/google"

/**
 * Fuentes de la portada. Se cargan una sola vez en app/layout.tsx (sobre
 * <html>), así las variables llegan también al menú, que se monta en un
 * portal. No importar este archivo desde componentes "use client".
 */
export const syne = Syne({
  subsets: ["latin"],
  // Solo los grosores que usan los títulos (.display y .display-md).
  weight: ["700", "800"],
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
