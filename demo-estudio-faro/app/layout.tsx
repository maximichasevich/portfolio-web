import type { Metadata } from "next"
import { Geist } from "next/font/google"

import "./globals.css"
import { WhatsappFlotante } from "@/components/whatsapp-flotante"
import { sitio } from "@/config/sitio"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

/**
 * Layout raíz de la demo. El diseño propio del sitio está en
 * app/(sitio)/layout.tsx (un grupo de rutas: no cambia las direcciones).
 */
export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  // Es un negocio ficticio: que los buscadores no lo indexen.
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("font-sans antialiased", geist.variable)}
    >
      <body>
        {children}
        {/* Botón para contactar al desarrollador (no al negocio ficticio). */}
        <WhatsappFlotante />
      </body>
    </html>
  )
}
