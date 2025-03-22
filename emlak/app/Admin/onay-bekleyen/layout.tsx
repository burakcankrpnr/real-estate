import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Onay Bekleyen İlanlar | Tüzgen Group",
  description:
    "Kullanıcılar tarafından eklenen ve onay bekleyen emlak ilanlarını inceleyin ve yönetin.",
};

export default function OnayBekleyenLayout({
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