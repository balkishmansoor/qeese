"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Download,
  FileText,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Select,
} from "@/components/ui";
import { EduPageHeader } from "./widgets";
import { BookmarkButton, downloadDataUrl, trackAndDownload } from "./widgets";
import { useEdu } from "@/lib/perniagaan/store";
import { Chapter, NoteResource, Tingkatan } from "@/lib/perniagaan/types";
import { formatTarikhPendek } from "@/lib/utils";

function chapterHref(tingkatan: Tingkatan) {
  return tingkatan === "T4" ? "/nota-t4" : "/nota-t5";
}

function NotaBrowserInner({ tingkatan }: { tingkatan: Tingkatan }) {
  const { data, ready, session, addRecent, addDownload } = useEdu();
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [jenis, setJenis] = useState("semua");
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<NoteResource | null>(null);

  const chapters = useMemo(
    () => data?.chapters.filter((c) => c.tingkatan === tingkatan) ?? [],
    [data, tingkatan]
  );

  const chapterById = useMemo(() => {
    const map = new Map<string, Chapter>();
    chapters.forEach((c) => map.set(c.id, c));
    return map;
  }, [chapters]);

  const notes = useMemo(() => {
    if (!data) return [];
    let list = data.noteResources.filter((n) => n.tingkatan === tingkatan);
    if (selectedChapter) list = list.filter((n) => n.chapterId === selectedChapter);
    if (jenis !== "semua") list = list.filter((n) => n.jenis === jenis);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.tajuk.toLowerCase().includes(q) ||
          n.kandungan.toLowerCase().includes(q) ||
          chapterById.get(n.chapterId)?.tajuk.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, tingkatan, selectedChapter, jenis, search, chapterById]);

  useEffect(() => {
    if (!ready || chapters.length === 0) return;
    const bab = params.get("bab");
    const nota = params.get("nota");
    if (nota && data) {
      const found = data.noteResources.find((n) => n.id === nota);
      if (found) {
        setSelectedNote(found);
        setSelectedChapter(found.chapterId);
        addRecent({
          id: found.id,
          jenis: "nota",
          label: found.tajuk,
          href: `${chapterHref(found.tingkatan)}?nota=${found.id}`,
          tarikh: new Date().toISOString(),
        });
        return;
      }
    }
    if (bab && chapters.some((c) => c.id === bab)) {
      setSelectedChapter(bab);
      const chapter = chapters.find((c) => c.id === bab)!;
      addRecent({
        id: chapter.id,
        jenis: "bab",
        label: `Bab ${chapter.nombor}: ${chapter.tajuk}`,
        href: `${chapterHref(tingkatan)}?bab=${chapter.id}`,
        tarikh: new Date().toISOString(),
      });
    } else if (!selectedChapter) {
      setSelectedChapter(chapters[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, chapters, data, params]);

  const selectedChapterData = selectedChapter ? chapterById.get(selectedChapter) : undefined;
  const canManage = session?.peranan === "admin" || session?.peranan === "guru";

  const downloadNote = (note: NoteResource) => {
    const chapter = chapterById.get(note.chapterId);
    const content = [
      note.tajuk.toUpperCase(),
      `Tingkatan: ${tingkatan === "T4" ? "Tingkatan 4" : "Tingkatan 5"}`,
      chapter ? `Bab: ${chapter.nombor}. ${chapter.tajuk}` : "",
      `Status: ${note.status === "rasmi" ? "Dokumen rasmi" : "Kandungan contoh"}`,
      `Dimuat naik oleh: ${note.dimuatNaikOleh} pada ${note.tarikhMuatNaik}`,
      "=".repeat(60),
      note.ringkasan,
      "",
      note.kandungan,
      "",
      chapter ? `Konsep Penting:\n${chapter.konsep.map((x) => `- ${x}`).join("\n")}` : "",
      chapter ? `Istilah:\n${chapter.istilah.map((x) => `- ${x.istilah}: ${x.maksud}`).join("\n")}` : "",
    ].join("\n");
    const item = {
      id: note.id,
      jenis: "muat_turun" as const,
      label: note.tajuk,
      href: `${chapterHref(note.tingkatan)}?nota=${note.id}`,
      tarikh: new Date().toISOString(),
    };
    if (note.failData) {
      downloadDataUrl(note.failNama ?? `${note.id}.pdf`, note.failData);
      addDownload(item);
      return;
    }
    trackAndDownload(item, `${note.id}.txt`, content);
    addDownload(item);
  };

  if (!ready || !data) {
    return <div className="py-20 text-center text-sm text-slate-400">Memuatkan nota...</div>;
  }

  return (
    <div>
      <EduPageHeader
        title={`Nota Perniagaan ${tingkatan === "T4" ? "Tingkatan 4" : "Tingkatan 5"}`}
        subtitle="Nota digital disusun mengikut bab buku teks KSSM dengan ringkasan, istilah dan contoh."
        actions={
          canManage ? (
            <Link href="/panel-admin?tab=nota">
              <Button variant="outline" size="sm">
                <ShieldCheck className="h-4 w-4" /> Urus Nota
              </Button>
            </Link>
          ) : undefined
        }
      />

      <div className="mb-5 grid gap-3 rounded-2xl border border-lavender-200 bg-lavender-50/70 p-4 text-sm text-lavender-700 sm:grid-cols-3 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {chapters.length} bab KSSM</div>
        <div className="flex items-center gap-2"><FileText className="h-4 w-4" /> {notes.length} sumber nota</div>
        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Boleh dicari & dimuat turun</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <Card className="h-fit p-4">
          <div className="mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">Bab KSSM</h2>
            <p className="text-xs text-slate-400">Pilih bab untuk menapis nota berkaitan.</p>
          </div>
          <div className="space-y-2">
            {chapters.map((chapter) => {
              const active = selectedChapter === chapter.id;
              const count = data.noteResources.filter((n) => n.chapterId === chapter.id).length;
              return (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                    active
                      ? "border-primary-300 bg-primary-50 dark:border-white/20 dark:bg-white/10"
                      : "border-slate-100 hover:border-lavender-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${active ? "text-primary-700 dark:text-white" : "text-slate-700 dark:text-slate-200"}`}>
                      Bab {chapter.nombor}: {chapter.tajuk}
                    </p>
                    <Badge tone="pink">{count}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{chapter.ringkasan}</p>
                </button>
              );
            })}
          </div>
        </Card>

        <div>
          <Card className="mb-4 p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nota mengikut tajuk atau kata kunci..."
                  className="pl-9"
                />
              </div>
              <Select value={jenis} onChange={(e) => setJenis(e.target.value)}>
                <option value="semua">Semua Jenis</option>
                <option>Nota Lengkap</option>
                <option>Ringkasan</option>
                <option>Kad Istilah</option>
                <option>PDF</option>
              </Select>
            </div>
          </Card>

          {selectedChapterData && (
            <Card className="mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-magenta-500 p-5 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/15 text-white">Bab {selectedChapterData.nombor}</Badge>
                  <Badge className="bg-white/15 text-white">{tingkatan === "T4" ? "Tingkatan 4" : "Tingkatan 5"}</Badge>
                </div>
                <h2 className="mt-2 text-xl font-bold">{selectedChapterData.tajuk}</h2>
                <p className="mt-1 text-sm text-primary-50">{selectedChapterData.ringkasan}</p>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Konsep Penting</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {selectedChapterData.konsep.slice(0, 4).map((item) => (
                      <li key={item} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-magenta-400" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Istilah Utama</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedChapterData.istilah.map((item) => (
                      <span key={item.istilah} className="rounded-full bg-lavender-100 px-3 py-1 text-xs font-medium text-lavender-700 dark:bg-white/10 dark:text-slate-200">
                        {item.istilah}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Contoh Aplikasi</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {selectedChapterData.contoh.slice(0, 3).map((item) => (
                      <li key={item} className="flex gap-2"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {notes.map((note) => (
              <Card key={note.id} className="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-pop">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="rounded-xl bg-softpink-100 p-3 text-magenta-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <BookmarkButton id={note.id} />
                </div>
                <h3 className="font-semibold leading-snug text-slate-900 dark:text-white">{note.tajuk}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{note.ringkasan}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Badge tone="purple">{note.jenis}</Badge>
                  <Badge tone={note.status === "rasmi" ? "green" : "lavender"}>{note.status === "rasmi" ? "Rasmi" : "Contoh"}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
                  <p className="text-xs text-slate-400">{note.dimuatNaikOleh} · {formatTarikhPendek(note.tarikhMuatNaik)}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => downloadNote(note)}>
                      <Download className="h-4 w-4" /> TXT
                    </Button>
                    <Button size="sm" onClick={() => {
                      setSelectedNote(note);
                      addRecent({ id: note.id, jenis: "nota", label: note.tajuk, href: `${chapterHref(note.tingkatan)}?nota=${note.id}`, tarikh: new Date().toISOString() });
                    }}>
                      Baca
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {notes.length === 0 && (
            <Card>
              <EmptyState
                title="Tiada nota dijumpai"
                message="Cuba ubah kata kunci carian atau pilih bab yang lain."
              />
            </Card>
          )}
        </div>
      </div>

      <Modal open={!!selectedNote} onClose={() => setSelectedNote(null)} title={selectedNote?.tajuk ?? "Nota"} wide>
        {selectedNote && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone="purple">{selectedNote.jenis}</Badge>
              <Badge tone={selectedNote.status === "rasmi" ? "green" : "lavender"}>{selectedNote.status === "rasmi" ? "Dokumen rasmi" : "Kandungan contoh"}</Badge>
              <Badge tone="pink">{selectedNote.dimuatNaikOleh}</Badge>
            </div>
            <div className="rounded-2xl bg-softpink-100 p-4 text-sm leading-relaxed text-magenta-800 dark:bg-white/10 dark:text-slate-200">
              {selectedNote.ringkasan}
            </div>
            {selectedNote.failData && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                {selectedNote.failData.startsWith("data:image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedNote.failData} alt={selectedNote.failNama ?? selectedNote.tajuk} className="max-h-[520px] w-full object-contain bg-slate-50" />
                ) : (
                  <iframe src={selectedNote.failData} title={selectedNote.failNama ?? selectedNote.tajuk} className="h-[520px] w-full bg-white" />
                )}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-white/10">
                  <p className="truncate text-xs text-slate-400">{selectedNote.failNama}</p>
                  <a href={selectedNote.failData} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary-600 hover:underline">Buka dalam tab baharu</a>
                </div>
              </div>
            )}
            <div className="mt-5 space-y-4">
              {selectedNote.kandungan.split(/\n{2,}/).map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{paragraph}</p>
              ))}
            </div>
            {selectedChapterData && (
              <div className="mt-6 grid gap-4 rounded-2xl border border-slate-100 p-4 md:grid-cols-2 dark:border-white/10">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Istilah Penting</p>
                  <div className="mt-2 space-y-2">
                    {selectedChapterData.istilah.map((item) => (
                      <p key={item.istilah} className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-primary-700 dark:text-lavender-200">{item.istilah}:</span> {item.maksud}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Contoh</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {selectedChapterData.contoh.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <BookmarkButton id={selectedNote.id} />
              <Button variant="outline" onClick={() => downloadNote(selectedNote)}>
                <Download className="h-4 w-4" /> Muat Turun Nota
              </Button>
              <Button onClick={() => setSelectedNote(null)}>Tutup</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function NotaBrowser({ tingkatan }: { tingkatan: Tingkatan }) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-400">Memuatkan nota...</div>}>
      <NotaBrowserInner tingkatan={tingkatan} />
    </Suspense>
  );
}
