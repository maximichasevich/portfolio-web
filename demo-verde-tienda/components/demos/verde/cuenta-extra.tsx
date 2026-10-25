"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  BellRing,
  Check,
  Droplets,
  Gift,
  PackageCheck,
  Pause,
  Play,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Truck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { pesos } from "@/lib/demo"
import { buscarPlanta, catalogo } from "@/components/demos/verde/catalogo"
import {
  PUNTOS_CANJE,
  VALOR_CANJE,
  buscarPlan,
  estadoDePedido,
  estadosPedido,
  nivelDe,
} from "@/components/demos/verde/extras"
import {
  RUTA,
  useAhora,
  useTienda,
  type MiPlanta,
  type Pedido,
} from "@/components/demos/verde/estado"
import { latido } from "@/components/demos/verde/efectos"
import { fondo } from "@/components/demos/verde/ui"

const DIA = 86400000

/* ---------- Seguimiento de pedido ---------- */

export function Seguimiento({ pedido }: { pedido: Pedido }) {
  const ahora = useAhora(15000)
  const estado = estadoDePedido(pedido.fecha, ahora)
  const retiro = pedido.zona.startsWith("Retiro")
  return (
    <div className="mt-1">
      <div className="relative mx-3 mt-3 mb-2 h-10" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[var(--vt-tinta-15)]" />
        <div
          className="absolute top-1/2 left-0 h-1.5 w-full origin-left rounded-full bg-[var(--vt-hoja)] transition-transform duration-700"
          style={{ transform: `translateY(-50%) scaleX(${estado / 3})` }}
        />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--vt-tinta)]",
              i <= estado ? "bg-[var(--vt-hoja)]" : "bg-[var(--vt-papel)]"
            )}
            style={{ left: `${(i / 3) * 100}%` }}
          />
        ))}
        <div className="vt-camion absolute inset-x-0 top-0" style={{ transform: `translateX(${(estado / 3) * 100}%)` }}>
          <span className="vt-rebote vt-anim absolute -top-3 grid size-8 -translate-x-1/2 place-items-center rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)]">
            {estado === 3 ? <PackageCheck className="size-4" /> : <Truck className="size-4" />}
          </span>
        </div>
      </div>
      <ol className="grid grid-cols-4 gap-1 text-center text-[11px] leading-tight">
        {estadosPedido.map((e, i) => (
          <li key={e.id} aria-current={i === estado ? "step" : undefined} className={cn(i > estado && "text-[var(--vt-tinta-50)]")}>
            <span className="block font-extrabold">{retiro && e.id === "camino" ? "Lista para retirar" : e.nombre}</span>
            {i === estado && <span className="mt-0.5 hidden text-[var(--vt-tinta-70)] sm:block">{e.detalle}</span>}
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        Estado del pedido: {estadosPedido[estado].nombre}. {estadosPedido[estado].detalle}.
      </p>
      <p className="mt-2 text-[11px] text-[var(--vt-tinta-50)]">
        Seguimiento de demostración: avanza solo en unos minutos.
      </p>
    </div>
  )
}

export function EtiquetaEstado({ pedido }: { pedido: Pedido }) {
  const ahora = useAhora(15000)
  const estado = estadoDePedido(pedido.fecha, ahora)
  return (
    <span
      className={cn(
        "mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold",
        estado === 3 ? "bg-[var(--vt-menta)]" : estado === 2 ? "bg-[var(--vt-cielo)]" : "bg-[var(--vt-manteca)]"
      )}
    >
      {estadosPedido[estado].nombre}
    </span>
  )
}

/* ---------- Mis plantas: recordatorios de riego ---------- */

function proximoRiego(m: MiPlanta, ahora: number) {
  const pasaron = Math.floor((ahora - m.ultimoRiego) / DIA)
  return m.cadaDias - pasaron
}

export function MisPlantas() {
  const { misPlantas, agregarMiPlanta, irAlCatalogo } = useTienda()
  const ahora = useAhora(60000)
  const [nueva, setNueva] = useState("")

  return (
    <div className="space-y-4">
      <p className="flex gap-2.5 rounded-2xl bg-[var(--vt-cielo)] p-4 text-sm leading-snug">
        <BellRing className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          Las plantas que comprás aparecen solas acá. Te avisaríamos por
          WhatsApp el día que toca regar (en esta demo, solo lo ves acá).
        </span>
      </p>

      {misPlantas.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[var(--vt-tinta-15)] p-5 text-sm text-[var(--vt-tinta-70)]">
          Todavía no tenés plantas con recordatorio.
          <button type="button" className="vt-boton mt-4 flex h-11 px-5 text-sm" onClick={() => irAlCatalogo()}>
            Elegir mi primera planta
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {misPlantas.map((m) => (
            <TarjetaMiPlanta key={m.id} m={m} ahora={ahora} />
          ))}
        </ul>
      )}

      <form
        className="flex flex-wrap items-end gap-2 rounded-2xl border-2 border-dashed border-[var(--vt-tinta-15)] p-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!nueva) return
          agregarMiPlanta(nueva)
          setNueva("")
        }}
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="mp-nueva" className="mb-1.5 block text-sm font-bold">
            ¿Ya tenías alguna? Sumala
          </label>
          <select id="mp-nueva" className="vt-campo h-11 min-h-0 py-0" value={nueva} onChange={(e) => setNueva(e.target.value)}>
            <option value="">Elegí una planta</option>
            {catalogo.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="vt-boton-linea h-11 px-4 text-sm" disabled={!nueva}>
          <Plus className="size-4" aria-hidden="true" /> Sumar
        </button>
      </form>
    </div>
  )
}

