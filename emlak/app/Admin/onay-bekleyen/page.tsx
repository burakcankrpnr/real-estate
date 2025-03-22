"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from '@headlessui/react';
import Breadcrumb from '@/components/Common/AdminBreadcrumb';
import Loader from '@/components/loader';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: {
    city?: string;
    district?: string;
    address?: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  type: string;
  status: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

const PendingApprovalsPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          if (parsedUser.role === "admin" || parsedUser.role === "moderator") {
            setUser(parsedUser);
            fetchPendingProperties();
          } else {
            // Yetkisiz kullanıcı
            setError("Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece admin ve moderatörler erişebilir.");
            toast.error("Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece admin ve moderatörler erişebilir.");
            router.push("/Admin");
          }
        } catch (error) {
          console.error("Kullanıcı verileri ayrıştırılamadı:", error);
          router.push("/signin");
        }
      } else {
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Onay bekleyen ilanlar yükleniyor...");
      
      // User ID'yi localStorage'dan al
      const storedUser = localStorage.getItem("user");
      let userId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser._id;
      }
      
      const response = await fetch("/api/admin/properties?pending=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId || "",
        },
        cache: "no-store",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Hata kodu: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Onay bekleyen ilanlar başarıyla yüklendi:", data);
      
      if (Array.isArray(data.properties)) {
        setProperties(data.properties);
      } else {
        console.error("API'den beklenmeyen veri formatı:", data);
        throw new Error("İlan verileri alınırken bir sorun oluştu");
      }
    } catch (error: any) {
      console.error("İlanlar yüklenirken hata:", error);
      setError(error.message || "İlanlar yüklenirken bir hata oluştu");
      toast.error(error.message || "İlanlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const approveProperty = async (id: string) => {
    try {
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
        fetchPendingProperties();
      } else {
        const data = await response.json();
        toast.error(data.error || "İlan onaylanırken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İlan onaylama hatası:", error);
      toast.error("İlan onaylanırken bir hata oluştu.");
    }
  };

  // İlan silme için state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  // İlan silme onay modali açma
  const openDeleteModal = (id: string) => {
    setPropertyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const deleteProperty = async (id: string) => {
    try {
      // User ID'yi localStorage'dan al
      const storedUser = localStorage.getItem("user");
      let userId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser._id;
      }
      
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId || "", // Admin kontrolü için user-id eklendi
        },
      });

      if (response.ok) {
        toast.success("İlan başarıyla silindi! İlan artık sistemde bulunmuyor.");
        // İlanları yenile
        fetchPendingProperties();
        // Modalı kapat
        setIsDeleteModalOpen(false);
        setPropertyToDelete(null);
      } else {
        const data = await response.json();
        toast.error(data.error || "İlan silinirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İlan silme hatası:", error);
      toast.error("İlan silinirken bir hata oluştu.");
    }
  };

  // İşlem butonlarını render eden fonksiyon
  const renderActionButtons = (property: Property) => {
    // Sadece adminler onaylama butonunu görebilir
    if (user?.role === "admin") {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => approveProperty(property._id)}
            className="rounded-md bg-green-600 px-3 py-1 text-sm text-white transition hover:bg-green-700"
            title="Onayla"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          
          <button
            onClick={() => openDeleteModal(property._id)}
            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
            title="Sil"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      );
    } else {
      // Moderatörler kendi ilanlarını silebilir, ancak onaylayamazlar
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => openDeleteModal(property._id)}
            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
            title="Sil"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      );
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
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Toaster position="top-right" />
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Onay Bekleyen İlanlar</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {user?.role === "admin" 
              ? "Sisteme eklenen ve onay bekleyen tüm ilanlar."
              : "Eklediğiniz ve onay bekleyen ilanlarınız."}
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
                  onClick={() => fetchPendingProperties()}
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none dark:bg-red-900/10 dark:text-red-200"
                >
                  Yeniden Dene
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {properties.length === 0 && !error ? (
        <div className="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">Onay Bekleyen İlan Yok</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Şu anda onay bekleyen ilan bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property._id} className="overflow-hidden rounded-lg bg-white shadow-lg transition hover:shadow-xl dark:bg-gray-800">
              <div className="relative h-48 w-full">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <svg 
                      className="h-16 w-16 text-gray-400 dark:text-gray-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs font-semibold text-yellow-900">
                    Onay Bekliyor
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 truncate dark:text-white">{property.title}</h3>
                <p className="mb-4 text-gray-600 line-clamp-2 dark:text-gray-300">{property.description}</p>
                
                <div className="mb-4 flex items-center text-gray-500 dark:text-gray-400">
                  <svg 
                    className="mr-1 h-5 w-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">
                    {typeof property.location === 'object' 
                      ? `${property.location.city || ''}, ${property.location.district || ''}` 
                      : property.location || ''}
                  </span>
                </div>
                
                <div className="mb-4 flex justify-between text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <svg 
                      className="mr-1 h-5 w-5 text-gray-600 dark:text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-sm">{property.type}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg 
                      className="mr-1 h-5 w-5 text-gray-600 dark:text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm">{property.status}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg 
                      className="mr-1 h-5 w-5 text-gray-600 dark:text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="text-sm">{property.features?.area} m²</span>
                  </div>
                </div>
                
                <div className="mb-4 flex justify-between text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <svg 
                      className="mr-1 h-5 w-5 text-gray-600 dark:text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span className="text-sm">{property.features?.bedrooms} Yatak Odası</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg 
                      className="mr-1 h-5 w-5 text-gray-600 dark:text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{new Date(property.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-2xl font-bold text-primary dark:text-primary-light">
                    {property.price.toLocaleString('tr-TR')} ₺
                  </span>
                  
                  {renderActionButtons(property)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => propertyToDelete && deleteProperty(propertyToDelete)}
      />
    </div>
  );
};

// İlan silme onay modali
const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                    Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve ilan tamamen sistemden silinecektir.
                  </p>
                </div>

                <div className="mt-5 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    onClick={onClose}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={onConfirm}
                  >
                    Evet, Sil
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PendingApprovalsPage; 