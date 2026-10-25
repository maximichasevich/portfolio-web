"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Dialog } from "radix-ui"
import { ArrowUpRight } from "lucide-react"

import { useFaro } from "@/components/demos/faro/contexto"
import { estudio, secciones } from "@/components/demos/faro/datos"
import { cn } from "@/lib/utils"

/** Logo mínimo: nombre en serif y una marca de luz. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className="serif notranslate text-[1.65rem] leading-none italic"
        translate="no"
      >
        Faro
      </span>
      <span className="etiqueta hidden opacity-80 sm:inline">
        Estudio de arquitectura
      </span>
    </span>
  )
}

/**
 * Cabecera mínima (logo + botón "Menú") y menú de pantalla completa con
 * vista previa de foto en escritorio. Sin barra de enlaces visible.
 */
export function Cabecera() {
  const { abierta, abrir, cerrar, botonMenu, alCerrar } = useFaro()
  const [activa, setActiva] = useState(0)
  const destino = useRef<string | null>(null)
  const [sobreOscuro, setSobreOscuro] = useState(true)

  // El color de la cabecera sigue al fondo: claro sobre fotos y secciones
  // oscuras (marcadas con data-oscuro), carbón sobre el fondo hueso.
  useEffect(() => {
    let cuadro = 0
    const medir = () => {
      cuadro = 0
      const y = 36
      const oscuro = [...document.querySelectorAll("[data-oscuro]")].some(
        (el) => {
          const r = el.getBoundingClientRect()
          return r.top <= y && r.bottom >= y
        }
      )
      setSobreOscuro(oscuro)
    }
    const alMover = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir)
    }
    cuadro = requestAnimationFrame(medir)
    window.addEventListener("scroll", alMover, { passive: true })
    window.addEventListener("resize", alMover)
    return () => {
      cancelAnimationFrame(cuadro)
      window.removeEventListener("scroll", alMover)
      window.removeEventListener("resize", alMover)
    }
  }, [])

  function irA(id: string) {
    destino.current = id
    cerrar()
  }

  return (
    <>
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-40 transition-colors duration-500",
          sobreOscuro
            ? "text-[var(--hueso)] [text-shadow:0_1px_12px_rgba(0,0,0,0.25)]"
            : "text-[var(--carbon)]"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6 lg:px-12">
          <a
            href="#inicio"
            className="pointer-events-auto"
            aria-label="Estudio Faro, ir al inicio"
          >
            <Logo />
          </a>
          <button
            ref={botonMenu}
            type="button"
            onClick={() => abrir("menu")}
            aria-haspopup="dialog"
            aria-expanded={abierta === "menu"}
            className="etiqueta group pointer-events-auto inline-flex min-h-11 items-center gap-3 px-1"
          >
            Menú
            <span aria-hidden="true" className="flex w-7 flex-col gap-[5px]">
              <span className="h-px w-full bg-current transition-transform duration-500 group-hover:translate-x-1" />
              <span className="h-px w-2/3 self-end bg-current transition-[width] duration-500 group-hover:w-full" />
            </span>
          </button>
        </div>
      </header>

      <Dialog.Root
        open={abierta === "menu"}
        onOpenChange={(v) => (v ? abrir("menu") : cerrar())}
      >
        <Dialog.Content
          className="capa sobre-oscuro fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[var(--carbon)] text-[var(--hueso)]"
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            const primero = e.currentTarget as HTMLElement | null
            primero
              ?.querySelector<HTMLElement>("nav a")
              ?.focus({ preventScroll: true })
          }}
          onCloseAutoFocus={(e) => {
            const id = destino.current
            destino.current = null
            if (!id) return alCerrar(e)
            e.preventDefault()
            const el = document.getElementById(id)
            if (!el) return
            const reducir = window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches
            history.replaceState(null, "", `#${id}`)
            el.scrollIntoView({ behavior: reducir ? "auto" : "smooth" })
            el.focus({ preventScroll: true })
          }}
        >
          <Dialog.Title className="sr-only">Menú principal</Dialog.Title>

          <div className="flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6 lg:px-12">
            <Logo />
            <Dialog.Close className="etiqueta inline-flex min-h-11 items-center gap-3 px-1">
              Cerrar
              <span aria-hidden="true" className="relative block size-4">
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
              </span>
            </Dialog.Close>
          </div>

          <div className="grid flex-1 gap-10 px-4 pt-6 pb-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pt-4 lg:pb-8">
            <nav aria-label="Secciones" className="lg:col-span-7">
              <ol className="border-t border-[var(--linea-clara)]">
                {secciones.map((s, i) => (
                  <li
                    key={s.id}
                    className="sube border-b border-[var(--linea-clara)]"
                    style={{ animationDelay: `${80 + i * 55}ms` }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        irA(s.id)
                      }}
                      onMouseEnter={() => setActiva(i)}
                      onFocus={() => setActiva(i)}
                      className="group flex items-baseline gap-4 py-1.5 sm:gap-8 sm:py-2"
                    >
                      <span className="mono w-8 shrink-0 text-xs text-[var(--piedra-claro)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="serif text-[clamp(2.4rem,min(6.4vw,9svh),4.75rem)] leading-[1.02] transition-[transform,font-style] duration-500 group-hover:translate-x-3 group-hover:italic group-focus-visible:translate-x-3 group-focus-visible:italic">
                        {s.nombre}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="boton"
                  onClick={() => abrir("agendar")}
                >
                  Agendar primera reunión
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="boton-linea"
                  onClick={() => abrir("clientes")}
                >
                  Área de clientes
                </button>
              </div>
            </nav>

            <div className="hidden lg:col-span-4 lg:col-start-9 lg:flex lg:flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--carbon-2)]">
                {secciones.map((s, i) => (
                  <Image
                    key={s.id}
                    src={s.foto.src}
                    alt=""
                    fill
                    sizes="30vw"
                    className={cn(
                      "object-cover transition-[opacity,transform] duration-700 ease-out",
                      activa === i
                        ? "scale-100 opacity-100"
                        : "scale-105 opacity-0"
                    )}
                  />
                ))}
              </div>
              <p className="etiqueta mt-3 flex justify-between text-[var(--piedra-claro)]">
                <span>{secciones[activa].nombre}</span>
                <span>
                  {String(activa + 1).padStart(2, "0")} /{" "}
                  {String(secciones.length).padStart(2, "0")}
                </span>
              </p>
            </div>
          </div>

          <div className="grid gap-6 border-t border-[var(--linea-clara)] px-4 py-6 text-sm text-[var(--piedra-claro)] sm:grid-cols-3 sm:px-8 lg:px-12">
            <address className="not-italic">
              <span className="etiqueta mb-2 block text-[var(--hueso)]">
                Estudio
              </span>
              {estudio.direccion}
              <br />
              {estudio.barrio}
            </address>
            <div>
              <span className="etiqueta mb-2 block text-[var(--hueso)]">
                Contacto
              </span>
              <a href={`mailto:${estudio.correo}`} className="subrayado">
                {estudio.correo}
              </a>
              <br />
              <a href={estudio.telefonoHref} className="subrayado">
                {estudio.telefono}
              </a>
            </div>
            <div>
              <span className="etiqueta mb-2 block text-[var(--hueso)]">
                Redes
              </span>
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {estudio.redes.map((r) => (
                  <li key={r.nombre}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="subrayado"
                    >
                      {r.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}
