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
  { id: "laboratorio", nombre: "Laboratorio", foto: fotosFaro.barra },
  { id: "estudio", nombre: "Estudio", foto: fotosFaro.ciudadvieja },
  { id: "servicios", nombre: "Servicios", foto: fotosFaro.pocitos },
  { id: "proceso", nombre: "Proceso", foto: fotosFaro.puntagorda },
  { id: "honorarios", nombre: "Honorarios", foto: fotosFaro.cordon },
  { id: "diario", nombre: "Diario", foto: fotosFaro.parquerodo },
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

/** Preguntas frecuentes sobre honorarios, etapas y obra. */
export const preguntas = [
  {
    p: "¿Cuánto cobran de honorarios?",
    r: "Para obra nueva, entre el 8 % y el 12 % del costo de construcción, según la escala y la complejidad. Incluye anteproyecto, proyecto ejecutivo, gestión de permisos y dirección de obra. Los interiorismos y las reformas chicas se cotizan por honorario fijo. Siempre firmamos un contrato con el monto cerrado antes de empezar.",
  },
  {
    p: "¿Cómo se pagan los honorarios?",
    r: "En cuotas atadas a cada etapa: un 15 % al firmar, un 25 % con el anteproyecto aprobado, un 30 % con el proyecto ejecutivo y el resto en cuotas mensuales durante la obra. Nunca pagás por una etapa que no recibiste.",
  },
  {
    p: "¿La primera reunión tiene costo?",
    r: "No. Es una conversación de una hora, en el estudio, en el terreno o por videollamada. Salís con una primera idea de plazos, costos y viabilidad, sin compromiso.",
  },
  {
    p: "¿Cuánto tarda una vivienda de principio a fin?",
    r: "Una casa de 250 a 350 m² lleva entre 20 y 28 meses: unos 5 meses de proyecto, de 2 a 4 de permisos y de 12 a 18 de obra. Con construcción en seco la obra puede bajar a 9 o 10 meses.",
  },
  {
    p: "¿Trabajan con una empresa constructora fija?",
    r: "No. Pedimos precios a tres empresas de confianza con el mismo pliego y te presentamos un comparativo. Vos elegís; nosotros controlamos que se cumpla lo contratado.",
  },
  {
    p: "¿Qué pasa si el presupuesto se desvía?",
    r: "Cada mes te enviamos un certificado de avance con lo gastado y lo que falta. Si aparece un imprevisto, lo presentamos con alternativas y su costo antes de decidir. En los últimos cinco años, el desvío promedio de nuestras obras fue del 4,2 %.",
  },
  {
    p: "¿Hacen proyectos fuera de Montevideo?",
    r: "Sí. Trabajamos en toda la costa, de Colonia a Rocha, y en el interior para chacras y bodegas. Fuera de Montevideo y Maldonado se suman los viáticos de las visitas de obra.",
  },
]

