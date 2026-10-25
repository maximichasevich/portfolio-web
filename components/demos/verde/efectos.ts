/*
 * Microinteracciones de Verde Tienda escritas directo en el DOM con la Web
 * Animations API: no re-renderizan React y solo animan transform y opacity.
 * Son cortas y se disparan por una acción de la persona, así que corren
 * también con "reducir movimiento" (lo pidió el dueño de la tienda).
 */

const TINTA = "#1f2a22"
const COLORES = ["#ff6542", "#ffd84d", "#cbbcff", "#ffbfd4", "#b8ead0", "#b6dcff", "#ffcf9e"]

function visible(el: Element) {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0
}

function botonCarrito() {
  return [...document.querySelectorAll("[data-vt-carrito]")].find(visible) ?? null
}

/** El botón del carrito pega un saltito. */
export function saltarCarrito() {
  const el = botonCarrito()
  if (!el) return
  el.animate(
    [
      { transform: "translateY(0) scale(1) rotate(0)" },
      { transform: "translateY(-9px) scale(1.12) rotate(-7deg)", offset: 0.35 },
      { transform: "translateY(1px) scale(0.95) rotate(4deg)", offset: 0.65 },
      { transform: "translateY(0) scale(1) rotate(0)" },
    ],
    { duration: 520, easing: "cubic-bezier(.3,.7,.4,1)" }
  )
}

/**
 * Una burbujita con la foto de la planta vuela desde el botón que se tocó
 * hasta el carrito, y el carrito salta al recibirla.
 */
export function volarAlCarrito(origen: Element | null | undefined, foto: string) {
  const destino = botonCarrito()
  if (!origen || !destino || !visible(origen)) {
    saltarCarrito()
    return
  }
  const a = origen.getBoundingClientRect()
  const b = destino.getBoundingClientRect()
  const tam = 52
  const x0 = a.left + a.width / 2 - tam / 2
  const y0 = a.top + a.height / 2 - tam / 2
  const x1 = b.left + b.width / 2 - tam / 2
  const y1 = b.top + b.height / 2 - tam / 2
  const burbuja = document.createElement("div")
  burbuja.setAttribute("aria-hidden", "true")
  Object.assign(burbuja.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${tam}px`,
    height: `${tam}px`,
    borderRadius: "999px",
    border: `2px solid ${TINTA}`,
    background: `#fffdf8 url("${foto}") center / cover`,
    boxShadow: `2px 2px 0 ${TINTA}`,
    zIndex: "90",
    pointerEvents: "none",
    willChange: "transform, opacity",
  })
  document.body.appendChild(burbuja)
  const medioX = (x0 + x1) / 2
  const medioY = Math.min(y0, y1) - 90
  const anim = burbuja.animate(
    [
      { transform: `translate(${x0}px, ${y0}px) scale(0.6)`, opacity: 0 },
      { transform: `translate(${x0}px, ${y0 - 10}px) scale(1.05)`, opacity: 1, offset: 0.15 },
      { transform: `translate(${medioX}px, ${medioY}px) scale(0.9) rotate(-20deg)`, offset: 0.55 },
      { transform: `translate(${x1}px, ${y1}px) scale(0.35) rotate(10deg)`, opacity: 0.9 },
    ],
    { duration: 720, easing: "cubic-bezier(.45,.05,.55,.95)" }
  )
  anim.onfinish = () => {
    burbuja.remove()
    saltarCarrito()
  }
  anim.oncancel = () => burbuja.remove()
}

/** El corazón late y suelta corazoncitos. */
export function latido(el: Element) {
  el.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.35)", offset: 0.25 },
      { transform: "scale(0.9)", offset: 0.5 },
      { transform: "scale(1.12)", offset: 0.75 },
      { transform: "scale(1)" },
    ],
    { duration: 520, easing: "ease-out" }
  )
  const r = el.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const n = 7
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span")
    p.setAttribute("aria-hidden", "true")
    p.innerHTML =
      '<svg viewBox="0 0 24 24" width="12" height="12"><path d="M12 21s-7-4.4-9.3-9C1 8.3 3.3 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.7 0 6 3.8 4.3 7.5C19 16.6 12 21 12 21Z" fill="' +
      COLORES[i % 4] +
      '" stroke="#1f2a22" stroke-width="2.4"/></svg>'
    Object.assign(p.style, {
      position: "fixed",
      left: `${cx - 6}px`,
      top: `${cy - 6}px`,
      width: "12px",
      height: "12px",
      zIndex: "90",
      pointerEvents: "none",
    })
    document.body.appendChild(p)
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2
    const dist = 26 + Math.random() * 10
    const anim = p.animate(
      [
        { transform: "translate(0,0) scale(0.4)", opacity: 1 },
        {
          transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(1) rotate(${(Math.random() - 0.5) * 60}deg)`,
          opacity: 1,
          offset: 0.6,
        },
        {
          transform: `translate(${Math.cos(ang) * dist * 1.3}px, ${Math.sin(ang) * dist * 1.3 + 8}px) scale(0.2)`,
          opacity: 0,
        },
      ],
      { duration: 640, easing: "cubic-bezier(.2,.8,.3,1)" }
    )
    anim.onfinish = () => p.remove()
    anim.oncancel = () => p.remove()
  }
}

/** Confeti liviano: 70 papelitos que caen y se borran solos. */
export function confeti() {
  const capa = document.createElement("div")
  capa.setAttribute("aria-hidden", "true")
  Object.assign(capa.style, {
    position: "fixed",
    inset: "0",
    zIndex: "100",
    pointerEvents: "none",
    overflow: "hidden",
  })
  document.body.appendChild(capa)
  const ancho = window.innerWidth
  const alto = window.innerHeight
  const total = ancho < 640 ? 50 : 70
  let pendientes = total
  for (let i = 0; i < total; i++) {
    const p = document.createElement("span")
    const w = 7 + Math.random() * 7
    const redondo = Math.random() < 0.3
    Object.assign(p.style, {
      position: "absolute",
      left: "0",
      top: "0",
      width: `${w}px`,
      height: `${redondo ? w : w * 0.55}px`,
      borderRadius: redondo ? "999px" : "2px",
      background: COLORES[i % COLORES.length],
      border: `1.5px solid ${TINTA}`,
    })
    capa.appendChild(p)
    // Salen desde dos "cañones" arriba a los costados y desde el centro.
    const x0 = [ancho * 0.15, ancho * 0.5, ancho * 0.85][i % 3]
    const y0 = -20
    const x1 = x0 + (Math.random() - 0.5) * ancho * 0.7
    const y1 = alto * (0.55 + Math.random() * 0.5)
    const giro = (Math.random() - 0.5) * 900
    const dur = 1500 + Math.random() * 900
    const anim = p.animate(
      [
        { transform: `translate(${x0}px, ${y0}px) rotate(0deg)`, opacity: 1 },
        {
          transform: `translate(${(x0 + x1) / 2}px, ${y1 * 0.45}px) rotate(${giro / 2}deg)`,
          opacity: 1,
          offset: 0.4,
        },
        { transform: `translate(${x1}px, ${y1}px) rotate(${giro}deg)`, opacity: 0 },
      ],
      { duration: dur, delay: Math.random() * 180, easing: "cubic-bezier(.2,.6,.4,1)", fill: "backwards" }
    )
    const fin = () => {
      pendientes -= 1
      if (pendientes <= 0) capa.remove()
    }
    anim.onfinish = fin
    anim.oncancel = fin
  }
}

/** Sacudón corto (por ejemplo, cupón inválido). */
export function sacudir(el: Element) {
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-3px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 360, easing: "ease-out" }
  )
}
