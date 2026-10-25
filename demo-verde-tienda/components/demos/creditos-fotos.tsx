import type { Foto } from "@/lib/demo"

/**
 * Créditos de las fotos de una demo. Las licencias CC BY y CC BY-SA piden
 * nombrar al autor y la licencia; va plegado para no ensuciar el pie.
 */
export function CreditosFotos({
  fotos,
  className = "",
}: {
  fotos: Record<string, Foto>
  className?: string
}) {
  const lista = Object.values(fotos)
  return (
    <details className={`mx-auto mt-6 max-w-6xl text-xs ${className}`}>
      <summary className="cursor-pointer select-none opacity-80 hover:opacity-100">
        Créditos de las fotos ({lista.length})
      </summary>
      <ul className="mt-3 grid gap-x-6 gap-y-1.5 opacity-80 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((f) => (
          <li key={f.src} className="min-w-0 truncate">
            <a
              href={f.fuente}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {f.autor}
            </a>{" "}
            · {f.licencia}
          </li>
        ))}
      </ul>
      <p className="mt-3 opacity-70">
        Fotos de Wikimedia Commons usadas como ejemplo. No son obras ni
        productos del negocio.
      </p>
    </details>
  )
}
