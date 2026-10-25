import type { Metadata, Viewport } from "next"

import { capaFuentes } from "@/components/demos/verde/fuentes"
import "./verde.css"

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`verde min-h-svh ${capaFuentes}`}>{children}</div>
}
