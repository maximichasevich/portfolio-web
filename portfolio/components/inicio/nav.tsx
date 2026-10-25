"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { SelectorIdioma } from "@/components/idioma/selector-idioma"
import { MenuHud, type Seccion } from "@/components/inicio/menu-hud"
import { perfil } from "@/data/perfil"

const secciones: Seccion[] = [
  { id: "inicio", texto: "Inicio" },
  { id: "que-hago", texto: "Qué hago" },
  { id: "trabajos", texto: "Ejemplos" },
  { id: "proceso", texto: "Cómo trabajo" },
  { id: "servicios", texto: "Servicios" },
  { id: "preguntas", texto: "Preguntas" },
  { id: "contacto", texto: "Contacto" },
]

/** Enlaces visibles en escritorio (el resto está en el menú). */
const visibles = ["trabajos", "proceso", "servicios"]

export function Nav() {
  const [abierto, setAbierto] = useState(false)
  const [activa, setActiva] = useState("inicio")

  // Sección visible: la que cruza la franja central de la pantalla.
  useEffect(() => {
    const els = secciones
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setActiva(e.target.id)
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Atajos: M o Ctrl/Cmd + K abren el menú.
  useEffect(() => {
    function onTecla(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      const escribiendo =
        t?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(t?.tagName ?? "")
      if (escribiendo) return
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setAbierto(true)
      } else if (
        (e.key === "m" || e.key === "M") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        setAbierto(true)
      }
    }
    window.addEventListener("keydown", onTecla)
    return () => window.removeEventListener("keydown", onTecla)
  }, [])

  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <div className="vidrio flex w-full max-w-4xl items-center justify-between gap-2 rounded-full py-2 pr-2 pl-5">
        <Link
          href="/"
          translate="no"
          className="notranslate display-md flex items-center gap-2 text-base tracking-tight"
        >
          <span>
            {perfil.nombreCorto}
            <span className="text-[var(--cian)]">.</span>
          </span>
          <span className="mono hidden text-[10px] font-normal tracking-[0.2em] text-[var(--estrella-45)] lg:inline">
            / WEB STUDIO
          </span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          {secciones
            .filter((s) => visibles.includes(s.id))
            .map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={activa === s.id ? "location" : undefined}
                className="relative hidden rounded-full px-3 py-2 text-sm text-[var(--estrella-70)] transition-colors hover:text-[var(--estrella)] focus-visible:text-[var(--estrella)] focus-visible:outline-none aria-[current=location]:text-[var(--estrella)] md:inline"
              >
                {s.texto}
                {activa === s.id && (
                  <span
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-[var(--cian)] to-[var(--violeta)]"
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          <SelectorIdioma variante="barra" />
          <button
            type="button"
            onClick={() => setAbierto(true)}
            aria-haspopup="dialog"
            className="boton-hud inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm"
          >
            <span className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className="h-px w-4 bg-current" />
              <span className="h-px w-2.5 bg-current" />
            </span>
            Menú
          </button>
          <a
            href="#contacto"
            className="boton-orbita ml-1 hidden rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex"
          >
            Contacto
          </a>
        </nav>
      </div>
      <MenuHud
        abierto={abierto}
        onCambio={setAbierto}
        secciones={secciones}
        activa={activa}
      />
    </header>
  )
}
