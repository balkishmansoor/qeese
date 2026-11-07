import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sistem Perancangan Tahunan Kurikulum",
  description:
    "Platform Digital Pengurusan dan Perancangan Kurikulum Sekolah",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ms">
      <body>
        <StoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
