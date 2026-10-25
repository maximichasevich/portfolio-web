"use client"

import Image from "next/image"
import { ArrowRight, Plus, ShoppingBag, Trash2, Truck } from "lucide-react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  ENVIO_GRATIS,
  buscarPlanta,
  catalogo,
  precioDesde,
  precioVariante,
  textoVariante,
} from "@/components/demos/verde/catalogo"
import { useTienda } from "@/components/demos/verde/estado"
import { Cajon, Contador, fondo } from "@/components/demos/verde/ui"

/** Barra de progreso hacia el envío gratis en Montevideo. */
export function ProgresoEnvio({ subtotal }: { subtotal: number }) {
  const falta = Math.max(0, ENVIO_GRATIS - subtotal)
  const avance = Math.min(1, subtotal / ENVIO_GRATIS)
  return (
    <div className="rounded-2xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-menta)] p-3.5">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Truck className="size-4 shrink-0" aria-hidden="true" />
        {falta > 0 ? (
          <span>
            Te faltan <strong className="font-extrabold">{pesos(falta)}</strong>{" "}
            para el envío gratis en Montevideo
          </span>
        ) : (
          <span>
            <strong className="font-extrabold">¡Tenés envío gratis</strong> en
            Montevideo!
          </span>
        )}
      </p>
      <div
        className="mt-2.5 h-3 overflow-hidden rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
        role="progressbar"
        aria-label="Avance hacia el envío gratis"
        aria-valuemin={0}
        aria-valuemax={ENVIO_GRATIS}
        aria-valuenow={Math.min(subtotal, ENVIO_GRATIS)}
        aria-valuetext={falta > 0 ? `Faltan ${pesos(falta)}` : "Envío gratis alcanzado"}
      >
        <motion.div
          className="h-full rounded-full bg-[var(--vt-coral)]"
          initial={false}
          animate={{ width: `${avance * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}

export function CajonCarrito() {
  const {
    panel,
    abrir,
    carrito,
    cantidadCarrito,
    subtotal,
    cambiarCantidad,
    agregar,
    irAlCatalogo,
    abrirVistaRapida,
  } = useTienda()

  const enCarrito = new Set(carrito.map((l) => l.plantaId))
  const sugeridas = catalogo
    .filter((p) => !enCarrito.has(p.id) && precioDesde(p) <= 500)
    .slice(0, 2)

  return (
    <Cajon
      abierto={panel === "carrito"}
      onCambio={(o) => abrir(o ? "carrito" : null)}
      titulo={`Tu carrito${cantidadCarrito ? ` (${cantidadCarrito})` : ""}`}
      descripcion="Productos que agregaste, cantidades y subtotal"
      icono={<ShoppingBag className="size-6" aria-hidden="true" />}
      pie={
        carrito.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-bold">Subtotal</span>
              <span className="vt-titulo text-3xl tabular-nums">{pesos(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-[var(--vt-tinta-70)]">
              IVA incluido. El envío se calcula en el siguiente paso. Hasta 6
              cuotas sin recargo.
            </p>
            <button
              type="button"
              className="vt-boton mt-3 h-13 w-full text-base"
              onClick={() => abrir("checkout")}
            >
              Finalizar compra <ArrowRight className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="mt-2 w-full py-2 text-sm font-bold underline underline-offset-4"
              onClick={() => abrir(null)}
            >
              Seguir comprando
            </button>
          </div>
        )
      }
    >
      {carrito.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <div className="vt-blob-1 grid size-28 place-items-center border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)]">
            <ShoppingBag className="size-10" aria-hidden="true" />
          </div>
          <p className="vt-titulo mt-6 text-3xl">Tu carrito está vacío</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--vt-tinta-70)]">
            Todavía no elegiste ninguna planta. ¿Arrancamos por las más fáciles?
          </p>
          <button type="button" className="vt-boton mt-6 h-12 px-6" onClick={() => irAlCatalogo({ facil: true })}>
            Ver plantas fáciles
          </button>
        </div>
      ) : (
        <div className="space-y-5 p-5">
          <ProgresoEnvio subtotal={subtotal} />
          <ul className="space-y-3">
            {carrito.map((l) => {
              const planta = buscarPlanta(l.plantaId)
              if (!planta) return null
              const precio = precioVariante(planta, l.tamanoId, l.macetaId)
              return (
                <li key={l.clave} className="vt-tarjeta flex gap-3 p-3">
                  <button
                    type="button"
                    onClick={() => abrirVistaRapida(planta.id)}
                    className={cn(
                      "vt-blob-2 relative size-20 shrink-0 overflow-hidden",
                      fondo[planta.color]
                    )}
                    aria-label={`Ver ${planta.nombre}`}
                  >
                    <Image src={planta.foto.src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-extrabold">{planta.nombre}</p>
                        <p className="text-xs text-[var(--vt-tinta-70)]">
                          {textoVariante(planta, l.tamanoId, l.macetaId)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="vt-icono -mt-1 -mr-1 size-9 shrink-0"
                        onClick={() => cambiarCantidad(l.clave, 0)}
                        aria-label={`Quitar ${planta.nombre} del carrito`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                      <Contador
                        chico
                        valor={l.cantidad}
                        nombre={planta.nombre}
                        onCambio={(n) => cambiarCantidad(l.clave, n)}
                      />
                      <span className="font-extrabold tabular-nums">
                        {pesos(precio * l.cantidad)}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {sugeridas.length > 0 && (
            <div>
              <p className="vt-titulo text-xl">Sumale algo chiquito</p>
              <ul className="mt-3 grid grid-cols-2 gap-3">
                {sugeridas.map((p) => (
                  <li key={p.id} className="rounded-3xl border-2 border-dashed border-[var(--vt-tinta-50)] p-3">
                    <div className={cn("vt-blob-3 relative aspect-square overflow-hidden", fondo[p.color])}>
                      <Image src={p.foto.src} alt="" fill sizes="160px" className="object-cover" />
                    </div>
                    <p className="mt-2 truncate text-sm font-bold">{p.nombre}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm tabular-nums">{pesos(precioDesde(p))}</span>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)]"
                        onClick={() => agregar(p.id)}
                        aria-label={`Agregar ${p.nombre} al carrito`}
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Cajon>
  )
}
