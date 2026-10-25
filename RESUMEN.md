# Resumen del trabajo: portfolio "Órbita"

De las tres propuestas iniciales (Titular, Afiche y Órbita) quedó **Órbita**,
que ahora vive en `/`. Las otras dos rutas, sus componentes y las
dependencias que solo usaban ellas (`gsap`, `matter-js`, `ogl`) se borraron.

Es un portfolio en español, oscuro, pensado primero para celular, con título
y descripción para Google, imagen para compartir en redes y respeto por la
preferencia de "reducir movimiento" del sistema.

## Dónde se cambian los datos

- `data/perfil.ts`: nombre, email, **WhatsApp** (está marcado con un `TODO`:
  poné el número con código de país y sin espacios, por ejemplo
  `59899123456`), la **URL del sitio** (`url`, cambiala cuando tengas
  dominio), la descripción para Google, los textos de servicios, los pasos
  del proceso, las razones y las preguntas frecuentes.
- `data/proyectos.ts`: los proyectos (título, descripción, imagen,
  tecnologías, link, tipo, año, color). Para agregar uno, copiá un bloque y
  subí la imagen a `public/proyectos/`. No hay que tocar ningún diseño.

Las imágenes de las tarjetas de "Trabajos" son capturas reales de las
portadas de cada demo (`public/proyectos/*.webp`, 1200×800). Si cambiás una
demo, volvé a sacar la captura.

## Fotos de las demos

Los productos de La Espiga, las plantas de Verde Tienda y las obras de
Estudio Faro usan fotos reales de Wikimedia Commons con licencias libres
(CC0, CC BY y CC BY-SA). Están en `public/demos/` en WebP y sus créditos en
`components/demos/fotos.ts`. Cada demo muestra los créditos plegados en el
pie, porque las licencias CC BY y CC BY-SA piden nombrar al autor. Son fotos
de ejemplo: no son obras ni productos de esos negocios, y el pie lo aclara.

## Rendimiento

La portada se trababa y empeoraba al bajar. Las causas y los arreglos:

- `components/ui/dot-pattern.tsx`: el fondo de puntos de "Trabajos" animaba
  casi 1.800 círculos con JavaScript a la vez. Ahora la grilla es un patrón
  SVG estático y solo 48 puntos titilan con CSS.
- `components/ui/particles.tsx`: creaba el doble de partículas y se volvía a
  renderizar con cada movimiento del mouse. Ahora no, y se pausa fuera de
  pantalla o con la pestaña oculta.
- `components/ui/globe.tsx`: el globo dibujaba en WebGL sin parar. Ahora se
  pausa fuera de pantalla o con la pestaña oculta, y limita la densidad de
  píxeles.
- Menos partículas y menos puntos en el mapa del globo, sin cambio visible.

Medido con el navegador: de 2 a 24 cuadros por segundo con picos de 800 ms,
a unos 160 estables con el peor cuadro en 12 ms.

Importante: `npm run dev` siempre es más lento que el sitio real. Para ver
la velocidad verdadera usá `npm run build` y después `npm start`.

## La página

**Concepto.** Una noche despejada: fondo casi negro, estrellas que se mueven
con el mouse, paneles de vidrio y una luz violeta y cian que recorre toda la
página. Transmite que lo moderno está al alcance de cualquier negocio.

**Tipografía.** Syne (display ancha) para títulos; Geist para texto.

**Secciones** (`components/inicio/`): Portada, cinta de "qué incluye", Qué
hago, Por qué trabajar conmigo, Trabajos, Cómo trabajamos, Preguntas
frecuentes y Contacto.

**Efectos interactivos.**
- Barra de progreso de scroll con `ScrollProgress` (magicui) en el borde
  superior.
- Portada: globo terráqueo nocturno con `Globe` (magicui, librería cobe) con
  Montevideo marcado en cian, se puede girar con el mouse; dos anillos de
  satélites con `OrbitingCircles` (magicui) que muestran lo que incluye una
  página; grilla que se enciende por sectores con `AnimatedGridPattern`
  (magicui); dos capas de `Particles` (magicui) con parallax; `Spotlight`
  (aceternity); `BlurText` (react-bits) en el titular; `GradientText`
  (react-bits) en la presentación; `WordRotate` (magicui) rotando "negocios,
  profesionales, tiendas online…"; botón principal con `ShimmerButton`
  (magicui).
- Cinta: `Marquee` (magicui) con las siete cosas que incluye cada página,
  se frena al pasar el mouse.
- Qué hago: tres `PixelCard` (react-bits) con ícono, borde de luz con
  `ShineBorder` (magicui) y entrada con `BlurFade` (magicui).
