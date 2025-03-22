"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: {
    city: string;
    district: string;
    address: string;
  };
  features: {
    rooms: string;
    bathrooms: string;
    area: string;
    floors?: string;
    floor?: string;
    bedrooms?: string;
    buildingAge?: string;
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
}

const NewPropertyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: "",
    location: {
      city: "",
      district: "",
      address: "",
    },
    features: {
      rooms: "",
      bathrooms: "",
      area: "",
      floors: "",
      floor: "",
      bedrooms: "",
      buildingAge: "",
      heating: "",
      hasGarage: false,
      hasGarden: false,
      hasPool: false,
      isFurnished: false,
      hasAirConditioning: false,
      hasBalcony: false,
      hasElevator: false,
      hasSecurity: false,
      hasInternet: false,
      hasSatelliteTV: false,
      hasFittedKitchen: false,
      hasParentalBathroom: false,
    },
    extraFeatures: [],
    type: "apartment",
    status: "for-sale",
    images: [],
    isApproved: true,
    isFeatured: false,
  });

  // Yeni özellik bilgisi
  const [newFeature, setNewFeature] = useState("");
  // Yeni resim URL'si
  const [newImage, setNewImage] = useState("");
  // Dosya yükleme state'i
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Kullanıcı kontrolü
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === "admin" || parsedUser.role === "moderator") {
          setUser(parsedUser);
        } else {
          router.push("/");
        }
      } else {
        router.push("/signin");
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Form değerlerini güncelle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Checkbox değerlerini güncelle
  const handleFeatureCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [parent, child] = name.split(".");
    
    setForm((prev) => {
      const updatedForm = { ...prev };
      if (parent === 'features') {
        updatedForm.features = {
          ...updatedForm.features,
          [child]: checked,
        };
      }
      return updatedForm;
    });
  };

  // Checkbox değerlerini güncelle
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Yeni özellik ekle
  const addFeature = () => {
    if (newFeature.trim() !== "") {
      // Eğer aynı özellik daha önce eklenmişse tekrar ekleme
      if (form.extraFeatures?.includes(newFeature.trim())) {
        toast.error("Bu özellik zaten eklenmiş!");
        return;
      }
      
      setForm((prev) => {
        const updatedForm = { ...prev };
        if (!updatedForm.extraFeatures) {
          updatedForm.extraFeatures = [];
        }
        updatedForm.extraFeatures.push(newFeature.trim());
        return updatedForm;
      });
      setNewFeature("");
      toast.success("Özellik eklendi!");
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

  // Dosya yükleme
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // FormData oluştur
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Yükleme isteği gönder
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          "user-id": user._id,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Dosya yüklenirken bir hata oluştu");
      }
      
      const data = await response.json();
      
      // Resim URL'sini form state'ine ekle
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, data.url],
      }));
      
      // Başarılı mesajı göster
      toast.success("Resim başarıyla yüklendi!");
      
      // State'i temizle
      setSelectedFile(null);
      
    } catch (error: any) {
      console.error("Dosya yükleme hatası:", error);
      toast.error(error.message || "Dosya yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
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
    
    try {
      setSubmitting(true);
      
      const formData = {
        ...form,
        price: parseFloat(form.price),
        features: {
          ...form.features,
          rooms: form.features.rooms ? parseInt(form.features.rooms.toString()) : 0,
          bathrooms: form.features.bathrooms ? parseInt(form.features.bathrooms.toString()) : 0,
          area: form.features.area ? parseFloat(form.features.area.toString()) : 0,
          floors: form.features.floors ? parseInt(form.features.floors?.toString() || '') : undefined,
          floor: form.features.floor ? parseInt(form.features.floor?.toString() || '') : undefined,
          bedrooms: form.features.bedrooms ? parseInt(form.features.bedrooms?.toString() || '') : undefined,
          buildingAge: form.features.buildingAge ? parseInt(form.features.buildingAge?.toString() || '') : undefined,
        },
      };
      
      const response = await fetch("/api/admin/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": user._id,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "İlan eklenirken bir hata oluştu");
      }
      
      toast.success("İlan başarıyla eklendi!");
      
      // Başarılı işlemden sonra ilanlar sayfasına yönlendir
      setTimeout(() => {
        router.push("/Admin/ilanlar");
      }, 1500);
      
    } catch (error: any) {
      console.error("İlan ekleme hatası:", error);
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setSubmitting(false);
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

  // Kullanıcı yetkilendirme beklerken
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Toaster position="top-right" />
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">Yeni İlan Ekle</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sisteme yeni bir emlak ilanı ekleyin.
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
            <h2 className="mb-4 text-xl font-semibold  text-dark dark:text-white">Temel Bilgiler</h2>
            
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
                  Satılık/Kiralık <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="for-sale">Satılık</option>
                  <option value="for-rent">Kiralık</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Konum Bilgileri */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold dark:text-white text-dark">Konum Bilgileri</h2>
            
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
                required
                placeholder="Tam adres bilgilerini yazın"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Mahalle, cadde ve bina numarası gibi detayları ekleyin.</p>
            </div>
          </div>
          
          {/* Detaylar */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold dark:text-white text-dark">Emlak Özellikleri</h2>
            
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {/* Alan */}
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
      placeholder="Örn: 120"
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
      required
    />
  </div>

  {/* Oda Sayısı */}
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
      placeholder="Örn: 3"
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
      required
    />
  </div>

  {/* Banyo Sayısı */}
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
      placeholder="Örn: 2"
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black placeholder-gray-500 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
      required
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
      <option value="yok">Isıtma Yok</option>
    </select>
  </div>
</div>

            
            <h3 className="mb-4 mt-6 text-lg font-medium dark:text-white text-dark">Emlak Özellikleri</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {[
    { id: "hasGarage", label: "Garaj / Otopark" },
    { id: "hasGarden", label: "Bahçe" },
    { id: "hasPool", label: "Havuz" },
    { id: "isFurnished", label: "Eşyalı" },
    { id: "hasAirConditioning", label: "Klima" },
    { id: "hasBalcony", label: "Balkon" },
    { id: "hasElevator", label: "Asansör" },
    { id: "hasSecurity", label: "Güvenlik" },
    { id: "hasInternet", label: "İnternet" },
    { id: "hasSatelliteTV", label: "Uydu TV" },
    { id: "hasFittedKitchen", label: "Ankastre Mutfak" },
    { id: "hasParentalBathroom", label: "Ebeveyn Banyosu" },
  ].map(({ id, label }) => (
    <div key={id} className="flex items-center">
      <input
        type="checkbox"
        id={`features.${id}`}
        name={`features.${id}`}
        checked={form.features[id] || false}
        onChange={handleFeatureCheckboxChange}
        className="h-4 w-4 rounded border-gray-300 bg-white text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-primary dark:focus:ring-primary"
      />
      <label
        htmlFor={`features.${id}`}
        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
    </div>
  ))}
</div>

          </div>
          
          {/* Özellikler */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold dark:text-white text-dark">Ekstra Özellikler</h2>
            
            <div className="mb-4 flex">
              <input
                type="text"
                id="newFeature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="w-full rounded-lg rounded-r-none border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                placeholder="Yeni özellik ekle..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="rounded-lg rounded-l-none bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                Ekle
              </button>
            </div>
            
            {form.extraFeatures && form.extraFeatures.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.extraFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700"
                  >
                    <span className="mr-1">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-1 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
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
            <h2 className="mb-4 text-xl font-semibold dark:text-white text-dark">Resimler</h2>
            
            {/* Resim URL'si ile ekleme */}
            <div className="mb-4">
              <h3 className="mb-2 text-md font-medium dark:text-white text-dark">URL ile ekle</h3>
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

            {/* Dosya yükleme */}
            <div className="mb-6">
              <h3 className="mb-2 text-md font-medium dark:text-white text-dark">Dosya yükle</h3>
              <div className="mb-2">
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
              <button
                type="button"
                onClick={handleFileUpload}
                disabled={!selectedFile || uploading}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {uploading ? `Yükleniyor... ${uploadProgress}%` : "Yükle"}
              </button>
            </div>
            
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
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold dark:text-white text-dark">Yayın Durumu</h2>
            
            <div className="space-y-4">
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
            </div>
          </div>
          
          {/* Gönderme Butonu */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "İlan Ekleniyor..." : "İlanı Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPropertyPage; 