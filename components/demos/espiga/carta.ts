import type { LucideIcon } from "lucide-react"
import {
  Cake,
  CakeSlice,
  Coffee,
  Cookie,
  Croissant,
  Egg,
  Sandwich,
  Wheat,
} from "lucide-react"

import { fotosEspiga } from "@/components/demos/fotos"
import type { Foto } from "@/lib/demo"

export type Categoria = "panes" | "facturas" | "dulces" | "cafe"

export const categorias: { id: Categoria; nombre: string; bajada: string }[] = [
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

export type Producto = {
  id: string
  categoria: Categoria
  nombre: string
  detalle: string
  precio: number
  /** Foto real, si hay una que corresponda. */
  foto?: Foto
  /** Dibujo a tiza para los productos sin foto. */
  icono: LucideIcon
  /** Nota corta escrita en la pizarra, por ejemplo la horneada. */
  nota?: string
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
  },
  {
    id: "semillas",
    categoria: "panes",
    nombre: "Pan integral de semillas",
    detalle: "Lino, girasol y sésamo. 600 g.",
    precio: 220,
    foto: fotosEspiga.semillas,
    icono: Wheat,
  },
  {
    id: "flauta",
    categoria: "panes",
    nombre: "Flauta",
    detalle: "Corteza crocante, miga liviana. 250 g.",
    precio: 70,
    icono: Wheat,
    nota: "Sale 7:00 y 16:00",
  },
  {
    id: "felipes",
    categoria: "panes",
    nombre: "Felipitos",
    detalle: "Seis panes chicos, ideales para la merienda.",
    precio: 90,
    icono: Wheat,
  },
  {
    id: "molde",
    categoria: "panes",
    nombre: "Pan de molde casero",
    detalle: "Blanco y tierno, para tostadas. Lo cortamos si querés.",
    precio: 160,
    icono: Wheat,
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
  },
  {
    id: "facturas",
    categoria: "facturas",
    nombre: "Facturas surtidas",
    detalle: "Media docena: rollos de canela, vigilantes y cañoncitos.",
    precio: 280,
    foto: fotosEspiga.bizcochos,
    icono: Croissant,
  },
  {
    id: "grasa",
    categoria: "facturas",
    nombre: "Medialunas de grasa",
    detalle: "Media docena, saladas y bien hojaldradas.",
    precio: 220,
    icono: Croissant,
  },
  {
    id: "bizcochos",
    categoria: "facturas",
    nombre: "Bizcochos de grasa",
    detalle: "Un cuarto kilo, para el mate.",
    precio: 150,
    icono: Cookie,
    nota: "El clásico del barrio",
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
  },
  {
    id: "alfajores",
    categoria: "dulces",
    nombre: "Alfajores de maicena",
    detalle: "Dos unidades, con dulce de leche y coco.",
    precio: 140,
    foto: fotosEspiga.alfajores,
    icono: Cookie,
  },
  {
    id: "pastafrola",
    categoria: "dulces",
    nombre: "Pasta frola de membrillo",
    detalle: "Entera, para 8 porciones.",
    precio: 390,
    icono: CakeSlice,
  },
  {
    id: "budin",
    categoria: "dulces",
    nombre: "Budín de naranja",
    detalle: "Con glaseado de limón. 500 g.",
    precio: 260,
    icono: Cake,
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
  },
  {
    id: "desayuno",
    categoria: "cafe",
    nombre: "Café con leche y dos medialunas",
    detalle: "El desayuno del barrio, para llevar.",
    precio: 210,
    icono: Coffee,
    nota: "Hasta las 11:00",
  },
  {
    id: "sandwich",
    categoria: "cafe",
    nombre: "Sándwich del día",
    detalle: "En pan de campo, con queso y vegetales de estación.",
    precio: 280,
    foto: fotosEspiga.sandwich,
    icono: Sandwich,
  },
  {
    id: "miga",
    categoria: "cafe",
    nombre: "Sándwiches de miga",
    detalle: "Seis triples de jamón y queso.",
    precio: 300,
    icono: Sandwich,
  },
  {
    id: "pascualina",
    categoria: "cafe",
    nombre: "Pascualina",
    detalle: "Porción de acelga y huevo, masa casera.",
    precio: 190,
    icono: Egg,
  },
]

export const productoPorId = new Map(carta.map((p) => [p.id, p]))
