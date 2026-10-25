"use client"

import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { RadioGroup } from "radix-ui"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeftRight,
  BellRing,
  Box,
  ChevronRight,
  CreditCard,
  Droplets,
  Home,
  MessageCircleQuestion,
  PawPrint,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Truck,
  ZoomIn,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  catalogo,
  macetas,
  precioDesde,
  precioVariante,
  textoLuz,
  type Planta,
} from "@/components/demos/verde/catalogo"
import {
  compradosJuntos,
  diasDeRiego,
  preguntasDe,
  primerTamanoDisponible,
  repartoEstrellas,
  resenasDe,
  sinStock,
  stockDe,
} from "@/components/demos/verde/extras"
import { RUTA, useTienda } from "@/components/demos/verde/estado"
import { EstadoStock, SelectorColor } from "@/components/demos/verde/opciones"
import { TarjetaPlanta, VistosRecientes } from "@/components/demos/verde/productos"
import { BotonFavorito, Contador, Estrellas, fondo } from "@/components/demos/verde/ui"
import { validarNombre } from "@/components/demos/verde/validar"

const Maceta3D = dynamic(
  () => import("@/components/demos/verde/maceta-3d").then((m) => m.Maceta3D),
  {
    ssr: false,
    loading: () => <div className="h-[390px] animate-pulse rounded-[28px]" aria-hidden="true" />,
  }
)

type Vista = "foto" | "detalle" | "3d"

