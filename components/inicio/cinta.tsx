import {
  CreditCard,
  Globe,
  MessageCircle,
  Search,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react"

import { Marquee } from "@/components/ui/marquee"

const incluye = [
  { Icono: Smartphone, texto: "Perfecta en el celular" },
  { Icono: Search, texto: "Aparece en Google" },
  { Icono: MessageCircle, texto: "Botón de WhatsApp" },
  { Icono: CreditCard, texto: "Pagos con Mercado Pago" },
  { Icono: Zap, texto: "Carga en segundos" },
  { Icono: Globe, texto: "Dominio y hosting" },
  { Icono: ShieldCheck, texto: "Segura y actualizada" },
]

/** Cinta con todo lo que incluye una página: se frena al pasar el mouse. */
export function Cinta() {
  return (
    <div
      className="relative border-y border-[var(--borde)] bg-[var(--nebulosa)]/60 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] py-4"
      aria-label="Qué incluye cada página"
    >
      <Marquee pauseOnHover className="[--duration:36s] [--gap:1rem]">
        {incluye.map(({ Icono, texto }) => (
          <span
            key={texto}
            className="vidrio flex items-center gap-2.5 rounded-full px-4 py-2 text-sm text-[var(--estrella-70)]"
          >
            <Icono className="size-4 text-[var(--cian)]" aria-hidden="true" />
            {texto}
          </span>
        ))}
      </Marquee>
    </div>
  )
}
