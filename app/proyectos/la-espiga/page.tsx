import Image from "next/image"
import {
  Accessibility,
  CreditCard,
  MapPin,
  MessageCircle,
  Phone,
  Truck,
} from "lucide-react"

import { BannerDemo } from "@/components/demos/banner-demo"
import { CreditosFotos } from "@/components/demos/creditos-fotos"
import { fotosEspiga } from "@/components/demos/fotos"
import { EstadoEnVivo } from "@/components/demos/espiga/en-vivo"
import { Encabezado } from "@/components/demos/espiga/encabezado"
import { NotaEncargo } from "@/components/demos/espiga/encargo"
import { HornoHoy } from "@/components/demos/espiga/horno-hoy"
import { Paneles } from "@/components/demos/espiga/paneles"
import { Pizarra } from "@/components/demos/espiga/pizarra"
import { Desayunos } from "@/components/demos/espiga/desayunos"
import { SelloMoneda } from "@/components/demos/espiga/moneda"
import { Opiniones } from "@/components/demos/espiga/opiniones"
import { ComoLlegar, Preguntas } from "@/components/demos/espiga/preguntas"
import { Sello } from "@/components/demos/espiga/sello"
import { PanDeLaSemana } from "@/components/demos/espiga/suscripcion"
import { TablaHorarios } from "@/components/demos/espiga/tabla-horarios"
import { TarjetaSellos } from "@/components/demos/espiga/tarjeta-sellos"
import { TortaAMedida } from "@/components/demos/espiga/torta"
import { Inclinable } from "@/components/demos/espiga/tres-d"
import { Vitrina } from "@/components/demos/espiga/vitrina"
import { whatsappDemo } from "@/lib/demo"

const mapa =
  "https://www.google.com/maps/search/?api=1&query=Av.+Brasil+2640,+Montevideo,+Uruguay"

const pasos = [
  {
    titulo: "Elegí en la pizarra",
    texto: "Sumá a tu bolsa lo que quieras llevar.",
  },
  {
    titulo: "Elegí a qué hora pasás",
    texto: "O pedí que te lo llevemos a tu casa.",
  },
  {
    titulo: "Mandalo por WhatsApp",
    texto: "Te confirmamos y pagás al recibir.",
  },
]

const historia = [
  {
    anio: "1987",
    texto: "Ramón y Nilda abren un mostrador chiquito en Av. Brasil.",
  },
  {
    anio: "1998",
    texto: "Llega el horno grande y nace la horneada de la tarde.",
  },
  {
    anio: "2016",
    texto:
      "Lucía, la nieta, suma la masa madre y harinas de molinos uruguayos.",
  },
  { anio: "Hoy", texto: "Pedidos por WhatsApp y el mismo pan de siempre." },
]

const encargos = [
  {
    nombre: "Tortas",
    detalle: "Chocolate, ricota, frutillas con crema o rogel. 12 porciones.",
    precio: "desde $ 1.450",
  },
  {
    nombre: "Mesa dulce",
    detalle: "Alfajorcitos, masas secas y mini tartas para 20 personas.",
    precio: "desde $ 3.200",
  },
  {
    nombre: "Sándwiches de miga",
    detalle: "Bandeja de 48 triples, surtidos.",
    precio: "$ 2.100",
  },
  {
    nombre: "Pan para eventos",
    detalle: "Felipitos, pan de campo en rodajas, grisines.",
    precio: "consultá",
  },
]

