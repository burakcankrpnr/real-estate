import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Yönetim Paneli | Emlak",
  description:
    "Emlak yönetim paneli. İlanları ve kullanıcıları yönetin, site ayarlarını düzenleyin.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <h2 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
      </p>
      <Link 
        href="/Admin"
        className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
      >
        Admin Paneline Dön
      </Link>
    </div>
  )
} 