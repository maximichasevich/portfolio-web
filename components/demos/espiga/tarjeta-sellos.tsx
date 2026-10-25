"use client"

import { useState } from "react"
import { Gift, Repeat2, Stamp } from "lucide-react"

import {
  avisar,
  canjearTarjeta,
  panesEnPedidos,
  sellarEnMostrador,
  usePedidos,
  useTarjeta,
} from "@/components/demos/espiga/estado"
import { Sello } from "@/components/demos/espiga/sello"
import { Inclinable } from "@/components/demos/espiga/tres-d"
import { cn } from "@/lib/utils"

const giros = [-12, 8, -4, 14, -9, 5, -15, 10, -6, 12]

/** Tarjeta de la casa: cada pan suma un sello; con 10, uno de regalo. */
export function TarjetaSellos() {
  const pedidos = usePedidos()
  const t = useTarjeta()
  const [dorso, setDorso] = useState(false)
  const total = panesEnPedidos(pedidos) + t.mostrador - t.canjeados * 10
  const llena = total >= 10
  const sellos = Math.max(0, Math.min(10, total))

  return (
    <div>
      <Inclinable max={5} className="tarjeta-escena">
        <div className={cn("tarjeta", dorso && "tarjeta-dorso-visible")}>
          {/* Frente */}
          <div className="tarjeta-cara kraft" aria-hidden={dorso}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="volanta text-[var(--rojo)]">Tarjeta de la casa</p>
                <p className="titulo text-[1.5rem] leading-tight sm:text-[1.7rem]">
                  Cada 10 panes, uno de regalo
                </p>
              </div>
              <Sello
                id="sello-tarjeta"
                titulo={false}
                className="size-12 shrink-0 text-[var(--rojo)] sm:size-14"
              />
            </div>
            <ol
              className="mt-3 grid grid-cols-5 gap-2 sm:gap-3"
              aria-label={`${sellos} de 10 sellos`}
            >
              {giros.map((g, i) => {
                const puesto = i < sellos
                return (
                  <li
                    key={i}
                    className="casillero"
                    aria-label={puesto ? `Sello ${i + 1}: puesto` : `Sello ${i + 1}: vacío`}
                  >
                    {puesto ? (
                      <span
                        className="sellito"
                        style={{ rotate: `${g}deg` }}
                        aria-hidden="true"
                      >
                        <Sello id={`sellito-${i}`} titulo={false} className="size-full" />
                      </span>
                    ) : (
                      <span aria-hidden="true" className="text-[0.85rem] font-bold text-[var(--tinta-70)]">
                        {i === 9 ? "¡Gratis!" : i + 1}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
          {/* Dorso */}
          <div className="tarjeta-cara tarjeta-cara-dorso papel" aria-hidden={!dorso}>
            <p className="titulo text-[1.4rem]">Cómo funciona</p>
            <ul className="mt-2 grid gap-1 text-[0.98rem]">
              <li>✦ Cada pan que comprás suma un sello.</li>
              <li>✦ Los pedidos de esta página suman solos.</li>
              <li>✦ En el mostrador, mostrá este número.</li>
              <li>✦ Con 10 sellos, el pan de campo va de regalo.</li>
            </ul>
            <p className="tiza mt-2 text-[1.5rem] tracking-[0.2em] text-[var(--rojo)]">
              N.º 1987-0417
            </p>
          </div>
        </div>
      </Inclinable>

      <p className="mt-4 text-[1.1rem]" aria-live="polite">
        {llena ? (
          <strong>¡Tarjeta completa! Tu próximo pan de campo va de regalo.</strong>
        ) : (
          <>
            Tenés <strong>{sellos} de 10 sellos</strong>. Te faltan{" "}
            {10 - sellos} para tu pan de regalo.
          </>
        )}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDorso((d) => !d)}
          aria-pressed={dorso}
          className="boton-borde rounded-md px-4"
        >
          <Repeat2 className="size-5" aria-hidden="true" />
          {dorso ? "Ver los sellos" : "Dar vuelta la tarjeta"}
        </button>
        {llena ? (
          <button
            type="button"
            onClick={() => {
              canjearTarjeta()
              avisar("¡Listo! Avisanos al retirar y te damos tu pan de regalo.")
            }}
            className="boton-rojo rounded-md px-4"
          >
            <Gift className="size-5" aria-hidden="true" />
            Canjear mi pan de regalo
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              sellarEnMostrador()
              avisar("Sumaste un sello en tu tarjeta.")
            }}
            className="boton-tinta rounded-md px-4"
          >
            <Stamp className="size-5" aria-hidden="true" />
            Sumar un sello del mostrador
          </button>
        )}
      </div>
      <p className="mt-2 text-[0.9rem] text-[var(--tinta-70)]">
        En la tienda real, el sello lo pone quien te atiende. Acá podés
        probarlo con el botón.
      </p>
    </div>
  )
}
