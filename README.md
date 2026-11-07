# Sistem Perancangan Tahunan Kurikulum Sekolah (SPTK)

Platform digital untuk guru, ketua panitia dan pentadbir sekolah menguruskan perancangan kurikulum tahunan, dokumentasi mesyuarat, takwim akademik, pembangunan profesionalisme, sumber dan analisis peperiksaan, serta jadual kelas tambahan.

**Platform Digital Pengurusan dan Perancangan Kurikulum Sekolah**

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

Buka http://localhost:3000 — anda akan diubah ke halaman log masuk demo. Pilih akaun untuk peranan **Admin**, **Ketua Panitia**, atau **Guru**.

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
  (app)/            # Halaman modul (layout dengan sidebar + topbar)
  log-masuk/        # Log masuk demo
components/         # UI kongsi (sidebar, carta, kalendar, jadual, modal)
lib/
  types.ts          # Jenis entiti
  seed.ts           # Data contoh Bahasa Melayu
  store.tsx         # Store localStorage + sesi demo
  utils.ts          # Pemformat tarikh BM, helpers
supabase/schema.sql # Skema Postgres + RLS
```
