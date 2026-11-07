import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { EduProvider } from "@/lib/perniagaan/store";
import { ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: "PANITIA PERNIAGAAN | Pembelajaran Perniagaan KSSM",
  description:
    "Portal pembelajaran Perniagaan Tingkatan 4 dan Tingkatan 5: nota, kuiz online, soalan latih tubi, percubaan negeri dan SPM.",
  manifest: "/manifest.webmanifest",
  themeColor: "#802390",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ms">
      <body>
        <StoreProvider>
          <EduProvider>
            <ToastProvider>{children}</ToastProvider>
          </EduProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