/** Diario del estudio: notas breves. */
export const articulos = [
  {
    id: "aleros",
    titulo: "Un alero bien calculado vale más que un aire acondicionado",
    bajada: "Cómo usamos el recorrido del sol en Montevideo para proyectar casas frescas en verano y luminosas en invierno.",
    fecha: "12 de octubre de 2026",
    autor: "Inés Barreiro",
    lectura: 5,
    tema: "Proyecto",
    foto: fotosFaro.carrasco,
    texto: [
      "En Montevideo el sol del mediodía sube casi 79° en diciembre y apenas 32° en junio. Esa diferencia es la herramienta más barata que tiene un proyecto: un alero de 1,20 m sobre una fachada norte deja la carpintería en sombra todo el verano y, en invierno, permite que la luz entre casi cuatro metros hacia dentro del estar.",
      "Antes de dibujar la primera planta hacemos un estudio solar del terreno: horas de sol en cada fachada, sombras de los vecinos y de los árboles existentes. Con eso decidimos dónde van el estar y los dormitorios, y qué tamaño tienen las aberturas.",
      "El resultado se nota en la factura de la luz y, sobre todo, en cómo se vive la casa. Una buena orientación no se ve en las fotos, pero se siente todos los días.",
    ],
  },
  {
    id: "presupuesto",
    titulo: "Por qué el presupuesto se arma antes que los renders",
    bajada: "Tres decisiones que tomamos con el cliente en las primeras semanas para que la obra no se desarme a mitad de camino.",
    fecha: "28 de agosto de 2026",
    autor: "Diego Albornoz",
    lectura: 4,
    tema: "Obra",
    foto: fotosFaro.puntagorda,
    texto: [
      "La mayoría de los desvíos de costo se definen en el anteproyecto, no en la obra. Por eso, junto con la primera propuesta, entregamos un presupuesto por rubros con tres escenarios de terminación.",
      "Fijamos una reserva para imprevistos de entre el 7 % y el 10 %, elegimos temprano los rubros que más pesan (aberturas, revestimientos, equipamiento) y pedimos precios reales antes de cerrar el proyecto ejecutivo.",
      "Así, cuando llegan los renders, ya sabemos que lo que muestran se puede construir con el dinero disponible.",
    ],
  },
  {
    id: "ciudadvieja",
    titulo: "Rehabilitar en la Ciudad Vieja: lo que aprendimos en cinco edificios",
    bajada: "Bovedillas, muros de un metro y permisos patrimoniales. Notas de obra para quien piensa comprar un edificio antiguo.",
    fecha: "3 de julio de 2026",
    autor: "Joaquín Pereda",
    lectura: 7,
    tema: "Patrimonio",
    foto: fotosFaro.ciudadvieja,
    texto: [
      "Un edificio de principios del siglo XX suele tener una estructura más noble de lo que aparenta: muros portantes de ladrillo macizo, bovedillas sobre perfiles de hierro y techos de cuatro metros que hoy serían impagables.",
      "El trabajo está en las instalaciones. Concentrarlas en un núcleo nuevo libera las fachadas y evita picar muros originales. Y conviene pedir el relevamiento estructural antes de firmar la compra, no después.",
      "Los permisos en zona patrimonial llevan entre cuatro y seis meses. Con un buen anteproyecto y una reunión previa con la comisión, el trámite se vuelve previsible.",
    ],
  },
  {
    id: "madera",
    titulo: "Materiales que envejecen bien frente al mar",
    bajada: "Eucalipto, chapa sin pintar y hormigón con áridos locales: una paleta para la costa que mejora con los años.",
    fecha: "19 de mayo de 2026",
    autor: "Tomás Aguerre",
    lectura: 6,
    tema: "Materiales",
    foto: fotosFaro.barra,
    texto: [
      "La sal, el viento y la arena castigan cualquier terminación. En la costa preferimos materiales que no necesitan pintura: maderas tratadas que toman un gris plateado, chapa galvanizada y hormigones que se manchan de forma pareja.",
      "El mantenimiento se planifica desde el proyecto: aleros que protegen las carpinterías, goterones en todos los antepechos y encuentros pensados para que el agua escurra.",
      "Una casa de temporada tiene que poder quedar cerrada seis meses y abrirse sin sorpresas. Esa es la vara con la que elegimos cada material.",
    ],
  },
]

/** Búsquedas laborales abiertas. */
export const busquedas = [
  {
    puesto: "Arquitecta o arquitecto con 5 años de experiencia",
    area: "Proyecto residencial",
    modalidad: "Presencial · Ciudad Vieja · Jornada completa",
    descripcion:
      "Para desarrollar anteproyectos y proyectos ejecutivos de viviendas, coordinar asesores y acompañar a las personas socias en las reuniones con clientes.",
    requisitos: [
      "Título de arquitectura y al menos 5 años en estudio",
      "Manejo avanzado de Revit o ArchiCAD",
      "Experiencia en permisos de la Intendencia de Montevideo",
      "Buena redacción y criterio para presentar alternativas",
    ],
  },
  {
    puesto: "Jefa o jefe de obra",
    area: "Dirección de obra",
    modalidad: "Montevideo y Maldonado · Jornada completa · Vehículo propio",
    descripcion:
      "Para seguir dos o tres obras en simultáneo: visitas semanales, coordinación de gremios, certificaciones y registro fotográfico para el área de clientes.",
    requisitos: [
      "Arquitectura, ingeniería civil o técnico en construcción",
      "Experiencia en obras residenciales de alta gama",
      "Manejo de cómputo y presupuesto",
      "Libreta de conducir vigente",
    ],
  },
]
