"use client"

import { useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  Eye,
  PawPrint,
  Plus,
  SlidersHorizontal,
  Sprout,
  Sun,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  catalogo,
  categoriasPlantas,
  normalizar,
  precioDesde,
  textoLuz,
  type Planta,
} from "@/components/demos/verde/catalogo"
import {
  filtrosVacios,
  useTienda,
  type Orden,
} from "@/components/demos/verde/estado"
import { BotonFavorito, Estrellas, FotoPlanta, fondo } from "@/components/demos/verde/ui"

const ordenes: { id: Orden; texto: string }[] = [
  { id: "destacadas", texto: "Destacadas" },
  { id: "vendidas", texto: "Más vendidas" },
  { id: "precio-asc", texto: "Precio: menor a mayor" },
  { id: "precio-desc", texto: "Precio: mayor a menor" },
  { id: "nombre", texto: "Nombre (A a Z)" },
]

const giros = ["-5deg", "4deg", "-3deg", "5deg"]

export function Catalogo() {
  const { filtros, setFiltros, orden, setOrden } = useTienda()

  const visibles = useMemo(() => {
    const q = normalizar(filtros.texto)
    const lista = catalogo.filter((p) => {
      if (filtros.categoria && p.categoria !== filtros.categoria) return false
      if (filtros.mascotas && !p.aptaMascotas) return false
      if (filtros.pocaLuz && p.luz !== "poca") return false
      if (filtros.facil && p.cuidado !== "Fácil") return false
      if (
        q &&
        ![p.nombre, p.nombreCientifico, p.categoria, textoLuz[p.luz]].some((t) =>
          normalizar(t).includes(q)
        )
      )
        return false
      return true
    })
    const copia = [...lista]
    if (orden === "vendidas") copia.sort((a, b) => b.ventas - a.ventas)
    if (orden === "precio-asc") copia.sort((a, b) => precioDesde(a) - precioDesde(b))
    if (orden === "precio-desc") copia.sort((a, b) => precioDesde(b) - precioDesde(a))
    if (orden === "nombre") copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    return copia
  }, [filtros, orden])

  const hayFiltros =
    !!filtros.categoria || filtros.mascotas || filtros.pocaLuz || filtros.facil || !!filtros.texto

  const alternar = (clave: "mascotas" | "pocaLuz" | "facil") =>
    setFiltros({ ...filtros, [clave]: !filtros[clave] })

  return (
    <div>
      {/* Barra de filtros */}
      <div className="flex flex-col gap-4">
        <div
          role="group"
          aria-label="Categoría"
          className="vt-sin-barra -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
        >
          {[null, ...categoriasPlantas].map((c) => (
            <button
              key={c ?? "todas"}
              type="button"
              aria-pressed={filtros.categoria === c}
              onClick={() => setFiltros({ ...filtros, categoria: c })}
              className="vt-chip h-11 shrink-0 px-5 text-[15px]"
            >
              {c ?? "Todas"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--vt-tinta-70)]">
            <SlidersHorizontal className="size-4" aria-hidden="true" /> Filtrar:
          </span>
          <button type="button" aria-pressed={filtros.mascotas} onClick={() => alternar("mascotas")} className="vt-chip h-9 px-3.5 text-sm">
            <PawPrint className="size-4" aria-hidden="true" /> Aptas para mascotas
          </button>
          <button type="button" aria-pressed={filtros.pocaLuz} onClick={() => alternar("pocaLuz")} className="vt-chip h-9 px-3.5 text-sm">
            <Sun className="size-4" aria-hidden="true" /> Poca luz
          </button>
          <button type="button" aria-pressed={filtros.facil} onClick={() => alternar("facil")} className="vt-chip h-9 px-3.5 text-sm">
            <Sprout className="size-4" aria-hidden="true" /> Fáciles
          </button>

          <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
            <label htmlFor="vt-orden" className="shrink-0 text-sm font-bold text-[var(--vt-tinta-70)]">
              Ordenar por
            </label>
            <select
              id="vt-orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="vt-campo h-10 min-h-0 flex-1 rounded-full border-[var(--vt-tinta)] py-0 pr-8 text-sm font-bold sm:w-56 sm:flex-none"
            >
              {ordenes.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.texto}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm" aria-live="polite">
          <span className="font-bold">
            {visibles.length} {visibles.length === 1 ? "planta" : "plantas"}
          </span>
          {filtros.texto && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--vt-manteca)] py-1 pr-1 pl-3 font-semibold">
              “{filtros.texto}”
              <button
                type="button"
                className="vt-icono size-6"
                onClick={() => setFiltros({ ...filtros, texto: "" })}
                aria-label="Quitar búsqueda"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          )}
          {hayFiltros && (
            <button
              type="button"
              className="font-bold underline underline-offset-4"
              onClick={() => setFiltros(filtrosVacios)}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Grilla */}
      {visibles.length === 0 ? (
        <div className="mt-8 rounded-[32px] border-2 border-dashed border-[var(--vt-tinta-50)] p-8 text-center">
          <p className="vt-titulo text-3xl">Ninguna planta cumple todo eso</p>
          <p className="mt-2 text-[var(--vt-tinta-70)]">
            Probá sacando algún filtro o dejá que el quiz elija por vos.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button type="button" className="vt-boton h-11 px-5" onClick={() => setFiltros(filtrosVacios)}>
              Ver todas
            </button>
            <a href="#quiz" className="vt-boton-linea h-11 px-5">
              Hacer el quiz
            </a>
          </div>
        </div>
      ) : (
        <ul className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibles.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
              >
                <TarjetaPlanta planta={p} indice={i} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}

export function TarjetaPlanta({ planta, indice }: { planta: Planta; indice: number }) {
  const { abrirVistaRapida, agregar } = useTienda()
  const forma = ((indice % 3) + 1) as 1 | 2 | 3

  return (
    <article className="vt-producto flex h-full flex-col">
      <div
        className={cn(
          "relative rounded-[28px] border-2 border-[var(--vt-tinta)] p-2.5 sm:rounded-[32px] sm:p-4",
          fondo[planta.color]
        )}
      >
        <button
          type="button"
          onClick={() => abrirVistaRapida(planta.id)}
          className="group/foto block w-full"
          aria-label={`Vista rápida de ${planta.nombre}`}
        >
          <FotoPlanta
            planta={planta}
            forma={forma}
            sizes="(min-width: 1280px) 18rem, (min-width: 768px) 30vw, 46vw"
            className="aspect-square w-full border-2 border-[var(--vt-tinta)]"
          />
          <span className="absolute inset-x-0 bottom-4 hidden justify-center opacity-0 transition-opacity group-hover/foto:opacity-100 group-focus-visible/foto:opacity-100 md:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] px-3.5 py-2 text-sm font-extrabold">
              <Eye className="size-4" aria-hidden="true" /> Vista rápida
            </span>
          </span>
        </button>
        {planta.sticker && (
          <span
            className="vt-sticker pointer-events-none absolute -top-3 -left-1 bg-[var(--vt-papel)] text-[10px] sm:-left-2 sm:text-[0.72rem]"
            style={{ "--giro": giros[indice % giros.length] } as React.CSSProperties}
          >
            {planta.sticker}
          </span>
        )}
        <BotonFavorito planta={planta} className="absolute top-3.5 right-3.5 size-9 sm:top-5 sm:right-5" />
        {planta.aptaMascotas && (
          <span className="pointer-events-none absolute bottom-3.5 left-3.5 inline-flex items-center gap-1 rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] px-2 py-1 text-[10px] font-extrabold sm:bottom-5 sm:left-5 sm:text-xs">
            <PawPrint className="size-3" aria-hidden="true" /> Apta mascotas
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <h3 className="vt-titulo text-[1.35rem] sm:text-[1.65rem]">
            <button type="button" onClick={() => abrirVistaRapida(planta.id)} className="text-left hover:underline">
              {planta.nombre}
            </button>
          </h3>
        </div>
        <p className="mt-0.5 truncate text-xs text-[var(--vt-tinta-70)] italic sm:text-sm">
          {planta.nombreCientifico}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--vt-tinta-70)]">
          <Estrellas valor={planta.estrellas} />
          <span className="hidden sm:inline">({planta.opiniones})</span>
          <span className="font-semibold whitespace-nowrap">{textoLuz[planta.luz]}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="leading-none">
            <span className="block text-[11px] font-semibold text-[var(--vt-tinta-70)]">
              {planta.tamanos.length > 1 ? "desde" : "precio"}
            </span>
            <span className="text-lg font-extrabold tabular-nums sm:text-xl">
              {pesos(precioDesde(planta))}
            </span>
          </p>
          <button
            type="button"
            onClick={() => agregar(planta.id)}
            className="vt-boton h-10 shrink-0 px-3 text-sm sm:px-4"
            aria-label={`Agregar ${planta.nombre} al carrito`}
          >
            <Plus className="size-4" strokeWidth={3} aria-hidden="true" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>
    </article>
  )
}
