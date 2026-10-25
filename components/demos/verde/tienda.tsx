"use client"

import { AnimatePresence, motion } from "motion/react"
import { CheckCircle2 } from "lucide-react"

import { ProveedorTienda, useTienda } from "@/components/demos/verde/estado"
import { CajonCarrito } from "@/components/demos/verde/carrito"
import { CajonFavoritos } from "@/components/demos/verde/favoritos"
import { VistaRapida } from "@/components/demos/verde/vista-rapida"
import { Checkout } from "@/components/demos/verde/checkout"
import { DialogoEntrar, PanelCuenta } from "@/components/demos/verde/cuenta"
import { MenuMovil } from "@/components/demos/verde/encabezado"

/**
 * Envuelve la página de Verde Tienda: estado compartido (carrito, favoritos,
 * cuenta y filtros) y todos los paneles (cajones, vista rápida, checkout).
 */
export function Tienda({ children }: { children: React.ReactNode }) {
  return (
    <ProveedorTienda>
      {children}
      <CajonCarrito />
      <CajonFavoritos />
      <VistaRapida />
      <Checkout />
      <PanelCuenta />
      <DialogoEntrar />
      <MenuMovil />
      <Aviso />
    </ProveedorTienda>
  )
}

/** Avisos cortos ("agregada al carrito"), leídos por lectores de pantalla. */
function Aviso() {
  const { aviso } = useTienda()
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex justify-center px-4 sm:inset-x-auto sm:top-auto sm:right-5 sm:bottom-5"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {aviso && (
          <motion.p
            key={aviso.id}
            initial={{ y: -16, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: -1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="vt-capa flex max-w-sm items-center gap-2.5 rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)] py-2.5 pr-5 pl-3 text-sm font-bold shadow-[3px_3px_0_var(--vt-tinta)]"
          >
            <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
            {aviso.texto}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
