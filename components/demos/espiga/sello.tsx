import { cn } from "@/lib/utils"

/**
 * Logo de La Espiga: un sello redondo de almacén, dibujado en SVG.
 * Toma el color del texto (currentColor). `id` tiene que ser único en la
 * página porque el texto curvo usa trazados con id.
 */
export function Sello({
  id,
  className,
  titulo = true,
}: {
  id: string
  className?: string
  /** false: solo la espiga en el centro, para tamaños chicos. */
  titulo?: boolean
}) {
  const granos = [0, 1, 2, 3]
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("sello notranslate", className)}
      role="img"
      aria-label="La Espiga, panadería artesanal. Pocitos, desde 1987"
    >
      <defs>
        <path id={`${id}-arriba`} d="M 27 100 A 73 73 0 0 1 173 100" />
        <path id={`${id}-abajo`} d="M 17 100 A 83 83 0 0 0 183 100" />
      </defs>
      <circle
        cx="100"
        cy="100"
        r="96"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <circle
        cx="100"
        cy="100"
        r="89"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="100"
        cy="100"
        r="62"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 4"
      />
      <g
        fill="currentColor"
        fontSize="12.5"
        fontWeight="700"
        letterSpacing="2.2"
        className="sello-texto"
      >
        <text textAnchor="middle">
          <textPath href={`#${id}-arriba`} startOffset="50%">
            PANADERÍA ARTESANAL
          </textPath>
        </text>
        <text textAnchor="middle">
          <textPath href={`#${id}-abajo`} startOffset="50%">
            POCITOS · DESDE 1987
          </textPath>
        </text>
      </g>
      <circle cx="21" cy="100" r="3" fill="currentColor" />
      <circle cx="179" cy="100" r="3" fill="currentColor" />

      {/* Espiga */}
      <g
        transform={titulo ? "translate(0 -6)" : "translate(0 34)"}
        fill="currentColor"
      >
        <path
          d="M100 92 V50"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <ellipse cx="100" cy="47" rx="3.6" ry="7" />
        {granos.map((i) => (
          <g key={i}>
            <ellipse
              cx="94"
              cy={57 + i * 9}
              rx="3.4"
              ry="7"
              transform={`rotate(-32 94 ${57 + i * 9})`}
            />
            <ellipse
              cx="106"
              cy={57 + i * 9}
              rx="3.4"
              ry="7"
              transform={`rotate(32 106 ${57 + i * 9})`}
            />
          </g>
        ))}
      </g>
      {titulo && (
        <text
          x="100"
          y="128"
          textAnchor="middle"
          fill="currentColor"
          fontSize="23"
          className="sello-marca"
        >
          La Espiga
        </text>
      )}
    </svg>
  )
}
