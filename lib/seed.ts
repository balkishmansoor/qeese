import { StoreData } from "./types";
import { todayISO, toISODate } from "./utils";

function d(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return toISODate(d);
}
function dt(offsetDays: number, hour = 9, min = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}
function monthDate(month: number, day: number, year?: number): string {
  return `${year ?? new Date().getFullYear()}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const currentYear = new Date().getFullYear();

export function seedData(): StoreData {
  return {
    users: [
      { id: "u1", nama: "BALKISH BINTI MANSOOR", email: "balkish@sekolah.edu.my", jawatan: "Setiausaha Kurikulum", peranan: "admin", jabatanUnit: "Kurikulum" },
      { id: "u2", nama: "Siti Aminah binti Yusof", email: "siti.aminah@sekolah.edu.my", jawatan: "Ketua Panitia Kurikulum", peranan: "ketua_panitia", jabatanUnit: "Kurikulum" },
      { id: "u3", nama: "Mohd Faiz bin Abdullah", email: "faiz@sekolah.edu.my", jawatan: "Guru Matematik", peranan: "guru", jabatanUnit: "Jabatan Sains & Matematik" },
      { id: "u4", nama: "Norhayati binti Hassan", email: "hayati@sekolah.edu.my", jawatan: "Guru Bahasa Melayu", peranan: "guru", jabatanUnit: "Jabatan Bahasa" },
      { id: "u5", nama: "Rajendran a/l Muniandy", email: "rajendran@sekolah.edu.my", jawatan: "Ketua Panitia SPM", peranan: "ketua_panitia", jabatanUnit: "Peperiksaan" },
    ],

    invitations: [
      {
        id: "inv1",
        tajukMesyuarat: "Mesyuarat Jawatankuasa Kurikulum Sekolah Peringkat I",
        tarikhMasa: dt(12, 14, 0),
        lokasi: "Bilik Mesyuarat, Blok Pentadbiran",
        agenda: "1. Semakan Pelan Pembangunan Kurikulum\n2. Pembahagian Tugas Panitia\n3. Cadangan Aktiviti Kokurikulum\n4. Hal Lain-lain",
        penganjur: "Siti Aminah binti Yusof",
        rujukan: "BP/SPTK/01/2025",
        penerima: "Semua Ahli Jawatankuasa Kurikulum",
        jawatanPenerima: "Ahli Jawatankuasa",
        alamatPenerima: "Sekolah Menengah Kebangsaan Taman Siswa",
        namaSekolah: "Sekolah Menengah Kebangsaan Taman Siswa",
        alamatSekolah: "Jalan Kenanga 5, Taman Siswa, 43000 Kajang, Selangor",
        penutup: "Sekian, terima kasih.",
        namaPenandatangan: "Siti Aminah binti Yusof",
        jawatanPenandatangan: "Ketua Panitia Kurikulum",
        diciptaPada: todayISO(),
      },
      {
        id: "inv2",
        tajukMesyuarat: "Mesyuarat Panitia Peperiksaan SPM",
        tarikhMasa: dt(5, 9, 30),
        lokasi: "Makmal Komputer 2",
        agenda: "1. Analisis Keputusan Peperiksaan Percubaan SPM\n2. Pelan Persediaan Peperiksaan Akhir Tahun\n3. Agihan Soalan Latihan",
        penganjur: "Rajendran a/l Muniandy",
        rujukan: "BP/SPTK/02/2025",
        penerima: "Semua Guru Mata Pelajaran Tingkatan 4 & 5",
        jawatanPenerima: "Ahli Panitia Peperiksaan",
        alamatPenerima: "Sekolah Menengah Kebangsaan Taman Siswa",
        namaSekolah: "Sekolah Menengah Kebangsaan Taman Siswa",
        alamatSekolah: "Jalan Kenanga 5, Taman Siswa, 43000 Kajang, Selangor",
        penutup: "Sekian, terima kasih.",
        namaPenandatangan: "Rajendran a/l Muniandy",
        jawatanPenandatangan: "Ketua Panitia Peperiksaan SPM",
        diciptaPada: todayISO(),
      },
    ],

    minutes: [
      {
        id: "min1",
        noMesyuarat: "JK/KUR/01/2025",
        tajukMesyuarat: "Mesyuarat Jawatankuasa Kurikulum Sekolah Peringkat I",
        tarikhMasa: dt(-30, 14, 0),
        lokasi: "Bilik Mesyuarat, Blok Pentadbiran",
        kehadiran: [
          { nama: "Siti Aminah binti Yusof", jawatan: "Pengerusi", kehadiran: "Hadir" },
          { nama: "Mohd Faiz bin Abdullah", jawatan: "Setiausaha", kehadiran: "Hadir" },
          { nama: "Norhayati binti Hassan", jawatan: "Ahli", kehadiran: "Hadir" },
          { nama: "Rajendran a/l Muniandy", jawatan: "Ahli", kehadiran: "Mohon Maaf" },
          { nama: "BALKISH BINTI MANSOOR", jawatan: "Setiausaha Kurikulum", kehadiran: "Hadir" },
        ],
        agenda: [
          { perkara: "Semakan Pelan Pembangunan Kurikulum", perbincangan: "Ahli mesyuarat membincangkan kemajuan pelan pembangunan kurikulum bagi tahun 2025.", keputusan: "Pelan diluluskan dengan pindaan kecil pada jadual pelaksanaan." },
          { perkara: "Pembahagian Tugas Panitia", perbincangan: "Setiap panitia dikehendaki mengemukakan senarai tugas sebelum hujung bulan.", keputusan: "Tarikh akhir ditetapkan pada 30 November 2025." },
        ],
        tindakan: [
          { id: "a1", perkara: "Kemukakan senarai tugas panitia", bertanggungjawab: "Semua Ketua Panitia", tarikhAkhir: monthDate(11, 30), status: "Dalam Proses" },
          { id: "a2", perkara: "Sediakan draf kalendar akademik", bertanggungjawab: "Siti Aminah binti Yusof", tarikhAkhir: monthDate(10, 15), status: "Selesai" },
        ],
        susulanMesyuaratLepas: "Susulan minit mesyuarat JK/KUR/04/2024 telah disemak dan semua tindakan telah dilaksanakan.",
        direkodOleh: "Mohd Faiz bin Abdullah",
        diciptaPada: todayISO(),
      },
    ],

    events: [
      { id: "e1", tajuk: "Mesyuarat Jawatankuasa Kurikulum", tarikhMula: d(12), masa: "14:00", lokasi: "Bilik Mesyuarat", kategori: "mesyuarat", peringatan: true },
      { id: "e2", tajuk: "Peperiksaan Percubaan SPM", tarikhMula: monthDate(11, 10, currentYear), tarikhAkhir: monthDate(11, 21, currentYear), kategori: "peperiksaan", peringatan: true, keterangan: "Semua mata pelajaran Tingkatan 5" },
      { id: "e3", tajuk: "Kursus Pembangunan Profesionalisme: Pedagogi Abad 21", tarikhMula: d(20), masa: "09:00", lokasi: "Makmal Komputer 1", kategori: "pdp", peringatan: true },
      { id: "e4", tajuk: "Tutup Sekolah - Cuti Sekolah", tarikhMula: monthDate(12, 22, currentYear), tarikhAkhir: monthDate(1, 3, currentYear + 1), kategori: "cuti", peringatan: false },
      { id: "e5", tajuk: "Peperiksaan Akhir Tahun", tarikhMula: monthDate(11, 24, currentYear), tarikhAkhir: monthDate(12, 5, currentYear), kategori: "peperiksaan", peringatan: true },
      { id: "e6", tajuk: "Tarikh Akhir Penyerahan Analisis Keputusan", tarikhMula: monthDate(12, 15, currentYear), kategori: "tarikh_akhir", peringatan: true },
      { id: "e7", tajuk: "Hari Pendaftaran SPM Online", tarikhMula: monthDate(8, 5, currentYear), kategori: "akademik", peringatan: false },
      { id: "e8", tajuk: "Bengkel Pengukuhan Pengajaran", tarikhMula: d(35), masa: "08:30", lokasi: "Dewan Besar", kategori: "pdp", peringatan: false },
    ],

    courses: [
      {
        id: "c1",
        tajuk: "Pedagogi Abad 21: Pembelajaran Berasaskan Teknologi",
        perihal: "Kursus intensif mengenai integrasi teknologi dalam pengajaran dan pembelajaran kurikulum sekolah.",
        objektif: "1. Menguasai alat digital untuk pengajaran\n2. Merekabentuk aktiviti P&P berasaskan teknologi\n3. Menilai keberkesanan pembelajaran digital",
        tarikhMasa: dt(20, 9, 0),
        lokasi: "Makmal Komputer 1, SMK Taman Siswa",
        fasilitator: "Dr. Lim Wei Ming (IPG)",
        sasaran: "Semua Guru Mata Pelajaran",
        status: "Akan Datang",
        jumlahPenyertaan: 24,
        sijilDikeluarkan: 0,
        bahan: "Slide pembentangan, buku kerja digital",
      },
      {
        id: "c2",
        tajuk: "Kemahiran Asas Pengurusan Data dan Analisis Keputusan Peperiksaan",
        perihal: "Latihan pengisian dan analisis keputusan peperiksaan menggunakan hamparan elektronik.",
        objektif: "1. Menggunakan fungsi hamparan untuk analisis data\n2. Menjana laporan analisis kelas\n3. Mengenal pasti pelajar lemah",
        tarikhMasa: dt(-10, 9, 0),
        lokasi: "Bilik Mesyuarat",
        fasilitator: "En. Ahmad Zaki (JPN)",
        sasaran: "Guru Tingkatan 4 & 5",
        status: "Selesai",
        jumlahPenyertaan: 18,
        sijilDikeluarkan: 18,
        refleksi: "Kursus berjalan lancar. Guru menunjukkan minat yang tinggi terhadap analisis data keputusan.",
      },
      {
        id: "c3",
        tajuk: "Kursus Penaksiran Bilik Darjah (PBD) Terkini",
        perihal: "Pendedahan teknik penaksiran berasaskan sekolah mengikut kurikulum semasa.",
        objektif: "1. Memahami domain PBD\n2. Menggunakan rubrik penaksiran\n3. Menyusun item pentaksiran",
        tarikhMasa: dt(45, 9, 0),
        lokasi: "Dewan Besar",
        fasilitator: "Pn. Kamariah (Jabatan Pendidikan)",
        sasaran: "Guru Bahasa Melayu & Bahasa Inggeris",
        status: "Akan Datang",
        jumlahPenyertaan: 12,
        sijilDikeluarkan: 0,
      },
    ],

    resources: [
      { id: "r1", tajuk: "Soalan Percubaan SPM 2024 - Matematik Kertas 1", subjek: "Matematik", tahun: 2024, kertas: "Kertas 1", jenis: "Soalan Peperiksaan", topik: ["Algebra", "Fungsi"], tahap: "Tingkatan 5", saiz: "2.1 MB", muatNaikPada: d(-60), muatNaikOleh: "Mohd Faiz bin Abdullah" },
      { id: "r2", tajuk: "Skema Pemarkahan - Matematik Kertas 1", subjek: "Matematik", tahun: 2024, kertas: "Kertas 1", jenis: "Skema Pemarkahan", topik: ["Algebra", "Fungsi"], tahap: "Tingkatan 5", saiz: "850 KB", muatNaikPada: d(-58), muatNaikOleh: "Mohd Faiz bin Abdullah" },
      { id: "r3", tajuk: "Soalan SPM sebenar 2023 - Bahasa Melayu Kertas 2", subjek: "Bahasa Melayu", tahun: 2023, kertas: "Kertas 2", jenis: "Soalan Peperiksaan", topik: ["Kefahaman", "Penulisan"], tahap: "Tingkatan 5", saiz: "1.8 MB", muatNaikPada: d(-120), muatNaikOleh: "Norhayati binti Hassan" },
      { id: "r4", tajuk: "Soalan SPM sebenar 2023 - Fizik Kertas 2", subjek: "Fizik", tahun: 2023, kertas: "Kertas 2", jenis: "Soalan Peperiksaan", topik: ["Termodinamik", "Elektrik"], tahap: "Tingkatan 5", saiz: "2.4 MB", muatNaikPada: d(-120), muatNaikOleh: "Rajendran a/l Muniandy" },
      { id: "r5", tajuk: "Skema Pemarkahan - Bahasa Melayu Kertas 2", subjek: "Bahasa Melayu", tahun: 2023, kertas: "Kertas 2", jenis: "Skema Pemarkahan", topik: ["Penulisan"], tahap: "Tingkatan 5", saiz: "620 KB", muatNaikPada: d(-118), muatNaikOleh: "Norhayati binti Hassan" },
      { id: "r6", tajuk: "Nota Pembelajaran - Sejarah Tingkatan 4", subjek: "Sejarah", tahun: currentYear, kertas: "Kertas 1", jenis: "Nota Pembelajaran", topik: ["Kedaulatan Negara"], tahap: "Tingkatan 4", saiz: "3.0 MB", muatNaikPada: d(-15), muatNaikOleh: "Siti Aminah binti Yusof" },
    ],

    results: [
      // Tingkatan 5 - Peperiksaan Percubaan SPM 2025
      ...[
        ["Aina Sofea binti Ahmad", "5 Bestari", 78, "A"], ["Daniel Anak Raj", "5 Bestari", 85, "A"],
        ["Farah Aisyah binti Hassan", "5 Bestari", 62, "C"], ["Harith bin Ismail", "5 Bestari", 45, "E"],
        ["Izzat bin Omar", "5 Bestari", 91, "A+"], ["Jia Wen Lim", "5 Bestari", 70, "B"],
        ["Kamal Ariffin bin Yusof", "5 Bestari", 55, "D"], ["Liyana binti Zainal", "5 Bestari", 83, "A"],
        ["Mohd Danish bin Kamarulzaman", "5 Bestari", 38, "G"], ["Nur Amira binti Saad", "5 Bestari", 67, "C+"],
      ].flatMap(([nama, kelas, markah, gred], i) => [
        { id: `res-pc-math-${i}`, namaPelajar: nama as string, kelas: kelas as string, subjek: "Matematik", markah: markah as number, gred: gred as string, peperiksaan: "Percubaan SPM 2025", tarikh: d(-25) },
        { id: `res-pc-eng-${i}`, namaPelajar: nama as string, kelas: kelas as string, subjek: "Bahasa Inggeris", markah: Math.min(98, (markah as number) + 5), gred: gred as string, peperiksaan: "Percubaan SPM 2025", tarikh: d(-25) },
        { id: `res-pc-bm-${i}`, namaPelajar: nama as string, kelas: kelas as string, subjek: "Bahasa Melayu", markah: Math.max(20, (markah as number) - 8), gred: gred as string, peperiksaan: "Percubaan SPM 2025", tarikh: d(-25) },
      ]),
      // Tingkatan 4 - Peperiksaan Akhir Tahun 2025
      ...[
        ["Aiman Hakim bin Idris", "4 Cemerlang", 72, "B"], ["Bella Anak Thomas", "4 Cemerlang", 88, "A"],
        ["Chong Wei bin Tan", "4 Cemerlang", 51, "D"], ["Daniah binti Rahman", "4 Cemerlang", 95, "A+"],
        ["Emir bin Hadi", "4 Cemerlang", 60, "C"], ["Faridah binti Noor", "4 Cemerlang", 42, "F"],
        ["Ganesh a/l Kumar", "4 Cemerlang", 77, "B+"], ["Hana binti Mohd Ali", "4 Cemerlang", 66, "C+"],
      ].flatMap(([nama, kelas, markah, gred], i) => [
        { id: `res-at-math-${i}`, namaPelajar: nama as string, kelas: kelas as string, subjek: "Matematik", markah: markah as number, gred: gred as string, peperiksaan: "Akhir Tahun 2025", tarikh: d(-40) },
        { id: `res-at-bm-${i}`, namaPelajar: nama as string, kelas: kelas as string, subjek: "Bahasa Melayu", markah: Math.min(98, (markah as number) + 6), gred: gred as string, peperiksaan: "Akhir Tahun 2025", tarikh: d(-40) },
        { id: `res-at-sains-${i}`, namaPelajar: nama as string, kelas: kelas as string, subjek: "Sains", markah: Math.max(25, (markah as number) - 4), gred: gred as string, peperiksaan: "Akhir Tahun 2025", tarikh: d(-40) },
      ]),
    ],

    gradeScales: [
      { gred: "A+", min: 90, max: 100 },
      { gred: "A", min: 80, max: 89 },
      { gred: "B+", min: 75, max: 79 },
      { gred: "B", min: 70, max: 74 },
      { gred: "C+", min: 65, max: 69 },
      { gred: "C", min: 60, max: 64 },
      { gred: "D", min: 50, max: 59 },
      { gred: "E", min: 40, max: 49 },
      { gred: "G", min: 0, max: 39 },
    ],

    classes: [
      { id: "k1", tajuk: "Kelas Tambahan Matematik - Topik Fungsi Kuadratik", subjek: "Matematik", guru: "Mohd Faiz bin Abdullah", kelas: "5 Bestari", tarikh: d(3), masaMula: "15:30", masaAkhir: "17:00", lokasi: "Bilik 12", objektif: "Meningkatkan penguasaan pelajar dalam menyelesaikan persamaan kuadratik", status: "Dijadualkan" },
      { id: "k2", tajuk: "Kelas Tambahan Bahasa Inggeris - Penulisan Karangan", subjek: "Bahasa Inggeris", guru: "Siti Aminah binti Yusof", kelas: "5 Bestari", tarikh: d(4), masaMula: "16:00", masaAkhir: "17:30", lokasi: "Perpustakaan", objektif: "Melatih kemahiran menulis karangan berpandukan format SPM", status: "Dijadualkan" },
      { id: "k3", tajuk: "Kelas Tambahan Sains - Ujian Amali", subjek: "Sains", guru: "Rajendran a/l Muniandy", kelas: "4 Cemerlang", tarikh: d(6), masaMula: "14:00", masaAkhir: "15:30", lokasi: "Makmal Sains 1", objektif: "Menguasai teknik eksperimen dan penganalisisan data", status: "Dijadualkan" },
      { id: "k4", tajuk: "Kelas Tambahan Bahasa Melayu - Pemahaman Inference", subjek: "Bahasa Melayu", guru: "Norhayati binti Hassan", kelas: "4 Cemerlang", tarikh: d(-2), masaMula: "15:00", masaAkhir: "16:30", lokasi: "Bilik 8", objektif: "Meningkatkan skor soalan pemahaman", status: "Selesai" },
    ],
  };
}
