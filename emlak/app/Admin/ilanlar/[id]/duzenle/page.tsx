"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuth, { User } from "@/app/hooks/useAuth";

interface LocationType {
  city: string;
  district: string;
  address?: string;
}

interface FeaturesType {
  rooms: string;
  bathrooms: string;
  area: string;
  garage?: boolean;
  garden?: boolean;
  pool?: boolean;
  furnished?: boolean;
  bedrooms?: string;
  floors?: string;
  floor?: string;
  buildingAge?: string;
  heating?: string;
}

interface PropertyFormType {
  title: string;
  description: string;
  price: string;
  type: string;
  status: string;
  location: LocationType;
  features: FeaturesType;
  images: string[];
  extraFeatures: string[];
  isApproved: boolean;
  isFeatured: boolean;
}

const EditPropertyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [newImage, setNewImage] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [propertyId, setPropertyId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState<PropertyFormType>({
    title: "",
    description: "",
    price: "",
    type: "apartment",
    status: "sale",
    location: {
      city: "",
      district: "",
      address: "",
    },
    features: {
      rooms: "",
      bathrooms: "",
      area: "",
      garage: false,
      garden: false,
      pool: false,
      furnished: false,
    },
    images: [],
    extraFeatures: [],
    isApproved: false,
    isFeatured: false,
  });

  // Kullanıcı kontrolü ve ilan verilerini yükleme
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role === "admin" || parsedUser.role === "moderator") {
            setUser(parsedUser);
            // propertyId var ise ilan verilerini yükle
            if (propertyId) {
              fetchPropertyData();
            }
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("Kullanıcı verileri ayrıştırılamadı:", error);
          router.push("/signin");
        }
      } else {
        router.push("/signin");
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, propertyId]);

  // URL'den ilan ID'sini al
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split('/');
      const id = pathSegments[pathSegments.indexOf('ilanlar') + 1];
      setPropertyId(id);
    }
  }, []);

  // İlan verilerini yükle
  const fetchPropertyData = async () => {
    try {
      setPropertyLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-id": user?._id || "",
        },
        cache: "no-store",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Hata kodu: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Form verilerini güncelle
      if (data.property) {
        // Form state'ini hazırla
        setForm({
          title: data.property.title || "",
          description: data.property.description || "",
          price: data.property.price?.toString() || "",
          type: data.property.type || "apartment",
          status: data.property.status || "for-sale",
          location: {
            city: data.property.location?.city || "",
            district: data.property.location?.district || "",
            address: data.property.location?.address || "",
          },
          features: {
            rooms: data.property.features?.rooms?.toString() || "",
            bathrooms: data.property.features?.bathrooms?.toString() || "",
            area: data.property.features?.area?.toString() || "",
            garage: !!data.property.features?.garage,
            garden: !!data.property.features?.garden,
            pool: !!data.property.features?.pool,
            furnished: !!data.property.features?.furnished,
            bedrooms: data.property.features?.bedrooms?.toString() || "",
            floors: data.property.features?.floors?.toString() || "",
            floor: data.property.features?.floor?.toString() || "",
            buildingAge: data.property.features?.buildingAge?.toString() || "",
            heating: data.property.features?.heating || "",
          },
          images: data.property.images || [],
          extraFeatures: data.property.extraFeatures || [],
          isApproved: data.property.isApproved || false,
          isFeatured: data.property.isFeatured || false,
        });
        
        console.log("İlan verileri yüklendi:", data.property);
      } else {
        throw new Error("İlan verileri alınamadı");
      }
    } catch (error: any) {
      console.error("İlan verileri yüklenirken hata:", error);
      setError(error.message || "İlan verileri yüklenirken bir hata oluştu");
      toast.error(error.message || "İlan verileri yüklenirken bir hata oluştu");
    } finally {
      setPropertyLoading(false);
    }
  };

  // Form değişikliklerini işle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => {
        const newForm = { ...prev };
        if (parent === "location") {
          newForm.location = { ...prev.location, [child]: value };
        } else if (parent === "features") {
          newForm.features = { ...prev.features, [child]: value };
        }
        return newForm;
      });
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Checkbox değişikliklerini işle
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => {
        const newForm = { ...prev };
        if (parent === "features") {
          newForm.features = { ...prev.features, [child]: checked };
        } else if (parent === "location") {
          newForm.location = { ...prev.location, [child]: checked };
        }
        return newForm;
      });
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  // Yeni özellik ekle
  const addFeature = () => {
    if (newFeature.trim() !== "" && !form.extraFeatures.includes(newFeature.trim())) {
      setForm((prev) => ({
        ...prev,
        extraFeatures: [...prev.extraFeatures, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  // Özellik sil
  const removeFeature = (index: number) => {
    setForm((prev) => {
      const updatedForm = { ...prev };
      if (updatedForm.extraFeatures && updatedForm.extraFeatures.length > 0) {
        updatedForm.extraFeatures = updatedForm.extraFeatures.filter((_, i) => i !== index);
      }
      return updatedForm;
    });
  };

  // Yeni resim ekle
  const addImage = () => {
    if (newImage.trim() !== "" && !form.images.includes(newImage.trim())) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  // Resim sil
  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Form gönderme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zorunlu alanlar ve validasyon kontrolü
    const requiredFields = {
      "başlık": form.title,
      "açıklama": form.description,
      "fiyat": form.price,
      "şehir": form.location.city,
      "ilçe": form.location.district,
      "adres": form.location.address,
      "alan": form.features.area,
      "oda sayısı": form.features.rooms,
      "banyo sayısı": form.features.bathrooms
    };
    
    // Her bir zorunlu alanı kontrol edip eksik olanları bildirelim
    const emptyFields: string[] = [];
    
    for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
      // Değer undefined, null veya boş string ise
      if (fieldValue === undefined || fieldValue === null || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
        emptyFields.push(fieldName);
      }
    }
    
    if (emptyFields.length > 0) {
      toast.error(`Lütfen şu zorunlu alanları doldurunuz: ${emptyFields.join(", ")}`);
      return;
    }
    
    if (!user) {
      toast.error("Oturum bilgileriniz bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Form verileri oluşturulurken toString() hatalarından kaçınmak için kontroller
      const formData = {
        ...form,
        price: form.price ? parseFloat(form.price.toString()) : 0,
        features: {
          ...form.features,
          rooms: form.features.rooms ? parseInt(form.features.rooms.toString()) : 0,
          bathrooms: form.features.bathrooms ? parseInt(form.features.bathrooms.toString()) : 0,
          area: form.features.area ? parseFloat(form.features.area.toString()) : 0,
          bedrooms: form.features.bedrooms ? parseInt(form.features.bedrooms?.toString() || '') : undefined,
          floors: form.features.floors ? parseInt(form.features.floors?.toString() || '') : undefined,
          floor: form.features.floor ? parseInt(form.features.floor?.toString() || '') : undefined,
          buildingAge: form.features.buildingAge ? parseInt(form.features.buildingAge?.toString() || '') : undefined,
          heating: form.features.heating,
          garage: form.features.garage,
          garden: form.features.garden,
          pool: form.features.pool,
          furnished: form.features.furnished,
        },
      };
      
      // API isteği
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-id": user._id,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        let errorMessage = "İlan güncellenirken bir hata oluştu";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          console.error("JSON parse hatası:", jsonError);
        }
        throw new Error(errorMessage);
      } else {
        // Başarılı yanıt
        toast.success("İlan başarıyla güncellendi!");
        
        // Başarılı işlemden sonra ilanlar sayfasına yönlendir
        setTimeout(() => {
          router.push("/Admin/ilanlar");
        }, 1500);
      }
    } catch (error: any) {
      console.error("İlan güncelleme hatası:", error);
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Yükleniyor durumu
  if (loading || propertyLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
      </div>
    );
  }

  // Kullanıcı yetkilendirme beklerken
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">Yetkilendirme gerekli</p>
          <Link href="/signin" className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Toaster position="top-right" />
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">İlan Düzenle</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Mevcut emlak ilanını düzenleyin.
          </p>
        </div>
        <Link
          href="/Admin/ilanlar"
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          İlanlar Sayfasına Dön
        </Link>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          {/* Temel Bilgiler */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">Temel Bilgiler</h2>
            
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  İlan Başlığı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                  placeholder="Örn: Deniz Manzaralı 3+1 Daire"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Dikkat çekici ve açıklayıcı bir başlık yazın.</p>
              </div>
              
              <div>
                <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fiyat (₺) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                  placeholder="Örn: 1500000"
                  min="0"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Açıklama <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                required
                placeholder="Emlak hakkında detaylı bilgi verin. Konum, iç özellikler, dış özellikler gibi önemli noktaları belirtin."
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Detaylı bir açıklama potansiyel alıcıların ilgisini artırır.</p>
            </div>
            
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Emlak Tipi <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="apartment">Daire</option>
                  <option value="house">Müstakil Ev</option>
                  <option value="villa">Villa</option>
                  <option value="land">Arsa</option>
                  <option value="commercial">İşyeri</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  İlan Durumu <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                >
                  <option value="sale">Satılık</option>
                  <option value="rent">Kiralık</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Konum Bilgileri */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">Konum Bilgileri</h2>
            
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="location.city" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Şehir <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={form.location.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                  placeholder="Örn: İstanbul"
                />
              </div>
              
              <div>
                <label htmlFor="location.district" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  İlçe/Semt <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location.district"
                  name="location.district"
                  value={form.location.district}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                  placeholder="Örn: Kadıköy"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="location.address" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Açık Adres <span className="text-red-500">*</span>
              </label>
              <textarea
                id="location.address"
                name="location.address"
                value={form.location.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                placeholder="Tam adres bilgilerini yazın"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Mahalle, cadde ve bina numarası gibi detayları ekleyin.</p>
            </div>
          </div>
          
          {/* Özellikler */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">Özellikler</h2>
            
            <div className="mb-4 grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="features.area" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alan (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="features.area"
                  name="features.area"
                  value={form.features.area}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  required
                  placeholder="Örn: 120"
                />
              </div>
              
              <div>
                <label htmlFor="features.rooms" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Oda Sayısı <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="features.rooms"
                  name="features.rooms"
                  value={form.features.rooms}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  required
                  placeholder="Örn: 3"
                />
              </div>
              
              <div>
                <label htmlFor="features.bathrooms" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Banyo Sayısı <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="features.bathrooms"
                  name="features.bathrooms"
                  value={form.features.bathrooms}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  required
                  placeholder="Örn: 2"
                />
              </div>
              
              {/* Yatak Odası Sayısı */}
              <div>
                <label htmlFor="features.bedrooms" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Yatak Odası Sayısı
                </label>
                <input
                  type="number"
                  id="features.bedrooms"
                  name="features.bedrooms"
                  value={form.features.bedrooms || ""}
                  onChange={handleChange}
                  placeholder="Örn: 2"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              {/* Kat Sayısı */}
              <div>
                <label htmlFor="features.floors" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kat Sayısı
                </label>
                <input
                  type="number"
                  id="features.floors"
                  name="features.floors"
                  value={form.features.floors || ""}
                  onChange={handleChange}
                  placeholder="Örn: 3"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              {/* Bulunduğu Kat */}
              <div>
                <label htmlFor="features.floor" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bulunduğu Kat
                </label>
                <input
                  type="number"
                  id="features.floor"
                  name="features.floor"
                  value={form.features.floor || ""}
                  onChange={handleChange}
                  placeholder="Örn: 2"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              {/* Bina Yaşı */}
              <div>
                <label htmlFor="features.buildingAge" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bina Yaşı
                </label>
                <input
                  type="number"
                  id="features.buildingAge"
                  name="features.buildingAge"
                  value={form.features.buildingAge || ""}
                  onChange={handleChange}
                  placeholder="Örn: 5"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              {/* Isıtma */}
              <div>
                <label htmlFor="features.heating" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Isıtma
                </label>
                <select
                  id="features.heating"
                  name="features.heating"
                  value={form.features.heating || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Seçiniz</option>
                  <option value="kombi">Kombi</option>
                  <option value="merkezi">Merkezi</option>
                  <option value="dogalgaz">Doğalgaz</option>
                  <option value="soba">Soba</option>
                  <option value="klima">Klima</option>
                  <option value="yerden">Yerden Isıtma</option>
                  <option value="yok">Isıtma Yok</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.garage"
                  name="features.garage"
                  checked={form.features.garage}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.garage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Garaj
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.garden"
                  name="features.garden"
                  checked={form.features.garden}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.garden" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bahçe
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.pool"
                  name="features.pool"
                  checked={form.features.pool}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.pool" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Havuz
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.furnished"
                  name="features.furnished"
                  checked={form.features.furnished}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.furnished" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mobilyalı
                </label>
              </div>
            </div>
            
            {/* Ekstra Özellikler */}
            <div className="mb-4">
              <h3 className="mb-2 text-md font-medium text-dark dark:text-white">Ekstra Özellikler</h3>
              <div className="flex">
                <input
                  type="text"
                  id="newFeature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="w-full rounded-lg rounded-r-none border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Ekstra özellik..."
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="rounded-lg rounded-l-none bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                  Ekle
                </button>
              </div>
            </div>
            
            {form.extraFeatures.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.extraFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 rounded-full text-primary hover:text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Henüz ekstra özellik eklenmedi.</p>
            )}
          </div>
          
          {/* Resimler */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">Resimler</h2>
            
            {/* Resim URL'si ile ekleme */}
            <div className="mb-4">
              <h3 className="mb-2 text-md font-medium text-dark dark:text-white">URL ile ekle</h3>
              <div className="flex">
                <input
                  type="text"
                  id="newImage"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full rounded-lg rounded-r-none border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Resim URL'si ekle..."
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="rounded-lg rounded-l-none bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                  Ekle
                </button>
              </div>
            </div>

            {/* Mevcut Resimler */}
            {form.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {form.images.map((image, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg">
                    <img src={image} alt={`İlan resmi ${index + 1}`} className="h-40 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Henüz resim eklenmedi.</p>
            )}
          </div>
          
          {/* Yayın Durumu */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">Yayın Durumu</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  İlanı öne çıkar
                </label>
              </div>
              
              {/* İlan onaylama kontrolü - sadece adminler için görünür */}
              {user && user.role === 'admin' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isApproved"
                    name="isApproved"
                    checked={form.isApproved}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                  />
                  <label htmlFor="isApproved" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    İlanı onaylı olarak yayınla
                  </label>
                </div>
              )}
            </div>
          </div>
          
          {/* Gönderme Butonu */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "İlan Güncelleniyor..." : "İlanı Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage; 