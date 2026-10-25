"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Popover } from "radix-ui"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  MessageCircle,
  PawPrint,
  ShoppingBag,
  Sparkles,
  Sprout,
  Sun,
  Trophy,
  UserRound,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { pesos, whatsappDemo } from "@/lib/demo"
import {
  ENVIO_GRATIS,
  catalogo,
  categoriasPlantas,
  colorCategoria,
  textoCategoria,
  type CategoriaPlanta,
} from "@/components/demos/verde/catalogo"
import { RUTA, useTienda, type Filtros } from "@/components/demos/verde/estado"
import { Buscador } from "@/components/demos/verde/buscador"
import { MenuCuenta } from "@/components/demos/verde/cuenta"
import { Cajon, Logo, capa, fondo } from "@/components/demos/verde/ui"

/* ---------- Barra de anuncios que rota ---------- */

const anuncios = [
  `Envío gratis en Montevideo desde ${pesos(ENVIO_GRATIS)}`,
  "Comprá antes de las 14 y te llega hoy",
  "Hasta 6 cuotas sin recargo con Mercado Pago",
  "Garantía de 30 días: si no prende, te la cambiamos",
  "Primera compra: 10% con el código PRIMERAPLANTA",
]

export function Anuncio() {
  const { pausado } = useTienda()
  const [i, setI] = useState(0)
  const [pausa, setPausa] = useState(false)

  // Rota sola; se frena al pasar el mouse, al enfocarla o con "Pausar animaciones".
  useEffect(() => {
    if (pausa || pausado) return
    const t = window.setInterval(() => setI((n) => (n + 1) % anuncios.length), 4500)
    return () => window.clearInterval(t)
  }, [pausa, pausado])

  const mover = (d: number) =>
    setI((n) => (n + d + anuncios.length) % anuncios.length)

  return (
    <div
      className="bg-[var(--vt-tinta)] text-[var(--vt-papel)]"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Novedades de la tienda"
    >
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-2 px-2 md:px-6">
        <button type="button" className="vt-icono size-8 hover:bg-white/10" onClick={() => mover(-1)} aria-label="Anuncio anterior">
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <div className="relative h-full min-w-0 flex-1 overflow-hidden text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={i}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-full items-center justify-center gap-2 truncate text-[13px] font-semibold"
            >
              <Sparkles className="size-3.5 shrink-0 text-[var(--vt-manteca)]" aria-hidden="true" />
              <span className="truncate">{anuncios[i]}</span>
            </motion.p>
          </AnimatePresence>
        </div>
        <button type="button" className="vt-icono size-8 hover:bg-white/10" onClick={() => mover(1)} aria-label="Anuncio siguiente">
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ---------- Atajos de filtro (mega menú y menú móvil) ---------- */

const necesidades: {
  etiqueta: string
  detalle: string
  filtros: Partial<Filtros>
  Icono: typeof Sun
  color: string
}[] = [
  {
    etiqueta: "Aptas para mascotas",
    detalle: "Sin riesgo para perros y gatos",
    filtros: { mascotas: true },
    Icono: PawPrint,
    color: "bg-[var(--vt-rosa)]",
  },
  {
    etiqueta: "Para poca luz",
    detalle: "Rincones y monoambientes",
    filtros: { pocaLuz: true },
    Icono: Sun,
    color: "bg-[var(--vt-cielo)]",
  },
  {
    etiqueta: "Fáciles de cuidar",
    detalle: "Para arrancar sin miedo",
    filtros: { facil: true },
    Icono: Sprout,
    color: "bg-[var(--vt-menta)]",
  },
]

function fotoCategoria(c: CategoriaPlanta) {
  return catalogo.find((p) => p.categoria === c)!.foto.src
}

function MegaMenu() {
  const { irAlCatalogo, setOrden } = useTienda()
  const [abierto, setAbierto] = useState(false)

  function ir(f: Partial<Filtros>) {
    setAbierto(false)
    irAlCatalogo(f)
  }

  return (
    <Popover.Root open={abierto} onOpenChange={setAbierto}>
      <Popover.Trigger className="vt-chip h-10 gap-1.5 bg-[var(--vt-manteca)] px-4 text-sm data-[state=open]:bg-[var(--vt-tinta)] data-[state=open]:text-[var(--vt-papel)]">
        Comprar plantas
        <ChevronDown className="size-4 transition-transform [[data-state=open]_&]:rotate-180" aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={12}
          collisionPadding={16}
          className={cn(
            capa,
            "vt-menu z-[55] w-[min(60rem,calc(100vw-2rem))] rounded-[32px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5 shadow-[0_24px_50px_-24px_rgba(31,42,34,0.55)]"
          )}
          aria-label="Categorías y filtros"
        >
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr_0.95fr]">
            <div>
              <p className="text-xs font-bold tracking-wider text-[var(--vt-tinta-70)] uppercase">
                Categorías
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2.5">
                {categoriasPlantas.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => ir({ categoria: c })}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-3xl p-2.5 text-left transition-transform hover:-rotate-1",
                        fondo[colorCategoria[c]]
                      )}
                    >
                      <span className="vt-blob-1 relative size-14 shrink-0 overflow-hidden border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
                        <Image src={fotoCategoria(c)} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="vt-titulo block text-xl">{c}</span>
                        <span className="block text-xs leading-snug text-[var(--vt-tinta-70)]">
                          {textoCategoria[c]}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-[var(--vt-tinta-70)] uppercase">
                Según tu casa
              </p>
              <ul className="mt-3 space-y-1">
                {necesidades.map((n) => (
                  <li key={n.etiqueta}>
                    <button
                      type="button"
                      onClick={() => ir(n.filtros)}
                      className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-[var(--vt-crema)]"
                    >
                      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)]", n.color)}>
                        <n.Icono className="size-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-extrabold">{n.etiqueta}</span>
                        <span className="block text-xs text-[var(--vt-tinta-70)]">{n.detalle}</span>
                      </span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      ir({})
                      setOrden("vendidas")
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-[var(--vt-crema)]"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-durazno)]">
                      <Trophy className="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold">Más vendidas</span>
                      <span className="block text-xs text-[var(--vt-tinta-70)]">Las que todos se llevan</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <Link
              href={`${RUTA}/#quiz`}
              onClick={() => setAbierto(false)}
              className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-lila)] p-5"
            >
              <span className="vt-sticker self-start bg-[var(--vt-manteca)]">Quiz · 30 segundos</span>
              <span>
                <span className="vt-titulo mt-6 block text-3xl">¿Qué planta va con vos?</span>
                <span className="mt-2 block text-sm text-[var(--vt-tinta-70)]">
                  Cuatro preguntas y te recomendamos la ideal para tu casa.
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold underline underline-offset-4">
                  Hacer el quiz <ChevronRight className="size-4" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

