# Guía de publicación

Qué está publicado, dónde y cómo hacer cambios.

## Direcciones

| Sitio | Dirección | Sitio en Netlify | Carpeta |
|---|---|---|---|
| Portfolio | https://michasevich.com (y www) | `michasevich` | `portfolio/` |
| La Espiga | https://laespiga.michasevich.com | `michasevich-laespiga` | `demo-la-espiga/` |
| Estudio Faro | https://estudiofaro.michasevich.com | `michasevich-estudiofaro` | `demo-estudio-faro/` |
| Verde Tienda | https://verdetienda.michasevich.com | `michasevich-verdetienda` | `demo-verde-tienda/` |

Las direcciones `https://<sitio-en-netlify>.netlify.app` redirigen al dominio
propio. La regla está al final del `netlify.toml` de cada carpeta.

| Servicio | Dónde |
|---|---|
| Código | https://github.com/maximichasevich/portfolio-web (público) |
| Netlify | https://app.netlify.com (equipo "maximiliano") |
| Supabase | https://supabase.com/dashboard/project/wxldwtmnlwpdydexugse (proyecto "portfolio", São Paulo) |
| Dominio y DNS | Namecheap, BasicDNS, con reenvío de correo |

## Cómo publicar un cambio

1. Editá el código en tu computadora y probalo:
   ```bash
   cd portfolio            # o la carpeta de la demo
   npm run dev             # http://localhost:3000
   ```
2. Guardalo y subilo:
   ```bash
   git add -A
   git commit -m "Qué cambiaste"
   git push
   ```
3. Netlify compila y publica solo, en uno o dos minutos. Podés seguirlo en **Netlify → el sitio → Deploys**.

Cada `git push` avisa a los cuatro sitios. Netlify solo vuelve a publicar
los que tienen cambios en su carpeta. En los demás vas a ver *Canceled build
due to no content change*: es normal y el sitio sigue igual.

Si una publicación falla, el sitio sigue mostrando la versión anterior. El
error se ve en **Deploys → la publicación fallida → Deploy log**.

## Variables de entorno

Las claves nunca están en el código. Están en dos lugares:

| Variable | Tu computadora (`portfolio/.env.local`) | Netlify (sitio `michasevich`) |
|---|---|---|
| `SUPABASE_URL` | sí | sí |
| `SUPABASE_ANON_KEY` (clave pública "publishable") | sí | sí |
| `MENSAJES_SAL` (sal secreta del límite de envíos) | sí | sí |
| `SUPABASE_DB_PASSWORD` (solo para la CLI) | sí | no |

Las demos no usan variables. Sus direcciones y tu WhatsApp están en
`config/sitio.ts` de cada una, y las del portfolio en
`portfolio/config/sitios.ts`.

Para cambiar una variable en Netlify: **Site configuration → Environment
variables**, y después **Deploys → Trigger deploy → Deploy site**.

## Base de datos (Supabase)

- **Tabla:** `mensajes`, con id, fecha, nombre, correo, teléfono, paquete, mensaje, huella y leído. Está definida en `supabase/migrations/`.
- **Seguridad por filas:** la clave pública solo puede insertar. Nadie puede leer, editar ni borrar desde la página.
- **Límite de envíos:** 5 mensajes por hora por visitante y 100 por hora en total. La huella es un código SHA-256 de la IP con una sal secreta: la IP no se guarda.
- **Cambios de la tabla:** se crea un archivo nuevo en `supabase/migrations/` y se aplica con:
  ```bash
  npx supabase db push --linked
  ```
  Desde la carpeta raíz. La CLI pide la contraseña de la base, que está en `portfolio/.env.local`.

### Ver los mensajes del formulario

1. Entrá a https://supabase.com/dashboard/project/wxldwtmnlwpdydexugse
2. Menú de la izquierda: **Table Editor → mensajes**.
3. Cada fila es un mensaje. Ordenalos por `creado` para ver primero los nuevos.
4. Podés marcar la columna `leido` para llevar la cuenta.

Para recibir un aviso por correo cuando llega uno, usá **Database → Webhooks →
Create a new hook**, con la tabla `mensajes` y el evento *Insert*, apuntando
a un servicio de correo. Es opcional.

## Dominio (Namecheap)

Registros en **Advanced DNS**:

| Tipo | Host | Valor |
|---|---|---|
| A | @ | 75.2.60.5 |
| CNAME | www | michasevich.netlify.app |
| CNAME | laespiga | michasevich-laespiga.netlify.app |
| CNAME | estudiofaro | michasevich-estudiofaro.netlify.app |
| CNAME | verdetienda | michasevich-verdetienda.netlify.app |

Los registros MX y TXT del reenvío de correo de Namecheap no se tocaron. Los
nameservers siguen siendo los de Namecheap.

Netlify renueva los certificados HTTPS solo. Todo el tráfico `http://` se
redirige a `https://`.

### Agregar otra demo en un subdominio

1. Creá la carpeta, como copia de una demo, y subila a GitHub.
2. En Netlify: **Add new site → Import from Git**, con el repositorio y la carpeta como *Base directory*.
3. En **Domain management**, agregá `nombre.michasevich.com`.
4. En Namecheap, agregá un `CNAME` con host `nombre` y valor `<sitio>.netlify.app`.
5. Agregá la dirección en `portfolio/config/sitios.ts`.

## Seguridad

- **Encabezados:** cada sitio envía Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy y Cross-Origin-Opener-Policy. Están en el `next.config.ts` de cada carpeta.
- **Formulario:**
  - Validación en la página y en el servidor.
  - Campo trampa invisible y tiempo mínimo de 3 segundos.
  - Límite de envíos en la base.
  - Los errores no muestran detalles internos.
- **Dependencias:** `npm audit` sin vulnerabilidades al publicar. Para revisar de nuevo:
  ```bash
  cd portfolio && npm audit
  ```

## Si algo se rompe

- **Volver a una publicación anterior:** **Netlify → Deploys**, elegí una publicación vieja y tocá **Publish deploy**. Es instantáneo y no toca el código.
- **Volver el código a un punto anterior:** el commit con la etiqueta `respaldo-antes-de-publicar` es el estado antes de publicar.
