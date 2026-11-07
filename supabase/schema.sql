-- Skema pangkalan data Supabase untuk Sistem Perancangan Tahunan Kurikulum
-- Jalankan dalam Supabase SQL Editor.

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  ketua_panitia_id uuid,
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  email text not null unique,
  jawatan text,
  peranan text not null check (peranan in ('admin','ketua_panitia','guru')),
  jabatan_unit text,
  created_at timestamptz default now()
);

create table if not exists meeting_invitations (
  id uuid primary key default gen_random_uuid(),
  tajuk_mesyuarat text not null,
  tarikh_masa timestamptz not null,
  lokasi text,
  agenda text,
  penganjur text,
  rujukan text,
  penerima text,
  jawatan_penerima text,
  alamat_penerima text,
  nama_sekolah text,
  alamat_sekolah text,
  penutup text,
  nama_penandatangan text,
  jawatan_penandatangan text,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists meeting_minutes (
  id uuid primary key default gen_random_uuid(),
  no_mesyuarat text not null,
  tajuk_mesyuarat text not null,
  tarikh_masa timestamptz not null,
  lokasi text,
  susulan_mesyuarat_lepas text,
  direkod_oleh text,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists meeting_attendees (
  id uuid primary key default gen_random_uuid(),
  minute_id uuid not null references meeting_minutes(id) on delete cascade,
  nama text not null,
  jawatan text,
  kehadiran text check (kehadiran in ('Hadir','Tidak Hadir','Mohon Maaf'))
);

create table if not exists meeting_agenda_items (
  id uuid primary key default gen_random_uuid(),
  minute_id uuid not null references meeting_minutes(id) on delete cascade,
  perkara text not null,
  perbincangan text,
  keputusan text,
  turutan int
);

create table if not exists meeting_action_items (
  id uuid primary key default gen_random_uuid(),
  minute_id uuid not null references meeting_minutes(id) on delete cascade,
  perkara text not null,
  bertanggungjawab text,
  tarikh_akhir date,
  status text default 'Belum Selesai'
);

create table if not exists annual_calendar_events (
  id uuid primary key default gen_random_uuid(),
  tajuk text not null,
  tarikh_mula date not null,
  tarikh_akhir date,
  masa text,
  lokasi text,
  kategori text not null,
  peringatan boolean default true,
  keterangan text,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists professional_development_courses (
  id uuid primary key default gen_random_uuid(),
  tajuk text not null,
  perihal text,
  objektif text,
  tarikh_masa timestamptz not null,
  lokasi text,
  fasilitator text,
  sasaran text,
  status text default 'Akan Datang',
  jumlah_penyertaan int default 0,
  sijil_dikeluarkan int default 0,
  bahan text,
  refleksi text,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists course_attendance (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references professional_development_courses(id) on delete cascade,
  user_id uuid references users(id),
  kehadiran text
);

create table if not exists examination_resources (
  id uuid primary key default gen_random_uuid(),
  tajuk text not null,
  subjek text not null,
  tahun int not null,
  kertas text,
  jenis text,
  topik text[],
  tahap text,
  saiz text,
  storage_path text,
  muat_naik_pada date,
  muat_naik_oleh uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists examination_results (
  id uuid primary key default gen_random_uuid(),
  nama_pelajar text not null,
  kelas text not null,
  subjek text not null,
  markah numeric not null check (markah between 0 and 100),
  gred text,
  peperiksaan text not null,
  tarikh date,
  imported_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists additional_classes (
  id uuid primary key default gen_random_uuid(),
  tajuk text not null,
  subjek text not null,
  guru text not null,
  kelas text not null,
  tarikh date not null,
  masa_mula time not null,
  masa_akhir time not null,
  lokasi text,
  objektif text,
  status text default 'Dijadualkan',
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists additional_class_attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references additional_classes(id) on delete cascade,
  nama_pelajar text not null,
  kehadiran text check (kehadiran in ('Hadir','Tidak Hadir'))
);

-- Row Level Security
alter table users enable row level security;
alter table meeting_invitations enable row level security;
alter table meeting_minutes enable row level security;
alter table annual_calendar_events enable row level security;
alter table professional_development_courses enable row level security;
alter table examination_resources enable row level security;
alter table examination_results enable row level security;
alter table additional_classes enable row level security;

-- Contoh dasar: semua pengguna yang log masuk boleh membaca;
-- admin & ketua_panitia boleh menulis. Laraskan mengikut keperluan sekolah.
create policy "auth read users" on users for select to authenticated using (true);
create policy "auth read invitations" on meeting_invitations for select to authenticated using (true);
create policy "admin write invitations" on meeting_invitations for all to authenticated
  using (exists (select 1 from users where id = auth.uid() and peranan in ('admin','ketua_panitia')));
create policy "auth read minutes" on meeting_minutes for select to authenticated using (true);
create policy "kp write minutes" on meeting_minutes for all to authenticated
  using (exists (select 1 from users where id = auth.uid() and peranan in ('admin','ketua_panitia')));
create policy "auth read events" on annual_calendar_events for select to authenticated using (true);
create policy "kp write events" on annual_calendar_events for all to authenticated
  using (exists (select 1 from users where id = auth.uid() and peranan in ('admin','ketua_panitia')));
create policy "auth read courses" on professional_development_courses for select to authenticated using (true);
create policy "kp write courses" on professional_development_courses for all to authenticated
  using (exists (select 1 from users where id = auth.uid() and peranan in ('admin','ketua_panitia')));
create policy "auth read resources" on examination_resources for select to authenticated using (true);
create policy "auth write resources" on examination_resources for all to authenticated using (true);
create policy "auth read results" on examination_results for select to authenticated using (true);
create policy "kp write results" on examination_results for all to authenticated
  using (exists (select 1 from users where id = auth.uid() and peranan in ('admin','ketua_panitia')));
create policy "auth read classes" on additional_classes for select to authenticated using (true);
create policy "kp write classes" on additional_classes for all to authenticated
  using (exists (select 1 from users where id = auth.uid() and peranan in ('admin','ketua_panitia')));