/* ---------- Encabezado ---------- */

function Burbuja({ n, color = "bg-[var(--vt-coral)]" }: { n: number; color?: string }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className={cn(
            "absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[var(--vt-tinta)] px-1 text-[10px] font-extrabold text-[var(--vt-tinta)] tabular-nums",
            color
          )}
          aria-hidden="true"
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function Encabezado() {
  const { cantidadCarrito, favoritos, abrir, irAlCatalogo } = useTienda()

  const enlaces = [
    { href: `${RUTA}/#quiz`, texto: "¿Qué planta va con vos?" },
    { href: `${RUTA}/#armar`, texto: "Maceta 3D", destacado: true },
    { href: `${RUTA}/#cuidados`, texto: "Cuidados" },
    { href: `${RUTA}/#club`, texto: "Club" },
    { href: `${RUTA}/#preguntas`, texto: "Ayuda" },
  ]

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--vt-tinta)] bg-[var(--vt-crema)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-4 md:px-6 lg:py-3">
        <button
          type="button"
          className="vt-icono size-11 lg:hidden"
          aria-label="Abrir menú"
          onClick={() => abrir("menu")}
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
        <Link href={RUTA} aria-label="Verde Tienda, ir al inicio" className="shrink-0">
          <Logo className="text-[1.65rem] lg:text-[2rem]" />
        </Link>

        <Buscador className="mx-auto hidden w-full max-w-xl lg:block" />

        <nav aria-label="Accesos rápidos" className="ml-auto flex items-center gap-0.5 sm:gap-1.5 lg:ml-0">
          <button
            type="button"
            className="vt-icono relative size-11"
            onClick={() => abrir("favoritos")}
            aria-label={`Favoritos (${favoritos.length})`}
          >
            <Heart className="size-[22px]" strokeWidth={2.2} aria-hidden="true" />
            <Burbuja n={favoritos.length} color="bg-[var(--vt-rosa)]" />
          </button>
          <MenuCuenta />
          <button
            type="button"
            data-vt-carrito=""
            className="relative ml-1 inline-flex h-11 items-center gap-2 rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-coral)] px-3 font-extrabold shadow-[0_3px_0_var(--vt-tinta)] transition-transform hover:-translate-y-0.5 sm:px-4"
            onClick={() => abrir("carrito")}
            aria-label={`Carrito (${cantidadCarrito} productos)`}
          >
            <ShoppingBag className="size-5" strokeWidth={2.4} aria-hidden="true" />
            <span className="hidden text-sm sm:inline">Carrito</span>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[var(--vt-tinta)] px-1.5 text-xs text-[var(--vt-papel)] tabular-nums">
              {cantidadCarrito}
            </span>
          </button>
        </nav>
      </div>

      {/* Buscador en celular */}
      <div className="px-3 pb-3 lg:hidden">
        <Buscador />
      </div>

      {/* Fila de navegación en escritorio */}
      <div className="hidden border-t-2 border-[var(--vt-tinta-15)] lg:block">
        <nav aria-label="Principal" className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-2">
          <MegaMenu />
          {categoriasPlantas.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => irAlCatalogo({ categoria: c })}
              className="hidden rounded-full px-3.5 py-2 text-sm font-bold hover:bg-[var(--vt-tinta)]/5 xl:inline-flex"
            >
              {c}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-0.5 bg-[var(--vt-tinta-15)] xl:block" aria-hidden="true" />
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-bold hover:bg-[var(--vt-tinta)]/5",
                e.destacado && "inline-flex items-center gap-1.5 text-[var(--vt-hoja)]"
              )}
            >
              {e.destacado && <Sparkles className="size-4" aria-hidden="true" />}
              {e.texto}
            </Link>
          ))}
          <a
            href={whatsappDemo("Hola Verde Tienda, tengo una consulta sobre una planta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto hidden items-center gap-1.5 text-sm font-bold text-[var(--vt-tinta-70)] hover:text-[var(--vt-tinta)] 2xl:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden="true" /> ¿Dudas? Escribinos
          </a>
        </nav>
      </div>
    </header>
  )
}

