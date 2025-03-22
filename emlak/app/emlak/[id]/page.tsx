"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    district: string;
    address: string;
  };
  features: {
    rooms: number;
    bathrooms: number;
    area: number;
    floors?: number;
    floor?: number;
    bedrooms?: number;
    buildingAge?: number;
    heating?: string;
    hasGarage: boolean;
    hasGarden: boolean;
    hasPool: boolean;
    isFurnished: boolean;
    hasAirConditioning?: boolean;
    hasBalcony?: boolean;
    hasElevator?: boolean;
    hasSecurity?: boolean;
    hasInternet?: boolean;
    hasSatelliteTV?: boolean;
    hasFittedKitchen?: boolean;
    hasParentalBathroom?: boolean;
  };
  extraFeatures?: string[];
  type: string;
  status: string;
  images: string[];
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

const PropertyDetailPage = () => {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [propertyId, setPropertyId] = useState("");

  // URL'den ilan ID'sini al
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split('/');
      const id = pathSegments[pathSegments.indexOf('emlak') + 1];
      setPropertyId(id);
    }
  }, []);

  // Kullanıcı bilgisini al
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // İlan detayını getir
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!propertyId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${propertyId}`);
        
        if (!response.ok) {
          throw new Error("İlan bilgileri yüklenemedi");
        }
        
        const data = await response.json();
        setProperty(data);
        
        // Eğer giriş yapmış kullanıcı varsa, favorilerde olup olmadığını kontrol et
        if (user) {
          checkIfFavorite(data._id);
        }
      } catch (error) {
        console.error("İlan detayı getirme hatası:", error);
        toast.error("İlan bilgileri yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [propertyId, user]);

  // Favorilerde olup olmadığını kontrol et
  const checkIfFavorite = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/favoriler/check?propertyId=${propertyId}`, {
        headers: {
          "user-id": user._id,
        },
      });
      
      if (!response.ok) {
        throw new Error("Favori durumu kontrol edilemedi");
      }
      
      const data = await response.json();
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error("Favori kontrolü hatası:", error);
    }
  };

  // Favorilere ekle/çıkar
  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Favori işlemi için giriş yapmanız gerekiyor");
      router.push("/signin");
      return;
    }
    
    try {
      const response = await fetch("/api/favoriler", {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": user._id,
        },
        body: JSON.stringify({ propertyId }),
      });
      
      if (!response.ok) {
        throw new Error(isFavorite ? "Favorilerden çıkarılamadı" : "Favorilere eklenemedi");
      }
      
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
    } catch (error: any) {
      console.error("Favori işlemi hatası:", error);
      toast.error(error.message || "İşlem sırasında bir hata oluştu");
    }
  };

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
      </div>
    );
  }

  // İlan bulunamadı
  if (!property) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-700 dark:text-gray-300">İlan bulunamadı!</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">Aradığınız ilan kaldırılmış veya mevcut değil.</p>
        <Link href="/" className="rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary/90">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <Toaster position="top-right" />
      
      <div className="container mx-auto py-8">
        {/* Başlık ve Temel Bilgiler */}
        <div className="mb-8 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{property.title}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {property.location.city}, {property.location.district}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-primary">
              {property.price.toLocaleString("tr-TR")} ₺
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {property.status === "for-sale" ? "Satılık" : "Kiralık"}
            </span>
          </div>
        </div>
        
        {/* İlan Detayları - 2 Sütunlu Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Sol Sütun - Resimler ve Özellikler */}
          <div className="lg:col-span-2">
            {/* Resim Galerisi */}
            <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-900">
              <div className="relative aspect-video w-full overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[activeImageIndex]}
                    alt={`${property.title} - Resim ${activeImageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Küçük Resimler */}
              {property.images && property.images.length > 1 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto p-2">
                  {property.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 ${
                        index === activeImageIndex ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Küçük resim ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Detaylı Açıklama */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Açıklama</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{property.description}</p>
            </div>
            
            {/* Özellikler */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Emlak Özellikleri</h2>
              
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Alan</span>
                  <span className="font-medium text-gray-900 dark:text-white">{property.features.area} m²</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Oda Sayısı</span>
                  <span className="font-medium text-gray-900 dark:text-white">{property.features.rooms}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Banyo Sayısı</span>
                  <span className="font-medium text-gray-900 dark:text-white">{property.features.bathrooms}</span>
                </div>
                {property.features.bedrooms && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Yatak Odası</span>
                    <span className="font-medium text-gray-900 dark:text-white">{property.features.bedrooms}</span>
                  </div>
                )}
                {property.features.floors && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Kat Sayısı</span>
                    <span className="font-medium text-gray-900 dark:text-white">{property.features.floors}</span>
                  </div>
                )}
                {property.features.floor && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bulunduğu Kat</span>
                    <span className="font-medium text-gray-900 dark:text-white">{property.features.floor}</span>
                  </div>
                )}
                {property.features.buildingAge && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bina Yaşı</span>
                    <span className="font-medium text-gray-900 dark:text-white">{property.features.buildingAge}</span>
                  </div>
                )}
                {property.features.heating && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Isıtma</span>
                    <span className="font-medium text-gray-900 dark:text-white">{property.features.heating}</span>
                  </div>
                )}
              </div>
              
              {/* Özellik Etiketleri */}
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">Özellikler</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.hasGarage && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Garaj
                    </span>
                  )}
                  {property.features.hasGarden && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                      Bahçe
                    </span>
                  )}
                  {property.features.hasPool && (
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                      Havuz
                    </span>
                  )}
                  {property.features.isFurnished && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Eşyalı
                    </span>
                  )}
                  {property.features.hasAirConditioning && (
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      Klima
                    </span>
                  )}
                  {property.features.hasBalcony && (
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                      Balkon
                    </span>
                  )}
                  {property.features.hasElevator && (
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      Asansör
                    </span>
                  )}
                  {property.features.hasSecurity && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
                      Güvenlik
                    </span>
                  )}
                  {property.features.hasInternet && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      İnternet
                    </span>
                  )}
                  {property.extraFeatures && property.extraFeatures.length > 0 && 
                    property.extraFeatures.map((feature, index) => (
                      <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {feature}
                      </span>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
          
          {/* Sağ Sütun - İletişim Bilgileri */}
          <div className="lg:col-span-1">
            {/* İlan Sahibi Kartı */}
            <div className="sticky top-24 mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">İlan Bilgileri</h2>
              
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Konum</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {property.location.address}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">İlan Tipi</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {property.type === "apartment" ? "Daire" : 
                   property.type === "villa" ? "Villa" :
                   property.type === "land" ? "Arsa" :
                   property.type === "commercial" ? "İşyeri" :
                   property.type === "house" ? "Müstakil Ev" : property.type}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">İlan Tarihi</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {new Date(property.createdAt).toLocaleString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
              
              {/* Favorilere Ekleme */}
              <button
                onClick={toggleFavorite}
                className={`mb-4 flex w-full items-center justify-center rounded-lg py-3 px-4 text-white transition-colors ${
                  isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              </button>
              
              {/* İletişim Butonları */}
              <a
                href="tel:+902121234567"
                className="mb-2 flex w-full items-center justify-center rounded-lg bg-green-500 py-3 px-4 text-white transition-colors hover:bg-green-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Ara
              </a>
              
              <a
                href="mailto:info@tuzgengroup.com"
                className="flex w-full items-center justify-center rounded-lg bg-blue-500 py-3 px-4 text-white transition-colors hover:bg-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                E-posta Gönder
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage; 