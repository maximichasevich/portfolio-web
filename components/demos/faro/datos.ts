import { fotosFaro } from "@/components/demos/fotos"

/** Datos fijos del estudio (todos ficticios). */
export const estudio = {
  correo: "hola@estudiofaro.uy",
  telefono: "+598 2916 4810",
  telefonoHref: "tel:+59829164810",
  direccion: "Rincón 620, piso 3",
  barrio: "Ciudad Vieja, Montevideo",
  horario: "Lunes a viernes, de 9 a 18 h",
  coordenadas: "34°54′28″S 56°12′40″O",
  redes: [
    { nombre: "Instagram", href: "https://www.instagram.com/" },
    { nombre: "LinkedIn", href: "https://www.linkedin.com/" },
    { nombre: "Pinterest", href: "https://www.pinterest.com/" },
  ],
}

/** Navegación principal (menú de pantalla completa). */
export const secciones = [
  { id: "obras", nombre: "Obras", foto: fotosFaro.carrasco },
  { id: "estudio", nombre: "Estudio", foto: fotosFaro.ciudadvieja },
  { id: "servicios", nombre: "Servicios", foto: fotosFaro.pocitos },
  { id: "proceso", nombre: "Proceso", foto: fotosFaro.puntagorda },
  { id: "prensa", nombre: "Prensa", foto: fotosFaro.barra },
  { id: "contacto", nombre: "Contacto", foto: fotosFaro.palermo },
]

export const equipo = [
  { nombre: "Inés Barreiro", rol: "Arquitecta · socia fundadora", desde: 2015 },
  { nombre: "Tomás Aguerre", rol: "Arquitecto · socio fundador", desde: 2015 },
  { nombre: "Carolina Méndez", rol: "Arquitecta · proyectos comerciales", desde: 2017 },
  { nombre: "Sofía Larrañaga", rol: "Interiorista", desde: 2018 },
  { nombre: "Joaquín Pereda", rol: "Arquitecto · dirección de obra", desde: 2019 },
  { nombre: "Diego Albornoz", rol: "Técnico en construcción · presupuestos", desde: 2021 },
]

export const servicios = [
  {
    titulo: "Arquitectura residencial",
    texto:
      "Viviendas nuevas, ampliaciones y reformas integrales. Desde el estudio del terreno hasta la entrega de llaves.",
    detalle: ["Estudio de viabilidad", "Anteproyecto y proyecto ejecutivo", "Permisos municipales"],
  },
  {
    titulo: "Espacios comerciales y corporativos",
    texto:
      "Oficinas, locales, gastronomía y salud. Proyectos que se ajustan a la operación de tu empresa y a sus plazos.",
    detalle: ["Programa y relevamiento", "Obra por etapas", "Manual de marca aplicado al espacio"],
  },
  {
    titulo: "Interiorismo",
    texto:
      "Luz, materiales, mobiliario a medida y selección de piezas. Para obra nueva o para transformar lo que ya tenés.",
    detalle: ["Mobiliario a medida", "Iluminación", "Curaduría de piezas y arte"],
  },
  {
    titulo: "Desarrollos inmobiliarios",
    texto:
      "Acompañamos a desarrolladores desde la compra del terreno: cabida, producto, imagen comercial y dirección de obra.",
    detalle: ["Estudios de cabida", "Diseño de producto", "Renders y material de venta"],
  },
  {
    titulo: "Dirección de obra",
    texto:
      "Coordinamos gremios, controlamos costos y certificamos avances. Vas a saber en qué está tu obra cada semana.",
    detalle: ["Licitación y comparativo de precios", "Visitas semanales", "Informe de avance y posventa"],
  },
]

export const proceso = [
  {
    titulo: "Primera reunión",
    plazo: "Sin cargo",
    texto:
      "Nos contás qué querés hacer, visitamos el lugar si hace falta y te damos una primera idea de plazos y costos.",
  },
  {
    titulo: "Anteproyecto",
    plazo: "4 a 6 semanas",
    texto:
      "Estudiamos el terreno y la normativa y presentamos dos o tres alternativas con maquetas, imágenes y un costo estimado.",
  },
  {
    titulo: "Proyecto ejecutivo y permisos",
    plazo: "8 a 12 semanas",
    texto:
      "Desarrollamos todos los planos y detalles, pedimos precios a empresas de confianza y gestionamos el permiso de construcción.",
  },
  {
    titulo: "Obra",
    plazo: "Según el proyecto",
    texto:
      "Dirigimos la obra con visitas semanales. Desde el área de clientes ves etapas, documentos y próximas reuniones.",
  },
  {
    titulo: "Entrega y posventa",
    plazo: "12 meses",
    texto:
      "Entregamos la obra con planos conforme a obra, garantías y un año de seguimiento para cualquier ajuste.",
  },
]

export const reconocimientos = [
  { anio: 2025, titulo: "Premio Medianera a la vivienda unifamiliar", obra: "Casa Carrasco", tipo: "Primer premio" },
  { anio: 2024, titulo: "Bienal Rioplatense de Arquitectura", obra: "Casa en La Barra", tipo: "Selección oficial" },
  { anio: 2024, titulo: "Premio Interiores del Sur", obra: "Apartamento Pocitos", tipo: "Mención" },
  { anio: 2023, titulo: "Concurso Rehabilitar la Ciudad Vieja", obra: "Oficinas Ciudad Vieja", tipo: "Segundo premio" },
  { anio: 2022, titulo: "Anuario de Arquitectura Comercial", obra: "Café Parque Rodó", tipo: "Publicación" },
]

export const prensa = [
  { medio: "Revista Plano Sur", nota: "La casa que mira al jardín", anio: 2025 },
  { medio: "Suplemento Habitar", nota: "Cinco estudios jóvenes de Montevideo", anio: 2024 },
  { medio: "Cuaderno de Obra", nota: "Construir sobre la duna", anio: 2024 },
  { medio: "Diseño Litoral", nota: "Oficinas que respetan su edificio", anio: 2023 },
]

export const cifras = [
  { valor: "48", texto: "obras terminadas" },
  { valor: "10", texto: "años de estudio" },
  { valor: "62.000", texto: "m² proyectados" },
  { valor: "7", texto: "premios y menciones" },
]
