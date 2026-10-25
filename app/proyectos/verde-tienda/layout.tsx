import type { Metadata, Viewport } from "next"

import { BannerDemo } from "@/components/demos/banner-demo"
import { capaFuentes } from "@/components/demos/verde/fuentes"
import { Anuncio, Encabezado } from "@/components/demos/verde/encabezado"
import { Pie } from "@/components/demos/verde/pie"
import { Tienda } from "@/components/demos/verde/tienda"
import "./verde.css"
import "./verde-3d.css"

export const metadata: Metadata = {
  // "absolute": la demo no hereda la plantilla de título del portfolio.
  title: { absolute: "Verde Tienda · Plantas con envío en el día en Montevideo" },
  description:
    "Vivero online: plantas de interior, exterior, suculentas y huerta con envío en el día en Montevideo, guía de cuidados y quiz para encontrar tu planta. Pagá con Mercado Pago en cuotas.",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: "#1f2a22",
}

/**
 * La tienda (estado, carrito, paneles, encabezado y pie) vive en el layout:
 * así la portada y las fichas de producto la comparten y el carrito no se
 * pierde al navegar entre ellas.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`verde min-h-svh ${capaFuentes}`}>
      <Tienda>
        <a
          href="#contenido"
          className="sr-only z-[80] rounded-full bg-[var(--vt-manteca)] px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        <Anuncio />
        <Encabezado />
        {children}
        <Pie />
        <BannerDemo />
      </Tienda>
    </div>
  )
}
