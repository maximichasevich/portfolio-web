/**
 * Largos máximos de los campos del formulario de contacto. Son los mismos
 * que controla la base de datos (supabase/migrations). Están aparte porque
 * un archivo "use server" solo puede exportar funciones.
 */
export const LIMITES = {
  nombre: 100,
  email: 200,
  telefono: 40,
  mensaje: 4000,
} as const
