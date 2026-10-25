import type { NextConfig } from "next"

/**
 * Encabezados de seguridad de todas las respuestas.
 *
 * Van acá y no en netlify.toml porque en Netlify las páginas de Next.js se
 * sirven con funciones, y a esas respuestas no se les aplican los
 * encabezados de netlify.toml.
 *
 * Content-Security-Policy: solo recursos del propio sitio, más el traductor
 * de Google (selector de idioma). 'unsafe-inline' en scripts es necesario
 * porque las páginas son estáticas y Next.js incluye pequeños scripts en
 * línea; no se carga ningún otro script de terceros.
 */
const politicaContenido = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://www.gstatic.com",
  "img-src 'self' data: blob: https://www.gstatic.com https://fonts.gstatic.com https://translate.google.com https://translate.googleapis.com https://www.google.com",
  "font-src 'self' data:",
  "connect-src 'self' https://translate.googleapis.com https://translate-pa.googleapis.com https://translate.google.com",
  "frame-src 'self' https://translate.google.com https://translate.googleapis.com",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ")

const encabezados = [
  { key: "Content-Security-Policy", value: politicaContenido },
  // El navegador recuerda usar siempre HTTPS (2 años, también subdominios).
  // Sin "preload" a propósito: es difícil de deshacer.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
]

const nextConfig: NextConfig = {
  // No anunciar en cada respuesta que el sitio usa Next.js.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: encabezados }]
  },
}

export default nextConfig
