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
  location: {
    city: string;
    district: string;
  };
  type: string;
  status: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  images: string[];
}

const PropertyListPage = () => {
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      queryParams.append("limit", pagination.limit.toString());
      
      if (filters.approved) {
        queryParams.append("approved", filters.approved);
      }
      
      if (filters.featured) {
        queryParams.append("featured", filters.featured);
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
  
  // İlan onaylama/öne çıkarma işlemi
  const handlePropertyUpdate = async (propertyId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "user-id": user?._id || "",
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error("İlan güncellenemedi");
      }
      
      // Başarılı olduğunda notification göster
      if (updates.isApproved) {
        toast.success("İlan başarıyla onaylandı!");
      } else if (updates.isFeatured === true) {
        toast.success("İlan başarıyla öne çıkarıldı!");
      } else if (updates.isFeatured === false) {
        toast.success("İlan öne çıkarma durumu kaldırıldı!");
      } else {
        toast.success("İlan başarıyla güncellendi!");
      }
      
      // İlanları yeniden getir
      fetchProperties(pagination.page);
    } catch (err: any) {
      console.error("İlan güncelleme hatası:", err);
      setError(err.message || "İlan güncellenirken bir hata oluştu");
      toast.error(err.message || "İlan güncellenirken bir hata oluştu");
    }
  };
  
  // Silme modal onay işlemi
  const confirmDelete = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setIsDeleteModalOpen(true);
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  İlan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Konum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Fiyat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {properties.map((property) => (
                <tr key={property._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
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
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{property.location.city}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{property.location.district}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {property.price.toLocaleString("tr-TR")} ₺
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {property.status === "for-sale" ? "Satılık" : "Kiralık"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${property.isApproved ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"}`}>
                        {property.isApproved ? "Onaylı" : "Onay Bekliyor"}
                      </span>
                      {property.isFeatured && (
                        <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                          Öne Çıkarılmış
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      {!property.isApproved && (
                        <button
                          onClick={() => handlePropertyUpdate(property._id, { isApproved: true })}
                          className="rounded-md bg-green-500 px-3 py-1 text-white transition-colors hover:bg-green-600"
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
                        href={`/Admin/ilanlar/${property._id}/duzenle`}
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