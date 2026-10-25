import { useId } from "react"

/*
 * Plantas dibujadas como stickers (relleno plano + borde de tinta) para los
 * modelos 3D. Todas comparten el mismo lienzo: 200 × 200, con la base de la
 * planta en (100, 200), que es donde va la boca de la maceta.
 */

const TINTA = "#1f2a22"
const T = 3 // grosor del borde

const verde = {
  oscuro: "#2c8a56",
  medio: "#47b072",
  claro: "#86d6a0",
  lima: "#b7e07a",
  tallo: "#2f7d4f",
}

type Pt = [number, number]

function Tallo({ d, ancho = 4, color = verde.tallo }: { d: string; ancho?: number; color?: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={TINTA} strokeWidth={ancho + T * 1.6} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={ancho} strokeLinecap="round" />
    </>
  )
}

/** Hoja ovalada con punta, apoyada en (0, 0) y apuntando hacia arriba. */
function hojaOval(l: number, a: number) {
  return `M0 0 C ${-a} ${-l * 0.12} ${-a} ${-l * 0.72} 0 ${-l} C ${a} ${-l * 0.72} ${a} ${-l * 0.12} 0 0 Z`
}

function Hoja({
  en,
  giro,
  l,
  a,
  color,
  nervio = true,
}: {
  en: Pt
  giro: number
  l: number
  a: number
  color: string
  nervio?: boolean
}) {
  return (
    <g transform={`translate(${en[0]} ${en[1]}) rotate(${giro})`}>
      <path d={hojaOval(l, a)} fill={color} stroke={TINTA} strokeWidth={T} strokeLinejoin="round" />
      {nervio && (
        <path d={`M0 -2 L0 ${-l * 0.82}`} stroke={TINTA} strokeWidth={T * 0.6} strokeLinecap="round" opacity={0.55} />
      )}
    </g>
  )
}

/* ---------- Monstera ---------- */

function HojaMonstera({ en, giro, l, id }: { en: Pt; giro: number; l: number; id: string }) {
  const a = l * 0.78
  const forma = `M0 0 C ${-a * 0.95} ${-l * 0.02} ${-a * 1.05} ${-l * 0.78} 0 ${-l} C ${a * 1.05} ${-l * 0.78} ${a * 0.95} ${-l * 0.02} 0 0 Z`
  const cortes = [0.3, 0.5, 0.7].flatMap((k) => [
    `M${-a * 1.1} ${-l * (k - 0.02)} L${-a * 0.32} ${-l * (k + 0.05)}`,
    `M${a * 1.1} ${-l * (k - 0.02)} L${a * 0.32} ${-l * (k + 0.05)}`,
  ])
  return (
    <g transform={`translate(${en[0]} ${en[1]}) rotate(${giro})`}>
      <mask id={id} maskUnits="userSpaceOnUse" x={-l} y={-l * 1.2} width={l * 2} height={l * 1.4}>
        <path d={forma} fill="#fff" />
        {cortes.map((c) => (
          <path key={c} d={c} stroke="#000" strokeWidth={l * 0.07} strokeLinecap="round" />
        ))}
      </mask>
      <g mask={`url(#${id})`}>
        <path d={forma} fill={verde.oscuro} stroke={TINTA} strokeWidth={T * 2} strokeLinejoin="round" />
        <path d={`M0 -2 L0 ${-l * 0.85}`} stroke={TINTA} strokeWidth={T * 0.7} opacity={0.5} />
        {cortes.map((c) => (
          <path key={c} d={c} stroke={TINTA} strokeWidth={l * 0.07 + T * 2} strokeLinecap="round" fill="none" />
        ))}
      </g>
    </g>
  )
}