- Por qué conmigo: cuatro `MagicCard` (magicui) con foco que sigue al mouse
  y título fijo (sticky) en escritorio.
- Trabajos: tarjetas 3D (aceternity) con `ShineBorder` en el color de cada
  proyecto, degradado sobre la imagen y fondo de puntos que titilan con
  `DotPattern` (magicui).
- Cómo trabajamos: `TracingBeam` (aceternity) más íconos por paso y un halo
  al pasar el mouse por cada tarjeta.
- Preguntas frecuentes: acordeón de shadcn (`Accordion`) sobre panel de
  vidrio.
- Contacto: dos `BorderBeam` (magicui) recorriendo el borde del panel,
  `Meteors` (magicui) y `ShimmerButton` para WhatsApp.

**Detalle sorpresa.** `ClickSpark` (react-bits) envuelve toda la página:
cada clic suelta un destello de estrellas violeta y cian.

## Para Google y para compartir

- `app/opengraph-image.tsx`: la imagen que aparece al compartir el link por
  WhatsApp, Instagram o LinkedIn. Se genera en el build con la misma paleta
  de la portada (globo con dos órbitas, titular y tu nombre). Sirve también
  para la tarjeta de X/Twitter.
- `app/icon.tsx` y `app/apple-icon.tsx`: favicon y el ícono para "agregar a
  pantalla de inicio" en el celular, con la "M." de la barra. Reemplazan al
  favicon de Next.
- `app/sitemap.ts` y `app/robots.ts`: el sitemap solo lista `/`. Las demos no
  están bloqueadas en robots a propósito: están marcadas `noindex` y Google
  tiene que poder leerlas para respetar esa marca.
- `app/layout.tsx`: `lang="es"`, modo oscuro forzado, metadatos base (título
  con plantilla, descripción, Open Graph, robots) leídos de `data/perfil.ts`.

## Sitios de ejemplo (los tres proyectos, navegables)

Desde "Trabajos" se abren en una pestaña nueva. Cada uno tiene una pastilla
"Demo" abajo a la izquierda que se despliega con "Volver al portfolio", su
propio ícono de pestaña (`icon.tsx` en su carpeta) y su título sin el nombre
del portfolio. Están marcados `noindex`. Cada demo tiene identidad propia,
pensada para su público:

- **La Espiga** (`/proyectos/la-espiga`): panadería de barrio para vecinos y
  gente mayor. Papel crema, kraft, pizarra con tiza y sello rojo. Fuentes
  Young Serif, Kalam y Atkinson Hyperlegible Next. Estado "abierto ahora"
  con la hora de Montevideo, carta por pestañas, "El horno hoy", encargos de
  tortas y botón "Letra grande". Menús: Tu bolsa (hora de retiro o envío,
  pedido por WhatsApp), Mis datos y Mis pedidos con "Repetir pedido".
  Archivos: `components/demos/espiga/`.
- **Estudio Faro** (`/proyectos/estudio-faro`): arquitectura para clientes de
  alto nivel. Editorial monocromo con fotos a pantalla completa. Fuentes
  Cormorant Garamond, DM Mono y Hanken Grotesk. Menú de pantalla completa,
  portada en fundido, obras con ficha técnica y navegación por teclado.
  Menús: Área de clientes (seguimiento de obra de demostración) y Agendar
  primera reunión en 5 pasos. Archivos: `components/demos/faro/`.
- **Verde Tienda** (`/proyectos/verde-tienda`): tienda online para público
  joven. Bloques de color, stickers y formas orgánicas. Fuentes Bricolage
  Grotesque y Figtree. Buscador con sugerencias, mega menú, vista rápida con
  tamaño y maceta, quiz "¿Qué planta va con vos?" y guía de cuidados. Menús:
  Carrito, Favoritos, Mi cuenta (datos, direcciones, pedidos) y compra en 4
  pasos. Archivos: `components/demos/verde/`.

Todo lo que el visitante guarda (bolsa, datos, pedidos, favoritos) queda en
su navegador con localStorage; no se envía a ningún servidor.

Los precios, direcciones, nombres y teléfonos son inventados.

## Decisiones que tomé sin consultarte

1. **Paleta.** Noche, violeta y cian. Evité el "negro + verde ácido" porque
   es lo que más se repite en portfolios hechos con IA.
2. **Nombre corto en la barra.** "Maxi." como marca; el nombre completo va en
   la portada, el pie y la imagen de redes. Se cambia en `data/perfil.ts`
   (`nombreCorto`).
3. **Botón de WhatsApp sin número.** Mientras `whatsapp` esté vacío, abre
   WhatsApp con el mensaje precargado pero sin destinatario. Cuando pongas el
   número, va directo a tu chat.
