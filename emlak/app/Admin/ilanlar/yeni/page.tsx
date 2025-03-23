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
  category: string;
  subcategory?: string;
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
    type: "apartman-dairesi",
    status: "satilik",
    category: "konut",
    subcategory: "",
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
          
          // Eğer moderatör ise, isApproved'u false olarak ayarla
          if (parsedUser.role === "moderator") {
            setForm(prev => ({
              ...prev,
              isApproved: false
            }));
          }
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

  // Emlak tipine göre kategoriyi otomatik belirle
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    let category = "";

    // Emlak tipine göre kategori belirleme
    if (["apartman-dairesi", "daire", "rezidans", "mustakil-ev", "villa", "ciftlik-evi", "yazlik", "prefabrik-ev"].includes(value)) {
      category = "konut";
    } else if (["dukkan-magaza", "ofis", "akaryakit-istasyonu", "atolye", "bufe", "ciftlik", "depo-antrepo"].includes(value)) {
      category = "is-yeri";
    } else if (["arsa", "tarla", "bag", "bahce", "depo", "zeytinlik"].includes(value)) {
      category = "arsa";
    } else if (["otel", "apart-otel", "butik-otel", "motel", "pansiyon", "kamp-yeri", "tatil-koyu"].includes(value)) {
      category = "turizm";
    }

    setForm((prev) => ({
      ...prev,
      type: value,
      category: category
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
        
        // API'den gelen hata mesajlarını daha iyi göster
        if (errorData.missingFields && Array.isArray(errorData.missingFields)) {
          throw new Error(`Eksik alanlar: ${errorData.missingFields.join(', ')}`);
        }
        
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
      "banyo sayısı": form.features.bathrooms,
      "emlak tipi": form.type,
      "emlak durumu": form.status,
      "kategori": form.category
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
      
      // Formdan API için veri hazırlama
      const formDataForAPI = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        location: {
          city: form.location.city,
          district: form.location.district,
          address: form.location.address,
        },
        features: {
          rooms: parseInt(form.features.rooms) || 0,
          bathrooms: parseInt(form.features.bathrooms) || 0,
          area: parseFloat(form.features.area) || 0,
          floors: form.features.floors ? parseInt(form.features.floors) : undefined,
          floor: form.features.floor ? parseInt(form.features.floor) : undefined,
          bedrooms: form.features.bedrooms ? parseInt(form.features.bedrooms) : undefined,
          buildingAge: form.features.buildingAge ? parseInt(form.features.buildingAge) : undefined,
          heating: form.features.heating || undefined,
          hasGarage: form.features.hasGarage,
          hasGarden: form.features.hasGarden,
          hasPool: form.features.hasPool,
          isFurnished: form.features.isFurnished,
          hasAirConditioning: form.features.hasAirConditioning,
          hasBalcony: form.features.hasBalcony,
          hasElevator: form.features.hasElevator,
          hasSecurity: form.features.hasSecurity,
          hasInternet: form.features.hasInternet,
          hasSatelliteTV: form.features.hasSatelliteTV,
          hasFittedKitchen: form.features.hasFittedKitchen,
          hasParentalBathroom: form.features.hasParentalBathroom,
        },
        type: form.type,
        status: form.status,
        category: form.category,
        subcategory: form.subcategory?.trim() || undefined,
        extraFeatures: form.extraFeatures,
        images: form.images,
        isApproved: form.isApproved,
        isFeatured: form.isFeatured,
      };
      
      console.log("API'ye gönderilen veriler:", JSON.stringify(formDataForAPI, null, 2));
      
      const response = await fetch("/api/admin/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": user._id,
        },
        body: JSON.stringify(formDataForAPI),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("API yanıt hatası:", responseData);
        
        // API'den gelen hata mesajlarını daha iyi göster
        if (responseData.missingFields && responseData.missingFields.length > 0) {
          throw new Error(`Backend'in istediği eksik alanlar: ${responseData.missingFields.join(', ')}`);
        }
        
        throw new Error(responseData.error || "İlan eklenirken bir hata oluştu");
      }
      
      // Başarılı mesajını göster ve detayları konsola yaz
      console.log("İlan başarıyla eklendi:", responseData);
      toast.success(`İlan başarıyla eklendi! İlan ID: ${responseData.property._id}`);
      
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
          href="/Admin"
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Admin Paneline Dön
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
                  onChange={handleTypeChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                >
                  <option value="">Seçiniz</option>
                  <optgroup label="Konut">
                    <option value="apartman-dairesi">Apartman Dairesi</option>
                    <option value="daire">Daire</option>
                    <option value="rezidans">Rezidans</option>
                    <option value="mustakil-ev">Müstakil Ev</option>
                    <option value="villa">Villa</option>
                    <option value="ciftlik-evi">Çiftlik Evi</option>
                    <option value="yazlik">Yazlık</option>
                    <option value="prefabrik-ev">Prefabrik Ev</option>
                  </optgroup>
                  <optgroup label="İş Yeri">
                    <option value="dukkan-magaza">Dükkan / Mağaza</option>
                    <option value="ofis">Ofis</option>
                    <option value="akaryakit-istasyonu">Akaryakıt İstasyonu</option>
                    <option value="atolye">Atölye</option>
                    <option value="bufe">Büfe</option>
                    <option value="ciftlik">Çiftlik</option>
                    <option value="depo-antrepo">Depo & Antrepo</option>
                  </optgroup>
                  <optgroup label="Arsa">
                    <option value="arsa">Arsa</option>
                    <option value="tarla">Tarla</option>
                    <option value="bag">Bağ</option>
                    <option value="bahce">Bahçe</option>
                    <option value="ciftlik">Çiftlik</option>
                    <option value="depo">Depo</option>
                    <option value="zeytinlik">Zeytinlik</option>
                  </optgroup>
                  <optgroup label="Turizm">
                    <option value="otel">Otel</option>
                    <option value="apart-otel">Apart Otel</option>
                    <option value="butik-otel">Butik Otel</option>
                    <option value="motel">Motel</option>
                    <option value="pansiyon">Pansiyon</option>
                    <option value="kamp-yeri">Kamp Yeri (Mocamp)</option>
                    <option value="tatil-koyu">Tatil Köyü</option>
                  </optgroup>
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
                  <option value="satilik">Satılık</option>
                  <option value="kiralik">Kiralık</option>
                </select>
              </div>
            </div>
            
            {/* Kategori Seçimi */}
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Emlak Kategorisi <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  required
                >
                  <option value="">Seçiniz</option>
                  {form.type.includes("apartman-dairesi") || form.type.includes("daire") || form.type.includes("rezidans") || form.type.includes("mustakil-ev") || form.type.includes("villa") || form.type.includes("ciftlik-evi") || form.type.includes("yazlik") || form.type.includes("prefabrik-ev") ? (
                    <option value="konut">Konut</option>
                  ) : form.type.includes("dukkan-magaza") || form.type.includes("ofis") || form.type.includes("akaryakit-istasyonu") || form.type.includes("atolye") || form.type.includes("bufe") || form.type.includes("ciftlik") || form.type.includes("depo-antrepo") ? (
                    <option value="is-yeri">İş Yeri</option>
                  ) : form.type.includes("arsa") || form.type.includes("tarla") || form.type.includes("bag") || form.type.includes("bahce") || form.type.includes("depo") || form.type.includes("zeytinlik") ? (
                    <option value="arsa">Arsa</option>
                  ) : form.type.includes("otel") || form.type.includes("apart-otel") || form.type.includes("butik-otel") || form.type.includes("motel") || form.type.includes("pansiyon") || form.type.includes("kamp-yeri") || form.type.includes("tatil-koyu") ? (
                    <option value="turizm">Turizm</option>
                  ) : null}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Emlak tipine göre kategori otomatik belirlenir.</p>
              </div>
              <div>
                <label htmlFor="subcategory" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alt Kategori
                </label>
                <input
                  type="text"
                  id="subcategory"
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Opsiyonel alt kategori"
                />
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
              
              {/* Moderatör ise bilgilendirme mesajı göster */}
              {user && user.role === 'moderator' && (
                <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 text-sm text-blue-700 dark:text-blue-200">
                      Eklediğiniz ilanlar admin onayına tabi tutulacaktır.
                    </div>
                  </div>
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