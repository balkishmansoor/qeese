"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileQuestion,
  Play,
  RotateCcw,
  Timer,
  Trophy,
  User,
  XCircle,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, Input, Select } from "@/components/ui";
import { EduPageHeader } from "@/components/perniagaan/widgets";
import { useEdu } from "@/lib/perniagaan/store";
import { Kesukaran, QuizQuestion, Tingkatan } from "@/lib/perniagaan/types";
import { cn } from "@/components/ui";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function KuizPage() {
  const { data, ready, recordAttempt, studentName, setStudentName } = useEdu();
  const [tingkatan, setTingkatan] = useState<Tingkatan>("T4");
  const [bab, setBab] = useState("semua");
  const [kesukaran, setKesukaran] = useState<Kesukaran | "semua">("semua");
  const [jenis, setJenis] = useState<"semua" | "objektif" | "benar_salah">("semua");
  const [jumlah, setJumlah] = useState("10");
  const [name, setName] = useState(studentName);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => setName(studentName), [studentName]);

  const chapters = useMemo(() => {
    return data?.chapters.filter((c) => c.tingkatan === tingkatan) ?? [];
  }, [data, tingkatan]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.quizQuestions.filter((q) => q.tingkatan === tingkatan);
    if (bab !== "semua") list = list.filter((q) => String(q.bab) === bab);
    if (kesukaran !== "semua") list = list.filter((q) => q.kesukaran === kesukaran);
    if (jenis !== "semua") list = list.filter((q) => q.jenis === jenis);
    return list;
  }, [data, tingkatan, bab, kesukaran, jenis]);

  const leaderboard = useMemo(() => {
    if (!data) return [];
    return [...data.attempts]
      .sort((a, b) => b.peratus - a.peratus || b.tarikh.localeCompare(a.tarikh))
      .slice(0, 8);
  }, [data]);

  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }
    const timer = window.setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, submitted, timeLeft]);

  const startQuiz = () => {
    const limit = jumlah === "semua" ? filtered.length : Number(jumlah);
    const selected = [...filtered].sort(() => Math.random() - 0.5).slice(0, limit);
    setQuestions(selected);
    setAnswers(selected.map(() => null));
    setIndex(0);
    setStarted(true);
    setSubmitted(false);
    setShowReview(false);
    setTimeLeft(Math.max(60, selected.length * 45));
    if (name.trim()) setStudentName(name.trim());
  };

  const finishQuiz = () => {
    setSubmitted(true);
    if (!data || questions.length === 0) return;
    let correct = 0;
    let earned = 0;
    let max = 0;
    questions.forEach((q, i) => {
      max += q.markah;
      if (answers[i] === q.jawapan) {
        correct += 1;
        earned += q.markah;
      }
    });
    const peratus = max ? Math.round((earned / max) * 100) : 0;
    recordAttempt({
      namaMurid: name.trim() || studentName || "Murid Tetamu",
      tingkatan,
      bab: bab === "semua" ? "Semua Bab" : `Bab ${bab}`,
      jumlahSoalan: questions.length,
      jawapanBetul: correct,
      peratus,
      masa: Math.max(0, questions.length * 45 - timeLeft),
    });
  };

  const reset = () => {
    setStarted(false);
    setSubmitted(false);
    setShowReview(false);
    setQuestions([]);
    setAnswers([]);
    setIndex(0);
  };

  const score = useMemo(() => {
    if (!submitted || questions.length === 0) return { correct: 0, earned: 0, max: 0, peratus: 0 };
    let correct = 0;
    let earned = 0;
    let max = 0;
    questions.forEach((q, i) => {
      max += q.markah;
      if (answers[i] === q.jawapan) {
        correct += 1;
        earned += q.markah;
      }
    });
    return { correct, earned, max, peratus: max ? Math.round((earned / max) * 100) : 0 };
  }, [submitted, questions, answers]);

  if (!ready || !data) {
    return <div className="py-20 text-center text-sm text-slate-400">Memuatkan kuiz...</div>;
  }

  return (
    <div>
      <EduPageHeader
        title="Kuiz Online Perniagaan"
        subtitle="Jawab soalan objektif dan betul atau palsu dengan pemasa serta semakan jawapan."
        actions={<Badge tone="pink">Kandungan contoh untuk demo</Badge>}
      />

      {!started ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-5">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Tetapan Kuiz</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Nama Murid</span>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-9" placeholder="Nama anda" />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Tingkatan</span>
                <Select value={tingkatan} onChange={(e) => { setTingkatan(e.target.value as Tingkatan); setBab("semua"); }}>
                  <option value="T4">Tingkatan 4</option>
                  <option value="T5">Tingkatan 5</option>
                </Select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Bab</span>
                <Select value={bab} onChange={(e) => setBab(e.target.value)}>
                  <option value="semua">Semua Bab</option>
                  {chapters.map((c) => <option key={c.id} value={c.nombor}>Bab {c.nombor}: {c.tajuk}</option>)}
                </Select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Tahap Kesukaran</span>
                <Select value={kesukaran} onChange={(e) => setKesukaran(e.target.value as Kesukaran | "semua")}>
                  <option value="semua">Semua Tahap</option>
                  <option value="mudah">Mudah</option>
                  <option value="sederhana">Sederhana</option>
                  <option value="sukar">Sukar</option>
                </Select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Jenis Soalan</span>
                <Select value={jenis} onChange={(e) => setJenis(e.target.value as typeof jenis)}>
                  <option value="semua">Semua Jenis</option>
                  <option value="objektif">Objektif</option>
                  <option value="benar_salah">Betul / Palsu</option>
                </Select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Bilangan Soalan</span>
                <Select value={jumlah} onChange={(e) => setJumlah(e.target.value)}>
                  <option value="5">5 soalan</option>
                  <option value="10">10 soalan</option>
                  <option value="15">15 soalan</option>
                  <option value="semua">Semua ({filtered.length})</option>
                </Select>
              </label>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-softpink-100 p-4 text-sm text-magenta-700 dark:bg-white/5 dark:text-slate-300">
              <span>{filtered.length} soalan tersedia untuk penapis semasa.</span>
              <Button onClick={startQuiz} disabled={filtered.length === 0}>
                <Play className="h-4 w-4" /> Mula Kuiz
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="font-bold text-slate-900 dark:text-white">Papan Pendahulu</h2>
            </div>
            <div className="space-y-3">
              {leaderboard.length === 0 && <p className="text-sm text-slate-400">Belum ada percubaan direkodkan.</p>}
              {leaderboard.map((attempt, i) => (
                <div key={attempt.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 dark:border-white/10">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold", i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-lavender-100 text-lavender-700")}>
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{attempt.namaMurid}</p>
                    <p className="text-xs text-slate-400">{attempt.tingkatan} · {attempt.bab}</p>
                  </div>
                  <Badge tone={attempt.peratus >= 80 ? "green" : attempt.peratus >= 50 ? "pink" : "rose"}>{attempt.peratus}%</Badge>
                </div>
              ))}
            </div>
            <Link href="/kuiz-offline" className="mt-4 block">
              <Button variant="outline" className="w-full">
                <FileQuestion className="h-4 w-4" /> Perlukan versi luar talian?
              </Button>
            </Link>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Soalan {Math.min(index + 1, questions.length)} daripada {questions.length}</p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{questions[index]?.tajukBab}</h2>
              </div>
              <div className={cn("flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold", timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-lavender-100 text-lavender-700 dark:bg-white/10 dark:text-slate-200")}>
                <Timer className="h-4 w-4" /> {formatTime(timeLeft)}
              </div>
            </div>

            {!submitted && (
              <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div className="h-full bg-gradient-to-r from-primary-500 to-magenta-500 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
              </div>
            )}

            <div className="rounded-2xl bg-softpink-100 p-4 text-sm font-medium leading-relaxed text-primary-900 dark:bg-white/10 dark:text-slate-100">
              {questions[index]?.soalan}
            </div>

            <div className="mt-5 space-y-3">
              {questions[index]?.pilihan.map((option, optionIndex) => {
                const selected = answers[index] === optionIndex;
                const isCorrect = submitted && questions[index]?.jawapan === optionIndex;
                const isWrong = submitted && selected && !isCorrect;
                return (
                  <button
                    key={optionIndex}
                    disabled={submitted}
                    onClick={() => {
                      const next = [...answers];
                      next[index] = optionIndex;
                      setAnswers(next);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm transition-all",
                      isCorrect
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
                        : isWrong
                        ? "border-red-300 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-200"
                        : selected
                        ? "border-primary-400 bg-primary-50 text-primary-800 dark:bg-white/10 dark:text-white"
                        : "border-slate-200 bg-white hover:border-lavender-300 hover:bg-lavender-50/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    )}
                  >
                    <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold", selected || isCorrect || isWrong ? "border-current" : "border-slate-300 text-slate-400")}>
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isCorrect && <CheckCircle2 className="h-5 w-5" />}
                    {isWrong && <XCircle className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>

            {submitted && questions[index] && (
              <div className="mt-5 rounded-2xl border border-lavender-200 bg-lavender-50/70 p-4 text-sm text-lavender-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <p className="font-semibold">Penerangan</p>
                <p className="mt-1">{questions[index].penerangan}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" disabled={index === 0} onClick={() => setIndex((v) => v - 1)}>
                <ChevronLeft className="h-4 w-4" /> Sebelum
              </Button>
              <div className="flex gap-2">
                {!submitted && index < questions.length - 1 && (
                  <Button onClick={() => setIndex((v) => v + 1)}>Seterusnya <ChevronRight className="h-4 w-4" /></Button>
                )}
                {!submitted && index === questions.length - 1 && (
                  <Button onClick={finishQuiz}>Hantar Jawapan</Button>
                )}
                {submitted && (
                  <>
                    <Button variant="outline" onClick={() => setShowReview((v) => !v)}>
                      {showReview ? "Sembunyikan Semakan" : "Semak Jawapan"}
                    </Button>
                    <Button onClick={reset}><RotateCcw className="h-4 w-4" /> Cuba Lagi</Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-5 text-center">
              <Clock className="mx-auto h-8 w-8 text-primary-500" />
              <p className="mt-2 text-sm text-slate-400">Masa berbaki</p>
              <p className={cn("text-3xl font-bold", timeLeft < 60 ? "text-red-500" : "text-slate-900 dark:text-white")}>{formatTime(timeLeft)}</p>
            </Card>
            {submitted && (
              <Card className="p-5 text-center">
                <Award className="mx-auto h-10 w-10 text-amber-500" />
                <p className="mt-2 text-4xl font-extrabold text-primary-700 dark:text-lavender-200">{score.peratus}%</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{score.correct} / {questions.length} soalan betul · {score.earned}/{score.max} markah</p>
              </Card>
            )}
            <Card className="p-4">
              <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Navigasi Soalan</p>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-9 rounded-lg text-xs font-semibold transition-colors",
                      i === index
                        ? "bg-primary-600 text-white"
                        : answers[i] !== null
                        ? "bg-lavender-200 text-lavender-800 dark:bg-white/10 dark:text-slate-200"
                        : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {submitted && showReview && (
        <Card className="mt-6 p-5">
          <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Semakan Jawapan</h2>
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={q.id} className={cn("rounded-2xl border p-4", answers[i] === q.jawapan ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-red-200 bg-red-50/60 dark:border-red-900 dark:bg-red-950/20")}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{i + 1}. {q.soalan}</p>
                  <Badge tone={answers[i] === q.jawapan ? "green" : "rose"}>{answers[i] === q.jawapan ? "Betul" : "Salah"}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Jawapan anda: {answers[i] === null ? "-" : q.pilihan[answers[i] as number]} · Jawapan betul: {q.pilihan[q.jawapan]}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{q.penerangan}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {filtered.length === 0 && !started && (
        <Card><EmptyState title="Tiada soalan untuk penapis ini" message="Cuba pilih bab, tahap atau jenis soalan yang lain." /></Card>
      )}
    </div>
  );
}
