"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from '@headlessui/react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userEmailToDelete, setUserEmailToDelete] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const router = useRouter();

  // Kullanıcı bilgilerini localStorage'dan al
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          if (parsedUser.role === "admin") {
            setUser(parsedUser);
            fetchUsers();
          } else {
            // Yetkisiz kullanıcıyı ana sayfaya yönlendir
            setError("Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece admin erişebilir.");
            toast.error("Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece admin erişebilir.");
            router.push("/Admin"); // Admin paneline geri döndür
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

      // LocalStorage'dan kullanıcı bilgisini alın
      const storedUser = localStorage.getItem("user");
      let userId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser._id;
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          "user-id": userId || "",
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Hata kodu: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Kullanıcılar başarıyla yüklendi:", data);
      
      if (Array.isArray(data)) {
        setUsers(data);
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
      // LocalStorage'dan kullanıcı bilgisini alın
      const storedUser = localStorage.getItem("user");
      let userId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser._id;
      }

      const response = await fetch("/api/admin/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId || "",
        },
        body: JSON.stringify({ email, role: "admin" }),
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

  const makeModerator = async (email: string) => {
    try {
      // LocalStorage'dan kullanıcı bilgisini alın
      const storedUser = localStorage.getItem("user");
      let userId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser._id;
      }

      const response = await fetch("/api/admin/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId || "",
        },
        body: JSON.stringify({ email, role: "moderator" }),
      });

      if (response.ok) {
        toast.success("Kullanıcı başarıyla moderatör yapıldı!");
        // Kullanıcı listesini yenile
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error("Moderatör yapma hatası:", error);
      toast.error("Bir hata oluştu.");
    }
  };

  const makeUser = async (email: string) => {
    try {
      // LocalStorage'dan kullanıcı bilgisini alın
      const storedUser = localStorage.getItem("user");
      let userId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser._id;
      }

      const response = await fetch("/api/admin/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId || "",
        },
        body: JSON.stringify({ email, role: "user" }),
      });

      if (response.ok) {
        toast.success("Kullanıcı başarıyla normal kullanıcı yapıldı!");
        // Kullanıcı listesini yenile
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error("Normal kullanıcı yapma hatası:", error);
      toast.error("Bir hata oluştu.");
    }
  };

  // Kullanıcı silme işlemi
  const deleteUser = async (userId: string, userEmail: string) => {
    // Kullanıcı kendisini silmeye çalışıyorsa engelle
    if (user && userId === user._id) {
      toast.error("Kendinizi silemezsiniz!");
      return;
    }
    
    // Modal'ı açarak silme işlemini başlat
    setUserToDelete(userId);
    setUserEmailToDelete(userEmail);
    setIsDeleteModalOpen(true);
  };

  // Silme işlemini gerçekleştir
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // LocalStorage'dan kullanıcı bilgisini al
      const storedUser = localStorage.getItem("user");
      let adminId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        adminId = parsedUser._id;
      }

      const response = await fetch(`/api/admin/users/${userToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-id": adminId || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Kullanıcı başarıyla silindi!");
        // Kullanıcı listesini yenile
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Kullanıcı silinirken bir hata oluştu.");
      }
    } catch (error: any) {
      console.error("Kullanıcı silme hatası:", error);
      toast.error("Kullanıcı silinirken bir hata oluştu: " + (error.message || "Bilinmeyen hata"));
    } finally {
      // Modalı kapat ve state'i temizle
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setUserEmailToDelete("");
    }
  };

  // Form validasyonu
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    // İsim doğrulama
    if (!newUser.name) {
      newErrors.name = "Ad ve soyad gereklidir";
    } else if (newUser.name.length < 3) {
      newErrors.name = "Ad ve soyad en az 3 karakter olmalıdır";
    }
    
    // E-posta doğrulama
    if (!newUser.email) {
      newErrors.email = "E-posta adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }
    
    // Şifre doğrulama
    if (!newUser.password) {
      newErrors.password = "Şifre gereklidir";
    } else if (newUser.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }
    
    // Şifre tekrar doğrulama
    if (!newUser.confirmPassword) {
      newErrors.confirmPassword = "Şifre tekrarı gereklidir";
    } else if (newUser.password !== newUser.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Kullanıcı oluşturma fonksiyonu
  const createUser = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setCreateLoading(true);
      const storedUser = localStorage.getItem("user");
      let adminId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        adminId = parsedUser._id;
      }

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": adminId || "",
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role
        }),
      });

      if (response.ok) {
        toast.success("Kullanıcı başarıyla oluşturuldu!");
        setIsCreateModalOpen(false);
        setNewUser({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "user"
        });
        setErrors({});
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Kullanıcı oluşturulurken bir hata oluştu.");
      }
    } catch (error: any) {
      console.error("Kullanıcı oluşturma hatası:", error);
      toast.error("Kullanıcı oluşturulurken bir hata oluştu: " + (error.message || "Bilinmeyen hata"));
    } finally {
      setCreateLoading(false);
    }
  };

  // Arama işlemi için filtreleme fonksiyonu
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">Kullanıcılar</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Tüm kayıtlı kullanıcıları ve rollerini yönetin.
          </p>
        </div>
        
        <div className="flex w-full items-center gap-4 md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center rounded-lg bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Yeni Kullanıcı
          </button>
        </div>
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

      {filteredUsers.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {searchTerm ? "Arama kriterlerinize uygun kullanıcı bulunamadı." : "Hiç kullanıcı bulunamadı."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Son Güncelleme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {filteredUsers.map((userItem) => (
                <tr key={userItem._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl text-white">
                          {userItem.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{userItem.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{userItem.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      userItem.role === "admin"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : userItem.role === "moderator"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    }`}>
                      {userItem.role === "admin" ? "Admin" : userItem.role === "moderator" ? "Moderatör" : "Kullanıcı"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {new Date(userItem.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {new Date(userItem.updatedAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => makeAdmin(userItem.email)}
                        disabled={userItem.role === 'admin'}
                        className={`rounded-md ${
                          userItem.role === 'admin'
                            ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                        } px-3 py-1 text-sm transition-colors`}
                      >
                        {userItem.role === 'admin' ? 'Admin' : 'Admin Yap'}
                      </button>
                      <button
                        onClick={() => makeModerator(userItem.email)}
                        disabled={userItem.role === 'moderator'}
                        className={`rounded-md ${
                          userItem.role === 'moderator'
                            ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                        } px-3 py-1 text-sm transition-colors`}
                      >
                        {userItem.role === 'moderator' ? 'Moderatör' : 'Moderatör Yap'}
                      </button>
                      <button
                        onClick={() => makeUser(userItem.email)}
                        disabled={!userItem.role || userItem.role === 'user'}
                        className={`rounded-md ${
                          !userItem.role || userItem.role === 'user'
                            ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            : 'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500'
                        } px-3 py-1 text-sm transition-colors`}
                      >
                        {!userItem.role || userItem.role === 'user' ? 'Kullanıcı' : 'Üye Yap'}
                      </button>
                      {/* Kullanıcı silme butonu - kendi hesabını silemez */}
                      {user && user._id !== userItem._id && (
                        <button
                          onClick={() => deleteUser(userItem._id, userItem.email)}
                          className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Silme Onay Modalı */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Kullanıcıyı Sil
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      <strong>{userEmailToDelete}</strong> kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={confirmDeleteUser}
                    >
                      Sil
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Kullanıcı Oluşturma Modalı */}
      <Transition appear show={isCreateModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsCreateModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Yeni Kullanıcı Oluştur
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newUser.name}
                        onChange={(e) => {
                          setNewUser({ ...newUser, name: e.target.value });
                          if (errors.name) {
                            setErrors({ ...errors, name: undefined });
                          }
                        }}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        E-posta
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={newUser.email}
                        onChange={(e) => {
                          setNewUser({ ...newUser, email: e.target.value });
                          if (errors.email) {
                            setErrors({ ...errors, email: undefined });
                          }
                        }}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Şifre
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={newUser.password}
                          onChange={(e) => {
                            setNewUser({ ...newUser, password: e.target.value });
                            if (errors.password) {
                              setErrors({ ...errors, password: undefined });
                            }
                          }}
                          className={`mt-1 block w-full rounded-md border ${
                            errors.password ? "border-red-500" : "border-gray-300"
                          } bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Şifre Tekrar
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          value={newUser.confirmPassword}
                          onChange={(e) => {
                            setNewUser({ ...newUser, confirmPassword: e.target.value });
                            if (errors.confirmPassword) {
                              setErrors({ ...errors, confirmPassword: undefined });
                            }
                          }}
                          className={`mt-1 block w-full rounded-md border ${
                            errors.confirmPassword ? "border-red-500" : "border-gray-300"
                          } bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rol
                      </label>
                      <select
                        id="role"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="moderator">Moderatör</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setNewUser({
                          name: "",
                          email: "",
                          password: "",
                          confirmPassword: "",
                          role: "user"
                        });
                        setErrors({});
                      }}
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      onClick={createUser}
                      disabled={createLoading}
                    >
                      {createLoading ? (
                        <>
                          <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Oluşturuluyor...
                        </>
                      ) : (
                        "Oluştur"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UsersPage; 