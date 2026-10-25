# Verde Tienda · demo de tienda online de plantas

Sitio de ejemplo de mi [portfolio](../portfolio/). El negocio es ficticio,
pero la página funciona como un sitio real pensado para jóvenes de 20 a 35 años que compran desde el celular, muchos principiantes.

**Estilo.** E-commerce juvenil: bloques de color, stickers con borde de tinta y formas orgánicas. Fuentes Bricolage Grotesque y Figtree.

**Qué incluye**

- Maceta 3D configurable (planta, tamaño, maceta y color) y "Probala en tu casa"
- Buscador con sugerencias, mega menú, catálogo con filtros, comparador y favoritos
- Ficha de producto con galería, reseñas, preguntas, stock y "Avisame"
- Carrito con cupones, compra en 4 pasos con Mercado Pago simulado y opción de regalo
- Mi cuenta: datos, direcciones, seguimiento de pedidos, recordatorios de riego y club de puntos
- Quiz "¿Qué planta va con vos?", medidor de luz, guía de cuidados y suscripción mensual

Todo lo que guarda el visitante (carrito, datos, pedidos) queda en su
navegador con `localStorage`. No usa base de datos ni cobra nada.

## Correrlo en tu computadora

```bash
npm install
npm run dev        # http://localhost:3000
```

Para la versión optimizada: `npm run build` y después `npm start`.

## Configuración

`config/sitio.ts` tiene el nombre del negocio, la dirección de esta demo,
la del portfolio (para el aviso "Volver al portfolio") y mi WhatsApp para el
botón "¿Querés una página así?". Las direcciones también se pueden definir
con las variables de `.env.example`.

## Estructura

```
app/layout.tsx          Base del sitio: fuente, estilos globales, botón de WhatsApp
app/(sitio)/            Diseño, estilos y páginas propias de la demo
app/icon.tsx            Ícono de la pestaña
components/demos/verde/ Secciones y componentes de la demo
components/demos/       Aviso "Demo", créditos y lista de fotos (compartidos)
public/demos/           Fotos
```

## Publicar

En Netlify, creá un sitio con *Base directory* `demo-verde-tienda`. El resto ya está
en `netlify.toml`. Ver [docs/publicar.md](../docs/publicar.md).
