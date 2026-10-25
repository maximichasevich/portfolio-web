"use client"

import { useState } from "react"
import { Dialog } from "radix-ui"
import { Check, Gift, Info, PackageOpen, Sparkles, Star, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import {
  PUNTOS_CANJE,
  VALOR_CANJE,
  buscarPlan,
  planes,
  type Plan,
} from "@/components/demos/verde/extras"
import { useTienda } from "@/components/demos/verde/estado"
import { confeti } from "@/components/demos/verde/efectos"
import { PlantaDibujo } from "@/components/demos/verde/planta-svg"
import { capa, fondo } from "@/components/demos/verde/ui"

const tonos: Record<Plan["color"], { cara: string; lado: string; tapa: string }> = {
  menta: { cara: "#b8ead0", lado: "#8fd2ae", tapa: "#d4f4e2" },
  lila: { cara: "#cbbcff", lado: "#a996f2", tapa: "#ded4ff" },
  durazno: { cara: "#ffcf9e", lado: "#f2ad6c", tapa: "#ffe0bf" },
}

export function Club() {
  const { suscripcion, usuario, abrir, abrirCuenta, avisar } = useTienda()
  const [elegido, setElegido] = useState<Plan | null>(null)
  const actual = suscripcion ? buscarPlan(suscripcion.planId) : undefined

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="vt-sticker bg-[var(--vt-manteca)]" style={{ "--giro": "-3deg" } as React.CSSProperties}>
            <Gift className="size-3.5" aria-hidden="true" /> Suscripción mensual
          </span>
          <h2 id="club-titulo" className="vt-titulo mt-4 text-[clamp(2.8rem,7vw,5rem)]">
            Club de plantas
          </h2>
          <p className="mt-3 max-w-lg text-[var(--vt-tinta-70)]">
            Una caja sorpresa por mes con plantas elegidas para tu casa y su
            tarjeta de cuidados. Pausala o cancelala cuando quieras desde tu
            cuenta.
          </p>
        </div>
        <div className="max-w-xs rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-4 text-sm">
          <p className="flex items-center gap-2 font-extrabold">
            <Star className="size-4 fill-[var(--vt-coral)]" aria-hidden="true" /> Puntos verdes
          </p>
          <p className="mt-1 text-[var(--vt-tinta-70)]">
            Sumás 1 punto cada {pesos(10)}. Con {PUNTOS_CANJE} puntos te llevás{" "}
            {pesos(VALOR_CANJE)} de descuento.
          </p>
          <button
            type="button"
            className="mt-2 font-extrabold underline underline-offset-4"
            onClick={() => (usuario ? abrirCuenta("club") : abrir("entrar"))}
          >
            Ver mis puntos
          </button>
        </div>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {planes.map((p) => (
          <li key={p.id}>
            <TarjetaPlan
              plan={p}
              activo={actual?.id === p.id}
              onElegir={() => {
                if (!usuario) {
                  avisar("Entrá a tu cuenta para suscribirte")
                  abrir("entrar")
                  return
                }
                setElegido(p)
              }}
              onGestionar={() => abrirCuenta("club")}
            />
          </li>
        ))}
      </ul>

      <Confirmar plan={elegido} onCerrar={() => setElegido(null)} />
    </div>
  )
}

