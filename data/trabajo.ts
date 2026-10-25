/**
 * Cómo trabajo y ejemplos del portfolio, con más detalle que perfil.ts.
 * Los textos están pensados para un dueño de negocio, sin jerga técnica.
 */

export type Etapa = {
  /** Código corto para el panel tipo HUD. */
  codigo: string
  titulo: string
  duracion: string
  resumen: string
  /** Lo que hacemos en esta etapa. */
  hacemos: string[]
  /** Lo que el cliente recibe al terminar la etapa. */
  recibis: string[]
  /** Lo que necesito del cliente para avanzar. */
  necesito: string[]
}

export const etapas: Etapa[] = [
  {
    codigo: "BRIEF",
    titulo: "Charla inicial",
    duracion: "30 min · sin costo",
    resumen:
      "Me contás tu negocio, a quién le vendés y qué querés que pase cuando alguien entra a tu página.",
    hacemos: [
      "Entendemos tu negocio y a tus clientes",
      "Definimos el objetivo: que te escriban, que compren o que te conozcan",
      "Miramos a tu competencia y qué hace bien o mal",
    ],
    recibis: [
      "Presupuesto cerrado por escrito, sin letra chica",
      "Fecha de entrega comprometida",
      "Lista de lo que va a tener la página",
    ],
    necesito: ["30 minutos tuyos", "Si tenés, tu logo y fotos del negocio"],
  },
  {
    codigo: "PLAN",
    titulo: "Estrategia y contenido",
    duracion: "2 a 4 días",
    resumen:
      "Ordeno qué va en cada sección y escribo los textos para que se entiendan en cinco segundos.",
    hacemos: [
      "Mapa de la página: qué secciones y en qué orden",
      "Textos pensados para vender y para aparecer en Google",
      "Palabras clave de tu rubro y tu barrio",
    ],
    recibis: [
      "El esquema de la página para aprobar",
      "Los textos listos para revisar y corregir",
    ],
    necesito: [
      "Tus comentarios sobre los textos",
      "Datos: horarios, precios, contacto",
    ],
  },
  {
    codigo: "DISEÑO",
    titulo: "Diseño a medida",
    duracion: "1 semana",
    resumen:
      "Te muestro cómo se va a ver en computadora y en celular antes de programar una sola línea.",
    hacemos: [
      "Estilo propio según tu público, sin plantillas",
      "Diseño para celular primero, después computadora",
      "Hasta dos rondas de cambios incluidas",
    ],
    recibis: [
      "Un enlace para ver el diseño desde tu celular",
      "La paleta, las fuentes y el estilo de tu marca ordenados",
    ],
    necesito: ["Tu opinión sincera", "Aprobación del diseño final"],
  },
  {
    codigo: "BUILD",
    titulo: "Desarrollo",
    duracion: "1 a 3 semanas",
    resumen:
      "Construyo la página real: rápida, segura y con todo lo que acordamos funcionando.",
    hacemos: [
      "Programación a medida con tecnología actual",
      "WhatsApp, mapas, formularios, pagos o carrito según el caso",
      "Pruebas en celulares reales y en conexiones lentas",
    ],
    recibis: [
      "Un enlace de prueba que se actualiza con cada avance",
      "Reportes cortos por WhatsApp, sin tecnicismos",
    ],
    necesito: [
      "Probarla y contarme qué ves",
      "Accesos a dominio o redes si ya los tenés",
    ],
  },
  {
    codigo: "LAUNCH",
    titulo: "Publicación y soporte",
    duracion: "1 día + 30 días de soporte",
    resumen:
      "La publico en tu dominio, la doy de alta en Google y me quedo cerca el primer mes.",
    hacemos: [
      "Publicación en tu dominio con certificado de seguridad",
      "Alta en Google y en Google Maps",
      "Medición de visitas para saber de dónde llega la gente",
    ],
    recibis: [
      "La página online, a tu nombre",
      "Una videollamada para enseñarte a usarla",
      "30 días de ajustes incluidos",
    ],
    necesito: [
      "Contarme qué te dicen tus clientes",
      "Nada más: el resto corre por mi cuenta",
    ],
  },
]

/** Compromisos que rigen todo el trabajo. */
export const compromisos = [
  {
    titulo: "Precio cerrado",
    texto: "El presupuesto que acordamos es el que pagás.",
  },
  {
    titulo: "Todo a tu nombre",
    texto: "Dominio, hosting y código quedan a tu nombre.",
  },
  {
    titulo: "Respuesta en el día",
    texto: "Te contesto el mismo día hábil, siempre.",
  },
  {
    titulo: "Sin plantillas",
    texto: "Cada diseño se hace desde cero para tu negocio.",
  },
]

export type Ejemplo = {
  slug: string
  nombre: string
  rubro: string
  publico: string
  ruta: string
  color: string
  /** Captura de escritorio (970×700). */
  escritorio: string
  /** Captura de celular (780×1688). */
  celular: string
  funciones: string[]
  dato: { valor: string; etiqueta: string }
}

export const ejemplos: Ejemplo[] = [
  {
    slug: "la-espiga",
    nombre: "La Espiga",
    rubro: "Panadería de barrio",
    publico: "Vecinos, familias y gente mayor",
    ruta: "/proyectos/la-espiga",
    color: "#E9B949",
    escritorio: "/portfolio/la-espiga-d0.webp",
    celular: "/portfolio/la-espiga-m0.webp",
    funciones: [
      "Carta tipo pizarra con pedido por WhatsApp",
      "Bolsa con hora de retiro y datos guardados",
      "Estado “abierto ahora” en tiempo real",
      "Botón de letra grande para leer mejor",
    ],
    dato: { valor: "0", etiqueta: "llamadas para encargar" },
  },
  {
    slug: "estudio-faro",
    nombre: "Estudio Faro",
    rubro: "Estudio de arquitectura",
    publico: "Clientes de alto nivel y desarrolladores",
    ruta: "/proyectos/estudio-faro",
    color: "#c9a96e",
    escritorio: "/portfolio/estudio-faro-d0.webp",
    celular: "/portfolio/estudio-faro-m0.webp",
    funciones: [
      "Portfolio editorial con fichas técnicas",
      "Área de clientes para seguir la obra",
      "Agenda de reuniones en 5 pasos",
      "Menú de pantalla completa",
    ],
    dato: { valor: "9", etiqueta: "obras con ficha propia" },
  },
  {
    slug: "verde-tienda",
    nombre: "Verde Tienda",
    rubro: "Tienda online de plantas",
    publico: "Jóvenes que compran desde el celular",
    ruta: "/proyectos/verde-tienda",
    color: "#3FD68C",
    escritorio: "/portfolio/verde-tienda-d0.webp",
    celular: "/portfolio/verde-tienda-m0.webp",
    funciones: [
      "Buscador, favoritos y cuenta de cliente",
      "Compra en 4 pasos con Mercado Pago",
      "Quiz “¿Qué planta va con vos?”",
      "Envíos por zona con envío gratis",
    ],
    dato: { valor: "4", etiqueta: "pasos para comprar" },
  },
]

/** Todas las capturas, para el muro 3D. */
export const capturas = ["la-espiga", "estudio-faro", "verde-tienda"].flatMap(
  (s) => [0, 1, 2, 3, 4].map((i) => `/portfolio/${s}-d${i}.webp`)
)
