-- =====================================================================
-- Mensajes del formulario de contacto del portfolio
-- =====================================================================
-- Cómo usarlo: en Supabase, abrí "SQL Editor", pegá este archivo
-- completo y tocá "Run". Se puede ejecutar más de una vez sin problema.
--
-- Seguridad (Row Level Security):
--   * Cualquiera puede INSERTAR un mensaje (el formulario público).
--   * Nadie puede LEER, MODIFICAR ni BORRAR mensajes con la clave pública.
--     Los mensajes se ven solo desde el panel de Supabase (Table Editor),
--     con tu cuenta.
-- =====================================================================

create table if not exists public.mensajes (
  id          bigint generated always as identity primary key,
  creado      timestamptz not null default now(),
  nombre      text not null check (char_length(nombre) between 2 and 100),
  email       text not null check (
                char_length(email) <= 200
                and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
              ),
  telefono    text check (telefono is null or char_length(telefono) <= 40),
  paquete     text check (paquete is null or char_length(paquete) <= 100),
  mensaje     text not null check (char_length(mensaje) between 10 and 4000),
  leido       boolean not null default false
);

comment on table public.mensajes is
  'Mensajes enviados desde el formulario de contacto del portfolio.';

-- Activar la seguridad por filas: sin políticas, nadie puede hacer nada.
alter table public.mensajes enable row level security;

-- Única política: insertar mensajes nuevos, desde la página pública.
drop policy if exists "Cualquiera puede enviar un mensaje" on public.mensajes;
create policy "Cualquiera puede enviar un mensaje"
  on public.mensajes
  for insert
  to anon, authenticated
  with check (leido = false);

-- Permisos de tabla: la clave pública solo puede insertar.
revoke all on public.mensajes from anon, authenticated;
grant insert (nombre, email, telefono, paquete, mensaje) on public.mensajes to anon, authenticated;

-- Índice para ver primero los más nuevos.
create index if not exists mensajes_creado_idx on public.mensajes (creado desc);
