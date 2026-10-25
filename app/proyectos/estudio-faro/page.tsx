import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { BannerDemo } from "@/components/demos/banner-demo"
import { CreditosFotos } from "@/components/demos/creditos-fotos"
import { fotosFaro } from "@/components/demos/fotos"
import { Agendar } from "@/components/demos/faro/agendar"
import { AreaClientes } from "@/components/demos/faro/clientes"
import { AbrirCapa, ProveedorFaro } from "@/components/demos/faro/contexto"
import {
  cifras,
  equipo,
  estudio,
  prensa,
  proceso,
  reconocimientos,
  servicios,
} from "@/components/demos/faro/datos"
import { Diario } from "@/components/demos/faro/diario"
import { Dossier, Newsletter } from "@/components/demos/faro/dossier"
import { Galeria } from "@/components/demos/faro/galeria"
import { Cabecera, Logo } from "@/components/demos/faro/menu"
import { Diferido } from "@/components/demos/faro/perezosos"
import { Portada } from "@/components/demos/faro/portada"
import { Busquedas, Preguntas } from "@/components/demos/faro/preguntas"

const dos = (n: number) => String(n).padStart(2, "0")

/** Encabezado de sección con índice en mono, al estilo de una revista. */
function Rotulo({
  numero,
  nombre,
  claro = false,
}: {
  numero: number
  nombre: string
  claro?: boolean
}) {
  return (
    <p
      className={
        "etiqueta flex items-center gap-4 " +
        (claro ? "text-[var(--piedra-claro)]" : "text-[var(--piedra)]")
      }
    >
      <span>({dos(numero)})</span>
      <span
        aria-hidden="true"
        className={"h-px w-10 " + (claro ? "bg-[var(--linea-clara)]" : "bg-[var(--linea)]")}
      />
      <span>{nombre}</span>
    </p>
  )
}

