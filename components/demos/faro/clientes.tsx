"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, Tabs } from "radix-ui"
import {
  CalendarDays,
  Download,
  FileText,
  LogOut,
  MapPin,
  Video,
  X,
} from "lucide-react"

import { useFaro } from "@/components/demos/faro/contexto"
import { fotosFaro } from "@/components/demos/fotos"
import { cn } from "@/lib/utils"

/* ---- Datos de prueba (ficticios) ---- */

const proyecto = {
  nombre: "Casa Atlántida",
  codigo: "EF-2025-014",
  direccion: "Calle 11 esq. Circunvalación, Atlántida",
  inicioObra: "3 de marzo de 2026",
  entrega: "Abril de 2027",
  responsable: "Joaquín Pereda",
}

const etapas = [
  { nombre: "Anteproyecto", avance: 100, fecha: "Jul 2025" },
  { nombre: "Proyecto ejecutivo", avance: 100, fecha: "Oct 2025" },
  { nombre: "Permiso de construcción", avance: 100, fecha: "Feb 2026" },
  { nombre: "Obra gruesa", avance: 78, fecha: "Nov 2026" },
  { nombre: "Instalaciones", avance: 35, fecha: "Ene 2027" },
  { nombre: "Terminaciones", avance: 5, fecha: "Mar 2027" },
  { nombre: "Entrega", avance: 0, fecha: "Abr 2027" },
]

const reuniones = [
  {
    fecha: "Mar 4 nov",
    hora: "10:00",
    titulo: "Visita a obra: revisión de aberturas",
    lugar: "En obra, Atlántida",
    Icono: MapPin,
  },
  {
    fecha: "Jue 13 nov",
    hora: "18:30",
    titulo: "Elección de revestimientos de baños",
    lugar: "Estudio, Ciudad Vieja",
    Icono: MapPin,
  },
  {
    fecha: "Lun 24 nov",
    hora: "09:00",
    titulo: "Certificado de avance n.º 9",
    lugar: "Videollamada",
    Icono: Video,
  },
]

const documentos = [
  { nombre: "Planos de arquitectura", detalle: "Lámina A-01 a A-14 · rev. 3", tipo: "PDF", peso: "18,4 MB", fecha: "12/10/2026" },
  { nombre: "Presupuesto de obra", detalle: "Comparativo de tres empresas", tipo: "XLSX", peso: "420 KB", fecha: "05/02/2026" },
  { nombre: "Certificado de avance n.º 8", detalle: "Octubre 2026", tipo: "PDF", peso: "1,2 MB", fecha: "01/10/2026" },
  { nombre: "Planilla de terminaciones", detalle: "Pisos, revestimientos y griferías", tipo: "PDF", peso: "3,8 MB", fecha: "20/09/2026" },
  { nombre: "Permiso de construcción", detalle: "Intendencia de Canelones", tipo: "PDF", peso: "960 KB", fecha: "18/02/2026" },
]

const novedades = [
  { fecha: "22 oct", texto: "Se terminó el hormigonado de la losa superior. Desencofrado previsto para el 5 de noviembre." },
  { fecha: "15 oct", texto: "Llegaron las muestras de madera para el deck. Quedan en el estudio para la próxima reunión." },
  { fecha: "02 oct", texto: "Aprobado el certificado n.º 8. La obra avanza según el cronograma." },
]

type DatosCliente = {
  nombre: string
  correo: string
  telefono: string
  direccion: string
  aviso: string
}

const datosPrueba: DatosCliente = {
  nombre: "Lucía Fernández y Martín Suárez",
  correo: "familia.fs@correo.com",
  telefono: "+598 99 123 456",
  direccion: "Bulevar Artigas 1520, ap. 801, Montevideo",
  aviso: "Correo",
}

const CLAVE = "faro-cliente-demo"

function leerDatos(): DatosCliente {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return datosPrueba
    return { ...datosPrueba, ...(JSON.parse(crudo) as Partial<DatosCliente>) }
  } catch {
    return datosPrueba
  }
}

const avanceTotal = Math.round(
  etapas.reduce((s, e) => s + e.avance, 0) / etapas.length
)

