-- =====================================================================
-- Mensajes del formulario de contacto del portfolio
-- =====================================================================
-- Se aplica con la CLI de Supabase (supabase db push) o pegándolo en
-- el SQL Editor del panel. Se puede ejecutar más de una vez sin problema.
--
-- Seguridad (Row Level Security):
--   * Cualquiera puede INSERTAR un mensaje (el formulario público).
--   * Nadie puede LEER, MODIFICAR ni BORRAR mensajes con la clave pública.
--     Los mensajes se ven solo desde el panel de Supabase (Table Editor).
--   * Límite de envíos: 5 por hora por visitante y 100 por hora en total.
-- =====================================================================

create table if not exists public.mensajes (
  id          bigint generated always as identity primary key,
  creado      timestamptz not null default now(),
  nombre      text not null check (char_length(nombre) between 2 and 100),
  email       text not null check (
                char_length(email) <= 200
                and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
              ),
  telefono    text check (
                telefono is null
                or (char_length(telefono) <= 40 and telefono ~ '^[+0-9 ()-]+$')
              ),
  paquete     text check (paquete is null or char_length(paquete) <= 100),
  mensaje     text not null check (char_length(mensaje) between 10 and 4000),
  -- Huella anónima del visitante (SHA-256 de su IP con una sal secreta).
  -- Sirve solo para el límite de envíos; no se guarda la IP.
  huella      text check (huella is null or char_length(huella) = 64),
  leido       boolean not null default false
);

comment on table public.mensajes is
  'Mensajes enviados desde el formulario de contacto del portfolio.';
comment on column public.mensajes.huella is
  'SHA-256 de la IP del visitante con sal; solo para limitar envíos.';

-- Por si la tabla ya existía de una versión anterior sin huella.
alter table public.mensajes add column if not exists huella text;

-- ---------------------------------------------------------------------
-- Seguridad por filas: sin políticas, nadie puede hacer nada.
-- ---------------------------------------------------------------------
alter table public.mensajes enable row level security;
alter table public.mensajes force row level security;

drop policy if exists "Cualquiera puede enviar un mensaje" on public.mensajes;
create policy "Cualquiera puede enviar un mensaje"
  on public.mensajes
  for insert
  to anon, authenticated
  with check (leido = false);

-- Permisos de tabla: la clave pública solo puede insertar estas columnas.
revoke all on public.mensajes from anon, authenticated;
grant insert (nombre, email, telefono, paquete, mensaje, huella)
  on public.mensajes to anon, authenticated;

-- ---------------------------------------------------------------------
-- Límite de envíos (corre con permisos del dueño para poder contar).
-- ---------------------------------------------------------------------
create or replace function public.limitar_mensajes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.huella is not null and (
    select count(*) from public.mensajes
    where huella = new.huella and creado > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'Demasiados mensajes. Probá de nuevo más tarde.'
      using errcode = 'P0001';
  end if;

  if (
    select count(*) from public.mensajes
    where creado > now() - interval '1 hour'
  ) >= 100 then
    raise exception 'Demasiados mensajes. Probá de nuevo más tarde.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

-- Nadie la puede llamar directamente; solo corre como disparador.
revoke all on function public.limitar_mensajes() from public, anon, authenticated;

drop trigger if exists limitar_mensajes on public.mensajes;
create trigger limitar_mensajes
  before insert on public.mensajes
  for each row execute function public.limitar_mensajes();

create index if not exists mensajes_creado_idx on public.mensajes (creado desc);
create index if not exists mensajes_huella_idx on public.mensajes (huella, creado desc);
