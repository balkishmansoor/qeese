"use client";

import React, { useState } from "react";
import { Save, RotateCcw, Database, School, KeyRound } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Field, Input, Textarea, useToast, Badge } from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/lib/store";

export default function TetapanPage() {
  const { reset, ready, session } = useStore();
  const toast = useToast();
  const [school, setSchool] = useState({
    nama: "Sekolah Menengah Kebangsaan Taman Siswa",
    alamat: "Jalan Kenanga 5, Taman Siswa, 43000 Kajang, Selangor",
    ketuaKurikulum: "BALKISH BINTI MANSOOR",
    tahunAjaran: "2025",
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem("sptk_settings", JSON.stringify(school));
    setSaved(true);
    toast("Tetapan sekolah disimpan");
    setTimeout(() => setSaved(false), 2000);
  };

  if (!ready) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Tetapan Sistem" subtitle="Konfigurasi sekolah dan data sistem" />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><School className="w-4 h-4 text-magenta-500" /> Maklumat Sekolah</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Nama Sekolah">
            <Input value={school.nama} onChange={(e) => setSchool({ ...school, nama: e.target.value })} />
          </Field>
          <Field label="Alamat">
            <Textarea value={school.alamat} onChange={(e) => setSchool({ ...school, alamat: e.target.value })} className="min-h-[60px]" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Setiausaha Kurikulum">
              <Input value={school.ketuaKurikulum} onChange={(e) => setSchool({ ...school, ketuaKurikulum: e.target.value })} />
            </Field>
            <Field label="Tahun Ajaran">
              <Input value={school.tahunAjaran} onChange={(e) => setSchool({ ...school, tahunAjaran: e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button onClick={save}><Save className="w-4 h-4" /> {saved ? "Disimpan!" : "Simpan Tetapan"}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="w-4 h-4 text-magenta-500" /> Pengesahan & Pangkalan Data</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <span>Mod semasa</span>
            <Badge tone="green">Demo (Local Storage)</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Untuk produksi, konfigurasikan Supabase melalui pemboleh ubah persekitaran{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
            Skema pangkalan data disediakan dalam folder <code>supabase/</code>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-4 h-4 text-magenta-500" /> Data Demo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-500">
            Sistem ini menggunakan data demo yang disimpan dalam pelayar (localStorage). Anda boleh menetapkan semula
            semua data kepada contoh asal pada bila-bila masa.
          </p>
          {session?.role === "admin" ? (
            <Button variant="outline" onClick={() => { reset(); toast("Data demo ditetapkan semula"); }}>
              <RotateCcw className="w-4 h-4" /> Tetapkan Semula Data Demo
            </Button>
          ) : (
            <p className="text-xs text-slate-400">Hanya Admin boleh menetapkan semula data demo.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
