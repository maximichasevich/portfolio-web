/**
 * Horarios de La Espiga y cálculos con la hora real de Montevideo.
 * Todo se calcula en minutos desde la medianoche.
 */

export const dias = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
]

/** Apertura y cierre por día de la semana (0 = domingo). */
export const horarioPorDia: { abre: number; cierra: number }[] = [
  { abre: 8 * 60, cierra: 13 * 60 },
  { abre: 7 * 60, cierra: 20 * 60 },
  { abre: 7 * 60, cierra: 20 * 60 },
  { abre: 7 * 60, cierra: 20 * 60 },
  { abre: 7 * 60, cierra: 20 * 60 },
  { abre: 7 * 60, cierra: 20 * 60 },
  { abre: 7 * 60, cierra: 20 * 60 },
]

/** Filas de la tabla de horarios (días agrupados). */
export const filasHorario = [
  { dias: "Lunes a viernes", horas: "7:00 a 20:00", incluye: [1, 2, 3, 4, 5] },
  { dias: "Sábados", horas: "7:00 a 20:00", incluye: [6] },
  { dias: "Domingos", horas: "8:00 a 13:00", incluye: [0] },
]

export type Horneada = {
  minuto: number
  titulo: string
  productos: string[]
}

/** La de la tarde no se hace los domingos. */
export function horneadasDelDia(dia: number): Horneada[] {
  const manana: Horneada = {
    minuto: 7 * 60,
    titulo: "Horneada de la mañana",
    productos: [
      "Pan de campo",
      "Flautas",
      "Medialunas de manteca y de grasa",
      "Bizcochos de grasa",
    ],
  }
  const tarde: Horneada = {
    minuto: 16 * 60,
    titulo: "Horneada de la tarde",
    productos: [
      "Medialunas para la merienda",
      "Flautas y felipitos",
      "Facturas surtidas",
      "Pan de molde",
    ],
  }
  return dia === 0 ? [manana] : [manana, tarde]
}

export type Momento = {
  /** 0 = domingo. */
  dia: number
  /** Minutos desde la medianoche, hora de Montevideo. */
  minutos: number
}

const formato = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Montevideo",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})
const diasEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function momentoMontevideo(ts: number): Momento {
  const partes = formato.formatToParts(new Date(ts))
  const valor = (t: string) => partes.find((p) => p.type === t)?.value ?? ""
  const hora = Number(valor("hour")) % 24
  return {
    dia: Math.max(0, diasEn.indexOf(valor("weekday"))),
    minutos: hora * 60 + Number(valor("minute")),
  }
}

export function hora(minutos: number) {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return `${h}:${String(m).padStart(2, "0")}`
}

function nombreDia(desde: number, adelante: number) {
  if (adelante === 0) return "hoy"
  if (adelante === 1) return "mañana"
  return `el ${dias[(desde + adelante) % 7]}`
}

export type EstadoLocal = {
  abierto: boolean
  /** Ej.: "Abierto ahora". */
  titulo: string
  /** Ej.: "cierra a las 20:00". */
  detalle: string
}

export function estadoLocal({ dia, minutos }: Momento): EstadoLocal {
  const hoy = horarioPorDia[dia]
  if (minutos >= hoy.abre && minutos < hoy.cierra) {
    const faltan = hoy.cierra - minutos
    return {
      abierto: true,
      titulo: faltan <= 45 ? "Cierra pronto" : "Abierto ahora",
      detalle: `cierra a las ${hora(hoy.cierra)}`,
    }
  }
  if (minutos < hoy.abre) {
    return {
      abierto: false,
      titulo: "Cerrado",
      detalle: `abrimos hoy a las ${hora(hoy.abre)}`,
    }
  }
  const siguiente = (dia + 1) % 7
  return {
    abierto: false,
    titulo: "Cerrado",
    detalle: `abrimos ${nombreDia(dia, 1)} a las ${hora(horarioPorDia[siguiente].abre)}`,
  }
}

export type Franja = { valor: string; etiqueta: string }

/**
 * Horas de retiro posibles, cada 30 minutos, con al menos 30 minutos para
 * preparar el pedido. Si hoy ya no hay lugar, ofrece el próximo día.
 */
export function franjasRetiro({ dia, minutos }: Momento): {
  dia: string
  franjas: Franja[]
} {
  for (let adelante = 0; adelante < 7; adelante++) {
    const d = (dia + adelante) % 7
    const { abre, cierra } = horarioPorDia[d]
    let inicio = abre + 30
    if (adelante === 0) {
      inicio = Math.max(inicio, Math.ceil((minutos + 30) / 30) * 30)
    }
    const franjas: Franja[] = []
    for (let t = inicio; t <= cierra - 30; t += 30) {
      const cuando = nombreDia(dia, adelante)
      const etiqueta = `${hora(t)} a ${hora(t + 30)}`
      franjas.push({
        valor: `${cuando.charAt(0).toUpperCase()}${cuando.slice(1)}, de ${etiqueta}`,
        etiqueta,
      })
    }
    if (franjas.length > 0) {
      const titulo = nombreDia(dia, adelante)
      return {
        dia: titulo.charAt(0).toUpperCase() + titulo.slice(1),
        franjas,
      }
    }
  }
  return { dia: "", franjas: [] }
}
