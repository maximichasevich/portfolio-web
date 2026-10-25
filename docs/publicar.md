# Cómo publicar el portfolio y las demos

Orden recomendado: **1. Supabase → 2. GitHub → 3. Netlify → 4. Dominio**.
Las cuentas de los tres servicios son gratis para este uso.

---

## 1. Supabase: la base de datos de los mensajes

1. Entrá a [supabase.com](https://supabase.com), creá una cuenta y tocá **New project**.
   - Nombre: por ejemplo `portfolio`.
   - Contraseña de la base de datos: generá una y guardala, aunque este proyecto no la usa.
   - Región: elegí **São Paulo (South America)**, la más cercana a Uruguay.
2. Esperá un par de minutos a que se cree el proyecto.
3. En el menú de la izquierda, abrí **SQL Editor** y tocá **New query**.
4. Copiá todo el contenido de [`supabase/migrations/`](../supabase/migrations/), pegalo y tocá **Run**. Tiene que decir *Success*.
5. Buscá las claves en **Project Settings → API**, o en el botón **Connect** de arriba:
   - **Project URL** (algo como `https://abcd1234.supabase.co`): es `SUPABASE_URL`.
   - **Clave pública**, llamada `anon public` o `publishable`: es `SUPABASE_ANON_KEY`.
   - **No uses la clave `service_role` ni la `secret`.** El proyecto no las necesita y nunca tienen que ir en una página.
6. Para probar en tu computadora:
   ```bash
   cd portfolio
   cp .env.example .env.local
   ```
   Abrí `.env.local`, pegá los dos valores y corré `npm run dev`. Mandá un mensaje de prueba desde el formulario.

### Ver los mensajes que te llegan

En Supabase: **Table Editor → mensajes**. Cada fila es un mensaje, con
fecha, nombre, correo, teléfono, paquete y texto. La columna `leido` la
podés marcar a mano para llevar la cuenta.

Para que te avise por correo cuando llega uno, en **Database → Webhooks**
podés crear un aviso por cada inserción en `mensajes`. Es opcional.

---

## 2. GitHub: subir el código

1. Creá una cuenta en [github.com](https://github.com) si no tenés.
2. Tocá **New repository**:
   - Nombre: por ejemplo `portfolio-web`.
   - Visibilidad: **Public**, para que los clientes puedan ver tu código como parte del portfolio, o **Private** si preferís.
   - **No** marques "Add a README" ni ".gitignore": el proyecto ya los tiene.
3. GitHub te muestra la dirección del repositorio. En una terminal, dentro de la carpeta del proyecto:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/portfolio-web.git
   git push -u origin main
   ```
   La primera vez te va a pedir iniciar sesión en GitHub desde el navegador.

> El archivo `.env.local` con tus claves **no se sube**, porque está en `.gitignore`. Solo se sube `.env.example`, que no tiene valores.

---

## 3. Netlify: los cuatro sitios

Se crean **cuatro sitios desde el mismo repositorio**. Lo único que cambia
es la carpeta base. Repetí estos pasos para cada fila de la tabla:

| Sitio | Base directory | Nombre sugerido |
|---|---|---|
| Portfolio | `portfolio` | `maximilianomichasevich` |
| Demo 1 | `demo-la-espiga` | `demo-la-espiga` |
| Demo 2 | `demo-estudio-faro` | `demo-estudio-faro` |
| Demo 3 | `demo-verde-tienda` | `demo-verde-tienda` |

1. En [app.netlify.com](https://app.netlify.com): **Add new site → Import an existing project → GitHub**, y elegí el repositorio.
2. En la configuración:
   - **Base directory:** la carpeta de la tabla.
   - **Build command** y **Publish directory:** dejalos como los detecta; ya están en `netlify.toml` de cada carpeta.
3. Tocá **Deploy**. Tarda unos minutos.
4. Cambiá el nombre del sitio en **Site configuration → Change site name**, para que la dirección quede como `https://demo-la-espiga.netlify.app`.

### Variables de entorno

En cada sitio: **Site configuration → Environment variables → Add a variable**.

**Portfolio:**

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | La Project URL de Supabase |
| `SUPABASE_ANON_KEY` | La clave pública de Supabase |
| `NEXT_PUBLIC_SITE_URL` | `https://maximilianomichasevich.netlify.app` (o tu dominio) |
| `NEXT_PUBLIC_DEMO_LA_ESPIGA_URL` | La dirección de la demo 1 |
| `NEXT_PUBLIC_DEMO_ESTUDIO_FARO_URL` | La dirección de la demo 2 |
| `NEXT_PUBLIC_DEMO_VERDE_TIENDA_URL` | La dirección de la demo 3 |

**Cada demo:**

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | La dirección de esa demo |
| `NEXT_PUBLIC_PORTFOLIO_URL` | La dirección del portfolio |

Después de cargar o cambiar variables: **Deploys → Trigger deploy →
Deploy site**, para que se apliquen.

> Si usás exactamente los nombres sugeridos en la tabla, las direcciones ya
> coinciden con las que vienen en `config/` y las variables `NEXT_PUBLIC_*`
> son opcionales. Las de Supabase sí son obligatorias para el formulario.

Cada vez que hagas `git push`, Netlify vuelve a publicar solo los sitios
afectados.

---

## 4. Dominio propio para el portfolio

1. Comprá el dominio, por ejemplo en un registrador uruguayo para `.com.uy` o en Namecheap o Porkbun para `.com`.
2. En Netlify, en el sitio del portfolio: **Domain management → Add a domain** y escribí tu dominio.
3. Netlify te ofrece dos caminos:
   - **Usar Netlify DNS (lo más simple):** te da 4 servidores de nombres (`dns1.p0x.nsone.net`, etc.). En la página de tu registrador, reemplazá los servidores de nombres por esos.
   - **Mantener el DNS del registrador:** creá un registro `A` para el dominio sin `www` apuntando a la IP que indique Netlify, y un `CNAME` para `www` apuntando a `maximilianomichasevich.netlify.app`.
4. Esperá a que se propague; puede tardar de minutos a unas horas. Netlify activa el certificado HTTPS solo.
5. Actualizá las direcciones:
   - En el portfolio: `NEXT_PUBLIC_SITE_URL` = `https://tudominio.com`.
   - En cada demo: `NEXT_PUBLIC_PORTFOLIO_URL` = `https://tudominio.com`.
   - Volvé a publicar los cuatro sitios.

El sitemap, el archivo de robots y la imagen para redes sociales del
portfolio toman la dirección de `NEXT_PUBLIC_SITE_URL`, así que con eso
queda todo apuntando al dominio nuevo.

Si más adelante querés las demos en subdominios, como
`laespiga.tudominio.com`, se agregan igual desde el **Domain management** de
cada demo, con un `CNAME`.

---

## Comprobar que todo anda

- [ ] El portfolio abre y las tarjetas de "Ejemplos" llevan a las tres demos.
- [ ] En cada demo, la pastilla "Demo" vuelve al portfolio.
- [ ] El botón "¿Querés una página así?" abre tu WhatsApp con el nombre de la demo.
- [ ] Un mensaje de prueba del formulario aparece en Supabase → Table Editor → mensajes.
