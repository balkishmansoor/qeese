"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { School, ShieldCheck, UserCog, GraduationCap } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/components/ui";

const ROLE_ICON: Record<string, React.ReactNode> = {
  admin: <ShieldCheck className="w-8 h-8" />,
  ketua_panitia: <UserCog className="w-8 h-8" />,
  guru: <GraduationCap className="w-8 h-8" />,
};

export default function LoginPage() {
  const { data, ready, login, session } = useStore();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  React.useEffect(() => {
    if (ready && session) router.replace("/dashboard");
  }, [ready, session, router]);

  const users = data?.users ?? [];
  const byRole = (r: string) => users.filter((u) => u.peranan === r);

  const pick = (id: string) => {
    setSelected(id);
    login(id);
    setTimeout(() => router.push("/dashboard"), 250);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-softpink-100 via-[#faf7fc] to-lavender-100">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-magenta-500 text-white shadow-pop mb-4">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-700">
            Sistem Perancangan Tahunan Kurikulum
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Platform Digital Pengurusan dan Perancangan Kurikulum Sekolah
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-pop border border-primary-100 p-6 sm:p-8">
          <p className="text-sm font-medium text-slate-600 mb-1">Mod Demo — Pilih Akaun</p>
          <p className="text-xs text-slate-400 mb-6">
            Pilih peranan untuk meneruskan ke papan pemuka.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {(["admin", "ketua_panitia", "guru"] as const).map((role) => {
              const list = byRole(role);
              return (
                <div key={role} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 mb-3 text-primary-700">
                    {ROLE_ICON[role]}
                    <span className="text-sm font-semibold">
                      {role === "admin" ? "Admin" : role === "ketua_panitia" ? "Ketua Panitia" : "Guru"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {list.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => pick(u.id)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all",
                          selected === u.id
                            ? "border-magenta-400 bg-magenta-50 text-magenta-700"
                            : "border-slate-200 bg-white hover:border-lavender-400 hover:shadow-sm"
                        )}
                      >
                        <p className="font-medium text-slate-800">{u.nama}</p>
                        <p className="text-xs text-slate-400">{u.jawatan}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">
            Integrasi Supabase (pengesahan & RLS) boleh dikonfigurasi melalui pemboleh ubah persekitaran —
            lihat fail <code>.env.example</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