const nombresDia = new Intl.DateTimeFormat("es-UY", { weekday: "short" })

function TarjetaMiPlanta({ m, ahora }: { m: MiPlanta; ahora: number | null }) {
  const { regar, quitarMiPlanta, avisar } = useTienda()
  const planta = buscarPlanta(m.plantaId)
  if (!planta) return null
  const faltan = ahora === null ? m.cadaDias : proximoRiego(m, ahora)
  const toca = faltan <= 0
  const avance = Math.max(0, Math.min(1, 1 - faltan / m.cadaDias))
  // Próximos 7 días con los días de riego marcados.
  const semana = Array.from({ length: 7 }, (_, i) => {
    const d = faltan <= 0 ? i : i - faltan
    return { i, riega: d >= 0 && d % m.cadaDias === 0 }
  })

  return (
    <li className="vt-tarjeta p-4">
      <div className="flex items-center gap-3">
        <span className={cn("vt-blob-2 relative size-14 shrink-0 overflow-hidden border-2 border-[var(--vt-tinta)]", fondo[planta.color])}>
          <Image src={planta.foto.src} alt="" fill sizes="56px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold">{m.apodo}</p>
          <p className="text-xs text-[var(--vt-tinta-70)]">Riego cada {m.cadaDias} días</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border-2 border-[var(--vt-tinta)] px-2.5 py-1 text-xs font-extrabold",
            toca ? "vt-quedan vt-anim bg-[var(--vt-coral)]" : "bg-[var(--vt-menta)]"
          )}
        >
          {toca ? "¡Toca regar hoy!" : faltan === 1 ? "Mañana" : `En ${faltan} días`}
        </span>
      </div>
      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
        role="progressbar"
        aria-label={`Sed de ${m.apodo}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(avance * 100)}
      >
        <div className="h-full origin-left rounded-full bg-[#5aa9ec] transition-transform duration-500" style={{ transform: `scaleX(${avance})` }} />
      </div>
      <ul className="mt-3 grid grid-cols-7 gap-1 text-center" aria-label="Próximos 7 días">
        {semana.map((d) => (
          <li
            key={d.i}
            className={cn(
              "rounded-xl border-2 py-1 text-[10px] font-bold",
              d.riega ? "border-[var(--vt-tinta)] bg-[var(--vt-cielo)]" : "border-[var(--vt-tinta-15)] text-[var(--vt-tinta-50)]"
            )}
          >
            <span className="block">
              {ahora === null ? `D${d.i + 1}` : d.i === 0 ? "Hoy" : nombresDia.format(new Date(ahora + d.i * DIA)).replace(".", "")}
            </span>
            {d.riega ? (
              <Droplets className="mx-auto size-3.5 text-[#2b7fd1]" aria-label="regar" />
            ) : (
              <span className="block h-3.5" aria-hidden="true" />
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={cn("h-10 px-4 text-sm", toca ? "vt-boton" : "vt-boton-linea")}
          onClick={(e) => {
            latido(e.currentTarget)
            regar(m.id)
            avisar(`¡Bien! ${m.apodo} ya tomó agua`)
          }}
        >
          <Droplets className="size-4" aria-hidden="true" /> Ya la regué
        </button>
        <button type="button" className="vt-icono ml-auto size-9" onClick={() => quitarMiPlanta(m.id)} aria-label={`Quitar ${m.apodo} de mis plantas`}>
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}

/* ---------- Club: puntos y suscripción ---------- */

const formatoDia = new Intl.DateTimeFormat("es-UY", { weekday: "long", day: "numeric", month: "long" })

function proximoLunes(desde: number) {
  const d = new Date(desde)
  const falta = (8 - d.getDay()) % 7 || 7
  return new Date(desde + falta * DIA)
}

export function MiClub() {
  const {
    puntosGanados,
    puntosDisponibles,
    canjearPuntos,
    cuponesPropios,
    cupon,
    suscripcion,
    suscribir,
    pausarSuscripcion,
    avisar,
    abrir,
  } = useTienda()
  const ahora = useAhora(60000)
  const [cancelando, setCancelando] = useState(false)
  const { actual, siguiente } = nivelDe(puntosGanados)
  const plan = suscripcion ? buscarPlan(suscripcion.planId) : undefined
  const avanceNivel = siguiente ? (puntosGanados - actual.desde) / (siguiente.desde - actual.desde) : 1

  return (
    <div className="space-y-5">
      <section aria-labelledby="club-puntos" className="rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-manteca)] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id="club-puntos" className="text-sm font-extrabold">Tus puntos verdes</h3>
            <p className="vt-titulo mt-1 text-5xl tabular-nums">{puntosDisponibles}</p>
          </div>
          <span className={cn("vt-sticker text-sm", fondo[actual.color])} style={{ "--giro": "5deg" } as React.CSSProperties}>
            <Star className="size-3.5 fill-[var(--vt-coral)]" aria-hidden="true" /> Nivel {actual.nombre}
          </span>
        </div>
        <div
          className="mt-4 h-3 overflow-hidden rounded-full border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)]"
          role="progressbar"
          aria-label="Avance hacia el próximo nivel"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(avanceNivel * 100)}
        >
          <div className="h-full origin-left rounded-full bg-[var(--vt-coral)] transition-transform duration-700" style={{ transform: `scaleX(${avanceNivel})` }} />
        </div>
        <p className="mt-2 text-xs text-[var(--vt-tinta-70)]">
          {siguiente
            ? `Te faltan ${siguiente.desde - puntosGanados} puntos para el nivel ${siguiente.nombre}.`
            : "¡Llegaste al nivel más alto!"}{" "}
          Sumás 1 punto cada {pesos(10)}.
        </p>
        <button
          type="button"
          className="vt-boton-tinta mt-4 h-11 px-5 text-sm"
          disabled={puntosDisponibles < PUNTOS_CANJE}
          onClick={() => {
            const codigo = canjearPuntos()
            if (codigo) avisar(`Tu código ${codigo} ya quedó aplicado en el carrito`)
          }}
        >
          <Gift className="size-4" aria-hidden="true" /> Canjear {PUNTOS_CANJE} puntos por {pesos(VALOR_CANJE)}
        </button>
        {puntosDisponibles < PUNTOS_CANJE && (
          <p className="mt-2 text-xs text-[var(--vt-tinta-70)]">
            Necesitás {PUNTOS_CANJE - puntosDisponibles} puntos más para canjear.
          </p>
        )}
        {cuponesPropios.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {cuponesPropios.map((c) => (
              <li key={c} className="rounded-full border-2 border-dashed border-[var(--vt-tinta)] bg-[var(--vt-papel)] px-3 py-1 text-xs font-extrabold tracking-wide">
                {c} {cupon === c && "· aplicado"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="club-plan" className="rounded-[28px] border-2 border-[var(--vt-tinta)] bg-[var(--vt-papel)] p-5">
        <h3 id="club-plan" className="text-sm font-extrabold">Club de plantas</h3>
        {plan && suscripcion ? (
          <>
            <div className="mt-2 flex items-center gap-3">
              <span className={cn("grid size-12 place-items-center rounded-2xl border-2 border-[var(--vt-tinta)]", fondo[plan.color])}>
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="vt-titulo text-2xl">Plan {plan.nombre}</p>
                <p className="text-sm text-[var(--vt-tinta-70)]">
                  {plan.trae} · {pesos(plan.precio)}/mes
                </p>
              </div>
            </div>
            <p className={cn("mt-3 rounded-2xl p-3 text-sm font-bold", suscripcion.pausada ? "bg-[var(--vt-rosa)]" : "bg-[var(--vt-menta)]")}>
              {suscripcion.pausada
                ? "En pausa: no te mandamos cajas hasta que la reanudes."
                : ahora === null
                  ? "Próxima caja: el próximo lunes."
                  : `Próxima caja: ${formatoDia.format(proximoLunes(ahora))}.`}
            </p>
            {cancelando ? (
              <div className="mt-3 rounded-2xl border-2 border-[var(--vt-tinta)] p-3 text-sm">
                <p className="font-bold">¿Seguro? Podés pausarla en vez de cancelarla.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="vt-boton-tinta h-10 px-4 text-sm"
                    onClick={() => {
                      suscribir(null)
                      setCancelando(false)
                      avisar("Cancelaste tu suscripción. ¡Te esperamos de vuelta!")
                    }}
                  >
                    Sí, cancelar
                  </button>
                  <button type="button" className="vt-boton-linea h-10 px-4 text-sm" onClick={() => setCancelando(false)}>
                    Mejor no
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="vt-boton-linea h-10 px-4 text-sm"
                  onClick={() => {
                    pausarSuscripcion(!suscripcion.pausada)
                    avisar(suscripcion.pausada ? "Reanudaste tu plan" : "Pausaste tu plan")
                  }}
                >
                  {suscripcion.pausada ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
                  {suscripcion.pausada ? "Reanudar" : "Pausar"}
                </button>
                <button type="button" className="px-2 text-sm font-bold underline underline-offset-4" onClick={() => setCancelando(true)}>
                  Cancelar plan
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-[var(--vt-tinta-70)]">
              Una caja sorpresa por mes desde {pesos(590)}. Pausala cuando quieras.
            </p>
            <Link href={`${RUTA}/#club`} onClick={() => abrir(null)} className="vt-boton mt-3 h-11 px-5 text-sm">
              <Check className="size-4" aria-hidden="true" /> Ver los planes
            </Link>
          </>
        )}
      </section>
    </div>
  )
}
