"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"

export type Capa = "menu" | "clientes" | "agendar"

type ContextoFaro = {
  abierta: Capa | null
  abrir: (capa: Capa) => void
  cerrar: () => void
  /** Botón "Menú": a donde vuelve el foco si el disparador ya no existe. */
  botonMenu: React.RefObject<HTMLButtonElement | null>
  /** Evita que Radix devuelva el foco cuando una capa abre otra. */
  alCerrar: (e: Event) => void
}

const Contexto = createContext<ContextoFaro | null>(null)

/**
 * Coordina las capas de pantalla completa del sitio (menú, área de clientes
 * y agenda). Solo una está abierta a la vez; si el menú abre otra capa, al
 * cerrarla el foco vuelve al botón que la originó o al botón "Menú".
 */
export function ProveedorFaro({ children }: { children: React.ReactNode }) {
  const [abierta, setAbierta] = useState<Capa | null>(null)
  const botonMenu = useRef<HTMLButtonElement | null>(null)
  const volverA = useRef<HTMLElement | null>(null)
  const siguiente = useRef<Capa | null>(null)

  const abrir = useCallback((capa: Capa) => {
    const activo = document.activeElement as HTMLElement | null
    const dentroDeCapa = activo?.closest("[role='dialog']")
    if (!dentroDeCapa) volverA.current = activo
    siguiente.current = capa
    setAbierta(capa)
  }, [])

  const cerrar = useCallback(() => {
    siguiente.current = null
    setAbierta(null)
  }, [])

  const alCerrar = useCallback((e: Event) => {
    e.preventDefault()
    // Si otra capa tomó el lugar, ella se encarga del foco.
    if (siguiente.current) return
    const destino =
      volverA.current && volverA.current.isConnected
        ? volverA.current
        : botonMenu.current
    destino?.focus({ preventScroll: true })
  }, [])

  const valor = useMemo(
    () => ({ abierta, abrir, cerrar, botonMenu, alCerrar }),
    [abierta, abrir, cerrar, alCerrar]
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useFaro() {
  const c = useContext(Contexto)
  if (!c) throw new Error("useFaro va dentro de ProveedorFaro")
  return c
}

/** Botón cliente que abre una capa; sirve dentro de componentes de servidor. */
export function AbrirCapa({
  capa,
  className,
  children,
}: {
  capa: Capa
  className?: string
  children: React.ReactNode
}) {
  const { abrir } = useFaro()
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => abrir(capa)}
    >
      {children}
    </button>
  )
}
