"use client"

import Image from "next/image"
import { useId, useMemo, useRef, useState } from "react"
import { ArrowUpRight, Search, X } from "lucide-react"

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
import { useTienda, type Filtros } from "@/components/demos/verde/estado"
import { fondo } from "@/components/demos/verde/ui"

type Sugerencia =
  | { tipo: "planta"; clave: string; planta: Planta }
  | {
      tipo: "filtro"
      clave: string
      etiqueta: string
      detalle: string
      filtros: Partial<Filtros>
    }

const atajos: Extract<Sugerencia, { tipo: "filtro" }>[] = [
  {
    tipo: "filtro",
    clave: "f-mascotas",
    etiqueta: "Aptas para mascotas",
    detalle: "No son tóxicas para perros ni gatos",
    filtros: { mascotas: true },
  },
  {
    tipo: "filtro",
    clave: "f-poca",
    etiqueta: "Para poca luz",
    detalle: "Rincones y departamentos oscuros",
    filtros: { pocaLuz: true },
  },
  {
    tipo: "filtro",
    clave: "f-facil",
    etiqueta: "Fáciles de cuidar",
    detalle: "Ideales para arrancar",
    filtros: { facil: true },
  },
  ...categoriasPlantas.map((c) => ({
    tipo: "filtro" as const,
    clave: `c-${c}`,
    etiqueta: c,
    detalle: "Categoría",
    filtros: { categoria: c },
  })),
]

const palabrasAtajo: Record<string, string[]> = {
  "f-mascotas": ["mascota", "perro", "gato", "pet", "toxica"],
  "f-poca": ["poca luz", "sombra", "oscuro", "luz"],
  "f-facil": ["facil", "principiante", "dificil", "cuidar"],
}

function sugerir(consulta: string): Sugerencia[] {
  const q = normalizar(consulta)
  if (!q) return []
  const plantas = catalogo
    .filter((p) =>
      [p.nombre, p.nombreCientifico, p.categoria, textoLuz[p.luz]].some((t) =>
        normalizar(t).includes(q)
      )
    )
    .slice(0, 5)
    .map((planta) => ({ tipo: "planta" as const, clave: planta.id, planta }))
  const filtros = atajos.filter((a) => {
    if (normalizar(a.etiqueta).includes(q)) return true
    return (palabrasAtajo[a.clave] ?? []).some(
      (p) => p.includes(q) || q.includes(p)
    )
  })
  return [...plantas, ...filtros.slice(0, 3)]
}

/**
 * Buscador con sugerencias en vivo (combobox accesible): busca por nombre,
 * nombre científico, categoría o luz, y ofrece atajos a filtros.
 */
