"use client"

import { useState } from "react"

import { sitio } from "@/config/sitio"
import { cn } from "@/lib/utils"

const mensaje = `Hola Maxi, vi la demo de ${sitio.nombre} en tu portfolio y quiero una página así para mi negocio.`

/**
 * Botón flotante de WhatsApp para contactar al desarrollador del sitio.
 *
 * Lleva al lado la etiqueta "¿Querés una página así?" para que quede claro
 * que no es el contacto del negocio ficticio. En pantallas chicas la
 * etiqueta es corta ("¿Una así?") y el primer toque la despliega; el
 * segundo abre WhatsApp.
 */
export function WhatsappFlotante() {
  const [abierta, setAbierta] = useState(false)
  const href = `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(mensaje)}`

  return (
    <div
      translate="no"
      className="notranslate group fixed right-3 bottom-3 z-40 flex items-center gap-2 lg:right-5 lg:bottom-5"
    >
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        aria-label="¿Querés una página así? Mostrar detalle"
        className="rounded-full bg-neutral-900/90 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-lg backdrop-blur lg:hidden"
      >
        {abierta ? "¿Querés una página así? Escribime" : "¿Una así?"}
      </button>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="¿Querés una página así? Escribile al desarrollador por WhatsApp (se abre en una pestaña nueva)"
        className="flex items-center gap-2 focus-visible:outline-none"
      >
        <span
          aria-hidden="true"
          className="hidden rounded-full bg-neutral-900/90 px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-lg backdrop-blur transition-transform duration-300 group-hover:-translate-x-1 lg:inline-block"
        >
          ¿Querés una página así?
        </span>
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.65)] ring-2 ring-white/70 transition-transform duration-300 group-hover:scale-105 group-focus-within:scale-105 lg:size-14",
            abierta && "scale-105"
          )}
        >
          <svg viewBox="0 0 24 24" className="size-6 lg:size-7" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </span>
      </a>
    </div>
  )
}
