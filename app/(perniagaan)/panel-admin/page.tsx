"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Bell,
  BookOpen,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  Select,
  Table,
  TBody,
  Td,
  Textarea,
  Th,
  THead,
  Tr,
  uid,
  useToast,
} from "@/components/ui";
import { EduPageHeader } from "@/components/perniagaan/widgets";
import { useEdu } from "@/lib/perniagaan/store";
import {
  Announcement,
  Chapter,
  ExamPaper,
  NoteResource,
  PracticeQuestion,
  Tingkatan,
} from "@/lib/perniagaan/types";
import { NEGERI_PERCUBAAN } from "@/lib/perniagaan/data";
import { cn } from "@/components/ui";

type Tab = "overview" | "nota" | "bab" | "soalan" | "peperiksaan" | "pengumuman" | "pengguna";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Papan Pemuka", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "nota", label: "Nota", icon: <BookOpen className="h-4 w-4" /> },
  { id: "bab", label: "Bab KSSM", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "soalan", label: "Soalan", icon: <FileQuestion className="h-4 w-4" /> },
  { id: "peperiksaan", label: "Peperiksaan", icon: <ClipboardList className="h-4 w-4" /> },
  { id: "pengumuman", label: "Pengumuman", icon: <Bell className="h-4 w-4" /> },
  { id: "pengguna", label: "Pengguna", icon: <Users className="h-4 w-4" /> },
];

