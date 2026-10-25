import { Star } from "lucide-react"

import { opiniones } from "@/components/demos/espiga/contenido"
import { Inclinable } from "@/components/demos/espiga/tres-d"
import { whatsappDemo } from "@/lib/demo"

const giros = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1", "rotate-1"]
const fondos = ["#fffaf0", "#fdf3c4", "#fffaf0", "#f6e3d3", "#fdf3c4", "#fffaf0"]

/** Opiniones de vecinos, como papelitos pinchados en el corcho. */
export function Opiniones() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <p className="titulo text-[3.2rem] leading-none">4,8</p>
        <div>
          <p
            className="flex gap-0.5 text-[var(--rojo)]"
            role="img"
            aria-label="4,8 de 5 estrellas"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-6 fill-current" aria-hidden="true" />
            ))}
          </p>
          <p className="text-[var(--tinta-70)]">
            213 opiniones de vecinos en Google
          </p>
        </div>
      </div>

      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {opiniones.map((o, i) => (
          <li key={o.nombre} className={giros[i % giros.length]}>
            <Inclinable
              as="figure"
              className="sombra-papel relative h-full px-6 pt-8 pb-6"
              style={{ background: fondos[i % fondos.length] }}
            >
              <span className="chinche" aria-hidden="true" />
              <p
                className="flex gap-0.5 text-[var(--rojo)]"
                role="img"
                aria-label={`${o.estrellas} de 5 estrellas`}
              >
                {Array.from({ length: 5 }, (_, k) => (
                  <Star
                    key={k}
                    className={k < o.estrellas ? "size-5 fill-current" : "size-5"}
                    aria-hidden="true"
                  />
                ))}
              </p>
              <blockquote className="mt-3 text-[1.1rem] leading-relaxed">
                “{o.texto}”
              </blockquote>
              <figcaption className="mt-4">
                <span className="tiza block text-[1.45rem] text-[var(--rojo)]">
                  {o.nombre}
                </span>
                <span className="block text-[0.95rem] text-[var(--tinta-70)]">
                  {o.barrio}
                </span>
              </figcaption>
            </Inclinable>
          </li>
        ))}
      </ul>

      <p className="mt-10">
        <a
          href={whatsappDemo("¡Hola, La Espiga! Les quiero dejar mi opinión: ")}
          target="_blank"
          rel="noopener noreferrer"
          className="boton-borde rounded-md px-5"
        >
          Contanos qué te pareció
        </a>
      </p>
    </div>
  )
}
