import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { WhatsappFlotante } from "@/components/whatsapp-flotante"
import { perfil } from "@/data/perfil"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  metadataBase: new URL(perfil.url),
  title: {
    default: `${perfil.nombre} · Páginas web a medida en Montevideo`,
    template: `%s · ${perfil.nombre}`,
  },
  description: perfil.descripcion,
  keywords: [
    "diseño web Montevideo",
    "páginas web Uruguay",
    "tienda online Uruguay",
    "desarrollador web freelance",
    "landing page",
  ],
  authors: [{ name: perfil.nombre }],
  creator: perfil.nombre,
  openGraph: {
    type: "website",
    locale: "es_UY",
    siteName: perfil.nombre,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#05060f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("dark font-sans antialiased", geist.variable)}
    >
      <body>
        {children}
        {/* Botón de WhatsApp visible en todas las páginas. */}
        <WhatsappFlotante />
      </body>
    </html>
  )
}
