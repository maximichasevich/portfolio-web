"use client"

import { useId, useRef, useState } from "react"
import { Check, Download } from "lucide-react"

import { estudio, servicios } from "@/components/demos/faro/datos"
import { obras } from "@/components/demos/faro/obras"
import { guardarClave, useClave } from "@/components/demos/faro/utiles"
import { cn } from "@/lib/utils"

const perfiles = ["Particular", "Desarrollador", "Empresa"]

/* ---- PDF mínimo armado a mano (una página, fuentes estándar) ---- */

const reemplazos: Record<string, string> = {
  "—": "\x97",
  "–": "\x96",
  "’": "\x92",
  "“": "\x93",
  "”": "\x94",
  "′": "'",
  "″": '"',
}
function latin1(t: string) {
  return [...t]
    .map((c) => reemplazos[c] ?? (c.charCodeAt(0) < 256 ? c : "?"))
    .join("")
    .replace(/[\\()]/g, (m) => `\\${m}`)
}

function armarPdf(nombre: string, perfil: string) {
  const ops: string[] = [
    "0.937 0.922 0.894 rg 0 0 595 842 re f",
    "0.059 0.059 0.051 rg 0.059 0.059 0.051 RG",
  ]
  const texto = (x: number, y: number, fuente: string, tam: number, t: string, gris = false) =>
    ops.push(
      `BT /${fuente} ${tam} Tf ${gris ? "0.467 0.451 0.416" : "0.059 0.059 0.051"} rg ${x} ${y} Td (${latin1(t)}) Tj ET`
    )
  const linea = (y: number) => ops.push(`0.4 w 56 ${y} m 539 ${y} l S`)

  texto(56, 770, "F2", 8, "ESTUDIO DE ARQUITECTURA · MONTEVIDEO", true)
  texto(56, 700, "F1", 72, "Faro")
  texto(56, 668, "F1", 20, "Dossier 2026")
  texto(56, 640, "F2", 9, `Preparado para ${nombre} · ${perfil}`, true)
  linea(620)
  texto(56, 596, "F2", 8, "OBRAS SELECCIONADAS", true)
  obras.forEach((o, i) => {
    const y = 574 - i * 20
    texto(56, y, "F1", 13, o.nombre)
    texto(300, y, "F2", 8.5, `${o.lugar.split(",")[0]} · ${o.anio} · ${o.m2} m²`, true)
  })
  linea(384)
  texto(56, 360, "F2", 8, "SERVICIOS", true)
  servicios.forEach((s, i) => texto(56, 338 - i * 18, "F1", 13, s.titulo))
  linea(232)
  texto(56, 208, "F2", 8, "CONTACTO", true)
  texto(56, 188, "F2", 9.5, `${estudio.direccion} · ${estudio.barrio}`)
  texto(56, 172, "F2", 9.5, `${estudio.correo} · ${estudio.telefono}`)
  texto(56, 70, "F2", 7, "Documento de demostración generado por el sitio de ejemplo. Datos ficticios.", true)

  const contenido = ops.join("\n")
  const objetos = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
    `<< /Length ${contenido.length} >>\nstream\n${contenido}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ]
  let pdf = "%PDF-1.4\n"
  const posiciones: number[] = []
  objetos.forEach((o, i) => {
    posiciones.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`
  pdf += posiciones.map((p) => `${String(p).padStart(10, "0")} 00000 n \n`).join("")
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  const bytes = new Uint8Array(pdf.length)
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff
  return new Blob([bytes], { type: "application/pdf" })
}

