"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    console.log("Admin sayfası: localStorage kontrol ediliyor");
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      console.log("Admin sayfası: storedUser =", storedUser);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Admin sayfası: parsedUser =", parsedUser);
          console.log("Admin sayfası: kullanıcı rolü =", parsedUser.role);

          if (parsedUser.role === "admin" || parsedUser.role === "moderator") {
            setUser(parsedUser);
            fetchPendingCount(parsedUser._id);
          } else {
            console.log("Admin sayfası: Yetki yok, ana sayfaya yönlendiriliyorsunuz");
            router.push("/");
          }
        } catch (error) {
          console.error("JSON parse hatası", error);
          router.push("/signin");
        }
      } else {
        console.log("Admin sayfası: Kullanıcı girişi yok, giriş sayfasına yönlendiriliyorsunuz");
        router.push("/signin");
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Onay bekleyen ilan sayısını getiren fonksiyon
  const fetchPendingCount = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/properties?pending=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId || "",
        },
        cache: "no-store",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.pagination && typeof data.pagination.totalCount === 'number') {
          setPendingCount(data.pagination.totalCount);
        }
      }
    } catch (error) {
      console.error("Onay bekleyen ilan sayısı alınırken hata:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  const menuItems = [
    {
      title: "İlanlar",
      description: "Tüm ilanları görüntüleyin ve yönetin",
      icon: (
        <svg className="h-12 w-12 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      url: "/Admin/ilanlar",
    },
    {
      title: pendingCount > 0 ? `Onay Bekleyen İlanlar (${pendingCount})` : "Onay Bekleyen İlanlar",
      description: user.role === "admin" 
        ? "Onay bekleyen tüm ilanları görüntüleyin ve yönetin" 
        : "Eklediğiniz ve onay bekleyen ilanlarınızı görüntüleyin",
      icon: (
        <svg className="h-12 w-12 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      url: "/Admin/onay-bekleyen",
    },
    {
      title: "Yeni İlan Ekle",
      description: "Sisteme yeni ilan ekleyin",
      icon: (
        <svg className="h-12 w-12 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      url: "/Admin/ilanlar/yeni",
    },
    ...(user.role === "admin" ? [
      {
        title: "Kullanıcılar",
        description: "Sisteme kayıtlı kullanıcıları yönetin",
        icon: (
          <svg className="h-12 w-12 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
        url: "/Admin/kullanicilar",
      }
    ] : []),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold text-gray-900 text-dark dark:text-white">Admin Paneli</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {user.name}, emlak portalını buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item, index) => (
          <Link href={item.url} key={index}>
            <div className={`flex h-full flex-col items-center justify-center rounded-lg ${
              item.title.includes('Onay Bekleyen İlanlar') && pendingCount > 0 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-primary'
                : 'bg-white dark:bg-gray-800'
            } p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-gray-900/30`}>
              <div className="mb-4 rounded-full bg-blue-50 p-4 dark:bg-blue-900/20">
                {item.icon}
              </div>
              <h2 className={`mb-2 text-xl font-bold text-gray-900 text-dark dark:text-white ${
                item.title.includes('Onay Bekleyen İlanlar') && pendingCount > 0 
                  ? 'text-primary dark:text-primary'
                  : ''
              }`}>{item.title}</h2>
              <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel; 