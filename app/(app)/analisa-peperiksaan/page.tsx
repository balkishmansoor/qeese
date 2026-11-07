"use client";

import React, { useMemo, useRef, useState } from "react";
import { Upload, FileDown, AlertTriangle, GraduationCap, TrendingUp, Users, Percent } from "lucide-react";
import {
  Button, Card, Badge, Input, Select, Field, Modal, useToast,
  Table, THead, TBody, Tr, Th, Td, EmptyState,
} from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { BarChartCard, PieChartCard, LineChartCard } from "@/components/charts";
import { useStore } from "@/lib/store";
import { ExamResult, GradeScale } from "@/lib/types";
import { uid, todayISO } from "@/lib/utils";
import * as XLSX from "xlsx";

function gredDaripada(markah: number, scales: GradeScale[]): string {
  for (const s of scales) if (markah >= s.min && markah <= s.max) return s.gred;
  return "—";
}

export default function AnalisaPage() {
  const { get, add, setGradeScales, data, ready } = useStore();
  const toast = useToast();
  const results = get("results");
  const gradeScales = data?.gradeScales ?? [];

  const [pepFilter, setPepFilter] = useState("semua");
  const [kelasFilter, setKelasFilter] = useState("semua");
  const [subjekFilter, setSubjekFilter] = useState("semua");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [scaleOpen, setScaleOpen] = useState(false);
  const [scales, setScales] = useState<GradeScale[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const exams = useMemo(() => [...new Set(results.map((r) => r.peperiksaan))], [results]);
  const kelasList = useMemo(() => [...new Set(results.map((r) => r.kelas))].sort(), [results]);
  const subjekList = useMemo(() => [...new Set(results.map((r) => r.subjek))].sort(), [results]);

  const filtered = useMemo(() => {
    let list = results;
    if (pepFilter !== "semua") list = list.filter((r) => r.peperiksaan === pepFilter);
    if (kelasFilter !== "semua") list = list.filter((r) => r.kelas === kelasFilter);
    if (subjekFilter !== "semua") list = list.filter((r) => r.subjek === subjekFilter);
    return list;
  }, [results, pepFilter, kelasFilter, subjekFilter]);

  const stats = useMemo(() => {
    if (!filtered.length) return null;
    const avg = filtered.reduce((s, r) => s + r.markah, 0) / filtered.length;
    const lulus = filtered.filter((r) => r.markah >= 50).length;
    const students = new Set(filtered.map((r) => r.namaPelajar)).size;
    const intervention = filtered.filter((r) => r.markah < 50).length;
    return { avg: Math.round(avg * 10) / 10, passRate: Math.round((lulus / filtered.length) * 100), students, intervention };
  }, [filtered]);

  const subjectPerf = useMemo(() => {
    const map = new Map<string, { sum: number; n: number }>();
    filtered.forEach((r) => {
      const e = map.get(r.subjek) ?? { sum: 0, n: 0 };
      e.sum += r.markah; e.n++; map.set(r.subjek, e);
    });
    return [...map.entries()].map(([subjek, v]) => ({ subjek, purata: Math.round((v.sum / v.n) * 10) / 10 }));
  }, [filtered]);

  const gradeDist = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((r) => {
      const g = r.gred ?? gredDaripada(r.markah, gradeScales);
      map.set(g, (map.get(g) ?? 0) + 1);
    });
    const order = gradeScales.map((s) => s.gred).reverse();
    const keys = [...new Set([...order, ...map.keys()])].filter((k) => map.has(k));
    return keys.map((k) => ({ name: k, value: map.get(k)! }));
  }, [filtered, gradeScales]);

  const trends = useMemo(() => {
    const map = new Map<string, Map<string, number[]>>();
    results.forEach((r) => {
      if (!map.has(r.peperiksaan)) map.set(r.peperiksaan, new Map());
      const sub = map.get(r.peperiksaan)!;
      if (!sub.has(r.subjek)) sub.set(r.subjek, []);
      sub.get(r.subjek)!.push(r.markah);
    });
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([pep, subs]) => {
        const row: Record<string, string | number> = { peperiksaan: pep };
        subs.forEach((v, s) => {
          row[s] = Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10;
        });
        return row;
      });
  }, [results]);

  const trendLines = useMemo(() => {
    const subjects = new Set(results.map((r) => r.subjek));
    const palette = ["#802390", "#D13D96", "#ED6F96", "#B9AAFA", "#9d89f5"];
    return [...subjects].slice(0, 5).map((s, i) => ({ key: s, name: s, color: palette[i % palette.length] }));
  }, [results]);

  const topStudents = useMemo(() => {
    const map = new Map<string, { nama: string; kelas: string; sum: number; n: number; subjek: string[] }>();
    filtered.forEach((r) => {
      const k = `${r.namaPelajar}|${r.kelas}`;
      const e = map.get(k) ?? { nama: r.namaPelajar, kelas: r.kelas, sum: 0, n: 0, subjek: [] };
      e.sum += r.markah; e.n++; e.subjek.push(r.subjek); map.set(k, e);
    });
    return [...map.values()]
      .map((s) => ({ ...s, purata: Math.round((s.sum / s.n) * 10) / 10 }))
      .sort((a, b) => b.purata - a.purata)
      .slice(0, 10);
  }, [filtered]);

  const intervention = useMemo(
    () => filtered.filter((r) => r.markah < 50).sort((a, b) => a.markah - b.markah).slice(0, 10),
    [filtered]
  );

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
        let count = 0;
        rows.forEach((row) => {
          const nama = String(row["Nama Pelajar"] ?? row["nama"] ?? row["Nama"] ?? "").trim();
          const kelas = String(row["Kelas"] ?? row["kelas"] ?? "").trim();
          const subjek = String(row["Subjek"] ?? row["subjek"] ?? "").trim();
          const markah = Number(row["Markah"] ?? row["markah"] ?? row["Markah (%)"] ?? NaN);
          const pep = String(row["Peperiksaan"] ?? row["peperiksaan"] ?? pepFilter !== "semua" ? pepFilter : "Peperiksaan Baharu").trim();
          if (!nama || !subjek || isNaN(markah)) return;
          add("results", {
            id: uid(), namaPelajar: nama, kelas, subjek, markah: Math.max(0, Math.min(100, markah)),
            gred: gredDaripada(markah, gradeScales), peperiksaan: pep,
            tarikh: todayISO(),
          } as ExamResult);
          count++;
        });
        toast(count ? `${count} rekod keputusan diimport` : "Tiada rekod sah ditemui dalam fail", count ? "success" : "error");
      } catch {
        toast("Gagal membaca fail. Sila gunakan format CSV/Excel dengan lajur: Nama Pelajar, Kelas, Subjek, Markah, Peperiksaan", "error");
      }
    };
    reader.readAsBinaryString(file);
    setUploadOpen(false);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map((r) => ({
      "Nama Pelajar": r.namaPelajar, Kelas: r.kelas, Subjek: r.subjek,
      Markah: r.markah, Gred: r.gred ?? gredDaripada(r.markah, gradeScales), Peperiksaan: r.peperiksaan,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analisis");
    XLSX.writeFile(wb, "laporan-analisis-peperiksaan.xlsx");
    toast("Laporan Excel dimuat turun");
  };

  const saveScales = () => {
    setGradeScales(scales.filter((s) => s.gred && s.max > s.min));
    toast("Skala gred dikemas kini");
    setScaleOpen(false);
  };

  if (!ready || !data) return null;

  return (
    <div>
      <PageHeader
        title="Analisa Peperiksaan"
        subtitle="Analisis pencapaian pelajar mengikut subjek, kelas dan peperiksaan"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => { setScales(gradeScales); setScaleOpen(true); }}>Skala Gred</Button>
            <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}><Upload className="w-4 h-4" /> Import CSV/Excel</Button>
            <Button variant="outline" size="sm" onClick={exportExcel}><FileDown className="w-4 h-4" /> Eksport Excel</Button>
          </>
        }
      />

      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select value={pepFilter} onChange={(e) => setPepFilter(e.target.value)}>
            <option value="semua">Semua Peperiksaan</option>
            {exams.map((e) => <option key={e}>{e}</option>)}
          </Select>
          <Select value={kelasFilter} onChange={(e) => setKelasFilter(e.target.value)}>
            <option value="semua">Semua Kelas</option>
            {kelasList.map((k) => <option key={k}>{k}</option>)}
          </Select>
          <Select value={subjekFilter} onChange={(e) => setSubjekFilter(e.target.value)}>
            <option value="semua">Semua Subjek</option>
            {subjekList.map((s) => <option key={s}>{s}</option>)}
          </Select>
          <p className="text-xs text-slate-400 self-center">{filtered.length} rekod keputusan</p>
        </div>
      </Card>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { icon: <TrendingUp className="w-5 h-5" />, label: "Purata Markah", value: `${stats.avg}%`, color: "text-magenta-500 bg-magenta-50" },
            { icon: <Percent className="w-5 h-5" />, label: "Peratus Lulus (≥50)", value: `${stats.passRate}%`, color: "text-emerald-600 bg-emerald-50" },
            { icon: <Users className="w-5 h-5" />, label: "Bilangan Pelajar", value: stats.students, color: "text-primary-500 bg-primary-50" },
            { icon: <AlertTriangle className="w-5 h-5" />, label: "Perlu Intervensi (<50)", value: stats.intervention, color: "text-amber-600 bg-amber-50" },
          ].map((s, i) => (
            <Card key={i} className="p-4">
              <div className={`p-2.5 rounded-xl w-fit ${s.color}`}>{s.icon}</div>
              <p className="text-2xl font-bold text-slate-800 mt-2">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </Card>
          ))}
        </div>
      )}

      {!stats ? (
        <Card><EmptyState title="Tiada data keputusan" message="Import keputusan peperiksaan melalui CSV/Excel atau tambah data contoh." /></Card>
      ) : (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Pencapaian Mengikut Subjek</h3>
              <BarChartCard data={subjectPerf} xKey="subjek" yKey="purata" color="#D13D96" height={250} />
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Taburan Gred</h3>
              <PieChartCard data={gradeDist} height={250} />
            </Card>
          </div>

          {trends.length > 1 && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Trend Prestasi Mengikut Peperiksaan</h3>
              <LineChartCard data={trends} xKey="peperiksaan" lines={trendLines} height={280} />
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-3">10 Pelajar Terbaik</h3>
              <Table>
                <THead><Tr><Th>Nama</Th><Th>Kelas</Th><Th>Purata</Th><Th>Gred</Th></Tr></THead>
                <TBody>
                  {topStudents.map((s, i) => (
                    <Tr key={i}>
                      <Td className="font-medium">{s.nama}</Td>
                      <Td>{s.kelas}</Td>
                      <Td><Badge tone="green">{s.purata}%</Badge></Td>
                      <Td className="text-xs text-slate-400 max-w-[160px] truncate">{s.subjek.join(", ")}</Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Pelajar Perlu Intervensi
              </h3>
              {intervention.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Tiada pelajar di bawah paras lulus</p>
              ) : (
                <Table>
                  <THead><Tr><Th>Nama</Th><Th>Subjek</Th><Th>Markah</Th><Th>Gred</Th></Tr></THead>
                  <TBody>
                    {intervention.map((r) => (
                      <Tr key={r.id}>
                        <Td className="font-medium">{r.namaPelajar}<span className="block text-xs text-slate-400">{r.kelas}</span></Td>
                        <Td>{r.subjek}</Td>
                        <Td><Badge tone="red">{r.markah}%</Badge></Td>
                        <Td>{r.gred ?? gredDaripada(r.markah, gradeScales)}</Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Upload modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Import Keputusan Peperiksaan">
        <p className="text-sm text-slate-500 mb-4">
          Muat naik fail CSV atau Excel dengan lajur: <strong>Nama Pelajar</strong>, <strong>Kelas</strong>, <strong>Subjek</strong>, <strong>Markah</strong>, <strong>Peperiksaan</strong>.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div
          className="border-2 border-dashed border-lavender-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-lavender-50/50 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-lavender-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">Klik untuk pilih fail CSV/Excel</p>
          <p className="text-xs text-slate-400 mt-1">.csv, .xlsx, .xls</p>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setUploadOpen(false)}>Batal</Button>
        </div>
      </Modal>

      {/* Grade scale modal */}
      <Modal open={scaleOpen} onClose={() => setScaleOpen(false)} title="Konfigurasi Skala Gred">
        <p className="text-sm text-slate-500 mb-4">Tetapkan julat markah bagi setiap gred mengikut keperluan peperiksaan sekolah.</p>
        <div className="space-y-2">
          {scales.map((s, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              <Input value={s.gred} onChange={(e) => setScales(scales.map((x, j) => j === i ? { ...x, gred: e.target.value } : x))} className="text-center font-bold" />
              <Input type="number" value={s.min} onChange={(e) => setScales(scales.map((x, j) => j === i ? { ...x, min: Number(e.target.value) } : x))} />
              <Input type="number" value={s.max} onChange={(e) => setScales(scales.map((x, j) => j === i ? { ...x, max: Number(e.target.value) } : x))} />
              <Button variant="ghost" size="sm" className="text-red-400" onClick={() => setScales(scales.filter((_, j) => j !== i))}>×</Button>
            </div>
          ))}
          <Button variant="soft" size="sm" onClick={() => setScales([...scales, { gred: "", min: 0, max: 0 }])}>+ Tambah Gred</Button>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setScaleOpen(false)}>Batal</Button>
          <Button onClick={saveScales}>Simpan Skala</Button>
        </div>
      </Modal>
    </div>
  );
}