/** Pedido del dossier del estudio: formulario breve y descarga de un PDF. */
export function Dossier() {
  const id = useId()
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [perfil, setPerfil] = useState(perfiles[0])
  const [error, setError] = useState("")
  const [estado, setEstado] = useState<"listo" | "preparando" | "hecho">("listo")
  const temporizador = useRef(0)

  function descargar(e: React.FormEvent) {
    e.preventDefault()
    if (nombre.trim().length < 2) return setError("Escribí tu nombre.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim()))
      return setError("Revisá el correo: falta algo.")
    setError("")
    setEstado("preparando")
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => {
      const url = URL.createObjectURL(armarPdf(nombre.trim(), perfil))
      const a = document.createElement("a")
      a.href = url
      a.download = "Estudio-Faro-dossier-2026.pdf"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 4000)
      setEstado("hecho")
    }, 1300)
  }

  return (
    <form onSubmit={descargar} noValidate className="border border-[var(--linea-clara)] p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="etiqueta text-[var(--piedra-claro)]">Dossier del estudio</p>
          <p className="serif mt-2 text-3xl">Obras, servicios y método</p>
        </div>
        <p className="mono shrink-0 text-right text-[0.65rem] text-[var(--piedra-claro)]">
          PDF · 2026
        </p>
      </div>
      {estado === "hecho" ? (
        <div className="aparece mt-6" role="status">
          <p className="flex items-center gap-2 text-sm">
            <Check className="size-4" aria-hidden="true" />
            Listo, {nombre.split(" ")[0]}. El dossier se descargó en tu equipo.
          </p>
          <p className="mt-2 text-xs text-[var(--hueso)]/60">
            En el sitio real también te llegaría a {correo}.
          </p>
          <button type="button" className="boton-linea mt-5" onClick={() => setEstado("listo")}>
            Pedir otro
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="etiqueta text-[var(--piedra-claro)]">Nombre</span>
              <input
                className="campo border-[var(--linea-clara)] focus:border-[var(--hueso)]!"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="etiqueta text-[var(--piedra-claro)]">Correo</span>
              <input
                type="email"
                className="campo border-[var(--linea-clara)] focus:border-[var(--hueso)]!"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="email"
              />
            </label>
          </div>
          <fieldset className="mt-5">
            <legend className="etiqueta mb-2 text-[var(--piedra-claro)]">Soy</legend>
            <div className="flex flex-wrap gap-2">
              {perfiles.map((p) => (
                <label
                  key={p}
                  className={cn(
                    "mono relative inline-flex min-h-10 cursor-pointer items-center border px-3 text-xs transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2",
                    perfil === p
                      ? "border-[var(--hueso)] bg-[var(--hueso)] text-[var(--carbon)]"
                      : "border-[var(--linea-clara)] hover:border-[var(--hueso)]"
                  )}
                >
                  <input
                    type="radio"
                    name={`${id}-perfil`}
                    className="absolute opacity-0"
                    checked={perfil === p}
                    onChange={() => setPerfil(p)}
                  />
                  {p}
                </label>
              ))}
            </div>
          </fieldset>
          {error && (
            <p className="mt-4 text-sm text-[#e0a294]" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="boton relative mt-6 w-full overflow-hidden sm:w-auto" disabled={estado === "preparando"}>
            <Download className="size-4" aria-hidden="true" />
            {estado === "preparando" ? "Preparando el dossier…" : "Descargar dossier"}
            {estado === "preparando" && (
              <span aria-hidden="true" className="tiempo absolute inset-x-0 bottom-0 h-px bg-[var(--carbon)]" style={{ "--duracion": "1300ms" } as React.CSSProperties} />
            )}
          </button>
        </>
      )}
    </form>
  )
}

/** Suscripción al newsletter trimestral (se guarda en este navegador). */
export function Newsletter() {
  const guardado = useClave("faro-newsletter")
  const [correo, setCorreo] = useState("")
  const [aviso, setAviso] = useState("")

  if (guardado) {
    return (
      <div role="status">
        <p className="text-sm text-[var(--hueso)]">
          Ya estás en la lista con <span className="mono text-xs">{guardado}</span>.
        </p>
        <button
          type="button"
          className="subrayado mt-2 text-xs"
          onClick={() => {
            guardarClave("faro-newsletter", null)
            setAviso("Te diste de baja.")
          }}
        >
          Darme de baja
        </button>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim()))
          return setAviso("Revisá el correo: falta algo.")
        setAviso(
          guardarClave("faro-newsletter", correo.trim())
            ? ""
            : "Tu navegador bloquea el almacenamiento: no pudimos guardarte."
        )
      }}
    >
      <label htmlFor="faro-news" className="etiqueta block text-[var(--hueso)]">
        Newsletter trimestral
      </label>
      <p className="mt-2 max-w-xs text-xs leading-relaxed">
        Obras terminadas, notas del diario y visitas abiertas. Cuatro correos al año.
      </p>
      <div className="mt-3 flex max-w-sm border-b border-[var(--linea-clara)] focus-within:border-[var(--hueso)]">
        <input
          id="faro-news"
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[var(--hueso)] outline-none placeholder:text-[var(--piedra)]"
        />
        <button type="submit" className="etiqueta min-h-11 px-2 text-[var(--hueso)]">
          Suscribirme
        </button>
      </div>
      <p className="mt-2 min-h-4 text-xs text-[#e0a294]" aria-live="polite">
        {aviso}
      </p>
    </form>
  )
}
