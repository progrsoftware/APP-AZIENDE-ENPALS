-- Per l'app TOTEM (seconda azienda) con lo stesso utente di MARTINELLI e AUTONOMI.
-- Dove: Supabase > SQL Editor > New query > incolla tutto > Run. Si può rieseguire senza danni.
-- Permette di salvare più "app" per lo stesso utente (azienda, lavoratore, totem).
alter table public.app_data drop constraint if exists app_data_app_check;
alter table public.app_data add constraint app_data_app_check check (app ~ '^[a-z0-9]{1,30}$');