function AdminPanelInner() {
  const { data, ready, session, login, logout, addItem, updateItem, removeItem, resetData } = useEdu();
  const params = useSearchParams();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) || "overview");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [noteForm, setNoteForm] = useState({
    tingkatan: "T4" as Tingkatan,
    chapterId: "",
    tajuk: "",
    jenis: "Nota Lengkap" as NoteResource["jenis"],
    ringkasan: "",
    kandungan: "",
    status: "muat_naik" as NoteResource["status"],
    failNama: "",
    failData: "",
  });
  const [editingNote, setEditingNote] = useState<NoteResource | null>(null);
  const [editNoteForm, setEditNoteForm] = useState({
    tajuk: "",
    jenis: "Nota Lengkap" as NoteResource["jenis"],
    ringkasan: "",
    kandungan: "",
    status: "muat_naik" as NoteResource["status"],
  });
  const [questionForm, setQuestionForm] = useState({
    tingkatan: "T4" as Tingkatan,
    bab: 1,
    tajukBab: "",
    jenis: "Struktur" as PracticeQuestion["jenis"],
    soalan: "",
    markah: 2,
    skema: "",
  });
  const [paperForm, setPaperForm] = useState({
    kategori: "percubaan" as ExamPaper["kategori"],
    negeri: "Johor",
    tahun: new Date().getFullYear(),
    tingkatan: "T5" as ExamPaper["tingkatan"],
    kertas: "Kertas 1",
    tajuk: "",
    jenisDokumen: "Kertas Percubaan" as ExamPaper["jenisDokumen"],
    status: "placeholder" as ExamPaper["status"],
    catatan: "",
    failNama: "",
    failData: "",
  });
  const [announcementForm, setAnnouncementForm] = useState({
    tajuk: "",
    isi: "",
    tarikh: new Date().toISOString().slice(0, 10),
    jenis: "Umum" as Announcement["jenis"],
    disemat: false,
  });
  const [chapterForm, setChapterForm] = useState({
    tingkatan: "T4" as Tingkatan,
    nombor: 5,
    tajuk: "",
    ringkasan: "",
    konsep: "",
  });
  const [yearsText, setYearsText] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const canManage = session?.peranan === "admin" || session?.peranan === "guru";

  const chapters = useMemo(() => data?.chapters ?? [], [data]);
  const noteResources = useMemo(() => data?.noteResources ?? [], [data]);
  const practiceQuestions = useMemo(() => data?.practiceQuestions ?? [], [data]);

  if (!ready || !data) return <div className="py-20 text-center text-sm text-slate-400">Memuatkan panel...</div>;

  if (!session || !canManage) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-magenta-500 text-white">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Log Masuk Panel Guru/Admin</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Akses terhad untuk guru dan pentadbir panitia.</p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const result = login(email, password);
              if (!result.ok) setLoginError(result.message ?? "Log masuk gagal");
              else setLoginError("");
            }}
          >
            <Field label="Email" required>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="guru@panitia.my" />
            </Field>
            <Field label="Kata Laluan" required>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </Field>
            {loginError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{loginError}</p>}
            <Button className="w-full" type="submit">Log Masuk</Button>
          </form>
          <div className="mt-5 rounded-2xl bg-softpink-100 p-4 text-xs text-magenta-700 dark:bg-white/5 dark:text-slate-300">
            <p className="font-semibold">Akaun demo:</p>
            <p>Admin: admin@panitia.my / admin123</p>
            <p>Guru: guru@panitia.my / guru123</p>
            <p className="mt-2">Untuk produksi, gantikan dengan pengesahan Supabase/Auth yang selamat.</p>
          </div>
        </Card>
      </div>
    );
  }

  const addNote = () => {
    if (!noteForm.tajuk.trim() || !noteForm.chapterId) {
      toast("Sila lengkapkan tajuk dan bab", "error");
      return;
    }
    const chapter = chapters.find((c) => c.id === noteForm.chapterId);
    const resource: NoteResource = {
      id: uid(),
      chapterId: noteForm.chapterId,
      tingkatan: noteForm.tingkatan,
      tajuk: noteForm.tajuk,
      jenis: noteForm.jenis,
      kandungan: noteForm.kandungan || noteForm.ringkasan,
      ringkasan: noteForm.ringkasan || noteForm.tajuk,
      status: noteForm.status,
      dimuatNaikOleh: session.nama,
      tarikhMuatNaik: new Date().toISOString().slice(0, 10),
      saiz: noteForm.failNama || "Muat naik",
      failNama: noteForm.failNama || undefined,
      failData: noteForm.failData || undefined,
    };
    addItem("noteResources", resource);
    toast("Nota berjaya ditambah");
    setNoteForm({ ...noteForm, tajuk: "", ringkasan: "", kandungan: "", failNama: "", failData: "" });
  };

  const openEditNote = (note: NoteResource) => {
    setEditingNote(note);
    setEditNoteForm({
      tajuk: note.tajuk,
      jenis: note.jenis,
      ringkasan: note.ringkasan,
      kandungan: note.kandungan,
      status: note.status,
    });
  };

  const saveEditNote = () => {
    if (!editingNote || !editNoteForm.tajuk.trim()) {
      toast("Tajuk nota diperlukan", "error");
      return;
    }
    updateItem("noteResources", editingNote.id, editNoteForm);
    toast("Nota dikemas kini");
    setEditingNote(null);
  };

  const addQuestion = () => {
    if (!questionForm.soalan.trim() || !questionForm.tajukBab) {
      toast("Lengkapkan soalan dan tajuk bab", "error");
      return;
    }
    const chapter = chapters.find((c) => c.tingkatan === questionForm.tingkatan && c.nombor === questionForm.bab);
    const q: PracticeQuestion = {
      id: uid(),
      tingkatan: questionForm.tingkatan,
      bab: questionForm.bab,
      tajukBab: questionForm.tajukBab || chapter?.tajuk || "Umum",
      jenis: questionForm.jenis,
      soalan: questionForm.soalan,
      markah: questionForm.markah,
      skema: questionForm.skema || "Skema belum ditambah.",
      contoh: false,
    };
    addItem("practiceQuestions", q);
    toast("Soalan latih tubi ditambah");
    setQuestionForm({ ...questionForm, soalan: "", skema: "" });
  };

  const addPaper = () => {
    if (!paperForm.tajuk.trim()) {
      toast("Sila masukkan tajuk dokumen", "error");
      return;
    }
    const paper: ExamPaper = {
      id: uid(),
      kategori: paperForm.kategori,
      negeri: paperForm.kategori === "percubaan" ? paperForm.negeri : undefined,
      tahun: paperForm.tahun,
      tingkatan: paperForm.tingkatan,
      kertas: paperForm.kertas,
      tajuk: paperForm.tajuk,
      jenisDokumen: paperForm.jenisDokumen,
      status: paperForm.status,
      catatan: paperForm.catatan,
      failNama: paperForm.failNama || undefined,
      failData: paperForm.failData || undefined,
      dimuatNaikOleh: session.nama,
      tarikhMuatNaik: new Date().toISOString().slice(0, 10),
    };
    addItem("examPapers", paper);
    toast("Dokumen peperiksaan ditambah");
    setPaperForm({ ...paperForm, tajuk: "", catatan: "", failNama: "", failData: "" });
  };

  const addAnnouncement = () => {
    if (!announcementForm.tajuk.trim() || !announcementForm.isi.trim()) {
      toast("Lengkapkan tajuk dan isi pengumuman", "error");
      return;
    }
    const a: Announcement = { id: uid(), ...announcementForm };
    addItem("announcements", a);
    toast("Pengumuman ditambah");
    setAnnouncementForm({ ...announcementForm, tajuk: "", isi: "" });
  };

  const addChapter = () => {
    if (!chapterForm.tajuk.trim()) {
      toast("Sila masukkan tajuk bab", "error");
      return;
    }
    const maxBab = Math.max(0, ...chapters.filter((c) => c.tingkatan === chapterForm.tingkatan).map((c) => c.nombor));
    const chapter: Chapter = {
      id: uid(),
      tingkatan: chapterForm.tingkatan,
      nombor: chapterForm.nombor || maxBab + 1,
      tajuk: chapterForm.tajuk,
      ringkasan: chapterForm.ringkasan || chapterForm.tajuk,
      konsep: chapterForm.konsep.split("\n").map((x) => x.trim()).filter(Boolean),
      istilah: [],
      nota: [chapterForm.ringkasan || chapterForm.tajuk],
      contoh: [],
      dikemasKini: new Date().toISOString().slice(0, 10),
    };
    addItem("chapters", chapter);
    toast("Bab baharu ditambah");
    setChapterForm({ ...chapterForm, tajuk: "", ringkasan: "", konsep: "" });
  };

  const saveYears = () => {
    const source = yearsText || data.spmYears.join(", ");
    const years = source.split(",").map((x) => Number(x.trim())).filter((x) => !Number.isNaN(x)).sort((a, b) => b - a).slice(0, 5);
    if (!years.length) {
      toast("Masukkan tahun yang sah", "error");
      return;
    }
    const merged = { ...data, spmYears: years };
    localStorage.setItem("panitia_perniagaan_db_v1", JSON.stringify(merged));
    window.location.reload();
  };

  return (
    <div>
      <EduPageHeader
        title="Panel Guru & Pentadbir"
        subtitle={`Log masuk sebagai ${session.nama} (${session.peranan})`}
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard-pelajar"><Button variant="outline" size="sm">Dashboard Murid</Button></Link>
            <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4" /> Log Keluar</Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit p-3">
          <nav className="space-y-1">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  tab === item.id ? "bg-softpink-200 text-magenta-700 dark:bg-white/10 dark:text-white" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="min-w-0">
          {tab === "overview" && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Bab KSSM", value: data.chapters.length, icon: <BookOpen className="h-5 w-5" /> },
                { label: "Sumber Nota", value: data.noteResources.length, icon: <FileQuestion className="h-5 w-5" /> },
                { label: "Soalan Latih Tubi", value: data.practiceQuestions.length, icon: <ClipboardList className="h-5 w-5" /> },
                { label: "Dokumen Peperiksaan", value: data.examPapers.length, icon: <GraduationCap className="h-5 w-5" /> },
                { label: "Pengumuman", value: data.announcements.length, icon: <Bell className="h-5 w-5" /> },
                { label: "Cubaan Kuiz", value: data.attempts.length, icon: <Users className="h-5 w-5" /> },
                { label: "Pengguna", value: data.users.length, icon: <ShieldCheck className="h-5 w-5" /> },
                { label: "Muat Turun", value: data.downloads.length, icon: <Search className="h-5 w-5" /> },
              ].map((s) => (
                <Card key={s.label} className="p-5">
                  <div className="flex items-center justify-between">
                    <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p><p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p></div>
                    <div className="rounded-xl bg-primary-50 p-3 text-primary-600 dark:bg-white/10 dark:text-lavender-200">{s.icon}</div>
                  </div>
                </Card>
              ))}
              <Card className="p-5 sm:col-span-2 xl:col-span-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Tindakan Pentadbir</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setTab("nota")}><Plus className="h-4 w-4" /> Tambah Nota</Button>
                  <Button variant="outline" size="sm" onClick={() => setTab("soalan")}><Plus className="h-4 w-4" /> Tambah Soalan</Button>
                  <Button variant="outline" size="sm" onClick={() => setTab("peperiksaan")}><Plus className="h-4 w-4" /> Tambah Kertas</Button>
                  <Button variant="outline" size="sm" onClick={() => setTab("pengumuman")}><Plus className="h-4 w-4" /> Pengumuman</Button>
                  <Button variant="danger" size="sm" onClick={() => setConfirmReset(true)}>Tetapkan Semula Data Demo</Button>
                </div>
              </Card>
            </div>
          )}

          {tab === "nota" && (
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Muat Naik / Tambah Sumber Nota</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tingkatan"><Select value={noteForm.tingkatan} onChange={(e) => { setNoteForm({ ...noteForm, tingkatan: e.target.value as Tingkatan, chapterId: "" }); }}>{["T4", "T5"].map((t) => <option key={t} value={t}>{t === "T4" ? "Tingkatan 4" : "Tingkatan 5"}</option>)}</Select></Field>
                  <Field label="Bab"><Select value={noteForm.chapterId} onChange={(e) => setNoteForm({ ...noteForm, chapterId: e.target.value })}><option value="">Pilih bab</option>{chapters.filter((c) => c.tingkatan === noteForm.tingkatan).map((c) => <option key={c.id} value={c.id}>Bab {c.nombor}: {c.tajuk}</option>)}</Select></Field>
                  <Field label="Tajuk" className="sm:col-span-2"><Input value={noteForm.tajuk} onChange={(e) => setNoteForm({ ...noteForm, tajuk: e.target.value })} placeholder="cth: Nota Lengkap Bab 1" /></Field>
                  <Field label="Jenis"><Select value={noteForm.jenis} onChange={(e) => setNoteForm({ ...noteForm, jenis: e.target.value as NoteResource["jenis"] })}><option>Nota Lengkap</option><option>Ringkasan</option><option>Kad Istilah</option><option>PDF</option></Select></Field>
                  <Field label="Status"><Select value={noteForm.status} onChange={(e) => setNoteForm({ ...noteForm, status: e.target.value as NoteResource["status"] })}><option value="muat_naik">Muat Naik Guru</option><option value="contoh">Contoh</option><option value="rasmi">Rasmi</option></Select></Field>
                  <Field label="Ringkasan" className="sm:col-span-2"><Textarea value={noteForm.ringkasan} onChange={(e) => setNoteForm({ ...noteForm, ringkasan: e.target.value })} /></Field>
                  <Field label="Kandungan Nota" className="sm:col-span-2"><Textarea value={noteForm.kandungan} onChange={(e) => setNoteForm({ ...noteForm, kandungan: e.target.value })} className="min-h-[140px]" placeholder="Tampal kandungan nota di sini..." /></Field>
                  <Field label="Fail PDF / Imej (pilihan, maks ~700KB untuk LocalStorage)" className="sm:col-span-2">
                    <Input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 700 * 1024) {
                          toast("Fail terlalu besar untuk simpanan demo. Muat naik ke storan fail pada produksi.", "error");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => setNoteForm({ ...noteForm, failNama: file.name, failData: String(reader.result) });
                        reader.readAsDataURL(file);
                      }}
                    />
                    {noteForm.failNama && <p className="mt-1 text-xs text-emerald-600">Fail dipilih: {noteForm.failNama}</p>}
                  </Field>
                </div>
                <div className="mt-4 flex justify-end"><Button onClick={addNote}><Save className="h-4 w-4" /> Simpan Nota</Button></div>
              </Card>

              <Card>
                <div className="border-b border-slate-100 p-4"><h3 className="font-bold text-slate-900 dark:text-white">Senarai Sumber Nota ({noteResources.length})</h3></div>
                <Table>
                  <THead><Tr><Th>Tajuk</Th><Th>Jenis</Th><Th>Status</Th><Th>Oleh</Th><Th /> </Tr></THead>
                  <TBody>
                    {[...noteResources].sort((a, b) => b.tarikhMuatNaik.localeCompare(a.tarikhMuatNaik)).slice(0, 50).map((n) => (
                      <Tr key={n.id}>
                        <Td><p className="font-medium text-slate-800 dark:text-slate-200">{n.tajuk}</p><p className="text-xs text-slate-400">{n.tingkatan} · {n.tarikhMuatNaik}</p></Td>
                        <Td>{n.jenis}</Td>
                        <Td><Badge tone={n.status === "rasmi" ? "green" : n.status === "muat_naik" ? "pink" : "lavender"}>{n.status}</Badge></Td>
                        <Td>{n.dimuatNaikOleh}</Td>
                        <Td>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditNote(n)}>Edit</Button>
                            <Button variant="ghost" size="sm" onClick={() => { if (confirm("Padam sumber nota ini?")) removeItem("noteResources", n.id); }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </Card>
            </div>
          )}

          {tab === "bab" && (
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Tambah / Kemas Kini Bab</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Tingkatan"><Select value={chapterForm.tingkatan} onChange={(e) => setChapterForm({ ...chapterForm, tingkatan: e.target.value as Tingkatan })}><option value="T4">T4</option><option value="T5">T5</option></Select></Field>
                  <Field label="Nombor Bab"><Input type="number" value={chapterForm.nombor} onChange={(e) => setChapterForm({ ...chapterForm, nombor: Number(e.target.value) })} /></Field>
                  <Field label="Tajuk Bab" required><Input value={chapterForm.tajuk} onChange={(e) => setChapterForm({ ...chapterForm, tajuk: e.target.value })} /></Field>
                  <Field label="Ringkasan" className="sm:col-span-3"><Textarea value={chapterForm.ringkasan} onChange={(e) => setChapterForm({ ...chapterForm, ringkasan: e.target.value })} /></Field>
                  <Field label="Konsep (satu per baris)" className="sm:col-span-3"><Textarea value={chapterForm.konsep} onChange={(e) => setChapterForm({ ...chapterForm, konsep: e.target.value })} className="min-h-[120px]" /></Field>
                </div>
                <div className="mt-4 flex justify-end"><Button onClick={addChapter}><Plus className="h-4 w-4" /> Tambah Bab</Button></div>
              </Card>
              <Card>
                <div className="border-b border-slate-100 p-4"><h3 className="font-bold text-slate-900 dark:text-white">Senarai Bab Semasa</h3></div>
                <Table>
                  <THead><Tr><Th>Bab</Th><Th>Tajuk</Th><Th>Tingkatan</Th><Th>Kemaskini</Th><Th /></Tr></THead>
                  <TBody>
                    {chapters.map((c) => (
                      <Tr key={c.id}>
                        <Td className="font-semibold">{c.nombor}</Td>
                        <Td><p className="font-medium text-slate-800 dark:text-slate-200">{c.tajuk}</p><p className="text-xs text-slate-400">{c.ringkasan}</p></Td>
                        <Td><Badge tone={c.tingkatan === "T4" ? "purple" : "pink"}>{c.tingkatan}</Badge></Td>
                        <Td>{c.dikemasKini}</Td>
                        <Td>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => updateItem("chapters", c.id, { tajuk: window.prompt("Tajuk bab", c.tajuk) ?? c.tajuk })}><Save className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => { if (confirm("Padam bab ini?")) removeItem("chapters", c.id); }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </Card>
            </div>
          )}

          {tab === "soalan" && (
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Tambah Soalan Latih Tubi</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tingkatan"><Select value={questionForm.tingkatan} onChange={(e) => setQuestionForm({ ...questionForm, tingkatan: e.target.value as Tingkatan })}><option value="T4">T4</option><option value="T5">T5</option></Select></Field>
                  <Field label="Bab"><Select value={questionForm.bab} onChange={(e) => setQuestionForm({ ...questionForm, bab: Number(e.target.value) })}>{chapters.filter((c) => c.tingkatan === questionForm.tingkatan).map((c) => <option key={c.id} value={c.nombor}>Bab {c.nombor}</option>)}</Select></Field>
                  <Field label="Jenis"><Select value={questionForm.jenis} onChange={(e) => setQuestionForm({ ...questionForm, jenis: e.target.value as PracticeQuestion["jenis"] })}><option>Objektif</option><option>Struktur</option><option>Esei</option></Select></Field>
                  <Field label="Markah"><Input type="number" min={1} value={questionForm.markah} onChange={(e) => setQuestionForm({ ...questionForm, markah: Number(e.target.value) })} /></Field>
                  <Field label="Tajuk Bab" className="sm:col-span-2"><Input value={questionForm.tajukBab} onChange={(e) => setQuestionForm({ ...questionForm, tajukBab: e.target.value })} placeholder="cth: Pengurusan Sumber Manusia" /></Field>
                  <Field label="Soalan" className="sm:col-span-2" required><Textarea value={questionForm.soalan} onChange={(e) => setQuestionForm({ ...questionForm, soalan: e.target.value })} className="min-h-[90px]" /></Field>
                  <Field label="Skema Jawapan" className="sm:col-span-2"><Textarea value={questionForm.skema} onChange={(e) => setQuestionForm({ ...questionForm, skema: e.target.value })} className="min-h-[100px]" /></Field>
                </div>
                <div className="mt-4 flex justify-end"><Button onClick={addQuestion}><Plus className="h-4 w-4" /> Simpan Soalan</Button></div>
              </Card>
              <Card>
                <div className="border-b border-slate-100 p-4"><h3 className="font-bold text-slate-900 dark:text-white">Soalan Latih Tubi ({practiceQuestions.length})</h3></div>
                <Table>
                  <THead><Tr><Th>Soalan</Th><Th>Jenis</Th><Th>Markah</Th><Th>Tahap</Th><Th /></Tr></THead>
                  <TBody>
                    {practiceQuestions.map((q) => (
                      <Tr key={q.id}>
                        <Td><p className="font-medium text-slate-800 dark:text-slate-200">{q.soalan}</p><p className="text-xs text-slate-400">{q.tajukBab}</p></Td>
                        <Td><Badge tone="lavender">{q.jenis}</Badge></Td>
                        <Td>{q.markah}</Td>
                        <Td><Badge tone={q.contoh ? "pink" : "green"}>{q.contoh ? "Contoh" : "Guru"}</Badge></Td>
                        <Td><Button variant="ghost" size="sm" onClick={() => { if (confirm("Padam soalan ini?")) removeItem("practiceQuestions", q.id); }}><Trash2 className="h-4 w-4 text-red-500" /></Button></Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </Card>
            </div>
          )}

          {tab === "peperiksaan" && (
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Tambah Metadata Kertas Peperiksaan</h3>
                <p className="mb-4 text-xs text-slate-400">Sistem demo menyimpan metadata dan slot dokumen. Untuk PDF sebenar, gunakan storan fail Supabase/Firebase pada produksi.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Kategori"><Select value={paperForm.kategori} onChange={(e) => setPaperForm({ ...paperForm, kategori: e.target.value as ExamPaper["kategori"] })}><option value="percubaan">Percubaan Negeri</option><option value="spm">SPM</option></Select></Field>
                  {paperForm.kategori === "percubaan" && <Field label="Negeri"><Select value={paperForm.negeri} onChange={(e) => setPaperForm({ ...paperForm, negeri: e.target.value })}>{NEGERI_PERCUBAAN.map((n) => <option key={n}>{n}</option>)}</Select></Field>}
                  <Field label="Tahun"><Input type="number" value={paperForm.tahun} onChange={(e) => setPaperForm({ ...paperForm, tahun: Number(e.target.value) })} /></Field>
                  <Field label="Tingkatan"><Select value={paperForm.tingkatan} onChange={(e) => setPaperForm({ ...paperForm, tingkatan: e.target.value as ExamPaper["tingkatan"] })}><option value="T4">T4</option><option value="T5">T5</option><option value="Semua">Semua</option></Select></Field>
                  <Field label="Kertas"><Input value={paperForm.kertas} onChange={(e) => setPaperForm({ ...paperForm, kertas: e.target.value })} /></Field>
                  <Field label="Jenis Dokumen"><Select value={paperForm.jenisDokumen} onChange={(e) => setPaperForm({ ...paperForm, jenisDokumen: e.target.value as ExamPaper["jenisDokumen"] })}><option>Kertas Percubaan</option><option>Soalan</option><option>Skema Pemarkahan</option></Select></Field>
                  <Field label="Status"><Select value={paperForm.status} onChange={(e) => setPaperForm({ ...paperForm, status: e.target.value as ExamPaper["status"] })}><option value="placeholder">Placeholder</option><option value="rasmi">Rasmi</option></Select></Field>
                  <Field label="Tajuk" className="sm:col-span-2" required><Input value={paperForm.tajuk} onChange={(e) => setPaperForm({ ...paperForm, tajuk: e.target.value })} /></Field>
                  <Field label="Catatan" className="sm:col-span-2"><Textarea value={paperForm.catatan} onChange={(e) => setPaperForm({ ...paperForm, catatan: e.target.value })} /></Field>
                  <Field label="Fail PDF / Imej (pilihan, maks ~700KB)" className="sm:col-span-2">
                    <Input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 700 * 1024) {
                          toast("Fail terlalu besar untuk simpanan demo.", "error");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => setPaperForm({ ...paperForm, failNama: file.name, failData: String(reader.result) });
                        reader.readAsDataURL(file);
                      }}
                    />
                    {paperForm.failNama && <p className="mt-1 text-xs text-emerald-600">Fail dipilih: {paperForm.failNama}</p>}
                  </Field>
                </div>
                <div className="mt-4 flex justify-end"><Button onClick={addPaper}><Plus className="h-4 w-4" /> Simpan Dokumen</Button></div>
              </Card>

              <Card className="p-5">
                <h3 className="mb-3 font-bold text-slate-900 dark:text-white">Konfigurasi Tahun SPM (5 tahun)</h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input value={yearsText || data.spmYears.join(", ")} onChange={(e) => setYearsText(e.target.value)} placeholder="2021, 2022, 2023, 2024, 2025" />
                  <Button onClick={saveYears}>Simpan Tahun</Button>
                </div>
                <p className="mt-2 text-xs text-slate-400">Asingkan dengan koma. Sehingga lima tahun disimpan.</p>
              </Card>

              <Card>
                <div className="border-b border-slate-100 p-4"><h3 className="font-bold text-slate-900 dark:text-white">Dokumen Peperiksaan ({data.examPapers.length})</h3></div>
                <Table>
                  <THead><Tr><Th>Tajuk</Th><Th>Kategori</Th><Th>Tahun</Th><Th>Status</Th><Th /></Tr></THead>
                  <TBody>
                    {[...data.examPapers].sort((a, b) => (b.tarikhMuatNaik ?? "").localeCompare(a.tarikhMuatNaik ?? "")).slice(0, 50).map((p) => (
                      <Tr key={p.id}>
                        <Td><p className="font-medium text-slate-800 dark:text-slate-200">{p.tajuk}</p><p className="text-xs text-slate-400">{p.negeri ?? "SPM"} · {p.kertas}</p></Td>
                        <Td><Badge tone={p.kategori === "spm" ? "purple" : "pink"}>{p.kategori === "spm" ? "SPM" : "Percubaan"}</Badge></Td>
                        <Td>{p.tahun}</Td>
                        <Td><Badge tone={p.status === "rasmi" ? "green" : "amber"}>{p.status}</Badge></Td>
                        <Td><Button variant="ghost" size="sm" onClick={() => { if (confirm("Padam rekod ini?")) removeItem("examPapers", p.id); }}><Trash2 className="h-4 w-4 text-red-500" /></Button></Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </Card>
            </div>
          )}

          {tab === "pengumuman" && (
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Tambah Pengumuman</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tajuk" className="sm:col-span-2"><Input value={announcementForm.tajuk} onChange={(e) => setAnnouncementForm({ ...announcementForm, tajuk: e.target.value })} /></Field>
                  <Field label="Isi" className="sm:col-span-2"><Textarea value={announcementForm.isi} onChange={(e) => setAnnouncementForm({ ...announcementForm, isi: e.target.value })} className="min-h-[100px]" /></Field>
                  <Field label="Tarikh"><Input type="date" value={announcementForm.tarikh} onChange={(e) => setAnnouncementForm({ ...announcementForm, tarikh: e.target.value })} /></Field>
                  <Field label="Jenis"><Select value={announcementForm.jenis} onChange={(e) => setAnnouncementForm({ ...announcementForm, jenis: e.target.value as Announcement["jenis"] })}><option>Umum</option><option>Peperiksaan</option><option>Aktiviti</option><option>Penting</option></Select></Field>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><input type="checkbox" checked={announcementForm.disemat} onChange={(e) => setAnnouncementForm({ ...announcementForm, disemat: e.target.checked })} /> Semat di atas</label>
                </div>
                <div className="mt-4 flex justify-end"><Button onClick={addAnnouncement}><Plus className="h-4 w-4" /> Siarkan</Button></div>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                {data.announcements.map((a) => (
                  <Card key={a.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-semibold text-slate-900 dark:text-white">{a.tajuk}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{a.isi}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm("Padam pengumuman ini?")) removeItem("announcements", a.id); }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                    <div className="mt-3 flex gap-2"><Badge tone="pink">{a.jenis}</Badge><Badge tone="lavender">{a.tarikh}</Badge>{a.disemat && <Badge tone="green">Disemat</Badge>}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tab === "pengguna" && (
            <Card>
              <div className="border-b border-slate-100 p-4"><h3 className="font-bold text-slate-900 dark:text-white">Pengguna Sistem ({data.users.length})</h3></div>
              <Table>
                <THead><Tr><Th>Nama</Th><Th>Email</Th><Th>Peranan</Th><Th>Kelas</Th></Tr></THead>
                <TBody>
                  {data.users.map((u) => (
                    <Tr key={u.id}>
                      <Td className="font-medium text-slate-800 dark:text-slate-200">{u.nama}</Td>
                      <Td>{u.email}</Td>
                      <Td><Badge tone={u.peranan === "admin" ? "purple" : u.peranan === "guru" ? "pink" : "lavender"}>{u.peranan}</Badge></Td>
                      <Td>{u.kelas ?? "-"}</Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </Card>
          )}
        </div>
      </div>

      <Modal open={!!editingNote} onClose={() => setEditingNote(null)} title="Kemas Kini Nota" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tajuk" className="sm:col-span-2"><Input value={editNoteForm.tajuk} onChange={(e) => setEditNoteForm({ ...editNoteForm, tajuk: e.target.value })} /></Field>
          <Field label="Jenis"><Select value={editNoteForm.jenis} onChange={(e) => setEditNoteForm({ ...editNoteForm, jenis: e.target.value as NoteResource["jenis"] })}><option>Nota Lengkap</option><option>Ringkasan</option><option>Kad Istilah</option><option>PDF</option></Select></Field>
          <Field label="Status"><Select value={editNoteForm.status} onChange={(e) => setEditNoteForm({ ...editNoteForm, status: e.target.value as NoteResource["status"] })}><option value="muat_naik">Muat Naik Guru</option><option value="contoh">Contoh</option><option value="rasmi">Rasmi</option></Select></Field>
          <Field label="Ringkasan" className="sm:col-span-2"><Textarea value={editNoteForm.ringkasan} onChange={(e) => setEditNoteForm({ ...editNoteForm, ringkasan: e.target.value })} /></Field>
          <Field label="Kandungan" className="sm:col-span-2"><Textarea value={editNoteForm.kandungan} onChange={(e) => setEditNoteForm({ ...editNoteForm, kandungan: e.target.value })} className="min-h-[160px]" /></Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditingNote(null)}>Batal</Button>
          <Button onClick={saveEditNote}><Save className="h-4 w-4" /> Simpan Perubahan</Button>
        </div>
      </Modal>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Tetapkan Semula Data Demo">
        <p className="text-sm text-slate-600 dark:text-slate-300">Tindakan ini akan memadam semua nota, soalan, pengumuman dan cubaan yang ditambah oleh guru. Adakah anda pasti?</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmReset(false)}>Batal</Button>
          <Button variant="danger" onClick={() => { resetData(); setConfirmReset(false); toast("Data demo ditetapkan semula"); }}>Tetapkan Semula</Button>
        </div>
      </Modal>
    </div>
  );
}

export default function PanelAdminPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-400">Memuatkan panel...</div>}>
      <AdminPanelInner />
    </Suspense>
  );
}
