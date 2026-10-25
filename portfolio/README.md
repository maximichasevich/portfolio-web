# Portfolio

Mi página principal para vender servicios de diseño y desarrollo web.
Estilo futurista nocturno con globo 3D interactivo, modelos 3D en CSS,
carrusel de ejemplos, cómo trabajo, servicios y precios, preguntas
frecuentes y formulario de contacto que guarda los mensajes en Supabase.

## Correrlo en tu computadora

```bash
npm install
cp .env.example .env.local   # y completá las claves de Supabase
npm run dev                  # http://localhost:3000
```

Sin las claves de Supabase la página funciona igual. Solo el formulario
muestra un aviso y ofrece WhatsApp o correo.

Para ver la velocidad real del sitio publicado:

```bash
npm run build
npm start
```

Otros comandos: `npm run lint` (revisión de código) y `npm run typecheck`.

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Nombre, correo, WhatsApp, textos de servicios, razones y preguntas | `data/perfil.ts` |
| Paquetes, precios y servicios extra | `data/precios.ts` |
| Etapas de "Cómo trabajo" y ejemplos del carrusel | `data/trabajo.ts` |
| Tarjetas de proyectos | `data/proyectos.ts` |
| **Direcciones de las demos y del portfolio** | `config/sitios.ts` (o variables de entorno) |
| Capturas del carrusel y de las tarjetas | `public/portfolio/` y `public/proyectos/` |

Si reemplazás una imagen, usá un nombre de archivo nuevo. Next.js y el
navegador guardan copias según el nombre y seguirían mostrando la anterior.

## Variables de entorno

Están listadas en `.env.example`. En tu computadora van en `.env.local`,
que nunca se sube a git. En Netlify se cargan en *Site configuration >
Environment variables*.

| Variable | Para qué |
|---|---|
| `SUPABASE_URL` | Dirección del proyecto de Supabase |
| `SUPABASE_ANON_KEY` | Clave pública (anon o publishable) de Supabase |
| `MENSAJES_SAL` | Texto secreto al azar para la huella anónima del límite de envíos |
| `NEXT_PUBLIC_SITE_URL` | Dirección pública del portfolio, por ejemplo tu dominio |
| `NEXT_PUBLIC_DEMO_*_URL` | Direcciones publicadas de las tres demos |

## Formulario de contacto

- **Dónde se guarda:** en la tabla `mensajes` de Supabase. El código para crearla está en `../supabase/migrations/`.
- **Cómo se guarda:** desde el servidor, con la acción de `app/acciones/contacto.ts`. Valida los datos y frena robots con un campo trampa invisible, un tiempo mínimo de 3 segundos y un límite de 5 mensajes por hora por visitante (100 por hora en total).
- **Seguridad:** la tabla solo permite insertar mensajes con la clave pública. Los mensajes se leen únicamente desde el panel de Supabase.

## Estructura

```
app/            Páginas, metadatos (sitemap, robots, imagen para redes) y acciones
components/     Secciones de la portada (inicio/), componentes de UI e idioma
config/         Direcciones de los sitios
data/           Textos, precios y datos editables
hooks/          Hooks reutilizables
lib/            Utilidades y cliente de Supabase
public/         Imágenes
```
