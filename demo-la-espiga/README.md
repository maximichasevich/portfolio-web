# La Espiga · demo de panadería de barrio

Sitio de ejemplo de mi [portfolio](../portfolio/). El negocio es ficticio,
pero la página funciona como un sitio real pensado para vecinos, familias y gente mayor de Pocitos.

**Estilo.** Papel crema, kraft, pizarra con tiza y sello rojo. Fuentes Young Serif, Kalam y Atkinson Hyperlegible Next (pensada para baja visión). Texto grande, contraste alto y botón "Letra grande".

**Qué incluye**

- Estado "abierto ahora" con la hora real de Montevideo
- Carta tipo pizarra por pestañas, con filtros por alérgeno y fichas de producto
- Vitrina 3D, horno de ladrillo que se abre, sello que se da vuelta
- Torta configurable en 3D para encargos, con precio y porciones en vivo
- Promos del día, desayunos para regalar, pan de la semana y tarjeta de sellos
- Tu bolsa con retiro o envío y hora, Mis datos y Mis pedidos: el pedido se arma por WhatsApp

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
components/demos/espiga/Secciones y componentes de la demo
components/demos/       Aviso "Demo", créditos y lista de fotos (compartidos)
public/demos/           Fotos
```

## Publicar

En Netlify, creá un sitio con *Base directory* `demo-la-espiga`. El resto ya está
en `netlify.toml`. Ver [docs/publicar.md](../docs/publicar.md).
