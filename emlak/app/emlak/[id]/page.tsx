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
  category: string;
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
  const [error, setError] = useState<string | null>(null);

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
        setError("İlan bilgileri yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [propertyId, user]);

  // Favorilerde olup olmadığını kontrol et
  const checkIfFavorite = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/favorites/check?propertyId=${propertyId}`, {
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
      console.log(`Favori işlemi: ${isFavorite ? 'çıkarma' : 'ekleme'}, Kullanıcı ID: ${user._id}, İlan ID: ${propertyId}`);
      
      const response = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": user._id,
        },
        body: JSON.stringify({ propertyId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || (isFavorite ? "Favorilerden çıkarılamadı" : "Favorilere eklenemedi"));
      }
      
      const data = await response.json();
      console.log('Favori işlemi yanıtı:', data);
      
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
      </div>
    );
  }

  // İlan bulunamadı
  if (!property) {
    return (
      <div className="container mx-auto my-12 px-4">
        <div className="rounded-xl bg-red-50 p-6 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Hata Oluştu</h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <Link href="/" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 mt-16">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-4">
        {/* İlan Başlığı ve Fiyat */}
        <div className="mb-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{property.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {property.location?.city || ""}{property.location?.district ? `, ${property.location.district}` : ""}
              </p>
            </div>
            <div>
              <span className="text-xl font-bold text-primary">
                {property.price ? property.price.toLocaleString("tr-TR") : "0"} ₺
              </span>
            </div>
          </div>
        </div>

        {/* Ana İçerik - Grid yapısı güncellendi */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Sol Kolon - Resim Slider - 5/12 */}
          <div className="lg:col-span-5">
            {/* Resim Galerisi */}
            <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-900">
              <div className="relative h-[400px] w-full">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={property.images[activeImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    quality={85}
                    priority={activeImageIndex === 0}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">Görsel Yok</span>
                  </div>
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="flex gap-1 overflow-x-auto p-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                        index === activeImageIndex ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`Görsel ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favori Butonu */}
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  İlan No: {property._id.substring(property._id.length - 6)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(property.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <button
                onClick={toggleFavorite}
                className={`flex w-full items-center justify-center gap-2 rounded py-2 text-white text-sm transition-colors ${
                  isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill={isFavorite ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={isFavorite ? "0" : "2"}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isFavorite ? "Favorilerimde" : "Favorilere Ekle"}
              </button>
            </div>
          </div>

          {/* Sağ Kolon - İlan Detayları - 7/12 */}
          <div className="lg:col-span-7">
            {/* İlan Açıklaması */}
            <div className="mb-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
              <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Açıklama</h2>
              <div className="prose max-w-none text-sm dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300">{property.description}</p>
              </div>
            </div>

            {/* Temel Bilgiler */}
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 mb-4">
              <h3 className="mb-3 text-md font-semibold text-gray-900 dark:text-white">İlan Bilgileri</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">İlan Tipi:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {property.type === "apartman-dairesi" ? "Apartman Dairesi" : 
                     property.type === "mustakil-ev" ? "Müstakil Ev" : 
                     property.type === "villa" ? "Villa" : 
                     property.type === "arsa" ? "Arsa" : 
                     property.type === "ticari" ? "Ticari" : property.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Durum:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {property.status === "satilik" ? "Satılık" : "Kiralık"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Kategori:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {property.category === "konut" ? "Konut" : 
                     property.category === "isyeri" ? "İşyeri" : 
                     property.category === "arsa" ? "Arsa" : property.category}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Temel Özellikler - Renkli Kartlar */}
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 mb-4">
              <h3 className="mb-3 text-md font-semibold text-gray-900 dark:text-white">Özellikler</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {property.features?.area && (
                  <div className="flex flex-col items-center rounded bg-blue-50 p-2 dark:bg-blue-900/20">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{property.features.area} m²</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Alan</span>
                  </div>
                )}
                
                {property.features?.rooms && (
                  <div className="flex flex-col items-center rounded bg-green-50 p-2 dark:bg-green-900/20">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">{property.features.rooms}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Oda</span>
                  </div>
                )}
                
                {property.features?.bedrooms && (
                  <div className="flex flex-col items-center rounded bg-yellow-50 p-2 dark:bg-yellow-900/20">
                    <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{property.features.bedrooms}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Yatak Odası</span>
                  </div>
                )}
                
                {property.features?.bathrooms && (
                  <div className="flex flex-col items-center rounded bg-purple-50 p-2 dark:bg-purple-900/20">
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{property.features.bathrooms}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Banyo</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Diğer Özellikler - Simgeler */}
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 mb-4">
              <h3 className="mb-3 text-md font-semibold text-gray-900 dark:text-white">Detaylar</h3>
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                {property.features?.hasGarage && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Garaj
                  </div>
                )}
                {property.features?.hasGarden && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Bahçe
                  </div>
                )}
                {property.features?.hasPool && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Havuz
                  </div>
                )}
                {property.features?.isFurnished && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Eşyalı
                  </div>
                )}
                {property.features?.hasAirConditioning && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Klima
                  </div>
                )}
                {property.features?.hasBalcony && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Balkon
                  </div>
                )}
                {property.features?.hasElevator && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Asansör
                  </div>
                )}
                {property.features?.hasSecurity && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Güvenlik
                  </div>
                )}
                {property.features?.hasInternet && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> İnternet
                  </div>
                )}
                {property.features?.hasSatelliteTV && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Uydu TV
                  </div>
                )}
                {property.features?.hasFittedKitchen && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Ankastre Mutfak
                  </div>
                )}
                {property.features?.hasParentalBathroom && (
                  <div className="flex items-center">
                    <span className="mr-1 text-primary">✓</span> Ebeveyn Banyosu
                  </div>
                )}
              </div>
            </div>
            
            {/* Konum Bilgisi */}
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
              <h3 className="mb-3 text-md font-semibold text-gray-900 dark:text-white">Konum</h3>
              <div className="text-sm">
                <p className="text-gray-700 dark:text-gray-300">{property.location?.address || "-"}</p>
                <div className="mt-2 flex items-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{property.location?.district}, {property.location?.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage; 