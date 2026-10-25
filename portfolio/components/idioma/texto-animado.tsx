"use client"

import type { ComponentProps } from "react"

import BlurText from "@/components/BlurText"
import { useIdioma } from "@/components/idioma/selector-idioma"

/**
 * BlurText separa el texto en palabras animadas. Con la traducción
 * automática activa, Google traduciría cada palabra suelta ("You business
 * deserves a page that impress"), así que en ese caso se muestra el texto
 * entero sin animación y se traduce como frase.
 */
export function TextoAnimado(props: ComponentProps<typeof BlurText>) {
  const idioma = useIdioma()
  if (idioma !== "es") return <span>{props.text}</span>
  return <BlurText {...props} />
}
