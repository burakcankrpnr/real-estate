import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Yeni İlan Ekle | Tüzgen Group",
  description:
    "Sisteme yeni emlak ilanı ekleyin. İlan detaylarını, fotoğrafları ve özellikleri belirtin.",
};

export default function YeniIlanLayout({
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