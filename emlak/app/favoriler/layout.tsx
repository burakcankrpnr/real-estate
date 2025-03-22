import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Favorilerim | Tüzgen Group",
  description:
    "Favori emlak ilanlarınızı görüntüleyin, düzenleyin ve yönetin.",
};

export default function FavorilerLayout({
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