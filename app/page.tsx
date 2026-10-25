import type { Metadata } from "next"

import "./inicio.css"
import { Chispas } from "@/components/inicio/chispas"
import { Cinta } from "@/components/inicio/cinta"
import { Contacto } from "@/components/inicio/contacto"
import { ComoTrabajo } from "@/components/inicio/como-trabajo"
import { Ejemplos } from "@/components/inicio/ejemplos"
import { Faq } from "@/components/inicio/faq"
import { fuentesInicio } from "@/components/inicio/fuentes"
import { Hero } from "@/components/inicio/hero"
import { CursorLuz } from "@/components/inicio/interacciones"
import { Nav } from "@/components/inicio/nav"
import { Precios } from "@/components/inicio/precios"
import { Razones } from "@/components/inicio/razones"
import { Servicios } from "@/components/inicio/servicios"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: {
    absolute: "Maximiliano Michasevich · Páginas web que impresionan",
  },
  description:
    "Diseño y desarrollo de páginas web inmersivas para negocios, profesionales y tiendas online en Montevideo. Rápidas, modernas y perfectas en el celular.",
  openGraph: {
    title: "Maximiliano Michasevich · Páginas web que impresionan",
    description:
      "Sitios para negocios, páginas de presentación y tiendas online con diseño a medida desde Montevideo.",
  },
}

export default function Page() {
  return (
    <div className={cn("inicio min-h-svh", fuentesInicio)}>
      <Chispas>
        <ScrollProgress className="h-0.5 from-[#39d5ff] via-[#7c5cff] to-[#39d5ff]" />
        <CursorLuz />
        <Nav />
        <main>
          <Hero />
          <Cinta />
          <Servicios />
          <Ejemplos />
          <ComoTrabajo />
          <Precios />
          <Razones />
          <Faq />
          <Contacto />
        </main>
      </Chispas>
    </div>
  )
}