/**
 * Área de clientes de demostración. No pide credenciales: el botón entra con
 * un cliente de prueba. Los datos del cliente se guardan en localStorage.
 */
export function AreaClientes() {
  const { abierta, abrir, cerrar, alCerrar } = useFaro()
  const [dentro, setDentro] = useState(false)

  return (
    <Dialog.Root
      open={abierta === "clientes"}
      onOpenChange={(v) => (v ? abrir("clientes") : cerrar())}
    >
      <Dialog.Overlay className="capa fixed inset-0 z-[60] bg-[var(--carbon)]/70" />
      <Dialog.Content
        className="panel-lateral fixed inset-y-0 right-0 z-[61] flex w-full flex-col bg-[var(--papel)] text-[var(--carbon)] lg:w-[min(1040px,94vw)]"
        onCloseAutoFocus={alCerrar}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--linea)] px-5 py-2 sm:px-10">
          <p className="etiqueta flex items-center gap-2 text-[var(--piedra)]">
            Área de clientes
            <span className="border border-[var(--luz)] px-1.5 py-0.5 text-[0.6rem] text-[#7a6236]">
              Demostración
            </span>
          </p>
          <Dialog.Close className="etiqueta inline-flex min-h-11 items-center gap-2 px-1">
            Cerrar
            <X className="size-4" aria-hidden="true" />
          </Dialog.Close>
        </div>

        {dentro ? (
          <Panel alSalir={() => setDentro(false)} />
        ) : (
          <Acceso alEntrar={() => setDentro(true)} />
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}

function Acceso({ alEntrar }: { alEntrar: () => void }) {
  return (
    <div className="grid flex-1 overflow-y-auto lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src={fotosFaro.puntagorda.src}
          alt=""
          fill
          sizes="45vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center px-5 py-10 sm:px-10">
        <Dialog.Title className="serif text-[clamp(2.4rem,6vw,3.4rem)]">
          Seguimiento de tu obra
        </Dialog.Title>
        <Dialog.Description className="mt-4 max-w-md text-sm leading-relaxed text-[var(--carbon)]/80">
          Cada cliente del estudio tiene un espacio privado con el avance de
          la obra, las próximas reuniones y todos los documentos del proyecto.
        </Dialog.Description>

        <div className="mt-8 border border-[var(--linea)] bg-[var(--hueso)] p-5">
          <p className="etiqueta text-[#7a6236]">Esto es una demostración</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--carbon)]/80">
            No hace falta usuario ni contraseña. Entrás con un cliente de
            prueba y todos los datos son inventados. Lo que edites se guarda
            solo en este navegador.
          </p>
          <button type="button" className="boton mt-5 w-full sm:w-auto" onClick={alEntrar}>
            Entrar como cliente de prueba
          </button>
        </div>

        <p className="mt-6 text-xs text-[var(--piedra)]">
          En el sitio real, el acceso es con el correo de cada cliente y un
          enlace seguro.
        </p>
      </div>
    </div>
  )
}

