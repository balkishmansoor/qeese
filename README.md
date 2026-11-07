# PANITIA PERNIAGAAN

Portal pembelajaran digital untuk guru dan murid Perniagaan Tingkatan 4 dan Tingkatan 5 mengikut sukatan KSSM — nota, kuiz online/offline, soalan latih tubi, percubaan negeri, SPM, dashboard murid dan panel guru/admin.

**Platform Pembelajaran Perniagaan KSSM**

> Nota: repositori ini turut mengekalkan modul SPTK sedia ada di bawah laluan `(app)` untuk kegunaan sekolah. Portal Perniagaan menggunakan store LocalStorage berasingan (`panitia_perniagaan_db_v1`).

## Portal PANITIA PERNIAGAAN

Aplikasi turut mengandungi portal pembelajaran Perniagaan KSSM untuk Tingkatan 4 dan Tingkatan 5:

- `/` — homepage portal dengan akses pantas, pengumuman dan statistik pembelajaran.
- `/nota-t4` dan `/nota-t5` — nota digital mengikut bab KSSM, carian, bookmark dan muat turun.
- `/kuiz` — kuiz online berbilang pilihan / betul-palsu dengan pemasa dan semakan jawapan.
- `/kuiz-offline` — kertas soalan dan skema yang boleh dicetak atau dimuat turun.
- `/latih-tubi` — bank soalan objektif, struktur dan esei.
- `/percubaan-negeri` dan `/spm` — slot dokumen peperiksaan dengan penapis negeri/tahun/kertas.
- `/dashboard-pelajar` — kemajuan murid, sejarah kuiz, bookmark dan muat turun.
- `/panel-admin` — panel guru/admin untuk mengurus nota, bab, soalan, dokumen dan pengumuman.

Data portal disimpan berasingan dalam `localStorage` di bawah kunci `panitia_perniagaan_db_v1`. Akaun demo:

- Admin: `admin@panitia.my` / `admin123`
- Guru: `guru@panitia.my` / `guru123`
- Murid: `murid@panitia.my` / `murid123`

Untuk produksi, gantikan log masuk demo dengan Supabase Auth/RLS dan storan fail sebenar untuk PDF.

## Ciri-ciri

- **Dashboard** — statistik interaktif, kalendar mini, carta Recharts (prestasi subjek, taburan gred, trend), aktiviti terkini dan peristiwa akan datang.
- **Surat Jemputan Mesyuarat** — templat surat rasmi Malaysia, pratonton, cetak/Simpan PDF, eksport CSV.
- **Minit Mesyuarat** — senarai kehadiran, agenda, keputusan, tindakan susulan dengan tarikh akhir dan status; templat minit boleh cetak.
- **Takwim Tahunan** — paparan kalendar bulan, kod warna mengikut kategori, carian, penapis, peringatan, cetak.
- **Kursus PDP** — kad & jadual kursus, status pendaftaran, kehadiran, sijil, refleksi.
- **Soalan Peperiksaan SPM** — repositori soalan & skema pemarkahan mengikut subjek/tahun/kertas/topik (hanya dokumen yang dibenarkan disimpan).
- **Analisa Peperiksaan** — import CSV/Excel, purata markah, peratus lulus, taburan gred, senarai intervensi, trend prestasi, eksport Excel, konfigurasi skala gred.
- **Jadual Kelas Tambahan** — paparan senarai & mingguan, pengesanan konflik jadual guru, rekod kehadiran, cetak jadual.
- **Pengurusan Pengguna & Tetapan** — peranan Admin / Ketua Panitia / Guru.

## Teknologi

- Next.js (App Router) + TypeScript + Tailwind CSS
- Recharts untuk visualisasi data
- Lucide React untuk ikon
- XLSX (SheetJS) untuk import/eksport Excel
- **Mod demo**: data disimpan dalam `localStorage` pelayar dengan data contoh Bahasa Melayu.
- **Supabase** (pilihan): skema pangkalan data & RLS disediakan dalam `supabase/schema.sql`.

## Menjalankan Pembangunan

Keperluan: Node.js 18+.

```bash
npm install
npm run dev
```

Buka http://localhost:3000 — anda akan melihat homepage PANITIA PERNIAGAAN. Modul SPTK lama kekal di bawah laluan sedia ada dengan log masuk demo tersendiri (`sptk_session`).

## Skrip

| Arahan | Keterangan |
|---|---|
| `npm run dev` | Pelayan pembangunan |
| `npm run build` | Binaan produksi |
| `npm start` | Jalankan binaan produksi |

## Pemboleh Ubah Persekitaran

Salin `.env.example` ke `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jika nilai ini **tidak ditetapkan**, aplikasi berjalan dalam **mod demo** menggunakan `localStorage` — semua data contoh dan CRUD berfungsi sepenuhnya dalam pelayar. Tetapan → "Tetapkan Semula Data Demo" memulihkan data asal.

## Skema Pangkalan Data

Lihat `supabase/schema.sql` untuk skema lengkap (users, departments, meeting_invitations, meeting_minutes, meeting_attendees, meeting_action_items, annual_calendar_events, professional_development_courses, course_attendance, examination_resources, examination_results, additional_classes, additional_class_attendance) termasuk Row Level Security berdasarkan peranan.

## Susun Atur Projek

```
app/
  page.tsx           # Homepage PANITIA PERNIAGAAN
  (perniagaan)/      # Halaman portal Perniagaan (nota, kuiz, latih tubi, SPM, panel)
  (app)/             # Modul SPTK sedia ada
  log-masuk/         # Log masuk demo SPTK
components/
  perniagaan/        # Shell, widget dan browser nota portal
  ui.tsx             # UI kongsi (sidebar, carta, kalendar, jadual, modal)
lib/
  perniagaan/        # Jenis, seed data dan store LocalStorage portal
  types.ts           # Jenis entiti SPTK
  seed.ts            # Data contoh Bahasa Melayu SPTK
  store.tsx          # Store localStorage + sesi demo SPTK
  utils.ts           # Pemformat tarikh BM, helpers
public/              # Manifest PWA, ikon dan service worker
supabase/schema.sql  # Skema Postgres + RLS (SPTK)
```