function Monstera() {
  const base = useId().replace(/:/g, "")
  const hojas: { en: Pt; giro: number; l: number }[] = [
    { en: [52, 150], giro: -62, l: 52 },
    { en: [148, 146], giro: 64, l: 50 },
    { en: [70, 104], giro: -30, l: 62 },
    { en: [132, 96], giro: 28, l: 64 },
    { en: [100, 78], giro: -4, l: 66 },
  ]
  return (
    <>
      {hojas.map((h, i) => (
        <Tallo key={i} d={`M100 200 Q ${100 + (h.en[0] - 100) * 0.2} ${h.en[1] + 40} ${h.en[0]} ${h.en[1]}`} />
      ))}
      {hojas.map((h, i) => (
        <HojaMonstera key={i} {...h} id={`${base}m${i}`} />
      ))}
    </>
  )
}

/* ---------- Potus ---------- */

function Potus() {
  const ramas: { d: string; hojas: { en: Pt; giro: number }[] }[] = [
    { d: "M100 198 C 80 170 50 170 30 190", hojas: [{ en: [72, 176], giro: -40 }, { en: [48, 178], giro: -80 }, { en: [30, 190], giro: -120 }] },
    { d: "M100 198 C 120 168 152 166 172 188", hojas: [{ en: [128, 172], giro: 40 }, { en: [152, 174], giro: 80 }, { en: [172, 188], giro: 120 }] },
    { d: "M100 198 C 96 160 80 130 72 108", hojas: [{ en: [94, 160], giro: -20 }, { en: [82, 132], giro: -30 }, { en: [72, 108], giro: -10 }] },
    { d: "M100 198 C 106 158 124 130 132 112", hojas: [{ en: [108, 156], giro: 25 }, { en: [122, 132], giro: 30 }, { en: [132, 112], giro: 12 }] },
    { d: "M100 198 C 100 170 100 140 100 122", hojas: [{ en: [100, 150], giro: 0 }, { en: [100, 122], giro: 4 }] },
  ]
  return (
    <>
      {ramas.map((r) => (
        <Tallo key={r.d} d={r.d} ancho={3} />
      ))}
      {ramas.flatMap((r, i) =>
        r.hojas.map((h, j) => (
          <Hoja key={`${i}-${j}`} en={h.en} giro={h.giro} l={30} a={20} color={(i + j) % 2 ? verde.lima : verde.medio} />
        ))
      )}
    </>
  )
}

/* ---------- Lengua de suegra ---------- */

function Sansevieria() {
  const hojas = [
    { x: 100, h: 28, inc: 0, a: 15 },
    { x: 78, h: 52, inc: -14, a: 13 },
    { x: 122, h: 48, inc: 12, a: 13 },
    { x: 62, h: 92, inc: -26, a: 11 },
    { x: 140, h: 84, inc: 24, a: 11 },
  ]
  return (
    <>
      {[...hojas].reverse().map((f) => {
        const punta = f.x + f.inc
        const d = `M${f.x - f.a} 200 C ${f.x - f.a - 4} 140 ${punta - 8} ${f.h + 30} ${punta} ${f.h} C ${punta + 8} ${f.h + 30} ${f.x + f.a + 4} 140 ${f.x + f.a} 200 Z`
        const dIn = `M${f.x - f.a + 5} 200 C ${f.x - f.a + 2} 145 ${punta - 4} ${f.h + 40} ${punta} ${f.h + 14} C ${punta + 4} ${f.h + 40} ${f.x + f.a - 2} 145 ${f.x + f.a - 5} 200 Z`
        return (
          <g key={f.x}>
            <path d={d} fill="#f2d65a" stroke={TINTA} strokeWidth={T} strokeLinejoin="round" />
            <path d={dIn} fill="#3d8f5c" />
            {[0.25, 0.45, 0.65].map((k) => {
              const y = 200 - (200 - f.h) * k
              const x = f.x + f.inc * k
              return (
                <path key={k} d={`M${x - 6} ${y} q 6 -4 12 0`} stroke="#25633e" strokeWidth={2.5} fill="none" strokeLinecap="round" />
              )
            })}
          </g>
        )
      })}
    </>
  )
}

/* ---------- Ficus lyrata ---------- */

