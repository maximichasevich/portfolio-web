"use client"

import { useEffect, useRef } from "react"

import { useBucle } from "@/components/demos/verde/bucle"
import { MacetaDibujo, PlantaDibujo } from "@/components/demos/verde/planta-svg"

/*
 * Dos plantitas sticker en el collage de la portada que se inclinan hacia
 * donde va el cursor, como si soplara una brisa. La inclinación se escribe
 * en la variable --brisa dentro de requestAnimationFrame (sin re-renderizar)
 * y el bucle se duerme cuando la portada sale de pantalla.
 */

const macetas = [
  { id: "cactus", maceta: "ceramica", color: "#ffbfd4", clase: "left-[1%] top-[2%] w-[24%]", flex: 1 },
  { id: "lavanda", maceta: "barro", clase: "-right-[3%] top-[30%] w-[25%]", flex: -0.8 },
]

export function BrisaPortada() {
  const raizRef = useRef<HTMLDivElement>(null)
  const vientoRef = useRef({ brisa: 0, objetivo: 0, empuje: 0, x: -1 })

  const despertar = useBucle(raizRef, (dt) => {
    const v = vientoRef.current
    const k = dt / 16.7
    v.empuje *= Math.pow(0.9, k)
    const meta = Math.max(-1.2, Math.min(1.2, v.objetivo + v.empuje))
    v.brisa += (meta - v.brisa) * Math.min(1, 0.08 * k)
    raizRef.current?.style.setProperty("--brisa-raiz", v.brisa.toFixed(3))
    return Math.abs(meta - v.brisa) > 0.003 || Math.abs(v.empuje) > 0.01
  })

  useEffect(() => {
    function mover(e: PointerEvent) {
      if (e.pointerType !== "mouse") return
      const v = vientoRef.current
      v.objetivo = (e.clientX / window.innerWidth - 0.5) * 1.2
      if (v.x >= 0) v.empuje += (e.clientX - v.x) * 0.012
      v.x = e.clientX
      despertar()
    }
    window.addEventListener("pointermove", mover, { passive: true })
    return () => window.removeEventListener("pointermove", mover)
  }, [despertar])

  return (
    <div
      ref={raizRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {macetas.map((m, i) => (
        <div key={m.id} className={`pointer-events-auto absolute ${m.clase}`}
          onPointerDown={() => {
            vientoRef.current.empuje += i ? -0.9 : 0.9
            despertar()
          }}
        >
          <div
            className="vt-brisa-portada"
            style={{ "--brisa": `calc(var(--brisa-raiz, 0) * ${m.flex})` } as React.CSSProperties}
          >
            <div className="vt-mece-portada vt-anim" style={{ animationDelay: `${-i * 1.3}s` }}>
              <PlantaDibujo id={m.id} className="relative z-[1] -mb-[18%] w-full" />
              <MacetaDibujo tipo={m.maceta} color={m.color} className="mx-auto w-[62%]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
