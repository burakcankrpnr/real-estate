"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Breadcrumb için path parçalarını al
  const pathSegments = pathname?.split('/').filter(Boolean) || [];

  useEffect(() => {
    // Kullanıcının rolünü kontrol et
    const checkUserRole = () => {
      try {
        console.log("Admin layout: Kullanıcı rolü kontrol ediliyor");
        const userStr = localStorage.getItem("user");
        
        if (!userStr) {
          console.log("Admin layout: Kullanıcı bulunamadı, giriş sayfasına yönlendiriliyor");
          router.push("/signin");
          return;
        }
        
        try {
          const userData = JSON.parse(userStr);
          console.log("Admin layout: Kullanıcı rolü:", userData.role);
          
          if (userData.role === "admin" || userData.role === "moderator") {
            setUser(userData);
            setAuthorized(true);
          } else {
            console.log("Admin layout: Yetkisiz erişim, ana sayfaya yönlendiriliyor");
            router.push("/");
          }
        } catch (parseError) {
          console.error("Admin layout: JSON parse hatası", parseError);
          router.push("/signin");
        }
      } catch (error) {
        console.error("Admin layout: Hata oluştu", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Router yönlendirmesi gerçekleşiyor, hiçbir şey gösterme
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col pt-24">
      {/* Üst Menü - Ana header'ın altında kalacak şekilde ayarlandı */}
      
      <header className="bg-white shadow-sm dark:bg-gray-800 fixed left-0 right-0 top-[80px] z-30">
        {/* Üst menü içeriği buraya gelecek */}
        
      </header>

      {/* Ana İçerik - Admin header'ından sonra başlayacak şekilde margin ekledik */}
      <main className="container mx-auto p-0 mt-0 flex-grow">
        {children}
      </main>

      {/* Alt Bilgi - Sayfa en altına sabitlendi */}
      <footer className="bg-white py-4 text-center text-sm text-gray-500 shadow-inner dark:bg-gray-800 dark:text-gray-400 mt-auto">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Tüzgen Group Admin Paneli - Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout; 