export function Buscador({
  className,
  onElegir,
}: {
  className?: string
  /** Se llama al elegir algo (por ejemplo, para cerrar el menú móvil). */
  onElegir?: () => void
}) {
  const { abrirVistaRapida, irAlCatalogo } = useTienda()
  const [consulta, setConsulta] = useState("")
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(-1)
  const id = useId()
  const listaId = `${id}-lista`
  const entrada = useRef<HTMLInputElement>(null)

  const sugerencias = useMemo(() => sugerir(consulta), [consulta])
  const vacio = consulta.trim() === ""
  const opciones: Sugerencia[] = vacio ? atajos.slice(0, 3) : sugerencias
  const mostrar = abierto && (opciones.length > 0 || !vacio)

  function elegir(s: Sugerencia) {
    setAbierto(false)
    setConsulta("")
    setActivo(-1)
    onElegir?.()
    if (s.tipo === "planta") abrirVistaRapida(s.planta.id)
    else irAlCatalogo(s.filtros)
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (activo >= 0 && opciones[activo]) return elegir(opciones[activo])
    if (vacio) return
    setAbierto(false)
    onElegir?.()
    irAlCatalogo({ texto: consulta.trim() })
    setConsulta("")
  }

  function teclas(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setAbierto(true)
      setActivo((a) => (a + 1) % Math.max(opciones.length, 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActivo((a) =>
        a <= 0 ? opciones.length - 1 : (a - 1) % opciones.length
      )
    } else if (e.key === "Escape") {
      if (abierto) {
        e.preventDefault()
        e.stopPropagation()
        setAbierto(false)
        setActivo(-1)
      } else if (consulta) {
        setConsulta("")
      }
    }
  }

  return (
    <form
      role="search"
      onSubmit={enviar}
      className={cn("relative", className)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setAbierto(false)
          setActivo(-1)
        }
      }}
    >
      <label htmlFor={`${id}-q`} className="sr-only">
        Buscar plantas
      </label>
      <div className="flex h-12 items-center gap-2 rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] pr-1.5 pl-4 focus-within:shadow-[0_0_0_3px_var(--vt-manteca)]">
        <Search
          className="size-5 shrink-0 text-[var(--vt-tinta-70)]"
          aria-hidden="true"
        />
        <input
          ref={entrada}
          id={`${id}-q`}
          type="text"
          role="combobox"
          aria-expanded={mostrar}
          aria-controls={listaId}
          aria-autocomplete="list"
          aria-activedescendant={
            activo >= 0 && opciones[activo]
              ? `${id}-op-${opciones[activo].clave}`
              : undefined
          }
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Buscá monstera, suculentas, poca luz…"
          value={consulta}
          onChange={(e) => {
            setConsulta(e.target.value)
            setAbierto(true)
            setActivo(-1)
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={teclas}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-[var(--vt-tinta-50)] focus-visible:outline-none"
        />
        {consulta && (
          <button
            type="button"
            className="vt-icono size-8"
            aria-label="Borrar búsqueda"
            onClick={() => {
              setConsulta("")
              entrada.current?.focus()
            }}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="submit"
          className="hidden h-9 rounded-full bg-[var(--vt-tinta)] px-4 text-sm font-bold text-[var(--vt-papel)] sm:inline-flex sm:items-center"
        >
          Buscar
        </button>
      </div>

      <div
        className={cn(
          "absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-3xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] shadow-[0_18px_40px_-20px_rgba(31,42,34,0.5)]",
          !mostrar && "hidden"
        )}
      >
        {vacio ? (
          <p className="px-4 pt-3 pb-1 text-xs font-bold tracking-wide text-[var(--vt-tinta-70)] uppercase">
            Lo más buscado
          </p>
        ) : (
          opciones.length === 0 && (
            <p className="px-4 py-4 text-sm text-[var(--vt-tinta-70)]">
              No encontramos “{consulta}”. Probá con otra palabra o hacé el quiz
              para que te recomendemos una.
            </p>
          )
        )}
        <ul id={listaId} role="listbox" aria-label="Sugerencias" className="p-1.5">
          {opciones.map((s, i) => (
            <li
              key={s.clave}
              id={`${id}-op-${s.clave}`}
              role="option"
              aria-selected={i === activo}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => elegir(s)}
              onMouseEnter={() => setActivo(i)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl px-2.5 py-2",
                i === activo && "bg-[var(--vt-manteca)]"
              )}
            >
              {s.tipo === "planta" ? (
                <>
                  <span
                    className={cn(
                      "vt-blob-2 relative size-11 shrink-0 overflow-hidden",
                      fondo[s.planta.color]
                    )}
                  >
                    <Image
                      src={s.planta.foto.src}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">
                      {s.planta.nombre}
                    </span>
                    <span className="block truncate text-xs text-[var(--vt-tinta-70)] italic">
                      {s.planta.nombreCientifico} · {s.planta.categoria}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold tabular-nums">
                    {pesos(precioDesde(s.planta))}
                  </span>
                </>
              ) : (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-dashed border-[var(--vt-tinta-50)]">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">
                      {s.etiqueta}
                    </span>
                    <span className="block truncate text-xs text-[var(--vt-tinta-70)]">
                      {s.detalle}
                    </span>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
        {!vacio && opciones.length > 0 && (
          <button
            type="submit"
            className="w-full border-t-2 border-[var(--vt-tinta-15)] px-4 py-3 text-left text-sm font-bold hover:bg-[var(--vt-crema)]"
          >
            Ver todos los resultados de “{consulta}”
          </button>
        )}
      </div>
    </form>
  )
}
