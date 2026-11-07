export type Role = "admin" | "ketua_panitia" | "guru";

export interface User {
  id: string;
  nama: string;
  email: string;
  jawatan: string;
  peranan: Role;
  jabatanUnit?: string;
}

export interface Invitation {
  id: string;
  tajukMesyuarat: string;
  tarikhMasa: string; // ISO
  lokasi: string;
  agenda: string;
  penganjur: string;
  rujukan: string;
  penerima: string; // nama penerima
  jawatanPenerima: string;
  alamatPenerima: string;
  namaSekolah: string;
  alamatSekolah: string;
  penutup: string;
  namaPenandatangan: string;
  jawatanPenandatangan: string;
  diciptaPada: string;
}

export interface MinuteAttendee {
  nama: string;
  jawatan: string;
  kehadiran: "Hadir" | "Tidak Hadir" | "Mohon Maaf";
}

export interface ActionItem {
  id: string;
  perkara: string;
  bertanggungjawab: string;
  tarikhAkhir: string;
  status: "Belum Selesai" | "Dalam Proses" | "Selesai";
}

export interface Minute {
  id: string;
  noMesyuarat: string;
  tajukMesyuarat: string;
  tarikhMasa: string;
  lokasi: string;
  kehadiran: MinuteAttendee[];
  agenda: { perkara: string; perbincangan: string; keputusan: string }[];
  tindakan: ActionItem[];
  susulanMesyuaratLepas: string;
  direkodOleh: string;
  diciptaPada: string;
}

export type EventCategory =
  | "akademik"
  | "mesyuarat"
  | "peperiksaan"
  | "pdp"
  | "cuti"
  | "tarikh_akhir";

export interface CalendarEvent {
  id: string;
  tajuk: string;
  tarikhMula: string; // YYYY-MM-DD
  tarikhAkhir?: string;
  masa?: string;
  lokasi?: string;
  kategori: EventCategory;
  peringatan: boolean;
  keterangan?: string;
}

export interface Course {
  id: string;
  tajuk: string;
  perihal: string;
  objektif: string;
  tarikhMasa: string;
  lokasi: string;
  fasilitator: string;
  sasaran: string;
  status: "Akan Datang" | "Sedang Berlangsung" | "Selesai" | "Dibatalkan";
  jumlahPenyertaan: number;
  sijilDikeluarkan: number;
  bahan?: string;
  refleksi?: string;
}

export interface ExamResource {
  id: string;
  tajuk: string;
  subjek: string;
  tahun: number;
  kertas: "Kertas 1" | "Kertas 2" | "Kertas 3";
  jenis: "Soalan Peperiksaan" | "Skema Pemarkahan" | "Nota Pembelajaran";
  topik: string[];
  tahap: string; // e.g. "Tingkatan 5"
  saiz?: string;
  muatNaikPada: string;
  muatNaikOleh: string;
}

export interface ExamResult {
  id: string;
  namaPelajar: string;
  kelas: string;
  subjek: string;
  markah: number;
  gred?: string;
  peperiksaan: string; // e.g. "Percubaan SPM 2025"
  tarikh: string;
}

export interface GradeScale {
  gred: string;
  min: number;
  max: number;
}

export interface AdditionalClass {
  id: string;
  tajuk: string;
  subjek: string;
  guru: string;
  kelas: string;
  tarikh: string; // YYYY-MM-DD
  masaMula: string; // HH:mm
  masaAkhir: string;
  lokasi: string;
  objektif: string;
  kehadiran?: { nama: string; status: "Hadir" | "Tidak Hadir" }[];
  status: "Dijadualkan" | "Selesai" | "Dibatalkan";
}

export type StoreKey =
  | "invitations"
  | "minutes"
  | "events"
  | "courses"
  | "resources"
  | "results"
  | "classes"
  | "users";

export interface StoreData {
  invitations: Invitation[];
  minutes: Minute[];
  events: CalendarEvent[];
  courses: Course[];
  resources: ExamResource[];
  results: ExamResult[];
  classes: AdditionalClass[];
  users: User[];
  gradeScales: GradeScale[];
}
