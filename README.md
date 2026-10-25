# Maximiliano Michasevich · Portfolio web

Diseño y desarrollo de páginas web a medida desde Montevideo, Uruguay.

Este repositorio tiene **cuatro sitios independientes**: mi portfolio, donde
ofrezco mis servicios, y tres sitios de ejemplo completos, cada uno pensado
para un rubro y un público distintos. Cada carpeta es un proyecto Next.js que
se compila y se publica por separado.

| Carpeta | Qué es | Público |
|---|---|---|
| [`portfolio/`](portfolio/) | Mi página principal: servicios, precios, ejemplos y contacto | Empresas y emprendedores |
| [`demo-la-espiga/`](demo-la-espiga/) | Panadería de barrio con pedidos por WhatsApp | Vecinos, familias, gente mayor |
| [`demo-estudio-faro/`](demo-estudio-faro/) | Estudio de arquitectura editorial | Clientes de alto nivel |
| [`demo-verde-tienda/`](demo-verde-tienda/) | Tienda online de plantas | Jóvenes que compran por celular |

Los negocios de las demos son ficticios. Las fotos son de Wikimedia Commons
con licencias libres y cada demo muestra sus créditos.

## Tecnología

- [Next.js 16](https://nextjs.org) con App Router, React 19 y TypeScript.
- Tailwind CSS 4 y componentes de shadcn/ui, Magic UI, Aceternity y React Bits.
- Modelos 3D hechos con CSS 3D y WebGL liviano (globo con cobe), sin librerías pesadas.
- [Supabase](https://supabase.com) para guardar los mensajes del formulario de contacto del portfolio.
- Publicado en [Netlify](https://www.netlify.com): un sitio por carpeta.

## Correr un proyecto en tu computadora

Necesitás [Node.js](https://nodejs.org) 20 o más nuevo.

```bash
cd portfolio          # o demo-la-espiga, demo-estudio-faro, demo-verde-tienda
npm install
npm run dev           # abre http://localhost:3000
```

Cada carpeta tiene su propio README con más detalle.

## Estructura

```
.
├── portfolio/            Página principal (usa Supabase)
├── demo-la-espiga/       Demo 1
├── demo-estudio-faro/    Demo 2
├── demo-verde-tienda/    Demo 3
├── supabase/mensajes.sql Tabla y reglas de seguridad de los mensajes
└── docs/                 Guía de publicación y notas de diseño
```

## Publicar

Los pasos completos, de Supabase a GitHub, Netlify y el dominio propio, están
en [`docs/publicar.md`](docs/publicar.md).

## Código compartido

Las demos comparten algunas piezas chicas: el aviso "Demo", el selector de
idioma, el botón de WhatsApp y los créditos de fotos. Cada proyecto tiene su
propia copia, para que se pueda compilar y publicar solo, sin configuraciones
de monorepo. Si cambiás una de esas piezas, cambiala en cada carpeta.