export function FichaProducto({ planta }: { planta: Planta }) {
  const { agregar, registrarVisto, pausado, comparar, alternarComparar, avisar } = useTienda()
  const [tamanoId, setTamanoId] = useState(primerTamanoDisponible(planta).id)
  const [macetaId, setMacetaId] = useState(planta.conMaceta ? "barro" : "vivero")
  const [colorId, setColorId] = useState("menta")
  const [cantidad, setCantidad] = useState(1)
  const [vista, setVista] = useState<Vista>("foto")

  const tamano = planta.tamanos.find((t) => t.id === tamanoId) ?? planta.tamanos[0]
  const indice = planta.tamanos.indexOf(tamano)
  const precio = precioVariante(planta, tamano.id, macetaId)
  const agotado = sinStock(planta.id, tamano.id)
  const enComparador = comparar.includes(planta.id)
  const escala = planta.tamanos.length > 1 ? 0.84 + (indice / (planta.tamanos.length - 1)) * 0.3 : 1

  // Guardar en "vistos recientemente" (fuera del render, en un cuadro aparte).
  useEffect(() => {
    const id = window.requestAnimationFrame(() => registrarVisto(planta.id))
    return () => window.cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planta.id])

  const vistas: { id: Vista; nombre: string; Icono: typeof Box }[] = [
    { id: "foto", nombre: "Foto", Icono: Sparkles },
    { id: "detalle", nombre: "Detalle de hojas", Icono: ZoomIn },
    ...(planta.conMaceta ? [{ id: "3d" as const, nombre: "Vista 3D", Icono: Box }] : []),
  ]

  const cuidados = [
    { Icono: Sun, titulo: "Luz", texto: textoLuz[planta.luz], color: "bg-[var(--vt-manteca)]" },
    { Icono: Droplets, titulo: "Riego", texto: `${planta.riego} (cada ${diasDeRiego(planta.id)} días)`, color: "bg-[var(--vt-cielo)]" },
    { Icono: Ruler, titulo: "Tamaño", texto: tamano.detalle, color: "bg-[var(--vt-lila)]" },
    { Icono: PawPrint, titulo: "Mascotas", texto: planta.notaMascotas, color: "bg-[var(--vt-rosa)]" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 md:px-6 md:pt-8">
      {/* Migas */}
      <nav aria-label="Estás en" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-[var(--vt-tinta-70)]">
          <li>
            <Link href={RUTA} className="inline-flex items-center gap-1 font-bold hover:underline">
              <Home className="size-3.5" aria-hidden="true" /> Inicio
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li>
            <Link href={`${RUTA}/#catalogo`} className="font-bold hover:underline">
              {planta.categoria}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li aria-current="page" className="font-bold text-[var(--vt-tinta)]">
            {planta.nombre}
          </li>
        </ol>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* Galería */}
        <div className="min-w-0 lg:sticky lg:top-36 lg:self-start">
          <div className={cn("relative overflow-hidden rounded-[36px] border-2 border-[var(--vt-tinta)] p-3 sm:p-4", fondo[planta.color])}>
            {vista === "3d" ? (
              <div className="rounded-[28px] bg-[var(--vt-papel)]/60 py-2">
                <Maceta3D
                  plantaId={planta.id}
                  macetaId={macetaId}
                  colorId={colorId}
                  escala={escala}
                  pausado={pausado}
                  etiqueta={`Modelo 3D de ${planta.nombre} con la maceta elegida`}
                />
              </div>
            ) : (
              <div className="vt-blob-1 relative aspect-square overflow-hidden border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
                <Image
                  src={planta.foto.src}
                  alt={vista === "foto" ? planta.nombre : `Detalle de las hojas de ${planta.nombre}`}
                  fill
                  preload
                  sizes="(min-width: 1024px) 38rem, 92vw"
                  className={cn("object-cover transition-transform duration-500", vista === "detalle" && "scale-[1.9]")}
                />
              </div>
            )}
            {planta.sticker && (
              <span className="vt-sticker absolute top-5 left-5 bg-[var(--vt-manteca)] text-sm" style={{ "--giro": "-5deg" } as React.CSSProperties}>
                <Sparkles className="size-3.5" aria-hidden="true" /> {planta.sticker}
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Vistas del producto">
            {vistas.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={vista === v.id}
                onClick={() => setVista(v.id)}
                className="vt-chip h-11 px-4 text-sm"
              >
                <v.Icono className="size-4" aria-hidden="true" /> {v.nombre}
              </button>
            ))}
            <Link href={`${RUTA}/#probala`} className="vt-chip h-11 px-4 text-sm">
              <Home className="size-4" aria-hidden="true" /> Probala en tu casa
            </Link>
          </div>
        </div>

        {/* Datos y compra */}
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full border-2 border-[var(--vt-tinta)] px-3 py-1 text-xs font-bold">{planta.categoria}</span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-pressed={enComparador}
                onClick={() => {
                  if (!enComparador) avisar(`Sumaste ${planta.nombre} al comparador`)
                  alternarComparar(planta.id)
                }}
                className={cn(
                  "grid size-10 place-items-center rounded-full border-2 border-[var(--vt-tinta)] transition-transform hover:scale-110",
                  enComparador ? "bg-[var(--vt-tinta)] text-[var(--vt-papel)]" : "bg-[var(--vt-papel)]"
                )}
                aria-label={enComparador ? `Sacar ${planta.nombre} del comparador` : `Comparar ${planta.nombre}`}
              >
                <ArrowLeftRight className="size-4" aria-hidden="true" />
              </button>
              <BotonFavorito planta={planta} />
            </div>
          </div>
          <h1 className="vt-titulo mt-3 text-[clamp(3rem,8vw,5rem)]">{planta.nombre}</h1>
          <p className="mt-1 text-[var(--vt-tinta-70)] italic">{planta.nombreCientifico}</p>
          <a href="#resenas-planta" className="mt-3 inline-flex items-center gap-2 text-sm hover:underline">
            <Estrellas valor={planta.estrellas} />
            <span className="font-bold">{planta.estrellas.toLocaleString("es-UY")}</span>
            <span className="text-[var(--vt-tinta-70)]">({planta.opiniones} opiniones)</span>
          </a>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={precio}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="vt-titulo text-5xl tabular-nums"
              >
                {pesos(precio)}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-[var(--vt-tinta-70)]">o 6 × {pesos(Math.ceil(precio / 6))} sin recargo</span>
          </div>

          <p className="mt-4 text-lg leading-relaxed text-[var(--vt-tinta-70)]">{planta.descripcion}</p>

          <fieldset className="mt-6">
            <legend className="text-sm font-extrabold">
              Tamaño <span className="font-normal text-[var(--vt-tinta-70)]">· {tamano.detalle}</span>
            </legend>
            <RadioGroup.Root
              value={tamano.id}
              onValueChange={(v) => {
                setTamanoId(v)
                setCantidad(1)
              }}
              aria-label="Tamaño"
              className="mt-2 flex flex-wrap gap-2"
            >
              {planta.tamanos.map((t) => (
                <RadioGroup.Item key={t.id} value={t.id} className="vt-opcion px-4 py-2.5 text-left">
                  <span className="block text-sm font-extrabold">{t.nombre}</span>
                  <span className="block text-xs text-[var(--vt-tinta-70)] tabular-nums">
                    {sinStock(planta.id, t.id) ? "Sin stock" : pesos(t.precio)}
                  </span>
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          </fieldset>

          {planta.conMaceta && (
            <fieldset className="mt-5">
              <legend className="text-sm font-extrabold">Maceta</legend>
              <RadioGroup.Root
                value={macetaId}
                onValueChange={setMacetaId}
                aria-label="Maceta"
                className="mt-2 grid gap-2 sm:grid-cols-3"
              >
                {macetas.map((m) => (
                  <RadioGroup.Item key={m.id} value={m.id} className="vt-opcion p-3 text-left">
                    <span className="flex items-center justify-between gap-2 text-sm font-extrabold">
                      {m.nombre}
                      <span className="text-xs font-bold tabular-nums">{m.extra ? `+${pesos(m.extra)}` : "Incluida"}</span>
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-[var(--vt-tinta-70)]">{m.detalle}</span>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </fieldset>
          )}

          {planta.conMaceta && macetaId === "ceramica" && (
            <div className="mt-5">
              <SelectorColor
                valor={colorId}
                onCambio={(c) => {
                  setColorId(c)
                  setVista("3d")
                }}
              />
            </div>
          )}

          <div className="mt-5">
            <EstadoStock planta={planta} tamanoId={tamano.id} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Contador valor={cantidad} onCambio={setCantidad} nombre={planta.nombre} max={Math.max(1, stockDe(planta.id, tamano.id))} />
            <button
              type="button"
              className="vt-boton h-13 flex-1 px-6 text-base"
              disabled={agotado}
              onClick={(e) =>
                agregar(planta.id, { tamanoId: tamano.id, macetaId, colorId, cantidad, origen: e.currentTarget })
              }
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              {agotado ? "Sin stock" : <>Agregar al carrito · {pesos(precio * cantidad)}</>}
            </button>
          </div>

          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-3">
            {[
              { Icono: Truck, texto: "Llega hoy en Montevideo si comprás antes de las 14" },
              { Icono: ShieldCheck, texto: "Garantía de 30 días: si no prende, te la cambiamos" },
              { Icono: CreditCard, texto: "Hasta 6 cuotas sin recargo con Mercado Pago" },
            ].map((b) => (
              <li key={b.texto} className="flex gap-2 rounded-2xl border-2 border-[var(--vt-tinta-15)] bg-[var(--vt-papel)] p-3">
                <b.Icono className="mt-0.5 size-4 shrink-0 text-[var(--vt-hoja)]" aria-hidden="true" />
                <span className="leading-snug">{b.texto}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 rounded-2xl bg-[var(--vt-manteca)] p-4 text-sm leading-snug">
            <strong className="font-extrabold">Tip de la casa:</strong> {planta.consejo}
          </p>
        </div>
      </div>

      {/* Cuidados */}
      <section aria-labelledby="cuidados-planta" className="mt-16">
        <h2 id="cuidados-planta" className="vt-titulo text-[clamp(2.4rem,6vw,3.6rem)]">Cómo cuidarla</h2>
        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cuidados.map((c) => (
            <div key={c.titulo} className={cn("rounded-[28px] border-2 border-[var(--vt-tinta)] p-4 sm:p-5", c.color)}>
              <dt className="flex items-center gap-2 text-sm font-extrabold">
                <span className="grid size-9 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]">
                  <c.Icono className="size-4" aria-hidden="true" />
                </span>
                {c.titulo}
              </dt>
              <dd className="mt-3 text-sm leading-snug font-semibold">{c.texto}</dd>
            </div>
          ))}
        </dl>
        <RecordatorioRiego planta={planta} />
      </section>

      <CompradosJuntos planta={planta} />
      <Resenas planta={planta} />
      <Preguntas planta={planta} />

      <VistosRecientes excluir={planta.id} />

      <section aria-labelledby="parecidas" className="mt-16">
        <h2 id="parecidas" className="vt-titulo text-[clamp(2.4rem,6vw,3.6rem)]">También te pueden gustar</h2>
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {catalogo
            .filter((p) => p.id !== planta.id)
            .sort((a, b) => Number(b.categoria === planta.categoria) - Number(a.categoria === planta.categoria) || b.ventas - a.ventas)
            .slice(0, 4)
            .map((p, i) => (
              <li key={p.id}>
                <TarjetaPlanta planta={p} indice={i} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}

function RecordatorioRiego({ planta }: { planta: Planta }) {
  const { misPlantas, agregarMiPlanta, avisar, abrirCuenta } = useTienda()
  const guardada = misPlantas.some((m) => m.plantaId === planta.id)
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[28px] border-2 border-dashed border-[var(--vt-tinta)] p-4">
      <BellRing className="size-5 shrink-0" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-sm">
        <strong className="font-extrabold">¿Te olvidás de regar?</strong> Activá el recordatorio y te
        avisamos cada {diasDeRiego(planta.id)} días.
      </p>
      {guardada ? (
        <button type="button" className="vt-boton-linea h-10 px-4 text-sm" onClick={() => abrirCuenta("plantas")}>
          Ver en Mis plantas
        </button>
      ) : (
        <button
          type="button"
          className="vt-boton-tinta h-10 px-4 text-sm"
          onClick={() => {
            agregarMiPlanta(planta.id)
            avisar(`Recordatorio de riego activado para ${planta.nombre.toLowerCase()}`)
          }}
        >
          Activar recordatorio
        </button>
      )}
    </div>
  )
}

/* ---------- Comprados juntos ---------- */

function CompradosJuntos({ planta }: { planta: Planta }) {
  const { agregar, avisar } = useTienda()
  const otras = compradosJuntos(planta.id)
  const [marcadas, setMarcadas] = useState<string[]>(otras.map((p) => p.id))
  const todas = [planta, ...otras]
  const elegidas = todas.filter((p) => p.id === planta.id || marcadas.includes(p.id))
  const total = elegidas.reduce((s, p) => s + precioDesde(p), 0)
  if (otras.length === 0) return null

  return (
    <section aria-labelledby="juntos" className="mt-16 rounded-[36px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5 sm:p-8">
      <h2 id="juntos" className="vt-titulo text-[clamp(2.2rem,5vw,3.2rem)]">Se llevan juntas</h2>
      <p className="mt-1 text-sm text-[var(--vt-tinta-70)]">Las combinaciones que más se compran con {planta.nombre.toLowerCase()}.</p>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <ul className="flex flex-1 flex-wrap items-center gap-2 sm:gap-3">
          {todas.map((p, i) => {
            const fija = p.id === planta.id
            const activa = fija || marcadas.includes(p.id)
            return (
              <li key={p.id} className="flex items-center gap-2 sm:gap-3">
                {i > 0 && <Plus className="size-5 shrink-0 text-[var(--vt-tinta-50)]" aria-hidden="true" />}
                <label className={cn("relative block w-28 cursor-pointer sm:w-36", !activa && "opacity-50")}>
                  <span className={cn("vt-blob-2 relative block aspect-square overflow-hidden border-2 border-[var(--vt-tinta)]", fondo[p.color])}>
                    <Image src={p.foto.src} alt="" fill sizes="144px" className="object-cover" />
                  </span>
                  <span className="mt-1.5 flex items-start gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={activa}
                      disabled={fija}
                      onChange={(e) =>
                        setMarcadas(e.target.checked ? [...marcadas, p.id] : marcadas.filter((m) => m !== p.id))
                      }
                      className="mt-0.5 size-4 accent-[var(--vt-hoja)]"
                    />
                    <span>
                      <span className="block leading-tight font-extrabold">{fija ? `Esta: ${p.nombre}` : p.nombre}</span>
                      <span className="block text-xs tabular-nums text-[var(--vt-tinta-70)]">{pesos(precioDesde(p))}</span>
                    </span>
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
        <div className="shrink-0 lg:w-64">
          <p className="text-sm text-[var(--vt-tinta-70)]">Total por {elegidas.length}</p>
          <p className="vt-titulo text-4xl tabular-nums">{pesos(total)}</p>
          <button
            type="button"
            className="vt-boton mt-3 h-12 w-full px-5"
            onClick={(e) => {
              const origen = e.currentTarget
              elegidas.forEach((p, i) => agregar(p.id, { origen: i === 0 ? origen : null, silencioso: true }))
              avisar(`Sumaste ${elegidas.length} plantas al carrito`)
            }}
          >
            <ShoppingBag className="size-5" aria-hidden="true" /> Agregar las {elegidas.length}
          </button>
        </div>
      </div>
    </section>
  )
}

/* ---------- Reseñas ---------- */

function Resenas({ planta }: { planta: Planta }) {
  const { resenasPropias, publicarResena, usuario, avisar } = useTienda()
  const reparto = repartoEstrellas(planta)
  const propias = resenasPropias.filter((r) => r.plantaId === planta.id)
  const lista = resenasDe(planta.id)
  const [escribiendo, setEscribiendo] = useState(false)
  const [estrellas, setEstrellas] = useState(5)
  const [nombre, setNombre] = useState(usuario && !usuario.invitado ? usuario.nombre : "")
  const [texto, setTexto] = useState("")
  const [errores, setErrores] = useState<{ nombre?: string; texto?: string }>({})

  return (
    <section id="resenas-planta" aria-labelledby="resenas-planta-titulo" className="mt-16 scroll-mt-36">
      <h2 id="resenas-planta-titulo" className="vt-titulo text-[clamp(2.4rem,6vw,3.6rem)]">Reseñas</h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-[20rem_1fr]">
        <div>
          <div className="rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5">
            <p className="flex items-end gap-2">
              <span className="vt-titulo text-6xl">{planta.estrellas.toLocaleString("es-UY")}</span>
              <span className="pb-2 text-sm text-[var(--vt-tinta-70)]">de 5</span>
            </p>
            <Estrellas valor={planta.estrellas} className="mt-1" />
            <p className="mt-1 text-sm text-[var(--vt-tinta-70)]">{planta.opiniones} opiniones verificadas</p>
            <ul className="mt-4 space-y-1.5">
              {reparto.map((n, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-bold">
                  <span className="w-9 shrink-0">
                    {5 - i} <Star className="inline size-3 fill-[var(--vt-coral)] align-[-1px]" aria-hidden="true" />
                  </span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-crema)]">
                    <span
                      className="block h-full origin-left bg-[var(--vt-coral)]"
                      style={{ transform: `scaleX(${n / planta.opiniones})` }}
                    />
                  </span>
                  <span className="w-8 text-right tabular-nums text-[var(--vt-tinta-70)]">{n}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="vt-boton-linea mt-5 h-11 w-full text-sm" onClick={() => setEscribiendo(!escribiendo)} aria-expanded={escribiendo}>
              Escribir una reseña
            </button>
          </div>
        </div>

        <div>
          {escribiendo && (
            <form
              noValidate
              className="mb-5 rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-menta)] p-5"
              onSubmit={(e) => {
                e.preventDefault()
                const nuevos = {
                  nombre: validarNombre(nombre),
                  texto: texto.trim().length < 10 ? "Contanos un poquito más (10 letras como mínimo)." : undefined,
                }
                setErrores(nuevos)
                if (nuevos.nombre || nuevos.texto) return
                publicarResena({ plantaId: planta.id, nombre: nombre.trim(), estrellas, texto: texto.trim(), fecha: "recién" })
                setEscribiendo(false)
                setTexto("")
                avisar("¡Gracias! Publicamos tu reseña")
              }}
            >
              <fieldset>
                <legend className="text-sm font-extrabold">Tu puntaje</legend>
                <RadioGroup.Root
                  value={String(estrellas)}
                  onValueChange={(v) => setEstrellas(Number(v))}
                  aria-label="Estrellas"
                  className="mt-2 flex gap-1"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <RadioGroup.Item key={n} value={String(n)} aria-label={`${n} de 5`} className="grid size-10 place-items-center rounded-full hover:bg-[var(--vt-papel)]">
                      <Star className={cn("size-7 transition-transform", n <= estrellas ? "scale-110 fill-[var(--vt-coral)]" : "fill-transparent opacity-50")} aria-hidden="true" />
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
              </fieldset>
              <div className="mt-4 grid gap-4 sm:grid-cols-[14rem_1fr]">
                <div>
                  <label htmlFor="res-nombre" className="mb-1.5 block text-sm font-bold">Tu nombre</label>
                  <input id="res-nombre" className="vt-campo" value={nombre} onChange={(e) => setNombre(e.target.value)} aria-invalid={errores.nombre ? true : undefined} aria-describedby={errores.nombre ? "res-nombre-error" : undefined} />
                  {errores.nombre && <p id="res-nombre-error" className="mt-1 text-sm font-semibold text-[#b02e14]">{errores.nombre}</p>}
                </div>
                <div>
                  <label htmlFor="res-texto" className="mb-1.5 block text-sm font-bold">¿Qué tal tu {planta.nombre.toLowerCase()}?</label>
                  <textarea id="res-texto" rows={3} maxLength={300} className="vt-campo resize-none" value={texto} onChange={(e) => setTexto(e.target.value)} aria-invalid={errores.texto ? true : undefined} aria-describedby={errores.texto ? "res-texto-error" : undefined} />
                  {errores.texto && <p id="res-texto-error" className="mt-1 text-sm font-semibold text-[#b02e14]">{errores.texto}</p>}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="submit" className="vt-boton h-11 px-5 text-sm">Publicar reseña</button>
                <p className="text-xs text-[var(--vt-tinta-70)]">Demo: tu reseña queda solo en este navegador.</p>
              </div>
            </form>
          )}
          <ul className="columns-1 gap-4 md:columns-2">
            {propias.map((r, i) => (
              <TarjetaResena key={`p${i}`} nombre={r.nombre} barrio="Vos" estrellas={r.estrellas} texto={r.texto} fecha={r.fecha} destacada />
            ))}
            {lista.map((r) => (
              <TarjetaResena key={r.nombre} {...r} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function TarjetaResena({
  nombre,
  barrio,
  estrellas,
  texto,
  fecha,
  tamano,
  destacada = false,
}: {
  nombre: string
  barrio: string
  estrellas: number
  texto: string
  fecha: string
  tamano?: string
  destacada?: boolean
}) {
  return (
    <li className={cn("mb-4 break-inside-avoid rounded-[28px] border-2 border-[var(--vt-tinta)] p-5", destacada ? "bg-[var(--vt-manteca)]" : "bg-[var(--vt-papel)]")}>
      <Estrellas valor={estrellas} />
      <blockquote className="mt-2 leading-snug font-semibold">“{texto}”</blockquote>
      <p className="mt-3 text-sm">
        <span className="font-extrabold">{nombre}</span>
        <span className="text-[var(--vt-tinta-70)]">
          {" "}· {barrio} · {fecha}
          {tamano && ` · compró ${tamano.toLowerCase()}`}
        </span>
      </p>
    </li>
  )
}

/* ---------- Preguntas y respuestas ---------- */

function Preguntas({ planta }: { planta: Planta }) {
  const { preguntasPropias, publicarPregunta, avisar } = useTienda()
  const [texto, setTexto] = useState("")
  const [error, setError] = useState<string>()
  const lista = preguntasDe(planta.id)
  const propias = preguntasPropias.filter((p) => p.plantaId === planta.id)

  return (
    <section aria-labelledby="preguntas-planta" className="mt-16">
      <h2 id="preguntas-planta" className="vt-titulo text-[clamp(2.4rem,6vw,3.6rem)]">Preguntas y respuestas</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-3">
          {propias.map((p, i) => (
            <li key={`p${i}`} className="rounded-[28px] border-2 border-dashed border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5">
              <p className="font-extrabold">{p.pregunta}</p>
              <p className="mt-2 text-sm text-[var(--vt-tinta-70)]">Recibimos tu pregunta: te respondemos en el día (demo).</p>
            </li>
          ))}
          {lista.map((p) => (
            <li key={p.pregunta} className="rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5">
              <p className="flex gap-2 font-extrabold">
                <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-[var(--vt-hoja)]" aria-hidden="true" /> {p.pregunta}
              </p>
              <p className="mt-2 pl-7 text-sm leading-relaxed text-[var(--vt-tinta-70)]">
                <span className="font-bold text-[var(--vt-tinta)]">{p.quien}:</span> {p.respuesta}
              </p>
            </li>
          ))}
        </ul>
        <form
          noValidate
          className="self-start rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-cielo)] p-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (texto.trim().length < 8) {
              setError("Escribí tu pregunta (8 letras como mínimo).")
              return
            }
            setError(undefined)
            publicarPregunta({ plantaId: planta.id, pregunta: texto.trim(), fecha: "recién" })
            setTexto("")
            avisar("Mandamos tu pregunta")
          }}
        >
          <label htmlFor="preg-texto" className="vt-titulo block text-2xl">¿Te quedó una duda?</label>
          <p className="mt-1 text-sm text-[var(--vt-tinta-70)]">La responde alguien del vivero, no un robot.</p>
          <textarea
            id="preg-texto"
            rows={3}
            maxLength={200}
            className="vt-campo mt-3 resize-none"
            placeholder={`¿${planta.nombre} anda bien en un balcón?`}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "preg-error" : undefined}
          />
          {error && <p id="preg-error" className="mt-1 text-sm font-semibold text-[#b02e14]">{error}</p>}
          <button type="submit" className="vt-boton-tinta mt-3 h-11 w-full text-sm">Preguntar</button>
        </form>
      </div>
    </section>
  )
}

