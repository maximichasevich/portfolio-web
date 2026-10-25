"use client"

import Image from "next/image"
import { Heart, ShoppingBag, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  buscarPlanta,
  precioDesde,
  textoLuz,
} from "@/components/demos/verde/catalogo"
import { useTienda } from "@/components/demos/verde/estado"
import { Cajon, fondo } from "@/components/demos/verde/ui"

export function CajonFavoritos() {
  const {
    panel,
    abrir,
    favoritos,
    alternarFavorito,
    agregar,
    abrirVistaRapida,
    irAlCatalogo,
  } = useTienda()
  const plantas = favoritos.flatMap((id) => buscarPlanta(id) ?? [])

  return (
    <Cajon
      abierto={panel === "favoritos"}
      onCambio={(o) => abrir(o ? "favoritos" : null)}
      titulo={`Favoritos${plantas.length ? ` (${plantas.length})` : ""}`}
      descripcion="Las plantas que guardaste para después"
      icono={<Heart className="size-6" aria-hidden="true" />}
    >
      {plantas.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <div className="vt-blob-2 grid size-28 place-items-center border-2 border-[var(--vt-tinta)] bg-[var(--vt-rosa)]">
            <Heart className="size-10" aria-hidden="true" />
          </div>
          <p className="vt-titulo mt-6 text-3xl">Nada guardado todavía</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--vt-tinta-70)]">
            Tocá el corazón de cualquier planta y la encontrás acá cuando
            quieras.
          </p>
          <button type="button" className="vt-boton mt-6 h-12 px-6" onClick={() => irAlCatalogo()}>
            Explorar plantas
          </button>
        </div>
      ) : (
        <ul className="space-y-3 p-5">
          {plantas.map((p) => (
            <li key={p.id} className="vt-tarjeta flex gap-3 p-3">
              <button
                type="button"
                onClick={() => abrirVistaRapida(p.id)}
                className={cn("vt-blob-1 relative size-24 shrink-0 overflow-hidden", fondo[p.color])}
                aria-label={`Ver ${p.nombre}`}
              >
                <Image src={p.foto.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-extrabold">{p.nombre}</p>
                    <p className="text-xs text-[var(--vt-tinta-70)]">
                      {textoLuz[p.luz]} · {p.cuidado}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="vt-icono -mt-1 -mr-1 size-9 shrink-0"
                    onClick={() => alternarFavorito(p.id)}
                    aria-label={`Sacar ${p.nombre} de favoritos`}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <span className="text-sm font-bold tabular-nums">
                    desde {pesos(precioDesde(p))}
                  </span>
                  <button
                    type="button"
                    className="vt-boton h-9 px-3.5 text-sm"
                    onClick={(e) => agregar(p.id, { origen: e.currentTarget })}
                  >
                    <ShoppingBag className="size-4" aria-hidden="true" /> Agregar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Cajon>
  )
}
