import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kullanıcı Yönetimi | Tüzgen Group",
  description:
    "Sisteme kayıtlı kullanıcıları görüntüleyin, düzenleyin ve yönetin. Kullanıcı yetkilerini ayarlayın.",
};

export default function KullanicilarLayout({
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