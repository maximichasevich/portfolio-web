import type { LucideIcon } from "lucide-react"
import {
  Cake,
  CakeSlice,
  Coffee,
  Cookie,
  Croissant,
  Egg,
  Pizza,
  Sandwich,
  Wheat,
  WheatOff,
} from "lucide-react"

import { fotosEspiga } from "@/components/demos/fotos"
import type { Foto } from "@/lib/demo"

/** "promos" no tiene pestaña en la pizarra: se muestra en la vitrina. */
export type Categoria = "panes" | "facturas" | "dulces" | "cafe" | "promos"

export const categorias: {
  id: Exclude<Categoria, "promos">
  nombre: string
  bajada: string
}[] = [
  {
    id: "panes",
    nombre: "Panes",
    bajada: "Masa madre propia y harinas uruguayas.",
  },
  {
    id: "facturas",
    nombre: "Bizcochos y facturas",
    bajada: "Salen calentitos a las 7:00 y a las 16:00.",
  },
  {
    id: "dulces",
    nombre: "Dulces",
    bajada: "Recetas de la abuela Nilda, sin atajos.",
  },
  {
    id: "cafe",
    nombre: "Café y salado",
    bajada: "Para llevar o para la merienda en casa.",
  },
]

export type Alergeno = "gluten" | "lactosa" | "huevo" | "frutos-secos" | "sesamo"

export const nombresAlergenos: Record<Alergeno, string> = {
  gluten: "Gluten (trigo)",
  lactosa: "Lactosa (leche)",
  huevo: "Huevo",
  "frutos-secos": "Frutos secos",
  sesamo: "Sésamo",
}

export type Filtro = "sin-tacc" | "sin-lactosa" | "sin-huevo" | "vegano"

export const filtros: { id: Filtro; nombre: string }[] = [
  { id: "sin-tacc", nombre: "Sin TACC" },
  { id: "sin-lactosa", nombre: "Sin lactosa" },
  { id: "sin-huevo", nombre: "Sin huevo" },
  { id: "vegano", nombre: "Vegano" },
]

export type Producto = {
  id: string
  categoria: Categoria
  nombre: string
  detalle: string
  precio: number
  /** Precio de lista, para las promos. */
  antes?: number
  /** Foto real, si hay una que corresponda. */
  foto?: Foto
  /** Dibujo a tiza para los productos sin foto. */
  icono: LucideIcon
  /** Nota corta escrita en la pizarra, por ejemplo la horneada. */
  nota?: string
  ingredientes: string
  alergenos: Alergeno[]
  /** Hecho con premezcla certificada, en sector separado. */
  sinTacc?: boolean
  vegano?: boolean
  conservacion?: string
}

export function cumpleFiltro(p: Producto, f: Filtro) {
  if (f === "sin-tacc") return p.sinTacc === true
  if (f === "sin-lactosa") return !p.alergenos.includes("lactosa")
  if (f === "sin-huevo") return !p.alergenos.includes("huevo")
  return p.vegano === true
}

