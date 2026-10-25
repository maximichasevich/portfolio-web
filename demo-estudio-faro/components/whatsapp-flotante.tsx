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
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3 4.3c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.2.2 2 3.1 4.9 4.2 2.4.9 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4l-.5-.3-1.9-.9c-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.4.1-.2 0-.3 0-.5L10.7 9c-.2-.5-.4-.5-.6-.5H9Z" />
          </svg>
        </span>
      </a>
    </div>
  )
}
