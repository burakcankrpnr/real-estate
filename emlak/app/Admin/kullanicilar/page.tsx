"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Kullanıcı bilgilerini localStorage'dan al
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          if (parsedUser.role === "admin" || parsedUser.role === "moderator") {
            setUser(parsedUser);
            fetchUsers();
          } else {
            // Yetkisiz kullanıcıyı ana sayfaya yönlendir
            router.push("/");
          }
        } catch (error) {
          console.error("Kullanıcı verileri ayrıştırılamadı:", error);
          router.push("/signin");
        }
      } else {
        // Giriş yapmamış kullanıcıyı giriş sayfasına yönlendir
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Kullanıcılar yükleniyor...");
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Hata kodu: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Kullanıcılar başarıyla yüklendi:", data);
      
      if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error("API'den beklenmeyen veri formatı:", data);
        throw new Error("Kullanıcı verileri alınırken bir sorun oluştu");
      }
    } catch (error: any) {
      console.error("Kullanıcılar yüklenirken hata:", error);
      setError(error.message || "Kullanıcılar yüklenirken bir hata oluştu");
      toast.error(error.message || "Kullanıcılar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (email: string) => {
    try {
      const response = await fetch("/api/admin/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Kullanıcı başarıyla admin yapıldı!");
        // Kullanıcı listesini yenile
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error("Admin yapma hatası:", error);
      toast.error("Bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Router yönlendirmesi çalışana kadar hiçbir şey gösterme
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Toaster position="top-right" />
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold dark:text-white">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin.
          </p>
        </div>
        <Link 
          href="/Admin" 
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Admin Paneline Dön
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Hata</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fetchUsers()}
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none dark:bg-red-900/10 dark:text-red-200"
                >
                  Yeniden Dene
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow-md dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Ad Soyad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                E-posta
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Kayıt Tarihi
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {users.length > 0 ? (
              users.map((user: User) => (
                <tr key={user._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.role === 'admin' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : user.role === 'moderator'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.role || "üye"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => makeAdmin(user.email)}
                      disabled={user.role === 'admin'}
                      className={`mr-2 rounded-md ${
                        user.role === 'admin'
                          ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                          : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                      } px-3 py-1 text-sm transition-colors`}
                    >
                      {user.role === 'admin' ? 'Zaten Admin' : 'Admin Yap'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                  {error ? "Kullanıcı verisi yüklenemedi." : "Kullanıcı bulunamadı."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage; 