function HojaViolin({ en, giro, l }: { en: Pt; giro: number; l: number }) {
  const a = l * 0.5
  const d = `M0 0 C ${-a * 0.55} ${-l * 0.18} ${-a * 0.45} ${-l * 0.45} ${-a * 0.85} ${-l * 0.68} C ${-a * 1.1} ${-l * 0.95} ${a * 1.1} ${-l * 0.95} ${a * 0.85} ${-l * 0.68} C ${a * 0.45} ${-l * 0.45} ${a * 0.55} ${-l * 0.18} 0 0 Z`
  return (
    <g transform={`translate(${en[0]} ${en[1]}) rotate(${giro})`}>
      <path d={d} fill={verde.oscuro} stroke={TINTA} strokeWidth={T} strokeLinejoin="round" />
      <path d={`M0 -2 L0 ${-l * 0.8}`} stroke={verde.lima} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  )
}

function Ficus() {
  const hojas: { en: Pt; giro: number; l: number }[] = [
    { en: [100, 150], giro: -70, l: 44 },
    { en: [100, 140], giro: 68, l: 46 },
    { en: [100, 112], giro: -40, l: 50 },
    { en: [100, 100], giro: 42, l: 50 },
    { en: [100, 74], giro: -18, l: 50 },
    { en: [100, 66], giro: 16, l: 48 },
    { en: [100, 52], giro: 0, l: 46 },
  ]
  return (
    <>
      <Tallo d="M100 200 L100 54" ancho={7} color="#a8693f" />
      {hojas.map((h, i) => (
        <HojaViolin key={i} {...h} />
      ))}
    </>
  )
}

/* ---------- Cactus ---------- */

function Cactus() {
  const cuerpo = "M80 200 L80 62 C80 36 120 36 120 62 L120 200 Z"
  const brazoI = "M82 136 L66 136 C56 136 52 128 52 118 L52 92 C52 80 68 80 68 92 L68 122 L82 122 Z"
  const brazoD = "M118 116 L136 116 C144 116 148 108 148 100 L148 72 C148 60 132 60 132 72 L132 102 L118 102 Z"
  return (
    <>
      {[brazoI, brazoD, cuerpo].map((d) => (
        <path key={d} d={d} fill={verde.medio} stroke={TINTA} strokeWidth={T} strokeLinejoin="round" />
      ))}
      {[92, 100, 108].map((x) => (
        <path key={x} d={`M${x} 52 L${x} 196`} stroke="#2f8a55" strokeWidth={2.4} strokeLinecap="round" />
      ))}
      {[70, 90, 110, 130, 150, 170].flatMap((y) =>
        [86, 114].map((x) => (
          <path key={`${x}-${y}`} d={`M${x} ${y} l${x < 100 ? -5 : 5} -3`} stroke={TINTA} strokeWidth={1.8} strokeLinecap="round" />
        ))
      )}
      <g transform="translate(100 40)">
        {[0, 72, 144, 216, 288].map((g) => (
          <ellipse key={g} cx={0} cy={-7} rx={5} ry={8} transform={`rotate(${g})`} fill="#ff8fb3" stroke={TINTA} strokeWidth={2} />
        ))}
        <circle r={4} fill="#ffd84d" stroke={TINTA} strokeWidth={2} />
      </g>
    </>
  )
}

/* ---------- Lavanda ---------- */

function Lavanda() {
  const varas = [-46, -32, -18, -6, 6, 18, 32, 46]
  return (
    <>
      {varas.map((g, i) => {
        const largo = 120 - Math.abs(g) * 0.9 - (i % 2) * 10
        const rad = (g * Math.PI) / 180
        const x = 100 + Math.sin(rad) * largo
        const y = 200 - Math.cos(rad) * largo
        return (
          <g key={g}>
            <Tallo d={`M100 200 Q ${100 + Math.sin(rad) * largo * 0.4} ${200 - largo * 0.5} ${x} ${y}`} ancho={2.5} color="#7aa86a" />
            {[0, 1, 2, 3, 4].map((k) => (
              <ellipse
                key={k}
                cx={x - Math.sin(rad) * k * 7}
                cy={y + Math.cos(rad) * k * 7}
                rx={5.5}
                ry={4.5}
                fill={k % 2 ? "#a58cff" : "#8a6cf0"}
                stroke={TINTA}
                strokeWidth={2}
              />
            ))}
          </g>
        )
      })}
      {[-60, -30, 30, 60].map((g) => (
        <Hoja key={g} en={[100, 200]} giro={g} l={38} a={6} color="#9cc48e" nervio={false} />
      ))}
    </>
  )
}