4. **Imágenes locales.** Todas las fotos y capturas están dentro del
   proyecto, en WebP, así el sitio no depende de servicios externos.
   `next/image` las optimiza para cada tamaño de pantalla.
5. **Movimiento reducido.** Si el sistema lo pide, el globo, las partículas y
   el foco de luz no se montan; el resto de los componentes ya lo respetan.
   Hay una regla global en `app/globals.css` que acorta las animaciones CSS.
6. **Fondos pesados cargados aparte.** Globo y partículas se importan con
   `next/dynamic` sin SSR, así el HTML inicial y el texto llegan antes.
7. **Partículas en canvas 2D.** Usé `Particles` de magicui en vez de la de
   react-bits (WebGL 2) porque en un navegador sin aceleración gráfica el
   canvas se rompía y quedaba blanco. Un cliente puede abrir la página desde
   un celular viejo.
8. **Retoque a `BlurText`.** Envolvía el texto en un `<p>`, que dentro de un
   `<h1>` es HTML inválido; ahora usa un `<span>`.
9. **ESLint.** Los componentes copiados de las bibliotecas disparan reglas
   del compilador de React que no corregimos en código ajeno. En
   `eslint.config.mjs` relajé esas reglas solo para `components/ui/**` y
   `components/*.tsx`. Nuestro código se lintea completo y queda sin errores.
10. **Fuentes en las imágenes generadas.** La imagen de redes y los íconos
    usan la fuente por defecto del generador, no Syne, para que el build no
    dependa de descargar una fuente. Si querés Syne ahí, se puede cargar el
    archivo de la fuente desde `public/`.
11. **`AGENTS.md`** lo genera Next.js solo al levantar el servidor de
    desarrollo. Se puede desactivar con `agentRules: false` en
    `next.config.ts`.

## Cómo lo verifiqué

- `npm run build`: termina sin errores. Rutas: `/`, las tres demos,
  `/icon`, `/apple-icon`, `/opengraph-image`, `/robots.txt` y
  `/sitemap.xml`.
- `npm run typecheck`: sin errores. `npm run lint`: 0 errores, 3 avisos de
  variables sin usar dentro de componentes de las bibliotecas.
- Levanté el servidor de producción y descargué la imagen de redes y los dos
  íconos para mirarlos; revisé que el HTML de `/` lleve las etiquetas
  `og:image`, `twitter:image`, `icon` y `apple-touch-icon`.
- En sesiones anteriores: capturas de página completa a 375 px y 1440 px, sin
  desborde horizontal y sin errores en consola; portada con "reducir
  movimiento" activado.
- Lo que **no** pude verificar: cómo se ve el globo (WebGL) con una placa de
  video real, porque el navegador sin cabeza no lo renderiza. Miralo vos en
  el navegador y en el celular.

## Qué mejoraría después

1. **Proyectos reales.** Cuando tengas clientes reales, sus capturas van a
   pesar más que cualquier demo.
2. **Testimonios.** Una o dos frases de clientes con nombre y rubro, debajo
   de los proyectos. Cuando tengas alguna real, va en un `data/testimonios.ts`
   con el mismo esquema que los proyectos.
3. **Páginas por proyecto.** Un detalle corto por proyecto (problema,
   solución, resultado) suma para el SEO y para explicar qué hiciste.
4. **Formulario de contacto.** Además de WhatsApp, para quien prefiere
   escribir con calma. Necesita una ruta de API y un servicio de correo.
5. **Dominio y analítica.** Al publicar, cambiar `url` en `data/perfil.ts` y
   agregar algo de analítica para saber de dónde llega la gente.
6. **Lighthouse en celular.** Medir el peso de la portada (globo, partículas)
   con una conexión lenta y recortar si hace falta.

## Portada futurista (versión 2)

La portada profundiza el estilo "Órbita" con un lenguaje tipo HUD: marcos
con esquinas, etiquetas en mono (JetBrains Mono), líneas de escaneo,
indicadores en vivo y textos que se decodifican.

- **Menú tipo consola** (`components/inicio/menu-hud.tsx`): pantalla
  completa con secciones numeradas, estado de agenda, hora de Montevideo,
  WhatsApp, correo, copiar mail y accesos a las demos. Se abre con el botón
  "Menú", la tecla M o Ctrl + K. Ahora el celular tiene menú.
- **Barra** que marca la sección en la que estás.
- **Portada**: indicador "agenda abierta", contadores animados y lecturas
  tipo radar alrededor del globo.
