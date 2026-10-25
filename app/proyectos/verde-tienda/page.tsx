import Image from "next/image"
import {
  ArrowDown,
  CreditCard,
  AtSign,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react"

import { BannerDemo } from "@/components/demos/banner-demo"
import { CreditosFotos } from "@/components/demos/creditos-fotos"
import { fotosVerde } from "@/components/demos/fotos"
import { pesos, whatsappDemo } from "@/lib/demo"
import {
  ENVIO_GRATIS,
  buscarPlanta,
  resenas,
} from "@/components/demos/verde/catalogo"
import { Anuncio, Encabezado } from "@/components/demos/verde/encabezado"
import { Catalogo } from "@/components/demos/verde/productos"
import { Quiz } from "@/components/demos/verde/quiz"
import {
  CategoriasHistorias,
  GuiaCuidados,
  Newsletter,
  Preguntas,
} from "@/components/demos/verde/secciones"
import { Tienda } from "@/components/demos/verde/tienda"
import { Logo } from "@/components/demos/verde/ui"

const beneficios = [
  {
    Icono: Truck,
    titulo: "Envío en el día",
    texto: `Gratis en Montevideo desde ${pesos(ENVIO_GRATIS)}`,
    color: "bg-[var(--vt-menta)]",
  },
  {
    Icono: ShieldCheck,
    titulo: "Garantía de 30 días",
    texto: "Si no prende, te la cambiamos",
    color: "bg-[var(--vt-manteca)]",
  },
  {
    Icono: CreditCard,
    titulo: "Hasta 6 cuotas",
    texto: "Sin recargo con Mercado Pago",
    color: "bg-[var(--vt-lila)]",
  },
  {
    Icono: MessageCircle,
    titulo: "Te ayudamos",
    texto: "Dudas de cuidado por WhatsApp",
    color: "bg-[var(--vt-rosa)]",
  },
]

const coloresResena = [
  "bg-[var(--vt-papel)]",
  "bg-[var(--vt-menta)]",
  "bg-[var(--vt-papel)]",
  "bg-[var(--vt-rosa)]",
  "bg-[var(--vt-papel)]",
  "bg-[var(--vt-manteca)]",
]

const consulta = whatsappDemo(
  "Hola Verde Tienda, tengo una consulta sobre una planta."
)

export default function Page() {
  return (
    <Tienda>
      <a
        href="#catalogo"
        className="sr-only z-[80] rounded-full bg-[var(--vt-manteca)] px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar a la tienda
      </a>
      <Anuncio />
      <Encabezado />

      <main id="inicio">
        {/* ---------- Portada ---------- */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 pb-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6 lg:pt-14 lg:pb-16">
            <div className="relative z-10">
              <div className="flex flex-wrap gap-2">
                <span className="vt-sticker bg-[var(--vt-menta)]" style={{ "--giro": "-3deg" } as React.CSSProperties}>
                  <MapPin className="size-3.5" aria-hidden="true" /> Vivero online en Montevideo
                </span>
                <span className="vt-sticker bg-[var(--vt-papel)]" style={{ "--giro": "2deg" } as React.CSSProperties}>
                  +4.000 plantas entregadas
                </span>
              </div>
              <h1 className="vt-titulo mt-6 text-[clamp(3.5rem,13vw,7.8rem)]">
                Plantas fáciles de{" "}
                <span className="vt-garabato relative z-0">querer</span>.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--vt-tinta-70)] sm:text-xl">
                Elegila online, te la llevamos en el día y te explicamos cómo
                cuidarla. ¿Es tu primera planta? Empezá por el quiz.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#catalogo" className="vt-boton h-14 px-7 text-lg">
                  Comprar plantas <ArrowDown className="size-5" aria-hidden="true" />
                </a>
                <a href="#quiz" className="vt-boton-linea h-14 px-7 text-lg">
                  <Sparkles className="size-5" aria-hidden="true" /> Hacer el quiz
                </a>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm">
                <div className="flex -space-x-2" aria-hidden="true">
                  {["bg-[var(--vt-rosa)]", "bg-[var(--vt-cielo)]", "bg-[var(--vt-manteca)]"].map((c, i) => (
                    <span key={c} className={`grid size-9 place-items-center rounded-full border-2 border-[var(--vt-tinta)] text-xs font-extrabold ${c}`}>
                      {["C", "J", "F"][i]}
                    </span>
                  ))}
                </div>
                <p>
                  <span className="inline-flex items-center gap-1 font-extrabold">
                    <Star className="size-4 fill-[var(--vt-coral)]" aria-hidden="true" /> 4,8 de 5
                  </span>{" "}
                  <span className="text-[var(--vt-tinta-70)]">en más de 1.200 compras</span>
                </p>
              </div>
            </div>

            {/* Collage de fotos */}
            <div className="relative mx-auto aspect-square w-full max-w-[34rem]" aria-hidden="true">
              <div className="vt-blob-1 absolute inset-[6%_4%_10%_10%] bg-[var(--vt-lila)]" />
              <div className="vt-blob-2 absolute inset-[10%_10%_14%_16%] overflow-hidden border-2 border-[var(--vt-tinta)]">
                <Image
                  src={fotosVerde.monstera.src}
                  alt=""
                  fill
                  preload
                  sizes="(min-width: 1024px) 30rem, 80vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-[2%] left-0 size-[38%] rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)] p-2">
                <div className="relative size-full overflow-hidden rounded-full border-2 border-[var(--vt-tinta)]">
                  <Image src={fotosVerde.suculentas.src} alt="" fill sizes="13rem" className="object-cover" />
                </div>
              </div>
              <div className="vt-blob-3 absolute top-0 right-0 size-[30%] overflow-hidden border-2 border-[var(--vt-tinta)] bg-[var(--vt-rosa)]">
                <Image src={fotosVerde.potus.src} alt="" fill sizes="10rem" className="object-cover" />
              </div>
              <span className="vt-sticker absolute top-[38%] -left-1 bg-[var(--vt-coral)] text-sm sm:left-2" style={{ "--giro": "-8deg" } as React.CSSProperties}>
                <Truck className="size-4" aria-hidden="true" /> Llega hoy
              </span>
              <span className="vt-sticker absolute right-[2%] bottom-[16%] bg-[var(--vt-papel)] text-sm" style={{ "--giro": "6deg" } as React.CSSProperties}>
                Monstera desde {pesos(890)}
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
            <CategoriasHistorias />
          </div>
        </section>

        {/* ---------- Beneficios ---------- */}
        <section aria-label="Por qué comprar en Verde Tienda" className="border-y-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
          <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-[var(--vt-tinta-15)] lg:grid-cols-4">
            {beneficios.map((b) => (
              <li key={b.titulo} className="flex flex-col gap-3 bg-[var(--vt-papel)] p-4 sm:flex-row sm:items-center sm:p-6">
                <span className={`grid size-12 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] ${b.color}`}>
                  <b.Icono className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-extrabold">{b.titulo}</span>
                  <span className="block text-sm text-[var(--vt-tinta-70)]">{b.texto}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Catálogo ---------- */}
        <section id="catalogo" aria-labelledby="catalogo-titulo" className="scroll-mt-32 px-4 py-14 md:px-6 md:py-20 lg:scroll-mt-36">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold tracking-wider text-[var(--vt-hoja)] uppercase">
                  La tienda
                </p>
                <h2 id="catalogo-titulo" className="vt-titulo mt-2 text-[clamp(2.8rem,7vw,5rem)]">
                  Elegí tu próxima planta
                </h2>
              </div>
              <p className="max-w-sm text-[var(--vt-tinta-70)]">
                Precios con IVA. Tocá una planta para ver sus cuidados, elegir
                tamaño y maceta.
              </p>
            </div>
            <div className="mt-8">
              <Catalogo />
            </div>
          </div>
        </section>

        {/* ---------- Quiz ---------- */}
        <section id="quiz" aria-labelledby="quiz-titulo" className="scroll-mt-32 px-4 pb-14 md:px-6 md:pb-20 lg:scroll-mt-36">
          <div className="mx-auto max-w-7xl">
            <Quiz />
          </div>
        </section>

        {/* ---------- Guía de cuidados ---------- */}
        <section id="cuidados" aria-labelledby="cuidados-titulo" className="scroll-mt-32 bg-[var(--vt-manteca)] px-4 py-14 md:px-6 md:py-20 lg:scroll-mt-36">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="cuidados-titulo" className="vt-titulo text-[clamp(2.8rem,7vw,5rem)]">
                Guía de cuidados
                <br />
                <span className="text-[var(--vt-hoja)]">sin vueltas</span>
              </h2>
              <p className="max-w-sm text-[var(--vt-tinta-70)]">
                No hace falta tener mano verde. Con estas cuatro cosas, la
                enorme mayoría de las plantas vive años.
              </p>
            </div>
            <div className="mt-8">
              <GuiaCuidados />
            </div>
          </div>
        </section>

        {/* ---------- Reseñas ---------- */}
        <section id="resenas" aria-labelledby="resenas-titulo" className="scroll-mt-32 px-4 py-14 md:px-6 md:py-20 lg:scroll-mt-36">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="resenas-titulo" className="vt-titulo text-[clamp(2.8rem,7vw,5rem)]">
                Lo que dicen
                <br />
                en Montevideo
              </h2>
              <div className="flex items-center gap-4 rounded-3xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] px-5 py-4">
                <span className="vt-titulo text-5xl">4,8</span>
                <span className="text-sm">
                  <span className="flex gap-0.5" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="size-4 fill-[var(--vt-coral)]" />
                    ))}
                  </span>
                  <span className="mt-1 block text-[var(--vt-tinta-70)]">
                    <span className="sr-only">4,8 de 5 estrellas, </span>
                    1.247 opiniones verificadas
                  </span>
                </span>
              </div>
            </div>
            <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {resenas.map((r, i) => {
                const planta = buscarPlanta(r.plantaId)
                return (
                  <li
                    key={r.nombre}
                    className={`mb-4 break-inside-avoid rounded-[28px] border-2 border-[var(--vt-tinta)] p-5 ${coloresResena[i % coloresResena.length]}`}
                  >
                    <div className="flex gap-0.5" role="img" aria-label={`${r.estrellas} de 5 estrellas`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`size-4 ${n <= r.estrellas ? "fill-[var(--vt-coral)]" : "fill-transparent opacity-40"}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <blockquote className="mt-3 text-lg leading-snug font-semibold">
                      “{r.texto}”
                    </blockquote>
                    <div className="mt-4 flex items-center gap-3">
                      {planta && (
                        <span className="vt-blob-2 relative size-11 shrink-0 overflow-hidden border-2 border-[var(--vt-tinta)]">
                          <Image src={planta.foto.src} alt="" fill sizes="44px" className="object-cover" />
                        </span>
                      )}
                      <span className="text-sm">
                        <span className="block font-extrabold">
                          {r.nombre} · {r.barrio}
                        </span>
                        <span className="block text-[var(--vt-tinta-70)]">
                          Compró {planta?.nombre.toLowerCase()} · {r.fecha}
                        </span>
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ---------- Preguntas ---------- */}
        <section id="preguntas" aria-labelledby="preguntas-titulo" className="scroll-mt-32 px-4 pb-14 md:px-6 md:pb-20 lg:scroll-mt-36">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <h2 id="preguntas-titulo" className="vt-titulo text-[clamp(2.8rem,7vw,5rem)]">
                Envíos, pagos y garantía
              </h2>
              <div className="mt-6 rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-cielo)] p-5">
                <p className="font-extrabold">¿Te quedó alguna duda?</p>
                <p className="mt-1 text-sm text-[var(--vt-tinta-70)]">
                  Escribinos de lunes a sábado de 9 a 18. Respondemos en
                  minutos, y también te ayudamos si tu planta está triste.
                </p>
                <a href={consulta} target="_blank" rel="noopener noreferrer" className="vt-boton-tinta mt-4 h-11 px-5 text-sm">
                  <MessageCircle className="size-4" aria-hidden="true" /> Escribir por WhatsApp
                </a>
              </div>
            </div>
            <Preguntas />
          </div>
        </section>

        {/* ---------- Newsletter ---------- */}
        <section aria-labelledby="news-titulo" className="px-4 pb-14 md:px-6 md:pb-20">
          <div className="relative mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-[36px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-coral)] p-6 sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="vt-blob-3 pointer-events-none absolute -right-10 -bottom-16 size-52 bg-[var(--vt-durazno)] opacity-80" aria-hidden="true" />
            <div className="relative">
              <h2 id="news-titulo" className="vt-titulo text-[clamp(2.4rem,6vw,4rem)]">
                10% en tu primera planta
              </h2>
              <p className="mt-3 max-w-md">
                Sumate al club verde: un mail por mes con tips de temporada,
                plantas nuevas y descuentos. Nada de spam.
              </p>
            </div>
            <div className="relative">
              <Newsletter />
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Pie ---------- */}
      <footer className="bg-[var(--vt-tinta)] px-4 pt-14 pb-24 text-[var(--vt-crema)] md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="text-4xl" />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Vivero online con plantas elegidas a mano en Carrasco y enviadas
              con cuidado a todo el país.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (ejemplo)"
                className="grid size-11 place-items-center rounded-full border-2 border-white/30 hover:border-[var(--vt-manteca)] hover:text-[var(--vt-manteca)]"
              >
                <AtSign className="size-5" aria-hidden="true" />
              </a>
              <a
                href={consulta}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp (ejemplo)"
                className="grid size-11 place-items-center rounded-full border-2 border-white/30 hover:border-[var(--vt-manteca)] hover:text-[var(--vt-manteca)]"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <nav aria-label="Tienda">
            <p className="vt-titulo text-xl text-[var(--vt-manteca)]">Tienda</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><a href="#catalogo" className="hover:underline">Todas las plantas</a></li>
              <li><a href="#quiz" className="hover:underline">¿Qué planta va con vos?</a></li>
              <li><a href="#cuidados" className="hover:underline">Guía de cuidados</a></li>
              <li><a href="#resenas" className="hover:underline">Reseñas</a></li>
            </ul>
          </nav>
          <nav aria-label="Ayuda">
            <p className="vt-titulo text-xl text-[var(--vt-manteca)]">Ayuda</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><a href="#preguntas" className="hover:underline">Envíos y retiro</a></li>
              <li><a href="#preguntas" className="hover:underline">Garantía de 30 días</a></li>
              <li><a href="#preguntas" className="hover:underline">Medios de pago</a></li>
              <li><a href={consulta} target="_blank" rel="noopener noreferrer" className="hover:underline">Contacto</a></li>
            </ul>
          </nav>
          <div>
            <p className="vt-titulo text-xl text-[var(--vt-manteca)]">Vivero</p>
            <address className="mt-3 text-sm leading-relaxed text-white/80 not-italic">
              Camino Carrasco 5120, Montevideo
              <br />
              Lunes a sábados de 9 a 18
            </address>
            <p className="mt-5 text-xs font-bold tracking-wider text-white/60 uppercase">Pagás con</p>
            <ul className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold">
              {["Mercado Pago", "Visa", "Mastercard", "OCA", "Transferencia"].map((m) => (
                <li key={m} className="rounded-full border-2 border-white/25 px-2.5 py-1">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t-2 border-white/15 pt-6 text-xs text-white/60">
          <p>© 2026 Verde Tienda · Sitio de ejemplo: precios, reseñas y datos son ficticios.</p>
        </div>
        <CreditosFotos fotos={fotosVerde} className="max-w-7xl text-white/80" />
      </footer>

      <BannerDemo />
    </Tienda>
  )
}
