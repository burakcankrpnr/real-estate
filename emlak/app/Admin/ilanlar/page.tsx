"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Property type tanımı
interface Property {
  _id: string;
  title: string;
  price: number;
  description?: string;
  location: {
    city?: string;
    district?: string;
    neighborhood?: string;
    address?: string;
  };
  type: string;
  status: string;
  images: string[];
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
  favoriteCount?: number;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

const PropertyListPage = () => {
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [filter, setFilter] = useState({
    approved: "",
    featured: "",
  });
  
  // Silme onay modalı için state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  
  const router = useRouter();

  // Kullanıcı rolü kontrolü
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === "admin" || parsedUser.role === "moderator") {
          setUser(parsedUser);
        } else {
          // Yetkisiz kullanıcı
          router.push("/");
        }
      } else {
        // Giriş yapmamış kullanıcı
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  // İlanları getir
  const fetchProperties = async (page = 1, filters = filter) => {
    try {
      setLoading(true);
      
      // URL parametreleri oluştur
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", (pagination?.limit ?? 10).toString());
      
      if (filters.approved) {
        queryParams.append("approved", filters.approved);
      }
      
      if (filters.featured) {
        queryParams.append("featured", filters.featured);
      }

      // Arama terimi varsa ekle
      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }
      
      // API çağrısı
      const response = await fetch(`/api/admin/properties?${queryParams.toString()}`, {
        headers: {
          "user-id": user?._id || "", // Middleware için kullanıcı ID'si
        },
      });
      
      if (!response.ok) {
        throw new Error("İlanlar getirilemedi");
      }
      
      const data = await response.json();
      setProperties(data.properties);
      setPagination(data.pagination);
      setError(null);
    } catch (err: any) {
      console.error("İlanları getirme hatası:", err);
      setError(err.message || "İlanlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı yüklendiğinde ilanları getir
  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);
  
  // Filtre değiştiğinde ilanları getir
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value };
    setFilter(newFilter);
    fetchProperties(1, newFilter);
  };
  
  // Sayfa değiştiğinde ilanları getir
  const handlePageChange = (page: number) => {
    fetchProperties(page);
  };
  
  // İlan onaylama işlemi
  const approveProperty = async (id: string) => {
    try {
      setLoading(true);

      // User ID'yi localStorage'dan al
      const storedUser = localStorage.getItem("user");
      let userId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser._id;
      }
      
      const response = await fetch(`/api/admin/approve-property/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId || "", // Admin kontrolü için user-id eklendi
        },
      });

      if (response.ok) {
        toast.success("İlan başarıyla onaylandı! İlan artık ana sayfada görüntülenecek.");
        // İlanları yenile
        fetchProperties();
      } else {
        const data = await response.json();
        toast.error(data.error || "İlan onaylanırken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İlan onaylama hatası:", error);
      toast.error("İlan onaylanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  
  // İlan silme işlemi
  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    
    try {
      const response = await fetch(`/api/admin/properties/${propertyToDelete}`, {
        method: "DELETE",
        headers: {
          "user-id": user?._id || "",
        },
      });
      
      if (!response.ok) {
        throw new Error("İlan silinemedi");
      }
      
      // Modalı kapat
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
      
      // Başarılı olduğunda notification göster
      toast.success("İlan başarıyla silindi!");
      
      // İlanları yeniden getir
      fetchProperties(pagination.page);
    } catch (err: any) {
      console.error("İlan silme hatası:", err);
      setError(err.message || "İlan silinirken bir hata oluştu");
      toast.error(err.message || "İlan silinirken bir hata oluştu");
    }
  };
  
  const handlePropertyUpdate = async (id: string, updateData: { isApproved?: boolean; isFeatured?: boolean }) => {
    try {
      setLoading(true);

      // User ID'yi localStorage'dan al
      const storedUser = localStorage.getItem("user");
      let userId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser._id;
      }
      
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId || "", // Admin kontrolü için user-id eklendi
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // İşlem tipine göre başarı mesajı
        if (updateData.isApproved !== undefined) {
          toast.success("İlan onay durumu güncellendi!");
        } else if (updateData.isFeatured !== undefined) {
          if (updateData.isFeatured) {
            toast.success("İlan öne çıkarıldı!");
          } else {
            toast.success("İlan normal duruma getirildi!");
          }
        } else {
          toast.success("İlan güncellendi!");
        }
        
        // İlanları yenile
        fetchProperties();
      } else {
        const data = await response.json();
        toast.error(data.error || "İlan güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İlan güncelleme hatası:", error);
      toast.error("İlan güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDelete = (id: string) => {
    setPropertyToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  // Arama fonksiyonu
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Arama işlemi için
  useEffect(() => {
    if (user) {
      // Debounce için timeout oluştur
      const timeoutId = setTimeout(() => {
        fetchProperties(1);
      }, 500);
      
      // Cleanup
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, user]);
  
  // Yükleniyor durumu
  if (loading && !properties.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
      </div>
    );
  }

  // Kullanıcı yetkilendirme beklerken
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Toaster position="top-right" />
      
      <div className="mb-8 flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Emlak İlanları</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Tüm emlak ilanlarını yönetin, onaylayın veya silin.
          </p>
        </div>
        <Link
          href="/Admin/ilanlar/yeni"
          className="mt-4 flex items-center rounded-lg bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90 md:mt-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Yeni İlan Ekle
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-800/30 dark:text-red-400">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Onay Durumu</label>
          <select
            name="approved"
            value={filter.approved}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">Tümü</option>
            <option value="true">Onaylı</option>
            <option value="false">Onaysız</option>
          </select>
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Öne Çıkarma</label>
          <select
            name="featured"
            value={filter.featured}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">Tümü</option>
            <option value="true">Öne Çıkarılmış</option>
            <option value="false">Normal</option>
          </select>
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">İlan Ara</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="İlan başlığı, şehir veya tip ara..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          />
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-lg bg-gray-100 p-8 text-center dark:bg-gray-800">
          <p className="text-lg text-gray-600 dark:text-gray-300">Hiç emlak ilanı bulunamadı.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  İlan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Konum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Fiyat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Favoriler
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Oluşturan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {properties.map((property) => (
                <tr key={property._id} 
                    onClick={() => router.push(`/emlak/${property._id}`)} 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/emlak/${property._id}`} className="flex items-center">
                      <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0].startsWith('http') ? property.images[0] : `${window.location.origin}${property.images[0]}`}
                            alt={property.title}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/placeholder-property.jpg";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{property.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {property.type === "apartment" && "Daire"}
                          {property.type === "villa" && "Villa"}
                          {property.type === "land" && "Arsa"}
                          {property.type === "commercial" && "İşyeri"}
                          {property.type === "house" && "Müstakil Ev"}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/emlak/${property._id}`} className="block">
                      <div className="text-sm text-gray-900 dark:text-white">{property.location?.city || "Belirtilmemiş"}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{property.location?.district || "Belirtilmemiş"}</div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/emlak/${property._id}`} className="block">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.price ? property.price.toLocaleString("tr-TR") : "0"} ₺
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {property.status === "for-sale" || property.status === "satilik" ? "Satılık" : "Kiralık"}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/emlak/${property._id}`} className="block">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {property.isApproved ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <svg className="mr-1.5 h-2 w-2 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                            Onaylı
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            <svg className="mr-1.5 h-2 w-2 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                            Onay Bekliyor
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {property.isFeatured ? (
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            Öne Çıkarılmış
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            Normal
                          </span>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/emlak/${property._id}`} className="block">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {property.favoriteCount || 0}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/emlak/${property._id}`} className="block">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {property.createdBy?.name || "Bilinmiyor"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {property.createdBy?.email || ""}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/emlak/${property._id}`} className="block">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(property.createdAt).toLocaleDateString("tr-TR")}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(property.createdAt).toLocaleTimeString("tr-TR")}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                      {!property.isApproved && (
                        <button
                          onClick={() => approveProperty(property._id)}
                          className="rounded-md bg-green-500 px-3 py-1 text-white transition-colors hover:bg-green-600"
                          title="İlanı Onayla"
                        >
                          Onayla
                        </button>
                      )}
                      {property.isApproved && !property.isFeatured && (
                        <button
                          onClick={() => handlePropertyUpdate(property._id, { isFeatured: true })}
                          className="rounded-md bg-purple-500 px-3 py-1 text-white transition-colors hover:bg-purple-600"
                        >
                          Öne Çıkar
                        </button>
                      )}
                      {property.isFeatured && (
                        <button
                          onClick={() => handlePropertyUpdate(property._id, { isFeatured: false })}
                          className="rounded-md bg-gray-500 px-3 py-1 text-white transition-colors hover:bg-gray-600"
                        >
                          Normal
                        </button>
                      )}
                      <Link
                        href={`/Admin/ilanlar/duzenle/${property._id}`}
                        className="rounded-md bg-blue-500 px-3 py-1 text-white transition-colors hover:bg-blue-600"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => confirmDelete(property._id)}
                        className="rounded-md bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sayfalama */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`rounded-md px-3 py-1 ${
                pagination.page === 1
                  ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Önceki
            </button>
            
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`rounded-md px-3 py-1 ${
                  pagination.page === i + 1
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`rounded-md px-3 py-1 ${
                pagination.page === pagination.totalPages
                  ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Sonraki
            </button>
          </nav>
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
                    İlanı Sil
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
                      onClick={handleDeleteProperty}
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
    </div>
  );
};

export default PropertyListPage;