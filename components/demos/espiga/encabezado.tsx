"use client"

import { useEffect, useState } from "react"
import {
  ClipboardList,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react"

import { EstadoEnVivo } from "@/components/demos/espiga/en-vivo"
import {
  abrirPanel,
  alternarLetra,
  resumirBolsa,
  useBolsa,
  useLetraGrande,
} from "@/components/demos/espiga/estado"
import { PanelLateral } from "@/components/demos/espiga/panel"
import { Sello } from "@/components/demos/espiga/sello"
import { whatsappDemo } from "@/lib/demo"
import { cn } from "@/lib/utils"

export const secciones = [
  { id: "carta", nombre: "La pizarra" },
  { id: "horno", nombre: "El horno hoy" },
  { id: "encargos", nombre: "Tortas y encargos" },
  { id: "historia", nombre: "Nuestra historia" },
  { id: "visitanos", nombre: "Horarios y dirección" },
]

export const telefono = { texto: "2709 4512", href: "tel:+59827094512" }

/** Lleva a una sección después de cerrar el menú (que bloquea el scroll). */
function irA(id: string) {
  abrirPanel(null)
  window.setTimeout(() => {
    const el = document.getElementById(id)
    if (!el) return
    const reducir = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    el.scrollIntoView({ behavior: reducir ? "auto" : "smooth" })
    history.replaceState(null, "", `#${id}`)
  }, 60)
}

function BotonLetra({ className }: { className?: string }) {
  const grande = useLetraGrande()
  return (
    <button
      type="button"
      onClick={alternarLetra}
      aria-pressed={grande}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 font-bold",
        className
      )}
    >
      <span aria-hidden="true" className="titulo text-[1.1em]">
        A<span className="text-[1.3em]">A</span>
      </span>
      <span>{grande ? "Letra normal" : "Letra grande"}</span>
    </button>
  )
}

function BotonBolsa({ className }: { className?: string }) {
  const bolsa = useBolsa()
  const { unidades } = resumirBolsa(bolsa)
  return (
    <button
      type="button"
      onClick={() => abrirPanel("bolsa")}
      aria-label={`Tu bolsa: ${unidades} ${unidades === 1 ? "producto" : "productos"}`}
      className={cn(
        "boton-rojo relative rounded-md px-3.5 text-[1rem] sm:px-4",
        className
      )}
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">Tu bolsa</span>
      <span
        aria-hidden="true"
        className={cn(
          "flex min-w-7 items-center justify-center rounded-full px-1.5 text-[0.95rem] leading-7 tabular-nums",
          unidades > 0
            ? "bg-[var(--papel)] text-[var(--rojo)]"
            : "bg-[rgba(246,239,223,0.25)] text-[var(--papel)]"
        )}
      >
        {unidades}
      </span>
    </button>
  )
}

