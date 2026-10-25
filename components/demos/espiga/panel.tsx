"use client"

import { Dialog } from "radix-ui"
import { X } from "lucide-react"

import {
  abrirPanel,
  usePanel,
  type Panel,
} from "@/components/demos/espiga/estado"
import { cn } from "@/lib/utils"

/** El portal va dentro de .espiga para heredar colores y tipografías. */
function contenedor() {
  if (typeof document === "undefined") return undefined
  return document.querySelector<HTMLElement>(".espiga") ?? undefined
}

/**
 * Panel lateral accesible (Radix Dialog): atrapa el foco, cierra con
 * Escape o tocando afuera, y devuelve el foco al botón que lo abrió.
 */
export function PanelLateral({
  nombre,
  titulo,
  descripcion,
  lado = "derecha",
  children,
  pie,
}: {
  nombre: Exclude<Panel, null>
  titulo: string
  descripcion: string
  lado?: "derecha" | "izquierda"
  children: React.ReactNode
  pie?: React.ReactNode
}) {
  const abierto = usePanel() === nombre
  return (
    <Dialog.Root
      open={abierto}
      onOpenChange={(o) => abrirPanel(o ? nombre : null)}
    >
      <Dialog.Portal container={contenedor()}>
        <Dialog.Overlay className="panel-velo fixed inset-0 z-[60] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "panel fixed inset-y-0 z-[61] flex w-full max-w-[28rem] flex-col shadow-2xl duration-300 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
            lado === "derecha"
              ? "right-0 border-l-4 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
              : "left-0 border-r-4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
          )}
        >
          <header className="panel-cabeza flex items-start justify-between gap-4 px-5 pt-5 pb-4 sm:px-7">
            <div className="min-w-0">
              <Dialog.Title className="titulo text-[1.9rem] leading-tight">
                {titulo}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-[1rem] text-[var(--tinta-70)]">
                {descripcion}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="boton-borde -mr-1 flex size-12 shrink-0 items-center justify-center rounded-md"
              aria-label="Cerrar"
            >
              <X className="size-6" aria-hidden="true" />
            </Dialog.Close>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
            {children}
          </div>
          {pie && (
            <div className="panel-pie border-t-2 border-dashed border-[var(--tinta-20)] px-5 py-4 sm:px-7">
              {pie}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
