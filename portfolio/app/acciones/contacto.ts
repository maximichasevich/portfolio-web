"use server"

import { createHash } from "node:crypto"
import { headers } from "next/headers"

import { paquetes } from "@/data/precios"
import { LIMITES } from "@/lib/limites-contacto"
import { clienteSupabase } from "@/lib/supabase"

/** Resultado que muestra el formulario después de enviar. */
export type EstadoContacto = {
  estado: "inicial" | "ok" | "error"
  mensaje?: string
  /** Errores por campo, para marcarlos en el formulario. */
  errores?: Partial<Record<"nombre" | "email" | "telefono" | "mensaje", string>>
}

const opcionesPaquete = [
  ...paquetes.map((p) => p.nombre),
  "Otro",
  "Todavía no sé",
]

const texto = (v: FormDataEntryValue | null) =>
  typeof v === "string" ? v.trim() : ""

/** Tiempo mínimo para completar el formulario: menos que esto es un robot. */
const MINIMO_MS = 3000

const respuestaOk = {
  estado: "ok",
  mensaje: "¡Gracias! Te respondo en el día.",
} as const

/**
 * Huella anónima del visitante: SHA-256 de su IP con una sal secreta.
 * Se usa solo para el límite de envíos de la base; la IP no se guarda.
 */
async function huellaVisitante() {
  const sal = process.env.MENSAJES_SAL
  if (!sal) return null
  const h = await headers()
  const ip =
    h.get("x-nf-client-connection-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip")
  if (!ip) return null
  return createHash("sha256").update(`${sal}:${ip}`).digest("hex")
}

/**
 * Guarda un mensaje del formulario de contacto en Supabase.
 * Corre en el servidor: valida todo de nuevo (no se confía en el navegador)
 * y descarta envíos automáticos con un campo trampa invisible.
 */
export async function enviarMensaje(
  _anterior: EstadoContacto,
  datos: FormData
): Promise<EstadoContacto> {
  // Campo trampa: las personas no lo ven; los robots lo completan.
  if (texto(datos.get("sitio_web"))) return respuestaOk

  // Tiempo mínimo: el formulario guarda cuándo empezó a completarse.
  const inicio = Number(texto(datos.get("inicio")))
  if (inicio > 0 && Date.now() - inicio < MINIMO_MS) return respuestaOk

  const nombre = texto(datos.get("nombre"))
  const email = texto(datos.get("email"))
  const telefono = texto(datos.get("telefono"))
  const paquete = texto(datos.get("paquete"))
  const escrito = texto(datos.get("mensaje"))
  const resumen = texto(datos.get("resumen")).slice(0, 1000)
  // Mensaje final: lo que escribió más las opciones que tocó en el formulario.
  const mensaje = [escrito, resumen].filter(Boolean).join("\n\n")

  const errores: EstadoContacto["errores"] = {}
  if (nombre.length < 2 || nombre.length > LIMITES.nombre)
    errores.nombre = "Escribí tu nombre."
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > LIMITES.email)
    errores.email = "Revisá el correo: falta algo."
  if (telefono && !/^[+\d\s()-]{6,40}$/.test(telefono))
    errores.telefono = "El teléfono solo puede tener números, espacios y +."
  if (escrito.length < 10 && resumen.length === 0)
    errores.mensaje = "Contame un poco más (al menos 10 caracteres)."
  else if (mensaje.length < 10 || mensaje.length > LIMITES.mensaje)
    errores.mensaje = "Contame un poco más (al menos 10 caracteres)."
  if (Object.keys(errores).length > 0) {
    return { estado: "error", mensaje: "Revisá los campos marcados.", errores }
  }

  const supabase = clienteSupabase()
  if (!supabase) {
    console.error("Faltan SUPABASE_URL o SUPABASE_ANON_KEY")
    return {
      estado: "error",
      mensaje:
        "No pude enviar el mensaje en este momento. Escribime por WhatsApp o por correo.",
    }
  }

  const { error } = await supabase.from("mensajes").insert({
    nombre,
    email,
    telefono: telefono || null,
    paquete: opcionesPaquete.includes(paquete) ? paquete : null,
    mensaje,
    huella: await huellaVisitante(),
  })

  if (error) {
    // Límite de envíos (lo aplica la base con un disparador).
    if (error.code === "P0001") {
      return {
        estado: "error",
        mensaje:
          "Recibí varios mensajes tuyos seguidos. Probá de nuevo en un rato o escribime por WhatsApp.",
      }
    }
    // Solo en el registro del servidor; al visitante no se le muestran detalles.
    console.error("Error al guardar el mensaje:", error.code)
    return {
      estado: "error",
      mensaje:
        "No pude enviar el mensaje en este momento. Escribime por WhatsApp o por correo.",
    }
  }

  return {
    estado: "ok",
    mensaje: `¡Gracias, ${nombre.split(" ")[0]}! Recibí tu mensaje y te respondo en el día.`,
  }
}
