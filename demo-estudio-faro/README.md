# Estudio Faro · demo de estudio de arquitectura

Sitio de ejemplo de mi [portfolio](../portfolio/). El negocio es ficticio,
pero la página funciona como un sitio real pensado para propietarios de alto nivel, desarrolladores inmobiliarios y clientes comerciales.

**Estilo.** Editorial de lujo monocromo: hueso, carbón y un único acento latón. Fuentes Cormorant Garamond, DM Mono y Hanken Grotesk. Fotografía a pantalla completa y menú de pantalla completa.

**Qué incluye**

- Maqueta axonométrica 3D con vistas, capas, separación de niveles y estudio solar
- Corte de una casa con el recorrido del sol por estación y comparador croquis/obra
- Obras con filtros, parallax y ficha con memoria, planta, materiales y visor
- Mapa de obras, estimador orientativo de costo en USD y preguntas sobre honorarios
- Área de clientes de demostración con seguimiento de obra y agenda de reunión en 5 pasos
- Diario, búsquedas laborales, descarga de dossier en PDF y newsletter

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
components/demos/faro/  Secciones y componentes de la demo
components/demos/       Aviso "Demo", créditos y lista de fotos (compartidos)
public/demos/           Fotos
```

## Publicar

En Netlify, creá un sitio con *Base directory* `demo-estudio-faro`. El resto ya está
en `netlify.toml`. Ver [docs/publicar.md](../docs/publicar.md).
