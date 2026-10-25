import "server-only"

import { createClient } from "@supabase/supabase-js"

/**
 * Cliente de Supabase para usar solo en el servidor (acciones de servidor).
 *
 * Usa la clave pública ("anon" o "publishable"): la tabla de mensajes solo
 * permite insertar con esa clave (ver supabase/mensajes.sql), así que
 * aunque la clave se filtrara no se podrían leer los mensajes.
 * Las variables van en .env.local (local) y en Netlify (publicado).
 */
export function clienteSupabase() {
  const url = process.env.SUPABASE_URL
  const clave = process.env.SUPABASE_ANON_KEY
  if (!url || !clave) return null
  return createClient(url, clave, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
