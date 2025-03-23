import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konut Projeleri | Tüzgen Group",
  description: "Tüzgen Group tarafından geliştirilen premium konut projelerini inceleyin ve güvenilir yatırım fırsatlarını kaçırmayın.",
};

export default function KonutProjeleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 