"use client"

import dynamic from "next/dynamic"

import { AlAcercarse } from "@/components/demos/verde/ui"

/*
 * Secciones pesadas (3D, living, herramientas, club) que no se ven al abrir:
 * su código se baja en un archivo aparte y se montan recién cuando la
 * persona se acerca con el scroll.
 */

function Cargando({ alto }: { alto: string }) {
  return (
    <div
      className="animate-pulse rounded-[36px] border-2 border-dashed border-[var(--vt-tinta-15)]"
      style={{ minHeight: alto }}
      aria-hidden="true"
    />
  )
}

const Armador = dynamic(
  () => import("@/components/demos/verde/armador").then((m) => m.Armador),
  { ssr: false, loading: () => <Cargando alto="640px" /> }
)
const Probador = dynamic(
  () => import("@/components/demos/verde/probador").then((m) => m.Probador),
  { ssr: false, loading: () => <Cargando alto="560px" /> }
)
const Herramientas = dynamic(
  () => import("@/components/demos/verde/herramientas").then((m) => m.Herramientas),
  { ssr: false, loading: () => <Cargando alto="720px" /> }
)
const Club = dynamic(
  () => import("@/components/demos/verde/club").then((m) => m.Club),
  { ssr: false, loading: () => <Cargando alto="640px" /> }
)

export function SeccionArmador() {
  return (
    <AlAcercarse alto="640px">
      <Armador />
    </AlAcercarse>
  )
}

export function SeccionProbador() {
  return (
    <AlAcercarse alto="560px">
      <Probador />
    </AlAcercarse>
  )
}

export function SeccionHerramientas() {
  return (
    <AlAcercarse alto="720px">
      <Herramientas />
    </AlAcercarse>
  )
}

export function SeccionClub() {
  return (
    <AlAcercarse alto="640px">
      <Club />
    </AlAcercarse>
  )
}
