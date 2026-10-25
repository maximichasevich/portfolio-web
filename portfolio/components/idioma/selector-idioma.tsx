"use client"

import { useEffect, useSyncExternalStore } from "react"
import { Check, Languages } from "lucide-react"
import { DropdownMenu } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Selector de idioma con traducción automática (Google Translate).
 *
 * Las páginas están escritas en español. Al elegir otro idioma se guarda la
 * cookie `googtrans` (la que lee Google) y se recarga la página; el script de
 * traducción solo se descarga cuando hay un idioma distinto del español, así
 * que quien lee en español no carga nada extra. La cookie vale para todo el
 * sitio, así que el idioma elegido se mantiene en el portfolio y en las demos.
 */

export const idiomas = [
  { codigo: "es", nombre: "Español" },
  { codigo: "en", nombre: "English" },
  { codigo: "pt", nombre: "Português" },
  { codigo: "fr", nombre: "Français" },
  { codigo: "it", nombre: "Italiano" },
  { codigo: "de", nombre: "Deutsch" },
  { codigo: "nl", nombre: "Nederlands" },
  { codigo: "pl", nombre: "Polski" },
  { codigo: "ru", nombre: "Русский" },
  { codigo: "tr", nombre: "Türkçe" },
  { codigo: "ar", nombre: "العربية" },
  { codigo: "hi", nombre: "हिन्दी" },
  { codigo: "zh-CN", nombre: "中文" },
  { codigo: "ja", nombre: "日本語" },
  { codigo: "ko", nombre: "한국어" },
] as const

function leerIdioma(): string {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/)
  return m ? decodeURIComponent(m[1]) : "es"
}

function sinSuscripcion() {
  return () => {}
}

/** Idioma activo según la cookie de traducción ("es" si no hay). */
export function useIdioma() {
  return useSyncExternalStore(sinSuscripcion, leerIdioma, () => "es")
}

function borrarCookie() {
  const vencida = "expires=Thu, 01 Jan 1970 00:00:00 GMT"
  const host = window.location.hostname
  document.cookie = `googtrans=; ${vencida}; path=/`
  document.cookie = `googtrans=; ${vencida}; path=/; domain=${host}`
  document.cookie = `googtrans=; ${vencida}; path=/; domain=.${host}`
}

function elegir(codigo: string) {
  try {
    borrarCookie()
    if (codigo !== "es") {
      document.cookie = `googtrans=/es/${codigo}; path=/; max-age=31536000`
    }
  } catch {
    // Sin cookies no hay traducción automática; la página sigue en español.
  }
  window.location.reload()
}

/**
 * Google Translate reemplaza nodos de texto y React después no los encuentra.
 * Este parche, conocido en la comunidad de React, evita que eso rompa la
 * página. Solo se aplica cuando hay una traducción activa.
 */
function parchearDom() {
  const w = window as Window & { __parcheTraduccion?: boolean }
  if (w.__parcheTraduccion) return
  w.__parcheTraduccion = true
  const quitar = Node.prototype.removeChild
  Node.prototype.removeChild = function <T extends Node>(this: Node, hijo: T) {
    if (hijo.parentNode !== this) return hijo
    return quitar.call(this, hijo) as T
  }
  const insertar = Node.prototype.insertBefore
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    nuevo: T,
    referencia: Node | null
  ) {
    if (referencia && referencia.parentNode !== this) {
      return insertar.call(this, nuevo, null) as T
    }
    return insertar.call(this, nuevo, referencia) as T
  }
}

function cargarTraductor() {
  if (document.getElementById("script-traductor")) return
  parchearDom()
  const destino = document.createElement("div")
  destino.id = "google_translate_element"
  destino.hidden = true
  document.body.appendChild(destino)
  const w = window as Window & {
    iniciarTraductor?: () => void
    google?: {
      translate: {
        TranslateElement: new (
          opciones: Record<string, unknown>,
          id: string
        ) => unknown
      }
    }
  }
  w.iniciarTraductor = () => {
    if (!w.google) return
    new w.google.translate.TranslateElement(
      { pageLanguage: "es", autoDisplay: false },
      "google_translate_element"
    )
  }
  const script = document.createElement("script")
  script.id = "script-traductor"
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=iniciarTraductor"
  script.async = true
  document.body.appendChild(script)
}

export function SelectorIdioma({
  variante = "flotante",
  className,
}: {
  /** "barra": para la barra oscura del portfolio. "flotante": junto al aviso Demo. */
  variante?: "barra" | "flotante"
  className?: string
}) {
  const actual = useIdioma()
  const etiqueta = actual === "es" ? "ES" : actual.split("-")[0].toUpperCase()

  useEffect(() => {
    if (actual !== "es") cargarTraductor()
  }, [actual])

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={`Idioma: ${idiomas.find((i) => i.codigo === actual)?.nombre ?? actual}. Cambiar idioma`}
        className={cn(
          "notranslate inline-flex items-center gap-1.5 rounded-full font-semibold focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none",
          variante === "barra"
            ? "px-3 py-2 text-xs text-[var(--estrella-70)] transition-colors hover:text-[var(--estrella)]"
            : "bg-neutral-900/90 px-3 py-1.5 text-[11px] text-white shadow-lg backdrop-blur",
          className
        )}
        translate="no"
      >
        <Languages className="size-3.5" aria-hidden="true" />
        {etiqueta}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={variante === "barra" ? "bottom" : "top"}
          align={variante === "barra" ? "end" : "start"}
          sideOffset={8}
          translate="no"
          className="notranslate z-[100] max-h-[min(70vh,26rem)] w-52 overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0f22]/95 p-1.5 text-sm text-white shadow-2xl backdrop-blur"
        >
          <DropdownMenu.Label className="px-3 pt-2 pb-1 text-[11px] tracking-wide text-white/50 uppercase">
            Traducción automática
          </DropdownMenu.Label>
          {idiomas.map((i) => (
            <DropdownMenu.Item
              key={i.codigo}
              onSelect={() => i.codigo !== actual && elegir(i.codigo)}
              lang={i.codigo}
              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 outline-none data-[highlighted]:bg-white/10"
            >
              {i.nombre}
              {i.codigo === actual && (
                <Check className="size-4 text-[#39d5ff]" aria-hidden="true" />
              )}
            </DropdownMenu.Item>
          ))}
          <p className="px-3 pt-2 pb-1.5 text-[11px] leading-snug text-white/45">
            Traducido por Google. El texto original está en español.
          </p>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
