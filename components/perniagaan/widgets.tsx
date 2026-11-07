"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, Download, FileText } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/components/ui";
import { useEdu } from "@/lib/perniagaan/store";
import { ProgressItem } from "@/lib/perniagaan/types";

export function EduPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="edu-no-print mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-magenta-500">
          PANITIA PERNIAGAAN
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EduStatCard({
  icon,
  label,
  value,
  href,
  tone = "purple",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  href?: string;
  tone?: "purple" | "pink" | "lavender" | "rose";
}) {
  const tones = {
    purple: "bg-primary-50 text-primary-600",
    pink: "bg-softpink-200 text-magenta-600",
    lavender: "bg-lavender-100 text-lavender-700",
    rose: "bg-rose-100 text-rose-600",
  };
  const content = (
    <Card className="h-full p-4 transition-all hover:-translate-y-0.5 hover:shadow-pop">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("rounded-xl p-3", tones[tone])}>{icon}</div>
        {href && <ArrowRight className="h-4 w-4 text-slate-300" />}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export function BookmarkButton({ id, className }: { id: string; className?: string }) {
  const { data, toggleBookmark } = useEdu();
  const saved = data?.bookmarks.includes(id) ?? false;
  return (
    <Button
      type="button"
      variant={saved ? "soft" : "outline"}
      size="sm"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(id);
      }}
      aria-pressed={saved}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      {saved ? "Disimpan" : "Simpan"}
    </Button>
  );
}

export function trackAndDownload(
  item: ProgressItem,
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8"
) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadDataUrl(filename: string, dataUrl: string) {
  if (typeof window === "undefined") return;
  fetch(dataUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
}

export function DownloadTextButton({
  item,
  filename,
  content,
  label = "Muat Turun",
  variant = "soft",
  size = "sm",
}: {
  item: ProgressItem;
  filename: string;
  content: string;
  label?: string;
  variant?: "primary" | "secondary" | "soft" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}) {
  const { addDownload } = useEdu();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => {
        trackAndDownload(item, filename, content);
        addDownload(item);
      }}
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}

export function ResourceLinkCard({
  title,
  description,
  href,
  icon,
  badge,
  meta,
}: {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  meta?: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="flex h-full flex-col p-5 transition-all hover:-translate-y-1 hover:shadow-pop">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-xl bg-gradient-to-br from-primary-500 to-lavender-400 p-3 text-white">
            {icon ?? <FileText className="h-5 w-5" />}
          </div>
          {badge && <Badge tone="pink">{badge}</Badge>}
        </div>
        <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{description}</p>
        {meta && <p className="mt-4 text-xs text-slate-400">{meta}</p>}
      </Card>
    </Link>
  );
}
