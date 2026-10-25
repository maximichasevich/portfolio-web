/**
 * Proyectos que se muestran en el portfolio.
 *
 * Para agregar uno nuevo: copiá un bloque, cambiá los datos y subí la imagen
 * a /public/proyectos/. No hace falta tocar ningún componente.
 */
export type Proyecto = {
  /** Identificador corto, sin espacios (se usa como clave y en los anclajes). */
  slug: string
  titulo: string
  /** Una línea que explique qué es el negocio y qué se hizo. */
  descripcion: string
  /**
   * Ruta dentro de /public, por ejemplo "/proyectos/la-espiga-v2.webp".
   * Si reemplazás una imagen, usá un nombre nuevo: Next y el navegador
   * guardan copias por nombre y seguirían mostrando la anterior.
   */
  imagen: string
  tecnologias: string[]
  /** URL del sitio. Puede ser una ruta interna ("/proyectos/...") o una URL externa. Si todavía no está online, dejá "#". */
  link: string
  /** Tipo de trabajo, en palabras que entienda un cliente. */
  tipo: "Sitio para negocio" | "Página de presentación" | "Tienda online"
  /** Año de entrega. */
  anio: number
  /** Color de acento del proyecto (se usa en fondos y detalles). */
  color: string
}

export const proyectos: Proyecto[] = [
  {
    slug: "la-espiga",
    titulo: "La Espiga",
    descripcion:
      "Panadería de barrio en Pocitos. Carta tipo pizarra, bolsa de pedido con hora de retiro y pedidos directos por WhatsApp para que dejen de atender por teléfono.",
    imagen: "/proyectos/la-espiga-v2.webp",
    tecnologias: ["Next.js", "Tailwind CSS", "WhatsApp Business"],
    link: "/proyectos/la-espiga",
    tipo: "Sitio para negocio",
    anio: 2025,
    color: "#E9B949",
  },
  {
    slug: "estudio-faro",
    titulo: "Estudio Faro",
    descripcion:
      "Estudio de arquitectura. Portfolio editorial de obras con fichas técnicas, área de clientes para seguir cada obra y agenda de reuniones por pasos.",
    imagen: "/proyectos/estudio-faro-v2.webp",
    tecnologias: ["Next.js", "Sanity CMS", "Motion"],
    link: "/proyectos/estudio-faro",
    tipo: "Página de presentación",
    anio: 2025,
    color: "#7C5CFF",
  },
  {
    slug: "verde-tienda",
    titulo: "Verde Tienda",
    descripcion:
      "Vivero con venta online. Buscador, cuenta de cliente, favoritos, quiz para elegir planta y compra por pasos con Mercado Pago y envíos.",
    imagen: "/proyectos/verde-tienda-v2.webp",
    tecnologias: ["Next.js", "Mercado Pago", "Supabase"],
    link: "/proyectos/verde-tienda",
    tipo: "Tienda online",
    anio: 2026,
    color: "#3FD68C",
  },
]
