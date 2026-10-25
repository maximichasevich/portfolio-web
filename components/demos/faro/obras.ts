import { fotosFaro } from "@/components/demos/fotos"
import type { Foto } from "@/lib/demo"

export type Categoria = "Residencial" | "Comercial" | "Interiores"
export type Estado = "Construida" | "En obra" | "En proyecto"

export type Obra = {
  id: string
  nombre: string
  lugar: string
  anio: number
  categoria: Categoria
  m2: number
  foto: Foto
  /** Programa concreto: vivienda unifamiliar, oficinas, etc. */
  tipo: string
  estado: Estado
  /** Coordenadas aproximadas del barrio, para la ficha técnica. */
  coordenadas: string
  cliente: string
  equipo: string[]
  /** Una línea para la grilla y la portada. */
  bajada: string
  /** Texto de la ficha, en párrafos. */
  texto: string[]
}

export const categorias: Categoria[] = [
  "Residencial",
  "Comercial",
  "Interiores",
]

export const obras: Obra[] = [
  {
    id: "carrasco",
    nombre: "Casa Carrasco",
    lugar: "Carrasco, Montevideo",
    anio: 2024,
    categoria: "Residencial",
    m2: 320,
    foto: fotosFaro.carrasco,
    tipo: "Vivienda unifamiliar",
    estado: "Construida",
    coordenadas: "34°53′S 56°03′O",
    cliente: "Privado",
    equipo: ["Inés Barreiro", "Tomás Aguerre", "Sofía Larrañaga"],
    bajada: "Un volumen blanco que se abre al jardín y se cierra a la calle.",
    texto: [
      "La casa se organiza en dos bandas: una franja de servicios, maciza y opaca hacia la calle, y una crujía de estar completamente vidriada que mira al fondo del terreno. Entre ambas, un patio de luz ordena la circulación y ventila todos los ambientes.",
      "La estructura de hormigón queda a la vista en losas y tabiques. Los aleros, calculados según el recorrido del sol, evitan la sobreexposición en verano y dejan entrar la luz baja de invierno hasta el fondo del living.",
    ],
  },
  {
    id: "cordon",
    nombre: "Showroom Cordón",
    lugar: "Cordón, Montevideo",
    anio: 2024,
    categoria: "Comercial",
    m2: 140,
    foto: fotosFaro.cordon,
    tipo: "Local comercial",
    estado: "Construida",
    coordenadas: "34°54′S 56°10′O",
    cliente: "Marca de mobiliario local",
    equipo: ["Joaquín Pereda", "Carolina Méndez"],
    bajada: "Un local de planta libre pensado como una casa en exposición.",
    texto: [
      "El encargo era mostrar mobiliario sin que el local pareciera un depósito. Propusimos recorrer el espacio como si fuera una vivienda: estar, comedor y escritorio se suceden sin tabiques, separados por cambios de piso y de altura de cielorraso.",
      "Toda la iluminación es regulable y está pensada para la fotografía de producto: el local funciona también como set para el catálogo de la marca.",
    ],
  },
  {
    id: "pocitos",
    nombre: "Apartamento Pocitos",
    lugar: "Pocitos, Montevideo",
    anio: 2024,
    categoria: "Interiores",
    m2: 95,
    foto: fotosFaro.pocitos,
    tipo: "Reforma interior",
    estado: "Construida",
    coordenadas: "34°55′S 56°09′O",
    cliente: "Privado",
    equipo: ["Sofía Larrañaga", "Diego Albornoz"],
    bajada: "Un apartamento de los años sesenta recupera su planta original.",
    texto: [
      "Demolimos los agregados de reformas anteriores para volver a la planta pensada por su arquitecto original: un estar pasante con dos frentes y ventilación cruzada.",
      "La carpintería de lapacho se restauró pieza por pieza. El mobiliario fijo, diseñado por el estudio, resuelve el guardado en cada ambiente sin recargar las paredes.",
    ],
  },
  {
    id: "barra",
    nombre: "Casa en La Barra",
    lugar: "La Barra, Maldonado",
    anio: 2023,
    categoria: "Residencial",
    m2: 260,
    foto: fotosFaro.barra,
    tipo: "Vivienda de temporada",
    estado: "Construida",
    coordenadas: "34°55′S 54°52′O",
    cliente: "Privado",
    equipo: ["Inés Barreiro", "Tomás Aguerre"],
    bajada: "Una casa elevada sobre la duna para mirar el mar sin tocarla.",
    texto: [
      "Para no alterar la duna, la casa se apoya en pocos puntos y deja pasar la arena y la vegetación por debajo. El estar se ubica en el nivel superior, con vista franca al Atlántico y protección del viento sur.",
      "Los materiales se eligieron por cómo envejecen frente al mar: madera de eucalipto tratada, chapa sin pintar y hormigón con áridos de la zona.",
    ],
  },
  {
    id: "ciudadvieja",
    nombre: "Oficinas Ciudad Vieja",
    lugar: "Ciudad Vieja, Montevideo",
    anio: 2023,
    categoria: "Comercial",
    m2: 410,
    foto: fotosFaro.ciudadvieja,
    tipo: "Oficinas corporativas",
    estado: "Construida",
    coordenadas: "34°54′S 56°12′O",
    cliente: "Empresa de servicios tecnológicos",
    equipo: ["Joaquín Pereda", "Carolina Méndez", "Diego Albornoz"],
    bajada: "Un edificio de 1910 adaptado al trabajo híbrido.",
    texto: [
      "Mantuvimos los techos altos, las bovedillas y las aberturas de hierro del edificio original, y concentramos las instalaciones nuevas en un núcleo central que libera el perímetro para puestos de trabajo con luz natural.",
      "La planta combina salas cerradas con buena acústica, áreas de trabajo abiertas y una terraza para reuniones informales. La obra se hizo por etapas, sin interrumpir la operación del cliente.",
    ],
  },
  {
    id: "palermo",
    nombre: "Altillo Palermo",
    lugar: "Palermo, Montevideo",
    anio: 2023,
    categoria: "Interiores",
    m2: 70,
    foto: fotosFaro.palermo,
    tipo: "Reforma de altillo",
    estado: "Construida",
    coordenadas: "34°54′S 56°11′O",
    cliente: "Privado",
    equipo: ["Sofía Larrañaga"],
    bajada: "Un altillo en desuso convertido en vivienda bajo la cubierta.",
    texto: [
      "La estructura de madera de la cubierta quedó a la vista y define el ritmo del espacio. Una sola pieza de mobiliario recorre el lado más bajo y concentra cocina, guardado y escritorio.",
      "Las nuevas claraboyas, orientadas al sur, dan una luz pareja todo el día sin recalentar el ambiente.",
    ],
  },
  {
    id: "puntagorda",
    nombre: "Dúplex Punta Gorda",
    lugar: "Punta Gorda, Montevideo",
    anio: 2022,
    categoria: "Residencial",
    m2: 180,
    foto: fotosFaro.puntagorda,
    tipo: "Vivienda en dúplex",
    estado: "Construida",
    coordenadas: "34°54′S 56°05′O",
    cliente: "Privado",
    equipo: ["Tomás Aguerre", "Diego Albornoz"],
    bajada: "Dos viviendas en un mismo padrón, cada una con su jardín.",
    texto: [
      "El terreno en pendiente permitió encastrar dos viviendas que no se ven entre sí: cada una tiene acceso, jardín y vistas propias hacia la rambla.",
      "La envolvente de madera y vidrio se protege con aleros profundos. La construcción en seco redujo la obra a nueve meses.",
    ],
  },
  {
    id: "parquerodo",
    nombre: "Café Parque Rodó",
    lugar: "Parque Rodó, Montevideo",
    anio: 2022,
    categoria: "Comercial",
    m2: 85,
    foto: fotosFaro.parquerodo,
    tipo: "Gastronomía",
    estado: "Construida",
    coordenadas: "34°55′S 56°10′O",
    cliente: "Emprendimiento gastronómico",
    equipo: ["Carolina Méndez", "Joaquín Pereda"],
    bajada: "Una barra larga como único gesto en un local angosto.",
    texto: [
      "En un local de cuatro metros de frente, una barra continua de madera ordena todo: atención, preparación y una mesa compartida al fondo.",
      "El proyecto se entregó con manual de mantenimiento y lista de proveedores, para que el cliente pudiera replicarlo en una segunda sucursal.",
    ],
  },
  {
    id: "trescruces",
    nombre: "Clínica Tres Cruces",
    lugar: "Tres Cruces, Montevideo",
    anio: 2022,
    categoria: "Interiores",
    m2: 60,
    foto: fotosFaro.trescruces,
    tipo: "Consultorio médico",
    estado: "Construida",
    coordenadas: "34°53′S 56°10′O",
    cliente: "Clínica privada",
    equipo: ["Sofía Larrañaga", "Carolina Méndez"],
    bajada: "Un consultorio que se siente más casa que hospital.",
    texto: [
      "La sala de espera se resolvió con luz indirecta, madera clara y asientos individuales para bajar la tensión de quien llega. Los consultorios cumplen la normativa sanitaria sin perder calidez.",
      "Todas las superficies son lavables y los encuentros están redondeados, un requisito de higiene que convertimos en parte del lenguaje del proyecto.",
    ],
  },
]
