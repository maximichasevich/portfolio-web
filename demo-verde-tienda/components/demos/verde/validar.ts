/** Validaciones de formularios con mensajes claros, en voseo. */

export function validarNombre(valor: string) {
  const v = valor.trim()
  if (!v) return "Contanos tu nombre."
  if (v.length < 3) return "El nombre tiene que tener al menos 3 letras."
  if (/\d/.test(v)) return "El nombre no puede tener números."
  return undefined
}

export function validarEmail(valor: string) {
  const v = valor.trim()
  if (!v) return "Necesitamos un email para mandarte el comprobante."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
    return "Revisá el email: tiene que ser como nombre@correo.com."
  return undefined
}

export function validarTelefono(valor: string, obligatorio = true) {
  const v = valor.replace(/[\s\-().]/g, "")
  if (!v) return obligatorio ? "Dejanos un teléfono por si hay que coordinar la entrega." : undefined
  const local = v.replace(/^\+?598/, "0").replace(/^0(?=[24]\d{7}$)/, "")
  if (/^09\d{7}$/.test(local) || /^[24]\d{7}$/.test(local)) return undefined
  return "Poné un celular uruguayo, por ejemplo 099 123 456."
}

export function validarObligatorio(valor: string, mensaje: string) {
  return valor.trim() ? undefined : mensaje
}

/** Devuelve solo los errores que existen. */
export function limpiarErrores<T extends Record<string, string | undefined>>(
  errores: T
) {
  return Object.fromEntries(
    Object.entries(errores).filter(([, v]) => v)
  ) as Partial<Record<keyof T, string>>
}

/** Mueve el foco al primer campo con error. */
export function enfocarPrimerError(ids: string[]) {
  window.requestAnimationFrame(() => {
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) {
        el.focus()
        break
      }
    }
  })
}
