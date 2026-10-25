"use client"

import { usePathname } from "next/navigation"

import { linkWhatsappCon, perfil } from "@/data/perfil"

/** Nombre de cada demo, para que el mensaje diga desde dónde te escriben. */
const demos: Record<string, string> = {
  "/proyectos/la-espiga": "La Espiga",
  "/proyectos/estudio-faro": "Estudio Faro",
  "/proyectos/verde-tienda": "Verde Tienda",
}

/**
 * Botón flotante de WhatsApp, abajo a la derecha, en todas las páginas
 * (se monta en app/layout.tsx). Mide 48 px y queda por debajo de las barras
 * fijas de las demos; los paneles y ventanas de las demos lo tapan porque
 * tienen un z-index mayor.
 */
export function WhatsappFlotante() {
  const ruta = usePathname()
  const demo = demos[ruta]
  const mensaje = demo
    ? `Hola Maxi, vi la demo de ${demo} en tu portfolio y quiero una página así para mi negocio.`
    : perfil.mensajeWhatsapp

  return (
    <a
      href={linkWhatsappCon(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribime por WhatsApp (se abre en una pestaña nueva)"
      translate="no"
      className="notranslate group fixed right-3 bottom-3 z-40 flex size-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.65)] ring-2 ring-white/70 transition-transform duration-300 hover:scale-105 focus-visible:scale-105 focus-visible:ring-4 focus-visible:outline-none lg:right-5 lg:bottom-5 lg:size-14"
    >
      {/* Etiqueta que aparece al pasar el mouse (solo pantallas grandes). */}
      <span
        className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-neutral-900/90 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
        aria-hidden="true"
      >
        ¿Hablamos?
      </span>
      <svg
        viewBox="0 0 24 24"
        className="size-6 lg:size-7"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3 4.3c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.2.2 2 3.1 4.9 4.2 2.4.9 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4l-.5-.3-1.9-.9c-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.4.1-.2 0-.3 0-.5L10.7 9c-.2-.5-.4-.5-.6-.5H9Z" />
      </svg>
    </a>
  )
}
