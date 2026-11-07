"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Download, Eye, Printer, Search } from "lucide-react";
import { Badge, Button, Card, EmptyState, Input, Select, Textarea } from "@/components/ui";
import { EduPageHeader } from "@/components/perniagaan/widgets";
import { trackAndDownload } from "@/components/perniagaan/widgets";
import { useEdu } from "@/lib/perniagaan/store";
import { JenisSoalanLatih, Tingkatan } from "@/lib/perniagaan/types";

export default function LatihTubiPage() {
  const { data, ready, addRecent, addDownload } = useEdu();
  const [tingkatan, setTingkatan] = useState<Tingkatan | "Semua">("Semua");
  const [bab, setBab] = useState("semua");
  const [jenis, setJenis] = useState<JenisSoalanLatih | "semua">("semua");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const chapters = useMemo(() => data?.chapters ?? [], [data]);

  const questions = useMemo(() => {
    if (!data) return [];
    let list = [...data.practiceQuestions];
    if (tingkatan !== "Semua") list = list.filter((q) => q.tingkatan === tingkatan);
    if (bab !== "semua") list = list.filter((q) => String(q.bab) === bab);
    if (jenis !== "semua") list = list.filter((q) => q.jenis === jenis);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((x) => x.soalan.toLowerCase().includes(q) || x.skema.toLowerCase().includes(q) || x.tajukBab.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.tingkatan.localeCompare(b.tingkatan) || a.bab - b.bab || a.jenis.localeCompare(b.jenis));
  }, [data, tingkatan, bab, jenis, search]);

  const attempted = useMemo(() => {
    const ids = new Set((data?.recentItems ?? []).filter((x) => x.jenis === "latih_tubi").map((x) => x.id));
    return questions.filter((q) => ids.has(q.id)).length;
  }, [questions, data]);

  const markAttempted = (id: string, label: string) => {
    addRecent({ id, jenis: "latih_tubi", label, href: "/latih-tubi", tarikh: new Date().toISOString() });
  };

  const downloadQuestion = (q: any) => {
    const content = [
      `SOALAN LATIH TUBI - ${q.tajukBab}`,
      `Tingkatan: ${q.tingkatan === "T4" ? "Tingkatan 4" : "Tingkatan 5"} · Bab ${q.bab}`,
      `Jenis: ${q.jenis} · Markah: ${q.markah}`,
      "=".repeat(60),
      q.soalan,
      "",
      "Jawapan: ______________________________",
      "",
      "=".repeat(60),
      "SKEMA JAWAPAN",
      q.skema,
      q.penerangan ? `\nPenerangan: ${q.penerangan}` : "",
      "\nDokumen contoh untuk kegunaan pembelajaran.",
    ].join("\n");
    trackAndDownload({ id: q.id, jenis: "muat_turun", label: q.soalan.slice(0, 80), href: "/latih-tubi", tarikh: new Date().toISOString() }, `latih-tubi-${q.id}.txt`, content);
    addDownload({ id: q.id, jenis: "muat_turun", label: q.soalan.slice(0, 80), href: "/latih-tubi", tarikh: new Date().toISOString() });
    markAttempted(q.id, q.soalan.slice(0, 80));
  };

  const printQuestions = () => {
    const content = questions.map((q, i) => `${i + 1}. [${q.jenis}/${q.markah} markah] ${q.soalan}\nJawapan: ______________________`).join("\n\n");
    trackAndDownload({ id: "latih-tubi-print", jenis: "muat_turun", label: "Latih tubi cetak", href: "/latih-tubi", tarikh: new Date().toISOString() }, "latih-tubi.txt", `PANITIA PERNIAGAAN - SOALAN LATIH TUBI\n\n${content}\n`);
  };

  if (!ready || !data) return <div className="py-20 text-center text-sm text-slate-400">Memuatkan soalan latih tubi...</div>;

  return (
    <div>
      <EduPageHeader
        title="Soalan Latih Tubi Mengikut Bab"
        subtitle="Bank soalan objektif, struktur dan esei dengan skema jawapan untuk latihan berterusan."
        actions={<Badge tone="pink">{attempted}/{questions.length} cuba dalam senarai ini</Badge>}
      />

      <Card className="mb-5 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[180px_1fr_180px_180px_auto]">
          <Select value={tingkatan} onChange={(e) => { setTingkatan(e.target.value as Tingkatan | "Semua"); setBab("semua"); }}>
            <option value="Semua">Semua Tingkatan</option>
            <option value="T4">Tingkatan 4</option>
            <option value="T5">Tingkatan 5</option>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari soalan atau skema..." className="pl-9" />
          </div>
          <Select value={bab} onChange={(e) => setBab(e.target.value)}>
            <option value="semua">Semua Bab</option>
            {chapters.map((c) => <option key={c.id} value={c.nombor}>{c.tingkatan} Bab {c.nombor}</option>)}
          </Select>
          <Select value={jenis} onChange={(e) => setJenis(e.target.value as JenisSoalanLatih | "semua")}>
            <option value="semua">Semua Jenis</option>
            <option value="Objektif">Objektif</option>
            <option value="Struktur">Struktur</option>
            <option value="Esei">Esei</option>
          </Select>
          <Button variant="outline" onClick={printQuestions} disabled={questions.length === 0}><Printer className="h-4 w-4" /> Cetak</Button>
        </div>
      </Card>

      <div className="space-y-4">
        {questions.map((q, index) => {
          const open = openId === q.id;
          const showAnswer = !!revealed[q.id];
          return (
            <Card key={q.id} className="overflow-hidden">
              <button className="flex w-full items-start justify-between gap-4 p-5 text-left" onClick={() => setOpenId(open ? null : q.id)}>
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge tone="purple">{q.tingkatan === "T4" ? "T4" : "T5"}</Badge>
                    <Badge tone="pink">Bab {q.bab}</Badge>
                    <Badge tone="lavender">{q.jenis}</Badge>
                    <Badge tone="rose">{q.markah} markah</Badge>
                    {q.contoh && <Badge tone="green">Contoh</Badge>}
                  </div>
                  <p className="font-medium leading-relaxed text-slate-800 dark:text-slate-100">{index + 1}. {q.soalan}</p>
                  <p className="mt-1 text-xs text-slate-400">{q.tajukBab}</p>
                </div>
                {open ? <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" /> : <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />}
              </button>
              {open && (
                <div className="border-t border-slate-100 p-5 dark:border-white/10">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Jawapan Anda (ruang cuba dalam talian)</span>
                    <Textarea
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      placeholder="Taip jawapan anda di sini..."
                      className="min-h-[100px]"
                    />
                  </label>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setRevealed({ ...revealed, [q.id]: !showAnswer })}>
                      <Eye className="h-4 w-4" /> {showAnswer ? "Sembunyikan Skema" : "Tunjuk Skema Jawapan"}
                    </Button>
                    <Button variant="soft" size="sm" onClick={() => { markAttempted(q.id, q.soalan.slice(0, 80)); setRevealed({ ...revealed, [q.id]: true }); }}>
                      <CheckCircle2 className="h-4 w-4" /> Tanda Sudah Cuba
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => downloadQuestion(q)}>
                      <Download className="h-4 w-4" /> Muat Turun
                    </Button>
                  </div>
                  {showAnswer && (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/20">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-200">Skema Jawapan ({q.markah} markah)</p>
                      <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-200">{q.skema}</p>
                      {q.penerangan && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Penerangan: {q.penerangan}</p>}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {questions.length === 0 && (
        <Card><EmptyState title="Tiada soalan dijumpai" message="Cuba ubah penapis atau kata kunci carian." /></Card>
      )}
    </div>
  );
}
