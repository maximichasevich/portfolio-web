"use client"

import Image from "next/image"
import { useState } from "react"
import { Accordion, Tabs } from "radix-ui"
import {
  CalendarDays,
  Droplets,
  Hand,
  PawPrint,
  Plus,
  Send,
  Sun,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import { fotosVerde } from "@/components/demos/fotos"
import {
  ENVIO_GRATIS,
  catalogo,
  categoriasPlantas,
  colorCategoria,
  envios,
} from "@/components/demos/verde/catalogo"
import { useTienda } from "@/components/demos/verde/estado"
import { fondo } from "@/components/demos/verde/ui"
import { validarEmail } from "@/components/demos/verde/validar"

/* ---------- Categorías en círculos, estilo historias ---------- */

export function CategoriasHistorias() {
  const { irAlCatalogo } = useTienda()
  const items = [
    ...categoriasPlantas.map((c) => ({
      texto: c,
      foto: catalogo.find((p) => p.categoria === c)!.foto.src,
      color: fondo[colorCategoria[c]],
      ir: () => irAlCatalogo({ categoria: c }),
    })),
    {
      texto: "Pet friendly",
      foto: fotosVerde.helecho.src,
      color: "bg-[var(--vt-cielo)]",
      ir: () => irAlCatalogo({ mascotas: true }),
    },
    {
      texto: "Poca luz",
      foto: fotosVerde.sansevieria.src,
      color: "bg-[var(--vt-durazno)]",
      ir: () => irAlCatalogo({ pocaLuz: true }),
    },
  ]
  return (
    <ul
      aria-label="Explorá por categoría"
      className="vt-sin-barra -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:gap-6 lg:mx-0 lg:justify-between lg:overflow-visible lg:px-0"
    >
      {items.map((it, i) => (
        <li key={it.texto} className="snap-start">
          <button type="button" onClick={it.ir} className="group flex w-[5.5rem] flex-col items-center gap-2 sm:w-28">
            <span
              className={cn(
                "relative grid size-[5.5rem] place-items-center rounded-full border-2 border-[var(--vt-tinta)] p-1 transition-transform group-hover:-rotate-6 sm:size-28",
                it.color
              )}
            >
              <span className={cn("relative size-full overflow-hidden border-2 border-[var(--vt-tinta)]", `vt-blob-${(i % 3) + 1}`)}>
                <Image src={it.foto} alt="" fill sizes="112px" className="object-cover" />
              </span>
            </span>
            <span className="text-center text-sm leading-tight font-extrabold">{it.texto}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ---------- Guía de cuidados ---------- */

const guia = [
  {
    id: "luz",
    pestana: "Luz",
    Icono: Sun,
    titulo: "El test de la sombra",
    intro:
      "Al mediodía, poné la mano a 30 cm del lugar donde va la planta y mirá la sombra que hace.",
    puntos: [
      ["Sombra nítida", "Sol directo: suculentas, cactus, lavanda y aromáticas."],
      ["Sombra borrosa", "Luz indirecta: monstera, ficus y la mayoría de interior."],
      ["Casi no hay sombra", "Poca luz: lengua de suegra, potus, palo de agua."],
    ],
    foto: fotosVerde.ficus.src,
    color: "bg-[var(--vt-manteca)]",
    tip: "Girá la maceta un cuarto de vuelta cada semana para que crezca pareja.",
  },
  {
    id: "riego",
    pestana: "Riego",
    Icono: Droplets,
    titulo: "Ante la duda, no riegues",
    intro:
      "Más plantas mueren por exceso de agua que por falta. Antes de regar, hacé el test del dedo.",
    puntos: [
      ["Metés un dedo", "Si los primeros dos centímetros están secos, toca regar."],
      ["Regá hasta que drene", "El agua tiene que salir por abajo. Tirá lo que quede en el plato."],
      ["En invierno, menos", "La planta crece más lento y toma la mitad de agua."],
    ],
    foto: fotosVerde.helecho.src,
    color: "bg-[var(--vt-cielo)]",
    tip: "Usá agua a temperatura ambiente: el agua muy fría les da un susto a las raíces.",
  },
  {
    id: "semana",
    pestana: "Primera semana",
    Icono: CalendarDays,
    titulo: "Tus primeros 7 días juntas",
    intro:
      "Viajar en caja estresa a cualquiera. Estos pasos la ayudan a acomodarse en su casa nueva.",
    puntos: [
      ["Día 1", "Sacala de la caja, ubicala en su lugar y no la riegues si la tierra está húmeda."],
      ["Días 2 a 5", "Puede soltar alguna hoja: es normal. No la cambies de lugar."],
      ["Día 7", "Recién ahora, si querés, pasala a una maceta un poco más grande."],
    ],
    foto: fotosVerde.monstera.src,
    color: "bg-[var(--vt-menta)]",
    tip: "Sacale una foto el primer día: en un mes vas a ver cuánto creció.",
  },
  {
    id: "mascotas",
    pestana: "Mascotas",
    Icono: PawPrint,
    titulo: "Plantas y mascotas, en paz",
    intro:
      "En cada planta te decimos si es apta para perros y gatos, según la lista de la ASPCA.",
    puntos: [
      ["Aptas", "Helecho serrucho, suculentas y cactus (ojo con las espinas)."],
      ["Mejor lejos", "Monstera, potus, ficus, lengua de suegra y palo de agua."],
      ["Si mordió una", "Sacale los restos de la boca y consultá a tu veterinaria."],
    ],
    foto: fotosVerde.suculentas.src,
    color: "bg-[var(--vt-rosa)]",
    tip: "Las colgantes en altura son la solución para tener potus con gatos.",
  },
]

export function GuiaCuidados() {
  return (
    <Tabs.Root defaultValue="luz">
      <Tabs.List
        aria-label="Temas de la guía de cuidados"
        className="vt-sin-barra -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {guia.map((g) => (
          <Tabs.Trigger
            key={g.id}
            value={g.id}
            className="vt-chip h-11 shrink-0 px-5 text-[15px] data-[state=active]:bg-[var(--vt-tinta)] data-[state=active]:text-[var(--vt-papel)]"
          >
            <g.Icono className="size-4" aria-hidden="true" /> {g.pestana}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {guia.map((g) => (
        <Tabs.Content key={g.id} value={g.id} className="mt-6 outline-none">
          <div className="grid gap-6 rounded-[36px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5 sm:p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-10">
            <div>
              <h3 className="vt-titulo text-4xl sm:text-5xl">{g.titulo}</h3>
              <p className="mt-3 max-w-lg text-[var(--vt-tinta-70)]">{g.intro}</p>
              <ol className="mt-6 space-y-3">
                {g.puntos.map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className={cn("vt-titulo grid size-11 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] text-xl", g.color)}>
                      {i + 1}
                    </span>
                    <span className="pt-0.5">
                      <span className="block font-extrabold">{t}</span>
                      <span className="block text-sm text-[var(--vt-tinta-70)]">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={cn("relative rounded-[32px] p-4", g.color)}>
              <div className="vt-blob-2 relative aspect-square overflow-hidden border-2 border-[var(--vt-tinta)]">
                <Image src={g.foto} alt="" fill sizes="(min-width: 768px) 24rem, 90vw" className="object-cover" />
              </div>
              <p
                className="vt-sticker absolute -bottom-4 left-4 max-w-[85%] bg-[var(--vt-papel)] text-xs leading-snug whitespace-normal"
                style={{ "--giro": "-2deg" } as React.CSSProperties}
              >
                <Hand className="size-4 shrink-0" aria-hidden="true" /> {g.tip}
              </p>
            </div>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

/* ---------- Preguntas frecuentes ---------- */

const mvd = envios.find((e) => e.id === "mvd")!

const preguntas = [
  {
    p: "¿Cuánto sale el envío y cuándo llega?",
    r: `En Montevideo cuesta ${pesos(mvd.costo)} y es gratis desde ${pesos(ENVIO_GRATIS)}; si comprás antes de las 14, te llega en el día. A Ciudad de la Costa tarda 24 a 48 horas y al resto del país va por agencia en 2 a 4 días. También podés retirar gratis en el vivero.`,
  },
  {
    p: "¿Y si la planta llega mal o no prende?",
    r: "Tenés 30 días de garantía. Mandanos una foto por WhatsApp y te la cambiamos sin vueltas, o te devolvemos la plata.",
  },
  {
    p: "¿Cómo puedo pagar?",
    r: "Con Mercado Pago (débito, crédito o dinero en cuenta), hasta 6 cuotas sin recargo. Si pagás por transferencia, tenés 5% de descuento.",
  },
  {
    p: "¿Cómo viajan las plantas?",
    r: "En cajas con separadores, la tierra tapada para que no se vuelque y una tarjeta con sus cuidados. Las elegimos y fotografiamos antes de salir.",
  },
  {
    p: "¿Puedo mandarla de regalo?",
    r: "¡Claro! En el checkout poné la dirección de quien la recibe y en indicaciones el mensaje para la tarjeta. No incluimos el precio en la caja.",
  },
]

export function Preguntas() {
  return (
    <Accordion.Root type="single" collapsible className="space-y-3">
      {preguntas.map((q, i) => (
        <Accordion.Item
          key={q.p}
          value={`p${i}`}
          className="overflow-hidden rounded-3xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] data-[state=open]:bg-[var(--vt-manteca)]"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-extrabold sm:text-lg">
              {q.p}
              <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] transition-transform group-data-[state=open]:rotate-45">
                <Plus className="size-4" aria-hidden="true" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-5 text-[var(--vt-tinta-70)]">
            {q.r}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

/* ---------- Newsletter ---------- */

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string>()
  const [listo, setListo] = useState(false)

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const err = validarEmail(email)
    setError(err)
    if (!err) setListo(true)
  }

  if (listo) {
    return (
      <p className="rounded-3xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5 font-bold" role="status">
        ¡Listo! Tu código es <span className="rounded-lg bg-[var(--vt-manteca)] px-2 py-0.5 font-extrabold">HOLAVERDE</span>{" "}
        (es de ejemplo: no se envió ningún mail).
      </p>
    )
  }

  return (
    <form onSubmit={enviar} noValidate className="w-full">
      <label htmlFor="vt-news" className="sr-only">
        Tu email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="vt-news"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "vt-news-error" : undefined}
          className="vt-campo h-13 flex-1 rounded-full border-[var(--vt-tinta)] px-5"
        />
        <button type="submit" className="vt-boton-tinta h-13 px-6">
          <Send className="size-4" aria-hidden="true" /> Quiero mi 10%
        </button>
      </div>
      {error && (
        <p id="vt-news-error" className="mt-2 text-sm font-bold text-[#8f1f0b]">
          {error}
        </p>
      )}
    </form>
  )
}
