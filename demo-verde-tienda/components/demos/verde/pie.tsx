import Link from "next/link"
import { AtSign, MessageCircle } from "lucide-react"

import { CreditosFotos } from "@/components/demos/creditos-fotos"
import { fotosVerde } from "@/components/demos/fotos"
import { whatsappDemo } from "@/lib/demo"
import { RUTA } from "@/components/demos/verde/estado"
import { BotonPausa, Logo } from "@/components/demos/verde/ui"

const consulta = whatsappDemo(
  "Hola Verde Tienda, tengo una consulta sobre una planta."
)

const tienda = [
  { href: `${RUTA}/#catalogo`, texto: "Todas las plantas" },
  { href: `${RUTA}/#armar`, texto: "Armá tu maceta 3D" },
  { href: `${RUTA}/#probala`, texto: "Probala en tu casa" },
  { href: `${RUTA}/#quiz`, texto: "¿Qué planta va con vos?" },
  { href: `${RUTA}/#club`, texto: "Club de plantas" },
]

const ayuda = [
  { href: `${RUTA}/#cuidados`, texto: "Guía de cuidados" },
  { href: `${RUTA}/#herramientas`, texto: "Medidor de luz y riego" },
  { href: `${RUTA}/#preguntas`, texto: "Envíos y retiro" },
  { href: `${RUTA}/#preguntas`, texto: "Garantía de 30 días" },
]

export function Pie() {
  return (
    <footer className="bg-[var(--vt-tinta)] px-4 pt-14 pb-24 text-[var(--vt-crema)] md:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Logo className="text-4xl" />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Vivero online con plantas elegidas a mano en Carrasco y enviadas
            con cuidado a todo el país.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (ejemplo)"
              className="grid size-11 place-items-center rounded-full border-2 border-white/30 hover:border-[var(--vt-manteca)] hover:text-[var(--vt-manteca)]"
            >
              <AtSign className="size-5" aria-hidden="true" />
            </a>
            <a
              href={consulta}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp (ejemplo)"
              className="grid size-11 place-items-center rounded-full border-2 border-white/30 hover:border-[var(--vt-manteca)] hover:text-[var(--vt-manteca)]"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <nav aria-label="Tienda">
          <p className="vt-titulo text-xl text-[var(--vt-manteca)]">Tienda</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {tienda.map((e) => (
              <li key={e.texto}>
                <Link href={e.href} className="hover:underline">
                  {e.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Ayuda">
          <p className="vt-titulo text-xl text-[var(--vt-manteca)]">Ayuda</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {ayuda.map((e) => (
              <li key={e.texto}>
                <Link href={e.href} className="hover:underline">
                  {e.texto}
                </Link>
              </li>
            ))}
            <li>
              <a href={consulta} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Contacto
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <p className="vt-titulo text-xl text-[var(--vt-manteca)]">Vivero</p>
          <address className="mt-3 text-sm leading-relaxed text-white/80 not-italic">
            Camino Carrasco 5120, Montevideo
            <br />
            Lunes a sábados de 9 a 18
          </address>
          <p className="mt-5 text-xs font-bold tracking-wider text-white/60 uppercase">Pagás con</p>
          <ul className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold">
            {["Mercado Pago", "Visa", "Mastercard", "OCA", "Transferencia"].map((m) => (
              <li key={m} className="rounded-full border-2 border-white/25 px-2.5 py-1">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t-2 border-white/15 pt-6 text-xs text-white/60">
        <p>© 2026 Verde Tienda · Sitio de ejemplo: precios, reseñas, cupones y datos son ficticios.</p>
        <BotonPausa claro />
      </div>
      <CreditosFotos fotos={fotosVerde} className="max-w-7xl text-white/80" />
    </footer>
  )
}