export default function Page() {
  return (
    <ProveedorFaro>
      <a
        href="#contenido"
        className="etiqueta fixed top-3 left-3 z-[70] -translate-y-20 bg-[var(--carbon)] px-3 py-2 text-[var(--hueso)] focus:translate-y-0"
      >
        Saltar al contenido
      </a>

      <Cabecera />

      <main>
        <Portada />

        {/* Manifiesto */}
        <section
          id="contenido"
          tabIndex={-1}
          className="scroll-mt-20 px-4 py-24 outline-none sm:px-8 md:py-36 lg:px-12"
        >
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rotulo numero={1} nombre="El estudio" />
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <p className="serif text-[clamp(2rem,4.4vw,3.9rem)] leading-[1.06]">
                Proyectamos pocas obras por año y las seguimos de cerca. Nos
                interesa la luz del lugar, los materiales que envejecen bien y
                los presupuestos que{" "}
                <em>no se desarman a mitad de camino.</em>
              </p>
              <dl className="mt-16 grid grid-cols-2 gap-y-10 border-t border-[var(--linea)] pt-8 md:grid-cols-4">
                {cifras.map((c) => (
                  <div key={c.texto} className="flex flex-col">
                    <dt className="etiqueta order-2 mt-2 block text-[var(--piedra)]">
                      {c.texto}
                    </dt>
                    <dd className="serif order-1 text-5xl md:text-6xl">
                      {c.valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Obras */}
        <section
          id="obras"
          tabIndex={-1}
          className="scroll-mt-20 px-4 pb-28 outline-none sm:px-8 md:pb-40 lg:px-12"
        >
          <div className="mb-10 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rotulo numero={2} nombre="Obras" />
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 className="serif text-[clamp(3rem,7vw,6.5rem)]">
                Obras <em>seleccionadas</em>
              </h2>
              <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-[var(--carbon)]/75">
                Viviendas, espacios comerciales e interiores terminados entre
                2022 y 2024. Abrí cada obra para ver su ficha técnica.
              </p>
            </div>
          </div>
          <Galeria />

          <div className="mt-28 grid gap-6 md:mt-40 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="etiqueta text-[var(--piedra)]">Mapa de obras</p>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h3 className="serif text-[clamp(2.4rem,4.6vw,4rem)]">
                Entre el río <em>y el océano.</em>
              </h3>
              <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-[var(--carbon)]/75">
                Obras terminadas, en curso y en proyecto, de la Ciudad Vieja a
                Manantiales. Elegí un punto para ver su ficha.
              </p>
            </div>
          </div>
          <Diferido pieza="mapa" alto="min-h-[560px] lg:min-h-[640px]" className="mt-10" />
        </section>

        {/* Pausa fotográfica a todo el ancho */}
        <figure data-oscuro className="relative h-[70svh] min-h-[420px] w-full overflow-hidden bg-[var(--carbon)]">
          <Image
            src={fotosFaro.palermo.src}
            alt="Interior de un altillo con la estructura de madera de la cubierta a la vista"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <figcaption className="mono absolute right-4 bottom-4 left-4 flex flex-wrap justify-between gap-2 text-xs text-[var(--hueso)] sm:right-8 sm:left-8 lg:right-12 lg:left-12">
            <span>Altillo Palermo · 2023</span>
            <span>34°54′S 56°11′O</span>
          </figcaption>
        </figure>

        {/* Laboratorio: maqueta 3D, estudio solar, corte y comparador */}
        <section
          id="laboratorio"
          tabIndex={-1}
          className="scroll-mt-20 px-4 py-28 outline-none sm:px-8 md:py-40 lg:px-12"
        >
          <div className="mb-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rotulo numero={3} nombre="Laboratorio" />
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 className="serif text-[clamp(3rem,7vw,6.5rem)]">
                Dibujar <em>antes de construir.</em>
              </h2>
              <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-[var(--carbon)]/75">
                Así presentamos un anteproyecto: una maqueta que se gira y se
                desarma por capas, el recorrido real del sol sobre el terreno y
                cortes que explican cada decisión.
              </p>
            </div>
          </div>
          <Diferido pieza="maqueta" alto="min-h-[1080px] lg:min-h-[640px]" />

          <div className="mt-24 mb-10 grid gap-6 md:mt-32 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="etiqueta text-[var(--piedra)]">Corte interactivo</p>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h3 className="serif text-[clamp(2.4rem,4.6vw,4rem)]">
                Un alero <em>hace el trabajo.</em>
              </h3>
              <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-[var(--carbon)]/75">
                Cambiá la estación y mirá hasta dónde entra el sol del mediodía
                en Casa Carrasco. Los números del dibujo explican cada pieza.
              </p>
            </div>
          </div>
          <Diferido pieza="corte" alto="min-h-[640px] lg:min-h-[520px]" />

          <div className="mt-24 mb-10 grid gap-6 md:mt-32 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="etiqueta text-[var(--piedra)]">Del croquis a la obra</p>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h3 className="serif text-[clamp(2.4rem,4.6vw,4rem)]">
                Lo que dibujamos, <em>construido.</em>
              </h3>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-12">
            <Diferido pieza="comparador" alto="min-h-[340px] lg:min-h-[560px]" className="lg:col-span-10 lg:col-start-2" />
          </div>
        </section>

        {/* Estudio y equipo */}
        <section
          id="estudio"
          tabIndex={-1}
          className="scroll-mt-20 px-4 py-28 outline-none sm:px-8 md:py-40 lg:px-12"
        >
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rotulo numero={4} nombre="Estudio" />
            </div>
            <div className="lg:col-span-4 lg:col-start-5">
              <h2 className="serif text-[clamp(2.8rem,5.5vw,5rem)]">
                Seis personas,
                <br />
                <em>una mesa larga.</em>
              </h2>
              <div className="mt-8 space-y-4 text-[0.95rem] leading-relaxed text-[var(--carbon)]/80">
                <p>
                  Estudio Faro nació en 2015 en un primer piso de la Ciudad
                  Vieja. Hoy somos arquitectas, arquitectos, una interiorista y
                  un técnico en presupuestos trabajando en el mismo taller.
                </p>
                <p>
                  Cada proyecto lo encabeza una de las personas socias, de la
                  primera reunión a la entrega de llaves. No delegamos la obra
                  en terceros: la dirigimos nosotros.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] lg:col-span-4 lg:col-start-9">
              <Image
                src={fotosFaro.ciudadvieja.src}
                alt="Espacio de trabajo luminoso con mesas largas"
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-20 lg:grid lg:grid-cols-12">
            <table className="w-full text-left lg:col-span-8 lg:col-start-5">
              <caption className="etiqueta mb-4 text-left text-[var(--piedra)]">
                Equipo
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Rol</th>
                  <th scope="col">En el estudio desde</th>
                </tr>
              </thead>
              <tbody className="border-t border-[var(--linea)]">
                {equipo.map((p) => (
                  <tr key={p.nombre} className="border-b border-[var(--linea)]">
                    <th scope="row" className="serif py-4 pr-4 text-2xl font-light">
                      {p.nombre}
                    </th>
                    <td className="hidden py-4 pr-4 text-sm text-[var(--carbon)]/75 sm:table-cell">
                      {p.rol}
                    </td>
                    <td className="mono py-4 text-right text-xs text-[var(--piedra)]">
                      <span className="block text-left text-[var(--carbon)]/75 sm:hidden">
                        {p.rol}
                      </span>
                      desde {p.desde}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div id="trabajo" tabIndex={-1} className="mt-24 scroll-mt-24 outline-none lg:grid lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="etiqueta text-[var(--piedra)]">Trabajá con nosotros</p>
            </div>
            <div className="mt-6 lg:col-span-8 lg:col-start-5 lg:mt-0">
              <h3 className="serif text-[clamp(2.2rem,4vw,3.4rem)]">
                Búsquedas <em>abiertas</em>
              </h3>
              <div className="mt-8">
                <Busquedas />
              </div>
              <p className="mt-6 text-sm text-[var(--carbon)]/75">
                ¿No es tu perfil? Mandanos tu portfolio igual a{" "}
                <a href={`mailto:${estudio.correo}?subject=${encodeURIComponent("Postulación espontánea")}`} className="subrayado">
                  {estudio.correo}
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section
          id="servicios"
          tabIndex={-1}
          className="scroll-mt-20 bg-[var(--papel)] px-4 py-28 outline-none sm:px-8 md:py-40 lg:px-12"
        >
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rotulo numero={5} nombre="Servicios" />
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 className="serif text-[clamp(2.8rem,5.5vw,5rem)]">
                Del terreno <em>a la llave.</em>
              </h2>
              <ol className="mt-14 border-t border-[var(--linea)]">
                {servicios.map((s, i) => (
                  <li
                    key={s.titulo}
                    className="grid gap-x-8 gap-y-3 border-b border-[var(--linea)] py-8 md:grid-cols-[3rem_1fr_1fr]"
                  >
                    <span className="mono text-xs text-[var(--piedra)]">
                      {dos(i + 1)}
                    </span>
                    <h3 className="serif text-[2rem] leading-none">{s.titulo}</h3>
                    <div>
                      <p className="text-[0.95rem] leading-relaxed text-[var(--carbon)]/80">
                        {s.texto}
                      </p>
                      <ul className="mono mt-4 space-y-1 text-xs text-[var(--piedra)]">
                        {s.detalle.map((d) => (
                          <li key={d}>— {d}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section
          id="proceso"
          tabIndex={-1}
          className="scroll-mt-20 px-4 py-28 outline-none sm:px-8 md:py-40 lg:px-12"
        >
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rotulo numero={6} nombre="Proceso" />
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 className="serif text-[clamp(2.8rem,5.5vw,5rem)]">
                Cómo trabajamos
              </h2>
              <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-[var(--carbon)]/75">
                Cinco etapas con entregables claros. Sabés qué pasa en cada una,
                cuánto dura y qué decisiones te vamos a pedir.
              </p>
            </div>
          </div>
          <ol className="mt-16 grid gap-0 md:grid-cols-5 md:gap-6">
            {proceso.map((p, i) => (
              <li
                key={p.titulo}
                className="relative border-l border-[var(--linea)] pb-10 pl-6 md:border-t md:border-l-0 md:pt-8 md:pb-0 md:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 -left-[3.5px] size-1.5 rounded-full bg-[var(--carbon)] md:-top-[3.5px] md:left-0"
                />
                <p className="mono text-xs text-[var(--piedra)]">
                  {dos(i + 1)} · {p.plazo}
                </p>
                <h3 className="serif mt-3 text-[1.75rem] leading-none">
                  {p.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--carbon)]/75">
                  {p.texto}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Costos y honorarios */}
        <section
          id="honorarios"
          tabIndex={-1}
          className="scroll-mt-20 bg-[var(--papel)] px-4 py-28 outline-none sm:px-8 md:py-40 lg:px-12"
        >
          <div className="mb-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rotulo numero={7} nombre="Honorarios" />
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 className="serif text-[clamp(2.8rem,5.5vw,5rem)]">
                Costos claros <em>desde el principio.</em>
              </h2>
              <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-[var(--carbon)]/75">
                Una primera idea de cuánto cuesta construir lo que tenés en
                mente. Es orientativa: el número real sale del proyecto.
              </p>
            </div>
          </div>
          <Diferido pieza="estimador" alto="min-h-[1280px] lg:min-h-[720px]" />

          <div className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="etiqueta text-[var(--piedra)]">Preguntas frecuentes</p>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <Preguntas />
            </div>
          </div>
        </section>

        {/* Testimonio */}
        <section data-oscuro className="sobre-oscuro bg-[var(--carbon)] px-4 py-28 text-[var(--hueso)] sm:px-8 md:py-40 lg:px-12">
          <figure className="mx-auto max-w-5xl">
            <blockquote className="serif text-[clamp(2rem,4.5vw,4rem)] leading-[1.08]">
              <p>
                “Nos mostraron cada decisión antes de tomarla. La obra terminó
                en fecha y con el presupuesto que habíamos firmado, algo que
                nadie nos había prometido antes.”
              </p>
            </blockquote>
            <figcaption className="mono mt-10 flex flex-wrap gap-x-6 gap-y-1 text-xs text-[var(--piedra-claro)]">
              <span>Familia propietaria · Casa Carrasco</span>
              <span>2024</span>
            </figcaption>
          </figure>
        </section>

        {/* Reconocimientos y prensa */}
        <section
          id="prensa"
          tabIndex={-1}
          className="scroll-mt-20 px-4 py-28 outline-none sm:px-8 md:py-40 lg:px-12"
        >
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rotulo numero={8} nombre="Prensa" />
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 className="serif text-[clamp(2.8rem,5.5vw,5rem)]">
                Reconocimientos
              </h2>
              <ul className="mt-12 border-t border-[var(--linea)]">
                {reconocimientos.map((r) => (
                  <li
                    key={r.titulo}
                    className="grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-1 border-b border-[var(--linea)] py-5 md:grid-cols-[4rem_1fr_12rem_9rem]"
                  >
                    <span className="mono text-xs text-[var(--piedra)] md:pt-2">
                      {r.anio}
                    </span>
                    <span className="serif text-2xl leading-tight">
                      {r.titulo}
                    </span>
                    <span className="col-start-2 text-sm text-[var(--carbon)]/75 md:col-start-auto md:pt-1.5">
                      {r.obra}
                    </span>
                    <span className="mono col-start-2 text-xs text-[var(--piedra)] md:col-start-auto md:pt-2 md:text-right">
                      {r.tipo}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="etiqueta mt-20 text-[var(--piedra)]">
                Publicaciones
              </h3>
              <ul className="mt-6 grid gap-px border border-[var(--linea)] bg-[var(--linea)] sm:grid-cols-2">
                {prensa.map((p) => (
                  <li key={p.nota} className="bg-[var(--hueso)] p-6">
                    <p className="mono text-xs text-[var(--piedra)]">
                      {p.medio} · {p.anio}
                    </p>
                    <p className="serif mt-3 text-2xl italic leading-tight">
                      “{p.nota}”
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Diario */}
        <section
          id="diario"
          tabIndex={-1}
          className="scroll-mt-20 border-t border-[var(--linea)] px-4 py-28 outline-none sm:px-8 md:py-40 lg:px-12"
        >
          <div className="mb-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Rotulo numero={9} nombre="Diario" />
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 className="serif text-[clamp(2.8rem,5.5vw,5rem)]">
                Notas <em>de taller</em>
              </h2>
              <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-[var(--carbon)]/75">
                Lo que aprendemos en cada obra, escrito por quienes la dirigen.
              </p>
            </div>
          </div>
          <Diario />
        </section>

        {/* Contacto */}
        <section
          id="contacto"
          data-oscuro
          tabIndex={-1}
          className="sobre-oscuro scroll-mt-20 bg-[var(--carbon)] px-4 pt-28 pb-16 text-[var(--hueso)] outline-none sm:px-8 md:pt-40 lg:px-12"
        >
          <Rotulo numero={10} nombre="Contacto" claro />
          <h2 className="serif mt-10 text-[clamp(4rem,14vw,13rem)] leading-[0.85]">
            Conversemos<em>.</em>
          </h2>
          <div className="mt-14 grid gap-12 border-t border-[var(--linea-clara)] pt-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="max-w-md text-[0.95rem] leading-relaxed text-[var(--hueso)]/75">
                La primera reunión es sin cargo. Contanos qué querés hacer y
                salís con una primera idea de plazos, costos y próximos pasos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <AbrirCapa capa="agendar" className="boton">
                  Agendar primera reunión
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </AbrirCapa>
                <AbrirCapa capa="clientes" className="boton-linea">
                  Área de clientes
                </AbrirCapa>
              </div>
              <div className="mt-12">
                <Dossier />
              </div>
            </div>
            <div className="grid gap-8 text-sm sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
              <address className="not-italic">
                <span className="etiqueta mb-3 block text-[var(--piedra-claro)]">
                  Estudio
                </span>
                {estudio.direccion}
                <br />
                {estudio.barrio}
                <span className="mono mt-2 block text-xs text-[var(--piedra-claro)]">
                  {estudio.coordenadas}
                </span>
              </address>
              <div>
                <span className="etiqueta mb-3 block text-[var(--piedra-claro)]">
                  Escribinos
                </span>
                <a href={`mailto:${estudio.correo}`} className="subrayado">
                  {estudio.correo}
                </a>
                <br />
                <a href={estudio.telefonoHref} className="subrayado">
                  {estudio.telefono}
                </a>
              </div>
              <div>
                <span className="etiqueta mb-3 block text-[var(--piedra-claro)]">
                  Horario
                </span>
                {estudio.horario}
                <span className="mt-2 block text-[var(--hueso)]/60">
                  Visitas al estudio con cita previa.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer data-oscuro className="sobre-oscuro bg-[var(--carbon)] px-4 pb-28 text-[var(--piedra-claro)] sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 border-t border-[var(--linea-clara)] pt-8 text-sm md:flex-row md:items-start md:justify-between">
          <div className="text-[var(--hueso)]">
            <Logo />
            <p className="mono mt-3 text-xs text-[var(--piedra-claro)]">
              © 2026 Estudio Faro · Montevideo, Uruguay
            </p>
          </div>
          <Newsletter />
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {estudio.redes.map((r) => (
              <li key={r.nombre}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="subrayado"
                >
                  {r.nombre}
                </a>
              </li>
            ))}
            <li>
              <a href="#trabajo" className="subrayado">
                Trabajá con nosotros
              </a>
            </li>
          </ul>
        </div>
        <CreditosFotos fotos={fotosFaro} className="mx-0! max-w-none!" />
      </footer>

      <Agendar />
      <AreaClientes />
      <BannerDemo oscuro />
    </ProveedorFaro>
  )
}