/* ---------- Menú móvil ---------- */

export function MenuMovil() {
  const { panel, abrir, irAlCatalogo, usuario, cantidadCarrito, favoritos, pedidos, abrirCuenta } =
    useTienda()
  const router = useRouter()
  const cerrar = () => abrir(null)
  // Cerrar el menú y recién después bajar a la sección (el menú bloquea el
  // scroll). Desde la ficha de producto, volver a la portada.
  function irA(ev: React.MouseEvent, href: string) {
    ev.preventDefault()
    cerrar()
    if (!document.querySelector(href)) {
      router.push(`${RUTA}/${href}`)
      return
    }
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ block: "start" })
      history.replaceState(null, "", href)
    }, 60)
  }

  return (
    <Cajon
      abierto={panel === "menu"}
      onCambio={(o) => abrir(o ? "menu" : null)}
      titulo="Menú"
      descripcion="Buscador, categorías y accesos a tu cuenta"
      lado="izq"
      ancho="max-w-[24rem]"
      pie={
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <button type="button" className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-[var(--vt-crema)]" onClick={() => abrir("carrito")}>
            <ShoppingBag className="size-5" aria-hidden="true" /> Carrito ({cantidadCarrito})
          </button>
          <button type="button" className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-[var(--vt-crema)]" onClick={() => abrir("favoritos")}>
            <Heart className="size-5" aria-hidden="true" /> Favoritos ({favoritos.length})
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-1 rounded-2xl p-2 hover:bg-[var(--vt-crema)]"
            onClick={() => (usuario ? abrirCuenta("datos") : abrir("entrar"))}
          >
            <UserRound className="size-5" aria-hidden="true" /> {usuario ? "Mi cuenta" : "Entrar"}
          </button>
        </div>
      }
    >
      <div className="space-y-6 p-5">
        <Buscador onElegir={cerrar} />

        <div>
          <p className="text-xs font-bold tracking-wider text-[var(--vt-tinta-70)] uppercase">Categorías</p>
          <ul className="mt-3 grid grid-cols-2 gap-2.5">
            {categoriasPlantas.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => irAlCatalogo({ categoria: c })}
                  className={cn("flex w-full flex-col items-start gap-2 rounded-3xl p-3 text-left", fondo[colorCategoria[c]])}
                >
                  <span className="vt-blob-2 relative size-12 overflow-hidden border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
                    <Image src={fotoCategoria(c)} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="vt-titulo text-xl">{c}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wider text-[var(--vt-tinta-70)] uppercase">Según tu casa</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {necesidades.map((n) => (
              <button
                key={n.etiqueta}
                type="button"
                className="vt-chip px-3.5 py-2 text-sm"
                onClick={() => irAlCatalogo(n.filtros)}
              >
                <n.Icono className="size-4" aria-hidden="true" /> {n.etiqueta}
              </button>
            ))}
          </div>
        </div>

        <ul className="space-y-1 border-t-2 border-[var(--vt-tinta-15)] pt-4">
          {[
            { href: "#quiz", texto: "¿Qué planta va con vos? · Quiz" },
            { href: "#armar", texto: "Armá tu maceta en 3D" },
            { href: "#probala", texto: "Probala en tu casa" },
            { href: "#cuidados", texto: "Guía de cuidados" },
            { href: "#herramientas", texto: "Medidor de luz y riego" },
            { href: "#club", texto: "Club de plantas" },
            { href: "#resenas", texto: "Reseñas" },
            { href: "#preguntas", texto: "Envíos, pagos y garantía" },
          ].map((e) => (
            <li key={e.href}>
              <a href={`${RUTA}/${e.href}`} onClick={(ev) => irA(ev, e.href)} className="flex items-center justify-between rounded-2xl px-3 py-3 font-bold hover:bg-[var(--vt-papel)]">
                {e.texto} <ChevronRight className="size-4" aria-hidden="true" />
              </a>
            </li>
          ))}
          {usuario && pedidos.length > 0 && (
            <li>
              <button type="button" onClick={() => abrirCuenta("pedidos")} className="flex w-full items-center justify-between rounded-2xl px-3 py-3 font-bold hover:bg-[var(--vt-papel)]">
                Mis pedidos ({pedidos.length}) <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </li>
          )}
        </ul>
        <a
          href={whatsappDemo("Hola Verde Tienda, tengo una consulta sobre una planta.")}
          target="_blank"
          rel="noopener noreferrer"
          className="vt-boton-linea h-12 w-full"
        >
          <MessageCircle className="size-4" aria-hidden="true" /> Escribinos por WhatsApp
        </a>
      </div>
    </Cajon>
  )
}