export function Encabezado() {
  const grande = useLetraGrande()
  const [activa, setActiva] = useState<string | null>(null)

  // Letra grande: agranda la base de todo el sitio y la restaura al salir.
  useEffect(() => {
    const html = document.documentElement
    html.style.fontSize = grande ? "115%" : ""
    return () => {
      html.style.fontSize = ""
    }
  }, [grande])

  // Marca en la navegación la sección que se está viendo.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActiva(e.target.id)
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    for (const s of [{ id: "portada" }, ...secciones]) {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* Franja con el estado en vivo */}
      <div className="franja bg-[var(--tinta)] text-[0.95rem] text-[var(--papel)]">
        <div className="mx-auto flex min-h-11 max-w-6xl items-center justify-between gap-3 px-4 py-1 md:px-8">
          <EstadoEnVivo />
          <p className="hidden items-center gap-2 lg:flex">
            Av. Brasil 2640, Pocitos
            <span aria-hidden="true">·</span>
            <a
              href={telefono.href}
              className="underline decoration-[var(--tiza-30)] underline-offset-4 hover:decoration-current"
            >
              Tel. {telefono.texto}
            </a>
          </p>
          <BotonLetra className="hidden text-[0.95rem] hover:bg-white/10 sm:inline-flex" />
        </div>
      </div>

      {/* Cabecera de escritorio con el sello centrado */}
      <header className="papel hidden lg:block">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-8 px-8 pt-6 pb-4">
          <div>
            <p className="tiza text-[1.6rem] text-[var(--rojo)]">
              El pan del barrio desde 1987
            </p>
            <p className="mt-1 text-[var(--tinta-70)]">
              Masa madre · Harinas uruguayas · Dos horneadas por día
            </p>
          </div>
          <a
            href="#inicio"
            className="block rounded-full text-[var(--rojo)]"
            aria-label="La Espiga, ir al inicio"
          >
            <Sello id="sello-cabecera" className="size-36 -rotate-6" />
          </a>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => abrirPanel("pedidos")}
              className="boton-borde rounded-md px-4"
            >
              <ClipboardList className="size-5" aria-hidden="true" />
              Mis pedidos
            </button>
            <button
              type="button"
              onClick={() => abrirPanel("datos")}
              className="boton-borde rounded-md px-4"
            >
              <UserRound className="size-5" aria-hidden="true" />
              Mis datos
            </button>
          </div>
        </div>
      </header>

      {/* Barra fija: pestañas en escritorio, menú y bolsa en celular */}
      <div className="papel sticky top-0 z-40 border-b-2 border-[var(--tinta)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-4 lg:hidden">
          <button
            type="button"
            onClick={() => abrirPanel("menu")}
            className="boton-borde rounded-md px-3"
            aria-label="Abrir menú"
          >
            <Menu className="size-6" aria-hidden="true" />
            <span className="hidden min-[400px]:inline">Menú</span>
          </button>
          <a
            href="#inicio"
            className="flex min-w-0 items-center gap-2 text-[var(--rojo)]"
            aria-label="La Espiga, ir al inicio"
          >
            <Sello
              id="sello-movil"
              titulo={false}
              className="size-11 shrink-0"
            />
            <span className="titulo truncate text-[1.65rem] text-[var(--tinta)]">
              La Espiga
            </span>
          </a>
          <BotonBolsa />
        </div>

        <div className="mx-auto hidden max-w-6xl items-end justify-between gap-4 px-8 pt-2 lg:flex">
          <nav aria-label="Secciones">
            <ul className="flex items-end gap-1.5">
              {secciones.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="pestana"
                    aria-current={activa === s.id ? "true" : undefined}
                  >
                    {s.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <BotonBolsa className="mb-2" />
        </div>
      </div>

      {/* Menú del celular */}
      <PanelLateral
        nombre="menu"
        lado="izquierda"
        titulo="La Espiga"
        descripcion="Panadería de barrio en Pocitos"
      >
        <EstadoEnVivo className="mb-5 rounded-md bg-[var(--tinta)] px-3 py-2 text-[var(--papel)]" />
        <nav aria-label="Secciones">
          <ul className="border-t-2 border-[var(--tinta)]">
            {secciones.map((s) => (
              <li
                key={s.id}
                className="border-b border-dashed border-[var(--tinta-20)]"
              >
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    irA(s.id)
                  }}
                  className="titulo flex min-h-14 items-center justify-between py-2 text-[1.5rem]"
                >
                  {s.nombre}
                  <span aria-hidden="true" className="text-[var(--rojo)]">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 grid gap-2">
          <button
            type="button"
            onClick={() => abrirPanel("bolsa")}
            className="boton-rojo rounded-md px-4"
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            Ver mi bolsa
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => abrirPanel("pedidos")}
              className="boton-borde rounded-md px-3"
            >
              <ClipboardList className="size-5" aria-hidden="true" />
              Mis pedidos
            </button>
            <button
              type="button"
              onClick={() => abrirPanel("datos")}
              className="boton-borde rounded-md px-3"
            >
              <UserRound className="size-5" aria-hidden="true" />
              Mis datos
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-1 border-t-2 border-[var(--tinta)] pt-4">
          <a
            href={telefono.href}
            className="flex min-h-12 items-center gap-3 font-bold"
          >
            <Phone className="size-5 text-[var(--rojo)]" aria-hidden="true" />
            Llamar al {telefono.texto}
          </a>
          <a
            href={whatsappDemo("¡Hola, La Espiga! Tengo una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center gap-3 font-bold"
          >
            <MessageCircle
              className="size-5 text-[var(--rojo)]"
              aria-hidden="true"
            />
            Escribinos por WhatsApp
          </a>
          <BotonLetra className="-ml-2.5 justify-start hover:bg-[var(--papel-2)]" />
        </div>
      </PanelLateral>
    </>
  )
}
