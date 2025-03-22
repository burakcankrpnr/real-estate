import { Metadata } from "next"

export const metadata: Metadata = {
  title: "İlan Yönetimi | Tüzgen Group",
  description:
    "Emlak ilanlarını görüntüleyin, düzenleyin ve yönetin. İlan detaylarına erişin.",
};

export default function IlanlarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
} 