function TarjetaPlan({
  plan,
  activo,
  onElegir,
  onGestionar,
}: {
  plan: Plan
  activo: boolean
  onElegir: () => void
  onGestionar: () => void
}) {
  const [abierta, setAbierta] = useState(false)
  const tono = tonos[plan.color]
  return (
    <article
      className="flex h-full flex-col rounded-[32px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5"
      onPointerEnter={(e) => e.pointerType === "mouse" && setAbierta(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setAbierta(false)}
    >
      <div className={cn("relative grid h-48 place-items-center overflow-hidden rounded-[24px]", fondo[plan.color])}>
        <div className="vt-caja-escena pt-10" data-abierta={abierta} aria-hidden="true">
          <div className="vt-caja">
            <div className="vt-caja-cara" style={{ background: tono.lado, transform: "rotateX(-90deg) translateZ(55px)" }} />
            <div className="vt-caja-cara" style={{ background: tono.lado, transform: "rotateY(180deg) translateZ(55px)" }} />
            <div className="vt-caja-cara" style={{ background: tono.lado, transform: "rotateY(-90deg) translateZ(55px)" }} />
            <div className="vt-caja-planta">
              <PlantaDibujo id={plan.plantaId} className="size-full" />
            </div>
            <div className="vt-caja-cara" style={{ background: tono.lado, transform: "rotateY(90deg) translateZ(55px)" }} />
            <div className="vt-caja-cara grid place-items-center" style={{ background: tono.cara, transform: "translateZ(55px)" }}>
              <span className="vt-titulo rotate-[-6deg] rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] px-2 py-1 text-sm">
                verde<span className="text-[var(--vt-coral)]">.</span>
              </span>
            </div>
            <div className="vt-caja-tapa" style={{ background: tono.tapa }} />
          </div>
        </div>
        {activo && (
          <span className="vt-sticker absolute top-3 left-3 bg-[var(--vt-manteca)]">
            <Check className="size-3.5" aria-hidden="true" /> Tu plan
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="vt-titulo text-3xl">{plan.nombre}</h3>
        <p className="shrink-0">
          <span className="vt-titulo text-2xl tabular-nums">{pesos(plan.precio)}</span>
          <span className="text-sm text-[var(--vt-tinta-70)]"> /mes</span>
        </p>
      </div>
      <p className="mt-1 font-bold">{plan.trae}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-[var(--vt-tinta-70)]">
        {plan.detalle.map((d) => (
          <li key={d} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-[var(--vt-hoja)]" aria-hidden="true" /> {d}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {activo ? (
          <button type="button" className="vt-boton-linea h-11 flex-1 px-4 text-sm" onClick={onGestionar}>
            Gestionar mi plan
          </button>
        ) : (
          <button type="button" className="vt-boton h-11 flex-1 px-4 text-sm" onClick={onElegir}>
            Suscribirme
          </button>
        )}
        <button
          type="button"
          className="vt-boton-linea h-11 px-4 text-sm"
          aria-pressed={abierta}
          onClick={() => setAbierta(!abierta)}
        >
          <PackageOpen className="size-4" aria-hidden="true" /> {abierta ? "Cerrar caja" : "Abrir caja"}
        </button>
      </div>
    </article>
  )
}

function Confirmar({ plan, onCerrar }: { plan: Plan | null; onCerrar: () => void }) {
  const { suscribir, suscripcion, avisar } = useTienda()
  return (
    <Dialog.Root open={!!plan} onOpenChange={(o) => !o && onCerrar()}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn(capa, "vt-velo")} />
        <Dialog.Content
          className={cn(
            capa,
            "vt-modal fixed inset-x-0 bottom-0 z-[61] rounded-t-[32px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-crema)] p-6 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-[28rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[32px] md:p-8"
          )}
        >
          {plan && (
            <>
              <Dialog.Close className="vt-icono absolute top-4 right-4 size-10 border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]" aria-label="Cerrar">
                <X className="size-5" aria-hidden="true" />
              </Dialog.Close>
              <span className="vt-sticker bg-[var(--vt-lila)]">
                <Sparkles className="size-3.5" aria-hidden="true" /> Club de plantas
              </span>
              <Dialog.Title className="vt-titulo mt-4 text-4xl">Plan {plan.nombre}</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-[var(--vt-tinta-70)]">
                {plan.trae} cada mes por {pesos(plan.precio)}. La primera caja
                sale el próximo lunes a la dirección de tu cuenta.
              </Dialog.Description>
              {suscripcion && (
                <p className="mt-4 rounded-2xl bg-[var(--vt-manteca)] p-3 text-sm">
                  Ya tenés un plan activo: lo cambiamos por este.
                </p>
              )}
              <p className="mt-4 flex gap-2 rounded-2xl border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-3 text-sm">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Es una demo: no se cobra nada ni se piden datos de tarjeta.
              </p>
              <button
                type="button"
                className="vt-boton mt-6 h-12 w-full text-base"
                onClick={() => {
                  suscribir(plan.id)
                  onCerrar()
                  confeti()
                  avisar(`¡Ya sos parte del club! Tu plan ${plan.nombre} quedó activo`)
                }}
              >
                Confirmar suscripción · {pesos(plan.precio)}/mes
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
