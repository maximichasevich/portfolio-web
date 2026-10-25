"use client"

import { useRef } from "react"

import { useIdioma } from "@/components/idioma/selector-idioma"

/**
 * Título de la portada que reacciona al cursor: cada palabra se ilumina y
 * sube un poco según qué tan cerca está el mouse.
 *
 * El texto es visible desde el primer cuadro (la entrada solo lo desplaza),
 * así el navegador lo cuenta enseguida como contenido principal (LCP).
 * Con la traducción automática activa se muestra como texto plano, para que
 * Google lo traduzca como frase y no palabra por palabra.
 */
export function TituloVivo({ texto }: { texto: string }) {
  const idioma = useIdioma()
  const ref = useRef<HTMLSpanElement>(null)
  const raf = useRef(0)

  function mover(ev: React.PointerEvent) {
    if (ev.pointerType === "touch") return
    const cont = ref.current
    if (!cont) return
    const { clientX, clientY } = ev
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      cont.querySelectorAll<HTMLElement>(".palabra").forEach((p) => {
        const r = p.getBoundingClientRect()
        const d = Math.hypot(
          clientX - (r.left + r.width / 2),
          clientY - (r.top + r.height / 2)
        )
        // 1 encima de la palabra, 0 a partir de 220 px.
        const cerca = Math.max(0, 1 - d / 220)
        p.style.setProperty("--cerca", cerca.toFixed(3))
      })
    })
  }

  function salir() {
    cancelAnimationFrame(raf.current)
    ref.current
      ?.querySelectorAll<HTMLElement>(".palabra")
      .forEach((p) => p.style.setProperty("--cerca", "0"))
  }

  if (idioma !== "es") return <span>{texto}</span>

  return (
    <span
      ref={ref}
      className="titulo-vivo"
      onPointerMove={mover}
      onPointerLeave={salir}
    >
      {texto.split(" ").map((palabra, i) => (
        <span key={i}>
          <span className="palabra" style={{ animationDelay: `${i * 70}ms` }}>
            {palabra}
          </span>{" "}
        </span>
      ))}
    </span>
  )
}