function TituloSeccion({
  id,
  volanta,
  children,
  bajada,
}: {
  id: string
  volanta: string
  children: React.ReactNode
  bajada?: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="volanta text-[var(--rojo)]">{volanta}</p>
      <h2 id={id} className="titulo mt-2 text-[clamp(2.3rem,5.5vw,3.6rem)]">
        {children}
      </h2>
      {bajada && (
        <p className="mt-4 text-[1.15rem] text-[var(--tinta-70)]">{bajada}</p>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <>
      <Encabezado />

      <main id="inicio">
        {/* Portada */}
        <section
          id="portada"
          className="papel"
          aria-labelledby="titulo-portada"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 pb-14 sm:px-6 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pt-12 lg:pb-20">
            <div>
              <p className="tiza -rotate-2 text-[1.6rem] text-[var(--rojo)] lg:hidden">
                El pan del barrio desde 1987
              </p>
              <h1
                id="titulo-portada"
                className="titulo mt-2 text-[clamp(2.75rem,7.4vw,5.3rem)] lg:mt-0"
              >
                Pan recién horneado,{" "}
                <span className="text-[var(--rojo)]">a la vuelta de casa.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[1.2rem] leading-relaxed text-[var(--tinta-70)]">
                Desde 1987 horneamos en Av. Brasil con masa madre y harinas
                uruguayas. Armá tu bolsa, elegí a qué hora pasás y te la tenemos
                lista, sin hacer fila.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#carta"
                  className="boton-rojo rounded-md px-6 text-[1.1rem]"
                >
                  Ver la pizarra y pedir
                </a>
                <a
                  href="#encargos"
                  className="boton-borde rounded-md px-6 text-[1.1rem]"
                >
                  Encargar una torta
                </a>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[1rem] font-bold">
                {[
                  "Masa madre propia",
                  "Harinas uruguayas",
                  "Pagás al retirar",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex size-6 items-center justify-center rounded-full border-2 border-[var(--rojo)] text-[0.8rem] text-[var(--rojo)]"
                    >
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Foto pegada con cinta, etiqueta de precio y sello */}
            <div className="relative mx-auto w-full max-w-[25rem] px-4 sm:px-0">
              <Inclinable
                as="figure"
                max={6}
                className="sombra-papel relative rotate-2 bg-[#fffdf7] p-3 pb-14"
              >
                <span
                  className="cinta -top-3 left-6 -rotate-6"
                  aria-hidden="true"
                />
                <span
                  className="cinta -top-3 right-6 rotate-6"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--kraft)]">
                  <Image
                    src={fotosEspiga.campo.src}
                    alt="Pan de campo de masa madre recién horneado, con la corteza dorada"
                    fill
                    priority
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 25rem, 85vw"
                    className="object-cover"
                  />
                  <span className="vapores" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <figcaption className="tiza absolute inset-x-3 bottom-3 text-center text-[1.45rem]">
                  El de campo, recién salido
                </figcaption>
              </Inclinable>
              <div
                className="kraft sombra-papel absolute bottom-24 -left-1 -rotate-6 rounded-sm border-2 border-[var(--tinta)] px-4 py-3 sm:-left-8"
                aria-hidden="true"
              >
                <span className="absolute top-1/2 left-2 size-2.5 -translate-y-1/2 rounded-full border-2 border-[var(--tinta)] bg-[var(--papel)]" />
                <p className="pl-3 text-[0.8rem] font-bold tracking-widest uppercase">
                  Pan de campo
                </p>
                <p className="titulo pl-3 text-[2rem] leading-none">$ 180</p>
                <p className="pl-3 text-[0.85rem]">800 g · masa madre</p>
              </div>
              <SelloMoneda className="absolute -top-6 right-1 size-24 rotate-12 sm:-right-6 sm:size-28" />
            </div>
          </div>
        </section>

        {/* Cómo pedir */}
        <section
          aria-labelledby="como-pedir"
          className="kraft border-y-2 border-[var(--tinta)]"
        >
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:px-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
            <h2 id="como-pedir" className="titulo text-[2rem]">
              Pedir es fácil
            </h2>
            <ol className="grid gap-4 md:grid-cols-3">
              {pasos.map((p, i) => (
                <li key={p.titulo} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="titulo flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--tinta)] bg-[var(--papel)] text-[1.5rem]"
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[1.1rem] font-bold">
                      {p.titulo}
                    </span>
                    <span className="block">{p.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Promos de hoy: vitrina 3D */}
        <section
          id="promos"
          aria-labelledby="titulo-promos"
          className="anclas papel px-4 pt-14 pb-4 sm:px-6 md:px-8 md:pt-20"
        >
          <div className="mx-auto max-w-6xl">
            <TituloSeccion
              id="titulo-promos"
              volanta="Hoy en el mostrador"
              bajada="Lo que sobró de ayer a mitad de precio, combos para el mate y una promo distinta cada día. Mientras haya, está."
            >
              Promos de hoy
            </TituloSeccion>
            <div className="mt-10">
              <Vitrina />
            </div>
          </div>
        </section>

        {/* La pizarra (carta) */}
        <section
          id="carta"
          aria-label="La pizarra: carta y precios"
          className="anclas papel px-3 py-12 sm:px-6 md:px-8 md:py-16"
        >
          <div className="mx-auto max-w-6xl">
            <Pizarra />
          </div>
        </section>

        {/* El horno hoy */}
        <section
          id="horno"
          aria-labelledby="titulo-horno"
          className="anclas bg-[var(--papel-2)] px-4 py-14 sm:px-6 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <TituloSeccion
              id="titulo-horno"
              volanta="Dos horneadas por día"
              bajada="Prendemos el horno a las 5 de la mañana. A las 7:00 sale la primera tanda y a las 16:00, la de la merienda. Si querés asegurarte, reservalo en tu bolsa."
            >
              El horno hoy
            </TituloSeccion>
            <div className="mt-10">
              <HornoHoy />
            </div>
          </div>
        </section>

        {/* Historia */}
        <section
          id="historia"
          aria-labelledby="titulo-historia"
          className="anclas papel px-4 py-14 sm:px-6 md:px-8 md:py-20"
        >
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <TituloSeccion id="titulo-historia" volanta="Nuestra historia">
                Tres generaciones amasando en el barrio
              </TituloSeccion>
              <div className="mt-6 grid max-w-xl gap-4 text-[1.15rem] leading-relaxed">
                <p>
                  En 1987, Ramón y Nilda Ferreira abrieron un mostrador chiquito
                  en Av. Brasil. Ramón amasaba de madrugada; Nilda atendía y
                  anotaba los fiados en un cuaderno que todavía guardamos.
                </p>
                <p>
                  Hoy el horno lo maneja Lucía, su nieta. Sumó la masa madre y
                  las harinas de molinos uruguayos, pero las recetas de los
                  dulces siguen siendo las de Nilda, escritas a mano.
                </p>
              </div>
              <blockquote className="mt-10 border-l-4 border-[var(--rojo)] pl-5">
                <p className="titulo text-[clamp(1.7rem,3.6vw,2.4rem)] leading-tight">
                  “La masa no se apura. Se espera, como a los amigos.”
                </p>
                <footer className="tiza mt-3 text-[1.35rem] text-[var(--rojo)]">
                  — Nilda Ferreira
                </footer>
              </blockquote>
            </div>

            <div className="relative">
              <figure className="sombra-papel relative ml-auto max-w-md -rotate-1 bg-[#fffdf7] p-3 pb-12">
                <span
                  className="cinta -top-3 left-1/2 -translate-x-1/2 rotate-1"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--kraft)]">
                  <Image
                    src={fotosEspiga.semillas.src}
                    alt="Panes de semillas sobre el mostrador"
                    fill
                    sizes="(min-width: 1024px) 28rem, 90vw"
                    className="object-cover sepia-[0.25]"
                  />
                </div>
                <figcaption className="tiza absolute inset-x-3 bottom-2.5 text-center text-[1.35rem]">
                  El mostrador de Av. Brasil
                </figcaption>
              </figure>
              <ol className="mt-10 grid gap-0 border-l-2 border-dashed border-[var(--tinta)] pl-6">
                {historia.map((h) => (
                  <li key={h.anio} className="relative pb-6 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-[2.0625rem] size-4 rounded-full border-2 border-[var(--tinta)] bg-[var(--rojo)]"
                    />
                    <p className="titulo text-[1.8rem] leading-none text-[var(--rojo)]">
                      {h.anio}
                    </p>
                    <p className="mt-1 text-[1.1rem]">{h.texto}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Tortas y encargos */}
        <section
          id="encargos"
          aria-labelledby="titulo-encargos"
          className="anclas kraft border-y-2 border-[var(--tinta)] px-4 py-14 sm:px-6 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <TituloSeccion
              id="titulo-encargos"
              volanta="Cumpleaños, bautismos, reuniones"
              bajada="Armá tu torta y mirala en 3D antes de pedirla. Hacemos tortas y mesas dulces por encargo, con 48 horas de anticipación."
            >
              Tortas y encargos para tus fiestas
            </TituloSeccion>
            <div id="torta" className="anclas mt-10">
              <TortaAMedida />
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h3 className="titulo text-[clamp(1.8rem,4vw,2.4rem)]">
                Mesas dulces, miga y pan para eventos
              </h3>
              <p className="mt-2 text-[1.1rem] text-[var(--tinta-70)]">
                Para cumpleaños, velorios, reuniones de oficina o la fiesta del
                club. Te pasamos presupuesto sin compromiso.
              </p>
              <ul className="mt-6 border-t-2 border-[var(--tinta)]">
                {encargos.map((e) => (
                  <li
                    key={e.nombre}
                    className="border-b border-dashed border-[rgba(34,24,14,0.4)] py-4"
                  >
                    <div className="flex items-baseline gap-3">
                      <h3 className="titulo text-[1.5rem]">{e.nombre}</h3>
                      <span
                        aria-hidden="true"
                        className="flex-1 translate-y-[-0.3em] border-b-2 border-dotted border-[rgba(34,24,14,0.45)]"
                      />
                      <p className="shrink-0 font-bold">{e.precio}</p>
                    </div>
                    <p className="mt-1">{e.detalle}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid grid-cols-2 gap-5 px-2 sm:gap-8">
                <figure className="sombra-papel -rotate-3 bg-[#fffdf7] p-2 pb-9">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={fotosEspiga.ricota.src}
                      alt="Porción de torta de ricota"
                      fill
                      sizes="(min-width: 1024px) 14rem, 45vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="tiza mt-1.5 text-center text-[1.2rem]">
                    Torta de ricota
                  </figcaption>
                </figure>
                <figure className="sombra-papel mt-6 rotate-2 bg-[#fffdf7] p-2 pb-9">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={fotosEspiga.alfajores.src}
                      alt="Alfajores de maicena con coco"
                      fill
                      sizes="(min-width: 1024px) 14rem, 45vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="tiza mt-1.5 text-center text-[1.2rem]">
                    Alfajorcitos
                  </figcaption>
                </figure>
              </div>
            </div>
            <div className="lg:sticky lg:top-24">
              <NotaEncargo />
            </div>
          </div>
        </section>

        {/* Desayunos para regalar */}
        <section
          id="regalos"
          aria-labelledby="titulo-regalos"
          className="anclas papel px-4 py-14 sm:px-6 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <TituloSeccion
              id="titulo-regalos"
              volanta="Para el Día de la Madre, un cumple o porque sí"
              bajada="Armamos la caja, escribimos la tarjeta a mano y la llevamos a la puerta. Tocá una caja para ver qué trae."
            >
              Desayunos para regalar
            </TituloSeccion>
            <div className="mt-12">
              <Desayunos />
            </div>
          </div>
        </section>

        {/* Para los de siempre: tarjeta de sellos y suscripción */}
        <section
          id="de-siempre"
          aria-labelledby="titulo-de-siempre"
          className="anclas bg-[var(--papel-2)] px-4 py-14 sm:px-6 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <TituloSeccion
              id="titulo-de-siempre"
              volanta="Para los de siempre"
              bajada="Los vecinos que vienen todos los días se merecen algo más."
            >
              Tu tarjeta y tu pan de la semana
            </TituloSeccion>
            <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-start">
              <div id="tarjeta" className="anclas">
                <h3 className="titulo text-[1.9rem]">La tarjeta de la casa</h3>
                <p className="mt-1 mb-5 text-[1.05rem] text-[var(--tinta-70)]">
                  Cada 10 panes, el siguiente pan de campo va de regalo.
                </p>
                <TarjetaSellos />
              </div>
              <div id="suscripcion" className="anclas">
                <h3 className="titulo text-[1.9rem]">El pan de la semana</h3>
                <p className="mt-1 mb-5 text-[1.05rem] text-[var(--tinta-70)]">
                  Elegí tu pan y los días: te lo apartamos o te lo llevamos, con
                  10 % menos. Pausala cuando te vayas de viaje.
                </p>
                <PanDeLaSemana />
              </div>
            </div>
          </div>
        </section>

        {/* Opiniones */}
        <section
          id="opiniones"
          aria-labelledby="titulo-opiniones"
          className="anclas kraft border-y-2 border-[var(--tinta)] px-4 py-14 sm:px-6 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <TituloSeccion id="titulo-opiniones" volanta="Lo que dicen los vecinos">
              Opiniones del barrio
            </TituloSeccion>
            <div className="mt-8">
              <Opiniones />
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section
          id="preguntas"
          aria-labelledby="titulo-preguntas"
          className="anclas papel px-4 py-14 sm:px-6 md:px-8 md:py-20"
        >
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <TituloSeccion
                id="titulo-preguntas"
                volanta="Preguntas frecuentes"
                bajada="Si no encontrás lo que buscás, llamanos al 2709 4512. Atiende Lucía o Ramón."
              >
                Lo que más nos preguntan
              </TituloSeccion>
            </div>
            <Preguntas />
          </div>
        </section>

        {/* Horarios y dirección */}
        <section
          id="visitanos"
          aria-labelledby="titulo-visitanos"
          className="anclas papel px-4 py-14 sm:px-6 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <TituloSeccion id="titulo-visitanos" volanta="Visitanos">
              Horarios y cómo llegar
            </TituloSeccion>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div>
                <EstadoEnVivo className="rounded-md bg-[var(--tinta)] px-4 py-2.5 text-[1.05rem] text-[var(--papel)]" />
                <div className="mt-5">
                  <TablaHorarios />
                </div>
                <p className="mt-5 text-[1.05rem] text-[var(--tinta-70)]">
                  Las horneadas salen a las 7:00 y a las 16:00 (los domingos,
                  solo a la mañana). El pan de campo se termina temprano:
                  reservalo en tu bolsa.
                </p>
              </div>

              <div className="overflow-hidden rounded-md border-2 border-[var(--tinta)] bg-[#fffdf7]">
                <div
                  className="relative h-56 border-b-2 border-[var(--tinta)] bg-[var(--papel-2)] sm:h-64"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 600 260"
                    preserveAspectRatio="xMidYMid slice"
                    className="absolute inset-0 size-full"
                  >
                    <path
                      d="M0 215 C 150 190, 300 240, 600 200 L600 260 L0 260 Z"
                      fill="#c8d6d0"
                    />
                    <path
                      d="M0 215 C 150 190, 300 240, 600 200"
                      fill="none"
                      stroke="#22180e"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                    />
                    <g
                      stroke="rgba(34,24,14,0.18)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    >
                      <path d="M90 -10 V205" />
                      <path d="M210 -10 V212" />
                      <path d="M430 -10 V215" />
                      <path d="M540 -10 V205" />
                      <path d="M-10 40 H610" />
                      <path d="M-10 160 H610" />
                    </g>
                    <path
                      d="M-10 100 H610"
                      stroke="rgba(34,24,14,0.45)"
                      strokeWidth="20"
                    />
                    <path
                      d="M320 -10 V218"
                      stroke="rgba(34,24,14,0.3)"
                      strokeWidth="14"
                    />
                    <text
                      x="20"
                      y="92"
                      fontSize="15"
                      fontWeight="700"
                      fill="#22180e"
                    >
                      Av. Brasil
                    </text>
                    <text
                      x="440"
                      y="244"
                      fontSize="15"
                      fontWeight="700"
                      fill="#22180e"
                      fontStyle="italic"
                    >
                      Rambla
                    </text>
                    <g transform="translate(320 100)">
                      <circle r="30" fill="#a3301c" opacity="0.18" />
                      <circle
                        r="17"
                        fill="#a3301c"
                        stroke="#fffdf7"
                        strokeWidth="4"
                      />
                    </g>
                    <g transform="translate(345 52)">
                      <rect width="112" height="34" rx="4" fill="#22180e" />
                      <text
                        x="56"
                        y="22"
                        textAnchor="middle"
                        fontSize="15"
                        fontWeight="700"
                        fill="#f6efdf"
                      >
                        La Espiga
                      </text>
                    </g>
                  </svg>
                </div>
                <div className="p-5 sm:p-7">
                  <p className="titulo flex items-start gap-2 text-[1.7rem]">
                    <MapPin
                      className="mt-1 size-6 shrink-0 text-[var(--rojo)]"
                      aria-hidden="true"
                    />
                    Av. Brasil 2640, Pocitos
                  </p>
                  <p className="mt-1 pl-8 text-[var(--tinta-70)]">
                    Entre Benito Blanco y Chucarro, a tres cuadras de la rambla.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={mapa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="boton-rojo rounded-md px-5"
                    >
                      <MapPin className="size-5" aria-hidden="true" />
                      Cómo llegar
                      <span className="sr-only"> (abre Google Maps)</span>
                    </a>
                    <a
                      href="tel:+59827094512"
                      className="boton-borde rounded-md px-5"
                    >
                      <Phone className="size-5" aria-hidden="true" />
                      2709 4512
                    </a>
                  </div>
                  <div className="mt-6 border-t-2 border-dashed border-[var(--tinta-20)] pt-5">
                    <p className="titulo mb-3 text-[1.4rem]">Cómo llegar</p>
                    <ComoLlegar />
                  </div>
                  <ul className="mt-6 grid gap-3 border-t-2 border-dashed border-[var(--tinta-20)] pt-5">
                    <li className="flex gap-3">
                      <CreditCard
                        className="mt-0.5 size-5 shrink-0 text-[var(--rojo)]"
                        aria-hidden="true"
                      />
                      Efectivo, débito, crédito y Mercado Pago.
                    </li>
                    <li className="flex gap-3">
                      <Truck
                        className="mt-0.5 size-5 shrink-0 text-[var(--rojo)]"
                        aria-hidden="true"
                      />
                      Envíos a Pocitos, Punta Carretas y Buceo.
                    </li>
                    <li className="flex gap-3">
                      <Accessibility
                        className="mt-0.5 size-5 shrink-0 text-[var(--rojo)]"
                        aria-hidden="true"
                      />
                      Entrada a nivel, sin escalones. Si no podés bajar del
                      auto, te lo alcanzamos.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pie bg-[var(--tinta)] px-4 pt-12 pb-32 text-[var(--papel)] sm:px-6 md:px-8 lg:pb-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[auto_1fr_1fr] md:items-start">
          <Sello id="sello-pie" className="size-32 text-[var(--papel)]" />
          <div>
            <p className="titulo notranslate text-[2rem]" translate="no">
              La Espiga
            </p>
            <p className="mt-2 max-w-sm text-[var(--tiza-70)]">
              Panadería de barrio en Pocitos desde 1987. Horneamos todos los
              días con harinas uruguayas.
            </p>
          </div>
          <div className="grid gap-2">
            <p className="font-bold">Av. Brasil 2640, Pocitos, Montevideo</p>
            <p className="text-[var(--tiza-70)]">
              Lun. a sáb. 7:00 a 20:00 · Dom. 8:00 a 13:00
            </p>
            <a
              href="tel:+59827094512"
              className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"
            >
              <Phone className="size-5" aria-hidden="true" />
              2709 4512
            </a>
            <a
              href={whatsappDemo("¡Hola, La Espiga! Tengo una consulta.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-[var(--tiza-30)] pt-6 text-[0.95rem] text-[var(--tiza-70)]">
          <p>
            Sitio de ejemplo: nombres, precios, teléfono y dirección son
            ficticios.
          </p>
          <CreditosFotos fotos={fotosEspiga} className="mx-0" />
        </div>
      </footer>

      <Paneles />
      <BannerDemo />
    </>
  )
}