/* ---------- Helecho ---------- */

function fronda(fin: Pt, ctrl: Pt) {
  const pts: { p: Pt; ang: number }[] = []
  for (let i = 1; i <= 9; i++) {
    const t = i / 10
    const x = (1 - t) * (1 - t) * 100 + 2 * (1 - t) * t * ctrl[0] + t * t * fin[0]
    const y = (1 - t) * (1 - t) * 200 + 2 * (1 - t) * t * ctrl[1] + t * t * fin[1]
    const dx = 2 * (1 - t) * (ctrl[0] - 100) + 2 * t * (fin[0] - ctrl[0])
    const dy = 2 * (1 - t) * (ctrl[1] - 200) + 2 * t * (fin[1] - ctrl[1])
    pts.push({ p: [x, y], ang: (Math.atan2(dy, dx) * 180) / Math.PI })
  }
  return pts
}

const frondas: { fin: Pt; ctrl: Pt }[] = [
  { fin: [24, 176], ctrl: [52, 120] },
  { fin: [176, 176], ctrl: [148, 120] },
  { fin: [44, 96], ctrl: [70, 120] },
  { fin: [156, 96], ctrl: [130, 120] },
  { fin: [92, 44], ctrl: [90, 110] },
  { fin: [118, 52], ctrl: [112, 110] },
]

function Helecho() {
  return (
    <>
      {frondas.map((f, i) => (
        <g key={i}>
          <Tallo d={`M100 200 Q ${f.ctrl[0]} ${f.ctrl[1]} ${f.fin[0]} ${f.fin[1]}`} ancho={2.5} />
          {fronda(f.fin, f.ctrl).map(({ p, ang }, k) => {
            const l = 20 - k * 1.4
            return (
              <g key={k}>
                <Hoja en={p} giro={ang + 90 - 62} l={l} a={l * 0.32} color={k % 2 ? verde.claro : verde.medio} nervio={false} />
                <Hoja en={p} giro={ang + 90 + 62} l={l} a={l * 0.32} color={k % 2 ? verde.medio : verde.claro} nervio={false} />
              </g>
            )
          })}
        </g>
      ))}
    </>
  )
}

/* ---------- Palo de agua ---------- */

