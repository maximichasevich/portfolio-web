"use client"

import Image from "next/image"

import type { Producto } from "@/components/demos/espiga/carta"
import { pesos } from "@/lib/demo"
import { cn } from "@/lib/utils"

/**
 * Vitrina del mostrador en perspectiva (CSS 3D). Cada bandeja es un botón:
 * al pasar el mouse, enfocarla o tocarla se acerca y queda elegida.
 */
export function VitrinaEscena({
  items,
  elegido,
  onElegir,
  delDia,
}: {
  items: Producto[]
  elegido: string
  onElegir: (id: string) => void
  delDia: string
}) {
  const filas = [items.slice(0, 2), items.slice(2, 4)]
  return (
    <div className="vitrina-escena">
      <div className="vitrina">
        <div className="vitrina-fondo" aria-hidden="true" />
        {filas.map((fila, f) => (
          <div key={f} className="vitrina-estante">
            {fila.map((p) => {
              const Icono = p.icono
              const on = p.id === elegido
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onElegir(p.id)}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") onElegir(p.id)
                  }}
                  aria-pressed={on}
                  className={cn("bandeja", on && "bandeja-on")}
                >
                  <span className="bandeja-cuerpo">
                    <span className="bandeja-plato" aria-hidden="true">
                      {p.foto ? (
                        <Image
                          src={p.foto.src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 9rem, 30vw"
                          className="object-cover"
                        />
                      ) : (
                        <Icono
                          className="absolute inset-0 m-auto size-[45%] text-[var(--madera)]"
                          strokeWidth={1.3}
                        />
                      )}
                    </span>
                    <span className="bandeja-cartel">
                      {p.id === delDia && (
                        <span className="bandeja-sello">Hoy</span>
                      )}
                      <span className="block leading-tight font-bold">
                        {p.nombre}
                      </span>
                      <span className="titulo block text-[1.25rem] leading-none">
                        {pesos(p.precio)}
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        ))}
        <div className="vitrina-vidrio" aria-hidden="true" />
      </div>
      <div className="vitrina-mostrador" aria-hidden="true">
        <span className="titulo">La Espiga</span>
      </div>
    </div>
  )
}
