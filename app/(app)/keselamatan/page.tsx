"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, KeyRound, Smartphone, MonitorSmartphone, LogOut,
  Eye, EyeOff, Copy, Check, History, Users, BadgeCheck,
} from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Field, Input, Badge, Table, THead, TBody, Tr, Th, Td, useToast } from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/utils";

const PW_KEY = "sptk_password";
const MFA_KEY = "sptk_mfa";
const AUDIT_KEY = "sptk_audit";
const SESSIONS_KEY = "sptk_sessions";

interface AuditEntry { id: string; masa: string; tindakan: string; butiran: string; }
interface SessionEntry { id: string; peranti: string; lokasi: string; ip: string; masa: string; semasa: boolean; }

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function nowStr() {
  return new Date().toLocaleString("ms-MY", { dateStyle: "medium", timeStyle: "short" });
}

// Hash ringkas untuk demonstrasi (bukan kriptografi sebenar)
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return "h" + h.toString(16);
}

function genBackupCodes() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    let c = "";
    for (let j = 0; j < 8; j++) c += chars[Math.floor(Math.random() * chars.length)];
    codes.push(c.match(/.{4}/g)!.join("-"));
  }
  return codes;
}

export default function KeselamatanPage() {
  const { data, ready, session } = useStore();
  const toast = useToast();
  const user = data?.users.find((u) => u.id === session?.userId);
  const isAdmin = session?.role === "admin";

  // Kata laluan
  const [pwSedia, setPwSedia] = useState(false);
  const [pw, setPw] = useState({ semasa: "", baharu: "", sah: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");

  // MFA
  const [mfa, setMfa] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Sesi
  const [sessions, setSessions] = useState<SessionEntry[]>([]);

  // Log
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  useEffect(() => {
    if (!ready || !session) return;
    setPwSedia(!!loadJSON<Record<string, string>>(PW_KEY, {})[session.userId]);
    setMfa(!!loadJSON<Record<string, boolean>>(MFA_KEY, {})[session.userId]);
    setSessions(loadJSON<SessionEntry[]>(SESSIONS_KEY, []));
    setAudit(loadJSON<AuditEntry[]>(AUDIT_KEY, []));
  }, [ready, session]);

  const logAudit = (tindakan: string, butiran: string) => {
    if (!session) return;
    setAudit((prev) => {
      const next = [{ id: uid(), masa: nowStr(), tindakan, butiran }, ...prev].slice(0, 50);
      localStorage.setItem(AUDIT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const savePw = () => {
    setPwError("");
    if (pw.baharu.length < 8) { setPwError("Kata laluan baharu mestilah sekurang-kurangnya 8 aksara."); return; }
    if (pw.baharu !== pw.sah) { setPwError("Pengesahan kata laluan tidak sepadan."); return; }
    const map = loadJSON<Record<string, string>>(PW_KEY, {});
    map[session!.userId] = hash(pw.baharu);
    localStorage.setItem(PW_KEY, JSON.stringify(map));
    setPwSedia(true);
    setPw({ semasa: "", baharu: "", sah: "" });
    logAudit("Tukar Kata Laluan", `Kata laluan akaun ${user?.nama ?? session!.userId} dikemas kini`);
    toast("Kata laluan berjaya dikemas kini");
  };

  const toggleMfa = () => {
    const next = !mfa;
    const map = loadJSON<Record<string, boolean>>(MFA_KEY, {});
    map[session!.userId] = next;
    localStorage.setItem(MFA_KEY, JSON.stringify(map));
    setMfa(next);
    if (next && codes.length === 0) {
      const c = genBackupCodes();
      setCodes(c);
      localStorage.setItem(`${MFA_KEY}_codes_${session!.userId}`, JSON.stringify(c));
    }
    logAudit(next ? "Aktifkan MFA" : "Nyahaktifkan MFA", `Pengesahan dua faktor ${next ? "diaktifkan" : "dinyahaktifkan"}`);
    toast(next ? "Pengesahan dua faktor diaktifkan" : "Pengesahan dua faktor dinyahaktifkan");
  };

  const ensureSessions = () => {
    const existing = loadJSON<SessionEntry[]>(SESSIONS_KEY, []);
    if (existing.length > 0) return existing;
    const seed: SessionEntry[] = [
      { id: "s1", peranti: "Pelayar Web — Chrome (Windows)", lokasi: "Kajang, Selangor", ip: "203.0.113.24", masa: "Kini", semasa: true },
      { id: "s2", peranti: "Aplikasi Mudah Alih — Android", lokasi: "Putrajaya", ip: "198.51.100.7", masa: "2 jam lalu", semasa: false },
      { id: "s3", peranti: "Pelayar Web — Safari (iPhone)", lokasi: "Kuala Lumpur", ip: "192.0.2.15", masa: "Semalam", semasa: false },
    ];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(seed));
    setSessions(seed);
    return seed;
  };

  const revokeSession = (id: string) => {
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
    logAudit("Tamatkan Sesi", `Sesi peranti ${id} ditamatkan`);
    toast("Sesi telah ditamatkan");
  };

  const revokeOthers = () => {
    const next = sessions.filter((s) => s.semasa);
    setSessions(next);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
    logAudit("Tamatkan Sesi", "Semua sesi lain ditamatkan");
    toast("Semua sesi lain telah ditamatkan");
  };

  const roleRows = useMemo(() => [
    ["Lihat dashboard & data", "✓", "✓", "✓"],
    ["Urus minit & surat jemputan", "✓", "✓", "Himpunan"],
    ["Urus takwim & kelas tambahan", "✓", "✓", "Himpunan"],
    ["Analisa peperiksaan & import Excel", "✓", "✓", "—"],
    ["Kursus PDP & sijil", "✓", "✓", "Penyertaan"],
    ["Pengurusan pengguna", "✓", "—", "—"],
    ["Tetapan sistem & reset data", "✓", "—", "—"],
  ], []);

  if (!ready) return null;

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Keselamatan" subtitle="Urus kata laluan, pengesahan dua faktor dan sesi akaun anda" />

      {/* Status ringkas */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${pwSedia ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Kata Laluan</p>
              <Badge tone={pwSedia ? "green" : "amber"} className="mt-1">{pwSedia ? "Dikukuhkan" : "Belum ditetapkan"}</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${mfa ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Pengesahan 2 Faktor</p>
              <Badge tone={mfa ? "green" : "slate"} className="mt-1">{mfa ? "Aktif" : "Tidak aktif"}</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-100 text-primary-600">
              <MonitorSmartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Sesi Aktif</p>
              <p className="text-xs text-slate-400 mt-1">{sessions.filter((s) => !s.semasa).length + 1} peranti</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Kata laluan */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="w-4 h-4 text-magenta-500" /> Tukar Kata Laluan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Kata Laluan Baharu">
              <div className="relative">
                <Input type={showPw ? "text" : "password"} value={pw.baharu} onChange={(e) => setPw({ ...pw, baharu: e.target.value })} placeholder="Minimum 8 aksara" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Field label="Sahkan Kata Laluan Baharu">
              <Input type={showPw ? "text" : "password"} value={pw.sah} onChange={(e) => setPw({ ...pw, sah: e.target.value })} placeholder="Ulang kata laluan baharu" />
            </Field>
            {pwError && <p className="text-xs text-red-500">{pwError}</p>}
            <div className="flex justify-end">
              <Button onClick={savePw}><ShieldCheck className="w-4 h-4" /> Kemas Kini Kata Laluan</Button>
            </div>
          </CardContent>
        </Card>

        {/* MFA */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-magenta-500" /> Pengesahan Dua Faktor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-500">
              Tambah lapisan keselamatan dengan kod pengesahan melalui aplikasi pengesah (cth. Google Authenticator).
            </p>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="text-sm font-medium text-slate-700">Status MFA</span>
              <Button variant={mfa ? "outline" : "primary"} size="sm" onClick={toggleMfa}>
                {mfa ? "Nyahaktifkan" : "Aktifkan"}
              </Button>
            </div>
            {mfa && codes.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-2">
                <p className="text-xs font-medium text-amber-700">Kod sandaran — simpan di tempat selamat. Setiap kod hanya boleh digunakan sekali.</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {codes.map((c) => (
                    <code key={c} className="text-xs bg-white border border-amber-200 rounded-lg px-2 py-1.5 text-center text-slate-700">{c}</code>
                  ))}
                </div>
                <Button
                  variant="outline" size="sm" className="w-full"
                  onClick={() => {
                    navigator.clipboard?.writeText(codes.join("\n"));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Disalin" : "Salin Kod Sandaran"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sesi aktif */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><MonitorSmartphone className="w-4 h-4 text-magenta-500" /> Sesi Aktif</CardTitle>
            <Button variant="outline" size="sm" onClick={() => { ensureSessions(); revokeOthers(); }} disabled={sessions.filter((s) => !s.semasa).length === 0}>
              <LogOut className="w-3.5 h-3.5" /> Tamatkan Semua Sesi Lain
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <THead><Tr><Th>Peranti</Th><Th>Lokasi</Th><Th>Alamat IP</Th><Th>Aktiviti</Th><Th /></Tr></THead>
            <TBody>
              {(sessions.length ? sessions : ensureSessions()).map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <MonitorSmartphone className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{s.peranti}</span>
                      {s.semasa && <Badge tone="green">Semasa</Badge>}
                    </div>
                  </Td>
                  <Td>{s.lokasi}</Td>
                  <Td><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{s.ip}</code></Td>
                  <Td className="text-slate-500">{s.masa}</Td>
                  <Td className="text-right">
                    {!s.semasa && (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => revokeSession(s.id)}>
                        <LogOut className="w-3.5 h-3.5" /> Tamatkan
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Log keselamatan (admin) */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><History className="w-4 h-4 text-magenta-500" /> Log Keselamatan</CardTitle></CardHeader>
          <CardContent className="p-0 max-h-80 overflow-y-auto">
            {!isAdmin ? (
              <p className="px-5 pb-5 text-sm text-slate-400">Log keselamatan penuh hanya tersedia untuk Admin.</p>
            ) : audit.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-slate-400">Tiada aktiviti direkodkan lagi.</p>
            ) : (
              <ul className="divide-y divide-slate-50">
                {audit.slice(0, 15).map((a) => (
                  <li key={a.id} className="px-5 py-3">
                    <p className="text-sm text-slate-700">{a.tindakan} — {a.butiran}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.masa}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Peranan & kebenaran */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-4 h-4 text-magenta-500" /> Peranan & Kebenaran</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <THead>
                <Tr><Th>Capaian</Th><Th className="text-center">Admin</Th><Th className="text-center">Ketua Panitia</Th><Th className="text-center">Guru</Th></Tr>
              </THead>
              <TBody>
                {roleRows.map((r) => (
                  <Tr key={r[0]}>
                    <Td className="font-medium text-slate-600">{r[0]}</Td>
                    {[r[1], r[2], r[3]].map((v, i) => (
                      <Td key={i} className="text-center">
                        {v === "✓" ? (
                          <BadgeCheck className="w-4 h-4 text-emerald-500 inline" />
                        ) : v === "—" ? (
                          <span className="text-slate-300">—</span>
                        ) : (
                          <span className="text-xs text-slate-500">{v}</span>
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Nota keselamatan */}
      <Card className="border-lavender-200 bg-lavender-100/40">
        <CardContent className="flex items-start gap-3 py-4">
          <ShieldCheck className="w-5 h-5 text-lavender-700 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-600 space-y-1">
            <p className="font-medium text-slate-700">Nota Keselamatan</p>
            <p>
              Aplikasi ini beroperasi dalam mod demo — pengesahan disimpan dalam <code className="bg-white/60 px-1 rounded">localStorage</code> pelayar.
              Untuk produksi, gunakan integrasi Supabase Auth dengan Row Level Security (lihat <code className="bg-white/60 px-1 rounded">supabase/schema.sql</code>).
            </p>
            <p>
              Jangan kongsi kata laluan atau kod sandaran MFA dengan sesi lain. <Link href="/tetapan-sistem" className="text-magenta-600 hover:underline">Tetapan Sistem</Link> membenarkan Admin menetapkan semula data demo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
