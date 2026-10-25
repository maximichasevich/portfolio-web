import { ArrowLeft } from "lucide-react"

import { SelectorIdioma } from "@/components/idioma/selector-idioma"
import { sitio } from "@/config/sitio"

/**
 * Aviso flotante que aparece en los sitios de ejemplo para que quien llega
 * desde el portfolio sepa que es una demo y pueda volver. Al lado va el
 * selector de idioma (traducción automática) para leer la demo desde
 * cualquier país.
 *
 * La pastilla es corta ("Demo") para no tapar botones de las páginas; el
 * texto completo se despliega al pasar el mouse o al enfocarla con teclado.
 */
export function BannerDemo({ oscuro = false }: { oscuro?: boolean }) {
  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-1.5">
      <a
        href={`${sitio.portfolio}/#trabajos`}
        aria-label="Sitio de ejemplo. Volver al portfolio de Maxi"
        className={
          "group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-lg backdrop-blur focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none " +
          (oscuro
            ? "bg-white/90 text-neutral-900"
            : "bg-neutral-900/90 text-white")
        }
      >
        <ArrowLeft className="size-3.5 shrink-0" aria-hidden="true" />
        <span aria-hidden="true">Demo</span>
        <span
          aria-hidden="true"
          className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-64 group-hover:opacity-100 group-focus-visible:max-w-64 group-focus-visible:opacity-100"
        >
          · Volver al portfolio de Maxi
        </span>
      </a>
      <SelectorIdioma variante="flotante" />
    </div>
  )
}