function Mechon({ en }: { en: Pt }) {
  return (
    <g>
      {[-75, -48, -22, 0, 22, 48, 75].map((g) => (
        <g key={g} transform={`translate(${en[0]} ${en[1]}) rotate(${g})`}>
          <path d="M0 0 C -9 -14 -8 -40 0 -54 C 8 -40 9 -14 0 0 Z" fill={verde.medio} stroke={TINTA} strokeWidth={T * 0.9} strokeLinejoin="round" />
          <path d="M0 -3 L0 -48" stroke="#ffd84d" strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

function Palo() {
  return (
    <>
      {[
        { x: 86, y: 70 },
        { x: 116, y: 104 },
      ].map((c) => (
        <g key={c.x}>
          <rect x={c.x - 7} y={c.y} width={14} height={200 - c.y} rx={5} fill="#b07a4e" stroke={TINTA} strokeWidth={T} />
          {[0.3, 0.55, 0.8].map((k) => (
            <path key={k} d={`M${c.x - 7} ${c.y + (200 - c.y) * k} h14`} stroke={TINTA} strokeWidth={1.8} />
          ))}
          <Mechon en={[c.x, c.y + 4]} />
        </g>
      ))}
    </>
  )
}

/* ---------- Suculentas ---------- */

function Roseta({ c, r, color, punta }: { c: Pt; r: number; color: string; punta: string }) {
  return (
    <g transform={`translate(${c[0]} ${c[1]})`}>
      {[0, 1, 2].map((anillo) =>
        Array.from({ length: 7 - anillo }, (_, k) => {
          const g = (360 / (7 - anillo)) * k + anillo * 20
          const l = r * (1 - anillo * 0.28)
          return (
            <g key={`${anillo}-${k}`} transform={`rotate(${g})`}>
              <path d={hojaOval(l, l * 0.42)} fill={anillo === 2 ? punta : color} stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
            </g>
          )
        })
      )}
    </g>
  )
}

function Suculentas() {
  return (
    <>
      <Roseta c={[62, 172]} r={26} color="#8cc7b0" punta="#ffb3c8" />
      <Roseta c={[138, 170]} r={26} color="#a7d68a" punta="#ffd84d" />
      <Roseta c={[100, 150]} r={32} color="#7fb8c9" punta="#ff9fbf" />
    </>
  )
}

/* ---------- Kit de aromáticas ---------- */

function Mata({ c, color }: { c: Pt; color: string }) {
  const hojas: [number, number, number][] = [
    [-40, 0, 22], [-20, -6, 26], [0, -10, 28], [20, -6, 26], [40, 0, 22], [-28, -24, 22], [0, -32, 24], [28, -24, 22],
  ]
  return (
    <g>
      {hojas.map(([g, dy, l], i) => (
        <Hoja key={i} en={[c[0], c[1] + dy]} giro={g} l={l} a={l * 0.55} color={i % 2 ? color : verde.medio} />
      ))}
    </g>
  )
}

function Huerta() {
  return (
    <>
      <Mata c={[56, 196]} color={verde.lima} />
      <Mata c={[144, 196]} color={verde.claro} />
      <Mata c={[100, 186]} color={verde.lima} />
    </>
  )
}

/* ---------- Componente ---------- */

const dibujos: Record<string, () => React.ReactElement> = {
  monstera: Monstera,
  potus: Potus,
  sansevieria: Sansevieria,
  ficus: Ficus,
  cactus: Cactus,
  lavanda: Lavanda,
  helecho: Helecho,
  palo: Palo,
  suculentas: Suculentas,
  huerta: Huerta,
}

export function PlantaDibujo({
  id,
  className,
  titulo,
}: {
  id: string
  className?: string
  /** Si se pasa, el dibujo se anuncia con ese nombre; si no, es decorativo. */
  titulo?: string
}) {
  const Dibujo = dibujos[id] ?? Potus
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      overflow="visible"
    >
      <Dibujo />
    </svg>
  )
}

/** Maceta 2D de sticker (para el living y las tarjetas chicas). */
export function MacetaDibujo({
  tipo = "barro",
  color,
  className,
}: {
  tipo?: string
  color?: string
  className?: string
}) {
  const relleno =
    tipo === "vivero" ? "#3a3f3b" : tipo === "ceramica" ? (color ?? "#f7f1e6") : "#de7d4f"
  const borde = tipo === "vivero" ? "#555b56" : tipo === "ceramica" ? (color ?? "#f7f1e6") : "#c9683c"
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <path d="M14 22 L106 22 L94 96 L26 96 Z" fill={relleno} stroke={TINTA} strokeWidth={T} strokeLinejoin="round" />
      <rect x="8" y="8" width="104" height="18" rx="5" fill={borde} stroke={TINTA} strokeWidth={T} />
      {tipo === "ceramica" && (
        <g stroke={TINTA} strokeWidth={2.6} strokeLinecap="round" fill="none">
          <circle cx="48" cy="52" r="2.6" fill={TINTA} />
          <circle cx="72" cy="52" r="2.6" fill={TINTA} />
          <path d="M50 64 q10 8 20 0" />
        </g>
      )}
      <path d="M22 30 L30 90" stroke="#fff" strokeOpacity={0.35} strokeWidth={5} strokeLinecap="round" />
    </svg>
  )
}