export const carta: Producto[] = [
  // Panes
  {
    id: "campo",
    categoria: "panes",
    nombre: "Pan de campo",
    detalle: "Masa madre, 48 horas de fermentación. 800 g.",
    precio: 180,
    foto: fotosEspiga.campo,
    icono: Wheat,
    nota: "Se termina temprano",
    ingredientes: "Harina de trigo uruguaya, agua, masa madre y sal.",
    alergenos: ["gluten"],
    vegano: true,
    conservacion:
      "Dura 4 o 5 días en una bolsa de tela. Se puede congelar en rodajas.",
  },
  {
    id: "semillas",
    categoria: "panes",
    nombre: "Pan integral de semillas",
    detalle: "Lino, girasol y sésamo. 600 g.",
    precio: 220,
    foto: fotosEspiga.semillas,
    icono: Wheat,
    ingredientes:
      "Harina integral y blanca de trigo, semillas de lino, girasol y sésamo, masa madre y sal.",
    alergenos: ["gluten", "sesamo"],
    vegano: true,
    conservacion: "Dura 4 días en una bolsa de tela. Ideal tostado.",
  },
  {
    id: "flauta",
    categoria: "panes",
    nombre: "Flauta",
    detalle: "Corteza crocante, miga liviana. 250 g.",
    precio: 70,
    icono: Wheat,
    nota: "Sale 7:00 y 16:00",
    ingredientes: "Harina de trigo, agua, levadura, sal y una pizca de malta.",
    alergenos: ["gluten"],
    vegano: true,
    conservacion: "Es para el día. Al otro día, cinco minutos de horno.",
  },
  {
    id: "felipes",
    categoria: "panes",
    nombre: "Felipitos",
    detalle: "Seis panes chicos, ideales para la merienda.",
    precio: 90,
    icono: Wheat,
    ingredientes: "Harina de trigo, leche, manteca, levadura, azúcar y sal.",
    alergenos: ["gluten", "lactosa"],
  },
  {
    id: "molde",
    categoria: "panes",
    nombre: "Pan de molde casero",
    detalle: "Blanco y tierno, para tostadas. Lo cortamos si querés.",
    precio: 160,
    icono: Wheat,
    ingredientes: "Harina de trigo, leche, manteca, azúcar, levadura y sal.",
    alergenos: ["gluten", "lactosa"],
    conservacion: "Dura 5 días cerrado. En la heladera se seca: mejor freezer.",
  },
  {
    id: "sintacc",
    categoria: "panes",
    nombre: "Pan sin TACC",
    detalle: "Pan de molde chico, tierno y bien dorado. 400 g.",
    precio: 240,
    icono: WheatOff,
    nota: "Hecho en sector exclusivo",
    ingredientes:
      "Premezcla certificada sin TACC (almidón de mandioca, harina de arroz y fécula de maíz), huevo, aceite de girasol, levadura y sal.",
    alergenos: ["huevo"],
    sinTacc: true,
    conservacion:
      "Viene cerrado y rotulado. Dura 3 días; tostado queda como recién hecho.",
  },
  // Bizcochos y facturas
  {
    id: "medialunas",
    categoria: "facturas",
    nombre: "Medialunas de manteca",
    detalle: "Media docena, con almíbar.",
    precio: 260,
    foto: fotosEspiga.medialunas,
    icono: Croissant,
    nota: "Sale 7:00 y 16:00",
    ingredientes:
      "Harina de trigo, manteca, leche, huevo, azúcar, levadura y almíbar.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },
  {
    id: "facturas",
    categoria: "facturas",
    nombre: "Facturas surtidas",
    detalle: "Media docena: rollos de canela, vigilantes y cañoncitos.",
    precio: 280,
    foto: fotosEspiga.bizcochos,
    icono: Croissant,
    ingredientes:
      "Harina de trigo, manteca, huevo, leche, azúcar, canela, dulce de membrillo, dulce de leche y crema pastelera.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },
  {
    id: "grasa",
    categoria: "facturas",
    nombre: "Medialunas de grasa",
    detalle: "Media docena, saladas y bien hojaldradas.",
    precio: 220,
    icono: Croissant,
    ingredientes: "Harina de trigo, grasa vacuna, agua, levadura y sal.",
    alergenos: ["gluten"],
  },
  {
    id: "bizcochos",
    categoria: "facturas",
    nombre: "Bizcochos de grasa",
    detalle: "Un cuarto kilo, para el mate.",
    precio: 150,
    icono: Cookie,
    nota: "El clásico del barrio",
    ingredientes: "Harina de trigo, grasa vacuna, agua, sal y levadura.",
    alergenos: ["gluten"],
  },
  // Dulces
  {
    id: "ricota",
    categoria: "dulces",
    nombre: "Torta de ricota",
    detalle: "Porción generosa, receta de la abuela Nilda.",
    precio: 150,
    foto: fotosEspiga.ricota,
    icono: CakeSlice,
    ingredientes:
      "Ricota, huevo, azúcar y ralladura de limón, sobre masa de harina de trigo y manteca.",
    alergenos: ["gluten", "lactosa", "huevo"],
    conservacion: "En la heladera, hasta 3 días.",
  },
  {
    id: "alfajores",
    categoria: "dulces",
    nombre: "Alfajores de maicena",
    detalle: "Dos unidades, con dulce de leche y coco.",
    precio: 140,
    foto: fotosEspiga.alfajores,
    icono: Cookie,
    ingredientes:
      "Fécula de maíz, harina de trigo, manteca, huevo, dulce de leche y coco rallado.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },
  {
    id: "alfajores-sintacc",
    categoria: "dulces",
    nombre: "Alfajores sin TACC",
    detalle: "Dos unidades, de maicena, envueltos de a uno.",
    precio: 170,
    icono: Cookie,
    nota: "Hecho en sector exclusivo",
    ingredientes:
      "Fécula de maíz y premezcla certificada sin TACC, manteca, yemas, dulce de leche sin TACC y coco rallado.",
    alergenos: ["lactosa", "huevo"],
    sinTacc: true,
  },
  {
    id: "pastafrola",
    categoria: "dulces",
    nombre: "Pasta frola de membrillo",
    detalle: "Entera, para 8 porciones.",
    precio: 390,
    icono: CakeSlice,
    ingredientes:
      "Harina de trigo, manteca, huevo, azúcar y dulce de membrillo.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },
  {
    id: "budin",
    categoria: "dulces",
    nombre: "Budín de naranja",
    detalle: "Con glaseado de limón. 500 g.",
    precio: 260,
    icono: Cake,
    ingredientes:
      "Harina de trigo, huevo, aceite de girasol, jugo y ralladura de naranja, azúcar y glaseado de limón.",
    alergenos: ["gluten", "huevo"],
    conservacion: "Envuelto, dura una semana. Mejora al segundo día.",
  },
  // Café y salado
  {
    id: "cafe",
    categoria: "cafe",
    nombre: "Café de especialidad",
    detalle: "Grano uruguayo tostado en Montevideo. Para llevar.",
    precio: 130,
    foto: fotosEspiga.cafe,
    icono: Coffee,
    ingredientes:
      "Café de especialidad. Con leche entera o bebida de avena, como prefieras.",
    alergenos: [],
    sinTacc: true,
    vegano: true,
  },
  {
    id: "desayuno",
    categoria: "cafe",
    nombre: "Café con leche y dos medialunas",
    detalle: "El desayuno del barrio, para llevar.",
    precio: 210,
    icono: Coffee,
    nota: "Hasta las 11:00",
    ingredientes: "Café, leche entera y dos medialunas de manteca.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },
  {
    id: "sandwich",
    categoria: "cafe",
    nombre: "Sándwich del día",
    detalle: "En pan de campo, con queso y vegetales de estación.",
    precio: 280,
    foto: fotosEspiga.sandwich,
    icono: Sandwich,
    ingredientes:
      "Pan de campo, queso colonia, tomate, lechuga y zucchini grillado.",
    alergenos: ["gluten", "lactosa"],
  },
  {
    id: "miga",
    categoria: "cafe",
    nombre: "Sándwiches de miga",
    detalle: "Seis triples de jamón y queso.",
    precio: 300,
    icono: Sandwich,
    ingredientes: "Pan de miga, jamón cocido, queso dambo y manteca.",
    alergenos: ["gluten", "lactosa"],
    conservacion: "En la heladera y tapados, para el mismo día.",
  },
  {
    id: "pascualina",
    categoria: "cafe",
    nombre: "Pascualina",
    detalle: "Porción de acelga y huevo, masa casera.",
    precio: 190,
    icono: Egg,
    ingredientes:
      "Acelga, huevo, cebolla y queso rallado, en masa de harina de trigo y aceite.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },

  // Promos (vitrina "Hoy en el mostrador")
  {
    id: "ayer",
    categoria: "promos",
    nombre: "Pan de campo de ayer",
    detalle: "A mitad de precio. Ideal para tostadas, budín de pan o torrejas.",
    precio: 90,
    antes: 180,
    foto: fotosEspiga.campo,
    icono: Wheat,
    nota: "Hasta agotar",
    ingredientes: "Harina de trigo uruguaya, agua, masa madre y sal.",
    alergenos: ["gluten"],
    vegano: true,
  },
  {
    id: "combo-mate",
    categoria: "promos",
    nombre: "Combo mate",
    detalle: "Un cuarto de bizcochos y media docena de medialunas de grasa.",
    precio: 320,
    antes: 370,
    foto: fotosEspiga.bizcochos,
    icono: Cookie,
    ingredientes: "Harina de trigo, grasa vacuna, agua, sal y levadura.",
    alergenos: ["gluten"],
  },
  {
    id: "docena-medialunas",
    categoria: "promos",
    nombre: "Docena de medialunas",
    detalle: "De manteca, con almíbar. Para el desayuno de toda la familia.",
    precio: 460,
    antes: 520,
    foto: fotosEspiga.medialunas,
    icono: Croissant,
    ingredientes:
      "Harina de trigo, manteca, leche, huevo, azúcar, levadura y almíbar.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },
  {
    id: "promo-budin",
    categoria: "promos",
    nombre: "Lunes de budín",
    detalle: "Budín de naranja con glaseado de limón. 500 g.",
    precio: 210,
    antes: 260,
    icono: Cake,
    ingredientes:
      "Harina de trigo, huevo, aceite de girasol, naranja, azúcar y glaseado de limón.",
    alergenos: ["gluten", "huevo"],
  },
  {
    id: "promo-bizcochos",
    categoria: "promos",
    nombre: "Martes de bizcochos",
    detalle: "Medio kilo de bizcochos de grasa, recién salidos.",
    precio: 260,
    antes: 300,
    foto: fotosEspiga.bizcochos,
    icono: Cookie,
    ingredientes: "Harina de trigo, grasa vacuna, agua, sal y levadura.",
    alergenos: ["gluten"],
  },
  {
    id: "promo-miga",
    categoria: "promos",
    nombre: "Miércoles de miga",
    detalle: "Doce triples de jamón y queso.",
    precio: 540,
    antes: 600,
    foto: fotosEspiga.sandwich,
    icono: Sandwich,
    ingredientes: "Pan de miga, jamón cocido, queso dambo y manteca.",
    alergenos: ["gluten", "lactosa"],
  },
  {
    id: "promo-ricota",
    categoria: "promos",
    nombre: "Jueves de ricota",
    detalle: "Torta de ricota entera, para 10 porciones.",
    precio: 990,
    antes: 1150,
    foto: fotosEspiga.ricota,
    icono: CakeSlice,
    ingredientes:
      "Ricota, huevo, azúcar y ralladura de limón, sobre masa de harina de trigo y manteca.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },
  {
    id: "promo-pizza",
    categoria: "promos",
    nombre: "Viernes de pizza",
    detalle: "Pizza casera de muzzarella, en asadera. 8 porciones.",
    precio: 390,
    antes: 450,
    icono: Pizza,
    ingredientes:
      "Harina de trigo, salsa de tomate, muzzarella, orégano, aceite de oliva y levadura.",
    alergenos: ["gluten", "lactosa"],
  },
  {
    id: "promo-alfajores",
    categoria: "promos",
    nombre: "Sábado de alfajores",
    detalle: "Caja de seis alfajores de maicena.",
    precio: 380,
    antes: 420,
    foto: fotosEspiga.alfajores,
    icono: Cookie,
    ingredientes:
      "Fécula de maíz, harina de trigo, manteca, huevo, dulce de leche y coco rallado.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },
  {
    id: "promo-domingo",
    categoria: "promos",
    nombre: "Domingo en familia",
    detalle: "Pasta frola entera y media docena de facturas.",
    precio: 590,
    antes: 670,
    foto: fotosEspiga.bizcochos,
    icono: CakeSlice,
    ingredientes:
      "Harina de trigo, manteca, huevo, leche, azúcar, dulce de membrillo y crema pastelera.",
    alergenos: ["gluten", "lactosa", "huevo"],
  },
]

export const productoPorId = new Map(carta.map((p) => [p.id, p]))

/** Promo de cada día de la semana (0 = domingo). */
export const promoDelDia = [
  "promo-domingo",
  "promo-budin",
  "promo-bizcochos",
  "promo-miga",
  "promo-ricota",
  "promo-pizza",
  "promo-alfajores",
]
