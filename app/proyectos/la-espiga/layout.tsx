import type { Metadata } from "next"
import {
  Atkinson_Hyperlegible_Next,
  Kalam,
  Young_Serif,
} from "next/font/google"

import "./espiga.css"
import "./tres-d.css"
import { cn } from "@/lib/utils"

/** Títulos: serif de cartel antiguo, con carácter. */
const titulo = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-titulo",
  display: "swap",
})

/** Detalles de pizarra escritos a mano. */
const tiza = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tiza",
  display: "swap",
})

/** Texto: diseñada para personas con baja visión, muy legible. */
const texto = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-texto",
  display: "swap",
})

export const metadata: Metadata = {
  // "absolute": la demo no hereda la plantilla de título del portfolio.
  title: { absolute: "La Espiga · Panadería de barrio en Pocitos" },
  description:
    "Pan de masa madre, bizcochos y tortas por encargo en Pocitos, Montevideo. Armá tu bolsa, elegí la hora y retirá sin hacer fila.",
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "espiga min-h-svh",
        titulo.variable,
        tiza.variable,
        texto.variable
      )}
    >
      {children}
    </div>
  )
}
