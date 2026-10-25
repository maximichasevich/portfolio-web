import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { buscarPlanta, catalogo, precioDesde } from "@/components/demos/verde/catalogo"
import { FichaProducto } from "@/components/demos/verde/ficha"
import { pesos } from "@/lib/demo"

/** Una ficha por planta, generadas de antemano. */
export function generateStaticParams() {
  return catalogo.map((p) => ({ id: p.id }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const planta = buscarPlanta(id)
  if (!planta) return {}
  return {
    title: { absolute: `${planta.nombre} desde ${pesos(precioDesde(planta))} · Verde Tienda` },
    description: `${planta.descripcion} ${planta.riego}. Envío en el día en Montevideo.`,
    robots: { index: false, follow: false },
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const planta = buscarPlanta(id)
  if (!planta) notFound()
  return (
    <main id="contenido">
      <FichaProducto key={planta.id} planta={planta} />
    </main>
  )
}
