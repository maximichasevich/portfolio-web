import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, DM_Mono, Hanken_Grotesk } from "next/font/google"

import "./faro.css"

/* Tipografía propia de Estudio Faro: serif fina para titulares, mono para
   datos técnicos (m², año, coordenadas) y una sans neutra para leer. */
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--faro-serif",
  display: "swap",
})
const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--faro-mono",
  display: "swap",
})
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--faro-sans",
  display: "swap",
})

export const metadata: Metadata = {
  // "absolute": la demo no hereda la plantilla de título del portfolio.
  title: { absolute: "Estudio Faro · Arquitectura en Montevideo" },
  description:
    "Estudio de arquitectura en Montevideo. Viviendas, espacios comerciales e interiores entre el Río de la Plata y el Atlántico. Conocé las obras y agendá una primera reunión.",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: "#0f0f0d",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`faro min-h-svh ${serif.variable} ${mono.variable} ${sans.variable}`}
    >
      {children}
    </div>
  )
}
