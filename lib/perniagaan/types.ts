export type Tingkatan = "T4" | "T5";
export type Kesukaran = "mudah" | "sederhana" | "sukar";
export type JenisSoalanObjektif = "objektif" | "benar_salah";
export type JenisSoalanLatih = "Objektif" | "Struktur" | "Esei";
export type PerananEdu = "admin" | "guru" | "murid";

export interface Chapter {
  id: string;
  tingkatan: Tingkatan;
  nombor: number;
  tajuk: string;
  ringkasan: string;
  konsep: string[];
  istilah: { istilah: string; maksud: string }[];
  nota: string[];
  contoh: string[];
  dikemasKini: string;
}

export interface NoteResource {
  id: string;
  chapterId: string;
  tingkatan: Tingkatan;
  tajuk: string;
  jenis: "Nota Lengkap" | "Ringkasan" | "Kad Istilah" | "PDF";
  kandungan: string;
  ringkasan: string;
  status: "rasmi" | "contoh" | "muat_naik";
  dimuatNaikOleh: string;
  tarikhMuatNaik: string;
  saiz?: string;
  failNama?: string;
  failData?: string;
}

export interface QuizQuestion {
  id: string;
  tingkatan: Tingkatan;
  bab: number;
  tajukBab: string;
  jenis: JenisSoalanObjektif;
  kesukaran: Kesukaran;
  soalan: string;
  pilihan: string[];
  jawapan: number;
  penerangan: string;
  markah: number;
  contoh: boolean;
}

export interface PracticeQuestion {
  id: string;
  tingkatan: Tingkatan;
  bab: number;
  tajukBab: string;
  jenis: JenisSoalanLatih;
  soalan: string;
  markah: number;
  skema: string;
  penerangan?: string;
  contoh: boolean;
}

export interface ExamPaper {
  id: string;
  kategori: "percubaan" | "spm";
  negeri?: string;
  tahun: number;
  tingkatan: Tingkatan | "Semua";
  kertas: string;
  tajuk: string;
  jenisDokumen: "Soalan" | "Skema Pemarkahan" | "Kertas Percubaan";
  status: "placeholder" | "rasmi";
  catatan?: string;
  dimuatNaikOleh?: string;
  tarikhMuatNaik?: string;
  failNama?: string;
  failData?: string;
}

export interface Announcement {
  id: string;
  tajuk: string;
  isi: string;
  tarikh: string;
  jenis: "Umum" | "Peperiksaan" | "Aktiviti" | "Penting";
  disemat: boolean;
}

export interface EduUser {
  id: string;
  nama: string;
  email: string;
  kataLaluan: string;
  peranan: PerananEdu;
  kelas?: string;
}

export interface QuizAttempt {
  id: string;
  namaMurid: string;
  tingkatan: Tingkatan;
  bab: string;
  jumlahSoalan: number;
  jawapanBetul: number;
  peratus: number;
  masa?: number;
  tarikh: string;
}

export interface ProgressItem {
  id: string;
  jenis: "nota" | "bab" | "kuiz" | "latih_tubi" | "muat_turun";
  label: string;
  href: string;
  tarikh: string;
}

export interface EduData {
  chapters: Chapter[];
  noteResources: NoteResource[];
  quizQuestions: QuizQuestion[];
  practiceQuestions: PracticeQuestion[];
  examPapers: ExamPaper[];
  announcements: Announcement[];
  users: EduUser[];
  attempts: QuizAttempt[];
  bookmarks: string[];
  recentItems: ProgressItem[];
  downloads: ProgressItem[];
  spmYears: number[];
  percubaanYears: number[];
}

export interface EduSession {
  userId: string;
  nama: string;
  peranan: PerananEdu;
}
