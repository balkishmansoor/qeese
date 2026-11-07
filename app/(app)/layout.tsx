"use client";

import React, { useEffect } from "react";
import { AppShell } from "@/components/layout";
import { useStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { ready, session } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !session && pathname !== "/log-masuk") {
      router.replace("/log-masuk");
    }
  }, [ready, session, router, pathname]);

  if (!ready || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-magenta-500 animate-pulse" />
          <p className="text-sm text-slate-400">Memuatkan sistem...</p>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
