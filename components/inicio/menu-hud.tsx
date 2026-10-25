"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Copy, Mail, MessageCircle, X } from "lucide-react"
import { Dialog } from "radix-ui"

import { fuentesInicio } from "@/components/inicio/fuentes"
import { linkEmail, linkWhatsapp, perfil } from "@/data/perfil"
import { ejemplos } from "@/data/trabajo"
import { useHoraMontevideo } from "@/hooks/use-hora-montevideo"

export type Seccion = { id: string; texto: string }

/**
 * Menú de pantalla completa con estética de consola: secciones numeradas,
 * estado de la agenda, hora local y accesos rápidos. Se abre con el botón
 * "Menú" o con la tecla M / Ctrl+K desde la barra.
 */
export function MenuHud({
  abierto,
  onCambio,
  secciones,
  activa,
}: {
  abierto: boolean
  onCambio: (abierto: boolean) => void
  secciones: Seccion[]
  activa: string
}) {
  const hora = useHoraMontevideo()
  const [copiado, setCopiado] = useState(false)

  function ir(id: string) {
    onCambio(false)
    // Esperar a que el diálogo libere el scroll antes de desplazarse.
    window.setTimeout(() => {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${id}`)
    }, 60)
  }

  async function copiarEmail() {
    try {
      await navigator.clipboard.writeText(perfil.email)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch {
      window.location.href = linkEmail()
    }
  }

  return (
    <Dialog.Root open={abierto} onOpenChange={onCambio}>
      <Dialog.Portal>
        <Dialog.Overlay className="menu-hud-fondo fixed inset-0 z-[60] bg-[#05060f]/80 backdrop-blur-md" />
        <Dialog.Content
          className={`inicio menu-hud ${fuentesInicio} fixed inset-0 z-[61] overflow-y-auto`}
        >
          <Dialog.Title className="sr-only">Menú principal</Dialog.Title>
          <Dialog.Description className="sr-only">
            Secciones del portfolio, estado de disponibilidad y accesos rápidos
            de contacto.
          </Dialog.Description>

          <div
            className="escaneo pointer-events-none fixed inset-0"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-5 py-6 md:px-10 md:py-8">
            <div className="flex items-center justify-between">
              <span className="mono text-xs text-[var(--estrella-45)]">
                SISTEMA://{perfil.nombreCorto.toUpperCase()}.WEB
              </span>
              <Dialog.Close className="boton-hud inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <span className="mono text-xs">ESC</span>
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">Cerrar menú</span>
              </Dialog.Close>
            </div>

            <div className="mt-10 grid flex-1 gap-10 md:mt-14 md:grid-cols-[1.3fr_1fr] md:gap-16">
              <nav aria-label="Secciones">
                <ol className="flex flex-col">
                  {secciones.map((s, i) => (
                    <li key={s.id} className="border-b border-[var(--borde)]">
                      <button
                        type="button"
                        onClick={() => ir(s.id)}
                        aria-current={activa === s.id ? "location" : undefined}
                        className="group flex w-full items-baseline gap-5 py-4 text-left focus-visible:outline-none md:py-5"
                      >
                        <span className="mono w-8 shrink-0 text-xs text-[var(--estrella-45)] group-hover:text-[var(--cian)] group-focus-visible:text-[var(--cian)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={
                            "display text-[clamp(2rem,5vw,3.6rem)] transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-[var(--cian)] group-focus-visible:translate-x-2 group-focus-visible:text-[var(--cian)] " +
                            (activa === s.id ? "degradado" : "")
                          }
                        >
                          {s.texto}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="flex flex-col gap-5">
                <div className="hud rounded-2xl p-5">
                  <p className="etiqueta-hud">Estado</p>
                  <dl className="mono mt-4 grid grid-cols-2 gap-y-3 text-sm">
                    <dt className="text-[var(--estrella-45)]">Agenda</dt>
                    <dd className="flex items-center gap-2 text-[#3fd68c]">
                      <span className="en-vivo" aria-hidden="true" /> Abierta
                    </dd>
                    <dt className="text-[var(--estrella-45)]">Respuesta</dt>
                    <dd>En el día</dd>
                    <dt className="text-[var(--estrella-45)]">Montevideo</dt>
                    <dd suppressHydrationWarning>{hora} h</dd>
                    <dt className="text-[var(--estrella-45)]">Modalidad</dt>
                    <dd>Remoto · Uruguay</dd>
                  </dl>
                </div>

                <div className="hud rounded-2xl p-5">
                  <p className="etiqueta-hud">Contacto rápido</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href={linkWhatsapp()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="boton-orbita inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      Escribime por WhatsApp
                    </a>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={linkEmail()}
                        className="boton-hud inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm"
                      >
                        <Mail className="size-4" aria-hidden="true" /> Correo
                      </a>
                      <button
                        type="button"
                        onClick={copiarEmail}
                        className="boton-hud inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm"
                      >
                        {copiado ? (
                          <Check
                            className="size-4 text-[#3fd68c]"
                            aria-hidden="true"
                          />
                        ) : (
                          <Copy className="size-4" aria-hidden="true" />
                        )}
                        {copiado ? "Copiado" : "Copiar mail"}
                      </button>
                    </div>
                    <span className="sr-only" aria-live="polite">
                      {copiado ? "Correo copiado al portapapeles" : ""}
                    </span>
                  </div>
                </div>

                <div className="hud rounded-2xl p-5">
                  <p className="etiqueta-hud">Demos en vivo</p>
                  <ul className="mt-3 flex flex-col">
                    {ejemplos.map((e) => (
                      <li key={e.slug}>
                        <a
                          href={e.ruta}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between border-b border-[var(--borde)] py-2.5 text-sm last:border-0 hover:text-[var(--cian)] focus-visible:text-[var(--cian)] focus-visible:outline-none"
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className="size-2 rounded-full"
                              style={{ background: e.color }}
                              aria-hidden="true"
                            />
                            {e.nombre}
                            <span className="text-[var(--estrella-45)]">
                              · {e.rubro}
                            </span>
                          </span>
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p className="mono mt-10 text-[11px] text-[var(--estrella-45)]">
              Atajo: tecla M o Ctrl + K para abrir este menú.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
