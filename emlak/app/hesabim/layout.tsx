import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hesabım | Tüzgen Group",
  description:
    "Hesap bilgilerinizi görüntüleyin ve güncelleyin. Profil bilgilerinizi ve şifrenizi değiştirebilirsiniz.",
};

export default function HesabimLayout({
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