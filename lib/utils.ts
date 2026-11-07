const HARI = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
const BULAN = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember",
];
const BULAN_PENDEK = [
  "Jan", "Feb", "Mac", "Apr", "Mei", "Jun",
  "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis",
];

export function parseDate(s: string): Date {
  // handles ISO datetime or YYYY-MM-DD
  return new Date(s.length === 10 ? s + "T00:00:00" : s);
}

export function formatTarikh(s: string): string {
  const d = parseDate(s);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTarikhPendek(s: string): string {
  const d = parseDate(s);
  return `${d.getDate()} ${BULAN_PENDEK[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTarikhMasa(s: string): string {
  const d = parseDate(s);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${formatTarikh(s)} · ${hh}:${mm}`;
}

export function formatBulanTahun(year: number, month: number): string {
  return `${BULAN[month]} ${year}`;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function bulanList(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}
