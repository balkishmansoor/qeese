import { SiteShell } from "@/components/perniagaan/site-shell";

export default function PerniagaanLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
