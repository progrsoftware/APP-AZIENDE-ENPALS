-- Preparazione di Supabase per le app MARTINELLI e AUTONOMI SPETTACOLO
-- Dove: Supabase > SQL Editor > New query > incolla tutto > Run
-- Si può rieseguire senza danni.
--
-- Cosa crea:
--  * app_data       : una riga per app con i dati CIFRATI (Supabase non può leggerli)
--  * app_data_hist  : le ultime 30 versioni precedenti di ogni app (anch'esse cifrate)
--  * regole di sicurezza: ognuno vede e modifica solo le proprie righe

create table if not exists public.app_data (
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  app        text        not null check (app in ('azienda', 'lavoratore')),
  payload    text        not null,
  rev        bigint      not null default 1,
  device     text,
  updated_at timestamptz not null default now(),
  primary key (user_id, app)
);

create table if not exists public.app_data_hist (
  id       bigint generated always as identity primary key,
  user_id  uuid        not null references auth.users(id) on delete cascade,
  app      text        not null,
  payload  text        not null,
  rev      bigint,
  device   text,
  saved_at timestamptz not null default now()
);
create index if not exists app_data_hist_idx on public.app_data_hist (user_id, app, id desc);

alter table public.app_data      enable row level security;
alter table public.app_data_hist enable row level security;

drop policy if exists app_data_select on public.app_data;
drop policy if exists app_data_insert on public.app_data;
drop policy if exists app_data_update on public.app_data;
drop policy if exists app_data_delete on public.app_data;
drop policy if exists hist_select     on public.app_data_hist;

create policy app_data_select on public.app_data for select to authenticated using (user_id = auth.uid());
create policy app_data_insert on public.app_data for insert to authenticated with check (user_id = auth.uid());
create policy app_data_update on public.app_data for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy app_data_delete on public.app_data for delete to authenticated using (user_id = auth.uid());
create policy hist_select     on public.app_data_hist for select to authenticated using (user_id = auth.uid());

grant select, insert, update, delete on public.app_data      to authenticated;
grant select                         on public.app_data_hist to authenticated;

-- Prima di ogni aggiornamento conserva la versione precedente (ne tiene 30 per app)
create or replace function public.app_data_keep_hist() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.app_data_hist (user_id, app, payload, rev, device, saved_at)
  values (old.user_id, old.app, old.payload, old.rev, old.device, old.updated_at);

  delete from public.app_data_hist
   where user_id = old.user_id and app = old.app
     and id not in (select id from public.app_data_hist
                     where user_id = old.user_id and app = old.app
                     order by id desc limit 30);
  return new;
end $$;

revoke all on function public.app_data_keep_hist() from public, anon, authenticated;

drop trigger if exists app_data_hist_trg on public.app_data;
create trigger app_data_hist_trg before update on public.app_data
  for each row execute function public.app_data_keep_hist();