function Panel({ alSalir }: { alSalir: () => void }) {
  const [aviso, setAviso] = useState("")

  return (
    <Tabs.Root defaultValue="obra" className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-[var(--linea)] px-5 pt-6 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mono text-xs text-[var(--piedra)]">
              {proyecto.codigo} · Cliente de prueba
            </p>
            <Dialog.Title className="serif mt-1 text-[clamp(2.2rem,5vw,3.2rem)]">
              {proyecto.nombre}
            </Dialog.Title>
            <Dialog.Description className="mono mt-1 text-xs text-[var(--piedra)]">
              {proyecto.direccion}
            </Dialog.Description>
          </div>
          <button
            type="button"
            onClick={alSalir}
            className="etiqueta inline-flex min-h-11 items-center gap-2 text-[var(--piedra)] hover:text-[var(--carbon)]"
          >
            <LogOut className="size-3.5" aria-hidden="true" />
            Salir
          </button>
        </div>

        <Tabs.List
          aria-label="Secciones del área de clientes"
          className="-mx-5 mt-5 flex overflow-x-auto px-5 sm:mx-0 sm:px-0"
        >
          {[
            ["obra", "Obra"],
            ["reuniones", "Reuniones"],
            ["documentos", "Documentos"],
            ["datos", "Mis datos"],
          ].map(([v, t]) => (
            <Tabs.Trigger
              key={v}
              value={v}
              className="etiqueta mr-6 shrink-0 border-b border-transparent py-3 text-[var(--piedra)] hover:text-[var(--carbon)] data-[state=active]:border-[var(--carbon)] data-[state=active]:text-[var(--carbon)] sm:mr-8"
            >
              {t}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-10">
        <Tabs.Content value="obra" className="outline-none">
          <PestanaObra />
        </Tabs.Content>
        <Tabs.Content value="reuniones" className="outline-none">
          <PestanaReuniones />
        </Tabs.Content>
        <Tabs.Content value="documentos" className="outline-none">
          <PestanaDocumentos alAviso={setAviso} />
        </Tabs.Content>
        <Tabs.Content value="datos" className="outline-none">
          <PestanaDatos />
        </Tabs.Content>
        <p
          role="status"
          className={cn(
            "mono mt-6 text-xs text-[var(--piedra)]",
            aviso && "border-l border-[var(--luz)] pl-3"
          )}
        >
          {aviso}
        </p>
      </div>
    </Tabs.Root>
  )
}

function PestanaObra() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div className="flex items-end justify-between gap-4">
          <h3 className="serif text-3xl">Etapas</h3>
          <p className="mono text-xs text-[var(--piedra)]">
            Avance general <span className="text-[var(--carbon)]">{avanceTotal}%</span>
          </p>
        </div>
        <ol className="mt-5 border-t border-[var(--linea)]">
          {etapas.map((e, i) => (
            <li key={e.nombre} className="border-b border-[var(--linea)] py-3.5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="flex items-baseline gap-3 text-sm">
                  <span className="mono text-xs text-[var(--piedra)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {e.nombre}
                </p>
                <p className="mono shrink-0 text-xs text-[var(--piedra)]">
                  {e.avance === 100 ? "Terminada" : e.avance === 0 ? e.fecha : `${e.avance}% · ${e.fecha}`}
                </p>
              </div>
              <div
                role="progressbar"
                aria-label={e.nombre}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={e.avance}
                className="mt-2.5 ml-8 h-[3px] bg-[var(--hueso-2)]"
              >
                <div
                  className={cn(
                    "avance h-full",
                    e.avance === 100 ? "bg-[var(--carbon)]" : "bg-[var(--luz)]"
                  )}
                  style={{ transform: `scaleX(${e.avance / 100})` }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="serif text-3xl">Resumen</h3>
        <dl className="mono mt-5 grid grid-cols-[9.5rem_1fr] border-t border-[var(--linea)] text-[0.8rem]">
          {[
            ["Inicio de obra", proyecto.inicioObra],
            ["Entrega prevista", proyecto.entrega],
            ["Responsable", proyecto.responsable],
            ["Próxima visita", `${reuniones[0].fecha} · ${reuniones[0].hora}`],
          ].map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="border-b border-[var(--linea)] py-2.5 text-[var(--piedra)]">{k}</dt>
              <dd className="border-b border-[var(--linea)] py-2.5">{v}</dd>
            </div>
          ))}
        </dl>

        <h3 className="serif mt-10 text-3xl">Novedades</h3>
        <ul className="mt-5 space-y-4">
          {novedades.map((n) => (
            <li key={n.fecha} className="grid grid-cols-[3.5rem_1fr] gap-3 text-sm leading-relaxed">
              <span className="mono pt-0.5 text-xs text-[var(--piedra)]">{n.fecha}</span>
              <span className="text-[var(--carbon)]/85">{n.texto}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PestanaReuniones() {
  return (
    <div>
      <h3 className="serif text-3xl">Próximas reuniones</h3>
      <ul className="mt-5 border-t border-[var(--linea)]">
        {reuniones.map((r) => (
          <li
            key={r.titulo}
            className="grid gap-x-6 gap-y-1 border-b border-[var(--linea)] py-4 sm:grid-cols-[9rem_1fr_auto] sm:items-center"
          >
            <p className="mono text-xs">
              {r.fecha} · {r.hora}
            </p>
            <p className="serif text-xl">{r.titulo}</p>
            <p className="mono flex items-center gap-2 text-xs text-[var(--piedra)]">
              <r.Icono className="size-3.5" aria-hidden="true" />
              {r.lugar}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-6 flex items-center gap-2 text-sm text-[var(--piedra)]">
        <CalendarDays className="size-4" aria-hidden="true" />
        Para mover una reunión, escribile a tu responsable de obra.
      </p>
    </div>
  )
}

function PestanaDocumentos({ alAviso }: { alAviso: (t: string) => void }) {
  return (
    <div>
      <h3 className="serif text-3xl">Documentos del proyecto</h3>
      <ul className="mt-5 border-t border-[var(--linea)]">
        {documentos.map((d) => (
          <li
            key={d.nombre}
            className="flex items-center gap-4 border-b border-[var(--linea)] py-3.5"
          >
            <FileText className="size-5 shrink-0 text-[var(--piedra)]" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm">{d.nombre}</p>
              <p className="mono mt-0.5 text-xs text-[var(--piedra)]">
                {d.detalle} · {d.tipo} · {d.peso} · {d.fecha}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                alAviso(
                  `Demostración: en el sitio real se descargaría «${d.nombre}».`
                )
              }
              className="grid size-11 shrink-0 place-items-center border border-[var(--linea)] transition-colors hover:border-[var(--carbon)]"
              aria-label={`Descargar ${d.nombre} (${d.tipo}, ${d.peso})`}
            >
              <Download className="size-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PestanaDatos() {
  // El panel solo se monta después de un clic (nunca en el render del
  // servidor), así que leer localStorage al iniciar el estado no afecta la
  // hidratación.
  const [datos, setDatos] = useState<DatosCliente>(leerDatos)
  const [estado, setEstado] = useState("")

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(datos))
      setEstado("Datos guardados en este navegador.")
    } catch {
      setEstado("No se pudieron guardar: el navegador bloquea el almacenamiento.")
    }
  }

  function restablecer() {
    try {
      window.localStorage.removeItem(CLAVE)
    } catch {
      /* sin almacenamiento: no hay nada que borrar */
    }
    setDatos(datosPrueba)
    setEstado("Se restablecieron los datos de prueba.")
  }

  const campos: [keyof DatosCliente, string, string, string][] = [
    ["nombre", "Titulares", "text", "name"],
    ["correo", "Correo", "email", "email"],
    ["telefono", "Teléfono", "tel", "tel"],
    ["direccion", "Dirección de facturación", "text", "street-address"],
  ]

  return (
    <form onSubmit={guardar} className="max-w-2xl">
      <h3 className="serif text-3xl">Mis datos</h3>
      <p className="mt-2 text-sm text-[var(--piedra)]">
        Revisá que estén al día: los usamos para enviarte certificados y
        convocatorias.
      </p>
      <div className="mt-6 grid gap-7 sm:grid-cols-2">
        {campos.map(([k, etiqueta, tipo, auto]) => (
          <label key={k} className={cn("grid gap-1", k === "direccion" && "sm:col-span-2")}>
            <span className="etiqueta text-[var(--piedra)]">{etiqueta}</span>
            <input
              type={tipo}
              required
              value={datos[k]}
              autoComplete={auto}
              onChange={(e) => {
                setDatos((d) => ({ ...d, [k]: e.target.value }))
                setEstado("")
              }}
              className="campo"
            />
          </label>
        ))}
        <label className="grid gap-1">
          <span className="etiqueta text-[var(--piedra)]">Avisos de obra por</span>
          <select
            value={datos.aviso}
            onChange={(e) => setDatos((d) => ({ ...d, aviso: e.target.value }))}
            className="campo"
          >
            <option>Correo</option>
            <option>WhatsApp</option>
            <option>Correo y WhatsApp</option>
          </select>
        </label>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="submit" className="boton">
          Guardar cambios
        </button>
        <button type="button" className="boton-linea" onClick={restablecer}>
          Restablecer datos de prueba
        </button>
      </div>
      <p role="status" className="mono mt-4 min-h-5 text-xs text-[var(--piedra)]">
        {estado}
      </p>
    </form>
  )
}