- **Ejemplos en vivo** (`components/inicio/ejemplos.tsx`): carrusel 3D con
  cada demo en marco de navegador + iPhone (Magic UI). Avanza solo cada
  7 segundos, con pausa, flechas, teclado y deslizar. Al pasar el mouse
  sobre una tienda se destaca en su lugar y la ficha muestra sus datos;
  al sacar el mouse sigue el pase automático. Debajo, un muro 3D con 15
  pantallas reales que sube y baja. Las capturas están en `public/portfolio/`.
- **Cómo trabajo** (`components/inicio/como-trabajo.tsx`): 5 etapas
  interactivas con qué hacemos, qué recibís, qué necesito y duración; un
  diagrama con haces de luz (Magic UI) que muestra la página conectada con
  Google, Maps, WhatsApp, Mercado Pago e Instagram; y 4 compromisos. Los
  textos están en `data/trabajo.ts`.
- **Contacto**: configurador de pedido (qué necesitás, objetivos, plazo,
  nombre) con una terminal que arma el resumen en vivo y lo manda por
  WhatsApp o correo; y "qué pasa después".

El carrusel, el muro y las órbitas se mueven aunque el sistema pida reducir
movimiento, por pedido del dueño del sitio. El carrusel tiene botón de pausa.

## Traducción

Las cuatro páginas tienen un selector de idioma
(`components/idioma/selector-idioma.tsx`): en la barra del portfolio y al
lado de la pastilla "Demo" en cada demo. Ofrece 15 idiomas con traducción
automática de Google. El idioma elegido se guarda en una cookie y se
mantiene al pasar del portfolio a las demos. El script de Google solo se
descarga si alguien elige otro idioma; en español no se carga nada extra.
Los nombres de marca (Maxi., La Espiga, Faro, verde.) están marcados para
no traducirse. Es una traducción automática: sirve para entender todo,
pero no reemplaza una traducción profesional.

## Servicios y precios

Sección `#servicios` en la portada, entre "Cómo trabajo" y "Por qué
conmigo" (`components/inicio/precios.tsx`). Tres paquetes (landing desde
USD 150, sitio institucional desde USD 300 marcado "El más elegido", tienda
online desde USD 500), servicios extra y la nota sobre dominio y alojamiento.
Los textos y precios se editan en `data/precios.ts`. Cada "Pedir
presupuesto" abre WhatsApp con el paquete elegido ya escrito.

El número de WhatsApp (59892443629) está en `data/perfil.ts` y lo usan todos
los botones. El botón flotante (`components/whatsapp-flotante.tsx`) se monta
en `app/layout.tsx`, así aparece en las cuatro páginas; en las demos el
mensaje dice desde qué demo te escriben.

## Globo 3D interactivo

La escena de la portada (`components/inicio/globo-orbital.tsx`) es 3D de
verdad, sin librerías nuevas: el globo (cobe) y seis satélites en dos órbitas
inclinadas que pasan por delante y por detrás del planeta, con perspectiva
calculada en cada cuadro. Se gira arrastrando (mouse en los dos ejes, dedo
solo en horizontal para no trabar el scroll) o con las flechas del teclado,
con inercia. Pasar el mouse por un satélite lo destaca y frena las órbitas;
tocarlo lo fija y muestra qué significa en la ficha de abajo a la izquierda.
Se pausa fuera de pantalla. Reemplaza al globo con órbitas planas anterior.

## Más 3D, interacción y rendimiento

- **Modelos 3D nuevos** (`components/inicio/modelos-3d.tsx`, CSS 3D sin
  librerías): un cubo de capacidades en "Qué hago" que gira solo y se
  arrastra, y la "Anatomía de una web" en "Por qué conmigo": cinco capas que
  se separan al entrar en pantalla, se giran arrastrando y explican cada
  parte al pasar el mouse o tocarlas.
- **Interacciones** (`components/inicio/interacciones.tsx`): tarjetas que se
  inclinan en 3D hacia el cursor con reflejo de luz (servicios, razones,
  precios, compromisos y el carrusel), botones magnéticos en la portada y una
  luz suave que sigue al cursor. El título principal reacciona al mouse
  palabra por palabra (`titulo-vivo.tsx`) y los precios cuentan hasta su
  valor.
- **Optimización:** el haz de luz pasó de JavaScript a CSS, el globo 3D se
  monta después de la carga inicial, las capturas del carrusel se piden
  recién al acercarse, la segunda capa de partículas no se carga en celular,
  menos cuadros en la grilla y una variante menos de la fuente Syne.
  Lighthouse en celular: de 73 a 89 puntos, el contenido principal de 5,2 a
  3,7 s y el peso inicial de 795 a 462 KB.
