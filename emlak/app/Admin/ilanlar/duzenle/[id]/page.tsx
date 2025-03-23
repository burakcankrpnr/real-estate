"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

interface PropertyFormData {
  _id?: string;
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

const PropertyEditPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [property, setProperty] = useState<any>(null);
  
  // Yeni özellik bilgisi
  const [newFeature, setNewFeature] = useState("");
  // Yeni resim URL'si
  const [newImage, setNewImage] = useState("");
  // Dosya yükleme state'i
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // İlan bilgilerini içeren form state'i
  const [form, setForm] = useState<PropertyFormData>({
    _id: "",
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
    type: "",
    status: "",
    category: "",
    subcategory: "",
    images: [],
    isApproved: false,
    isFeatured: false,
  });

  // Formdan gelen verileri işleme
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    console.log(`Form alanı değişti: ${name}, değer: ${value}`);

    // Nested özellikler için (location, features)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'location') {
        setForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            [child]: value,
          },
        }));
      } else if (parent === 'features') {
        // features içindeki tüm alanlar için tip kontrolü
        let fieldValue: string | number | boolean = value;
        
        // Sayısal değerler için dönüşüm yap
        if (['rooms', 'bathrooms', 'area', 'floors', 'floor', 'bedrooms', 'buildingAge'].includes(child)) {
          fieldValue = value === '' ? '' : Number(value);
        }
        
        setForm((prev) => ({
          ...prev,
          features: {
            ...prev.features,
            [child]: fieldValue,
          },
        }));
        
        console.log(`Features güncellendi: ${child} = ${fieldValue}`);
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  // Ek özellik ekleme
  const addFeature = () => {
    if (newFeature.trim() === "") {
      toast.error("Lütfen bir özellik girin");
      return;
    }

    // Özellik zaten var mı kontrol et
    if (form.extraFeatures && form.extraFeatures.includes(newFeature.trim())) {
      toast.error("Bu özellik zaten eklenmiş");
      return;
    }

    setForm((prev) => ({
      ...prev,
      extraFeatures: [...(prev.extraFeatures || []), newFeature.trim()],
    }));
    setNewFeature("");
  };

  // Ek özellik silme
  const removeFeature = (index: number) => {
    if (!form.extraFeatures) return;
    
    setForm((prev) => ({
      ...prev,
      extraFeatures: prev.extraFeatures?.filter((_, i) => i !== index),
    }));
  };
  
  // Resim URL'si ekleme
  const addImage = () => {
    if (newImage.trim() === "") {
      toast.error("Lütfen geçerli bir resim URL'si girin");
      return;
    }

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, newImage.trim()],
    }));
    setNewImage("");
  };

  // Resim silme
  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  
  // Dosya yükleme işlemi
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Lütfen bir dosya seçin");
      return;
    }

    // Dosya türü kontrolü
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Sadece JPEG, PNG, JPG ve WEBP formatları desteklenir");
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalıdır");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Mock progress için timer
      const mockProgressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(mockProgressTimer);
            return 90;
          }
          return newProgress;
        });
      }, 300);

      // API'ye dosyayı yükle - user-id header'ı eklendi
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          "user-id": currentUser._id, // Kullanıcı ID'si eklendi
        },
      });

      if (!response.ok) {
        clearInterval(mockProgressTimer);
        throw new Error("Dosya yükleme başarısız");
      }

      const data = await response.json();
      clearInterval(mockProgressTimer);
      setUploadProgress(100);

      // Resmi form'a ekle
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, data.url],
      }));

      toast.success("Dosya başarıyla yüklendi");
      setSelectedFile(null);
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
      toast.error("Dosya yüklenirken bir hata oluştu");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Özellik checkbox değişikliklerini işleme
  const handleFeatureCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // features. kısmını ayır
    const featureName = name.replace('features.', '');
    
    setForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [featureName]: checked,
      },
    }));
    
    console.log(`Checkbox güncellendi: ${featureName} = ${checked}`);
  };

  // İlan durumu checkbox değişiklikleri
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Kullanıcı bilgilerini ve ilan bilgilerini yükle
  useEffect(() => {
    const fetchUserAndProperty = async () => {
      try {
        // Kullanıcı bilgilerini localStorage'dan al
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/signin");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        // İlan bilgilerini API'den al
        const response = await fetch(`/api/admin/properties/${id}`, {
          headers: {
            "user-id": parsedUser._id || "",
          },
        });

        if (!response.ok) {
          throw new Error("İlan bilgileri alınamadı");
        }

        const data = await response.json();
        setProperty(data.property);

        // Form'a ilanın mevcut bilgilerini yükle
        const property = data.property;
        setForm({
          _id: property._id,
          title: property.title || "",
          description: property.description || "",
          price: property.price ? property.price.toString() : "",
          location: {
            city: property.location?.city || "",
            district: property.location?.district || "",
            address: property.location?.address || "",
          },
          features: {
            rooms: property.features?.rooms ? property.features.rooms.toString() : "",
            bathrooms: property.features?.bathrooms ? property.features.bathrooms.toString() : "",
            area: property.features?.area ? property.features.area.toString() : "",
            floors: property.features?.floors ? property.features.floors.toString() : "",
            floor: property.features?.floor ? property.features.floor.toString() : "",
            bedrooms: property.features?.bedrooms ? property.features.bedrooms.toString() : "",
            buildingAge: property.features?.buildingAge ? property.features.buildingAge.toString() : "",
            heating: property.features?.heating || "",
            hasGarage: property.features?.hasGarage || false,
            hasGarden: property.features?.hasGarden || false,
            hasPool: property.features?.hasPool || false,
            isFurnished: property.features?.isFurnished || false,
            hasAirConditioning: property.features?.hasAirConditioning || false,
            hasBalcony: property.features?.hasBalcony || false,
            hasElevator: property.features?.hasElevator || false,
            hasSecurity: property.features?.hasSecurity || false,
            hasInternet: property.features?.hasInternet || false,
            hasSatelliteTV: property.features?.hasSatelliteTV || false,
            hasFittedKitchen: property.features?.hasFittedKitchen || false,
            hasParentalBathroom: property.features?.hasParentalBathroom || false,
          },
          extraFeatures: property.extraFeatures || [],
          type: property.type || "",
          status: property.status || "",
          category: property.category || "",
          subcategory: property.subcategory || "",
          images: property.images || [],
          isApproved: property.isApproved || false,
          isFeatured: property.isFeatured || false,
        });
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
        toast.error("İlan bilgileri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProperty();
  }, [id, router]);

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
    
    // Boş olan zorunlu alanları bul
    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.toString().trim() === "")
      .map(([key]) => key);
    
    if (emptyFields.length > 0) {
      toast.error(`Lütfen zorunlu alanları doldurunuz: ${emptyFields.join(", ")}`);
      return;
    }
    
    if (!currentUser) {
      toast.error("Oturum bilgileriniz bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    try {
      setSubmitting(true);
      
      // Formdan API için veri hazırlama
      const formDataForAPI = {
        _id: form._id,
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        city: form.location.city,
        area: parseFloat(form.features.area) || 0,
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

      const response = await fetch(`/api/admin/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-id": currentUser._id,
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
        
        throw new Error(responseData.error || "İlan düzenlenirken bir hata oluştu");
      }

      toast.success("İlan başarıyla güncellendi!");
      setTimeout(() => {
        router.push("/Admin/ilanlar");
      }, 1500);
    } catch (error: any) {
      console.error("İlan düzenleme hatası:", error);
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="top-right" />
      
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">İlan Düzenle</h1>
        <Link
          href="/Admin/ilanlar"
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          İlanlara Dön
        </Link>
      </div>
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">İlan Bilgileri</h2>
            
            <div className="mb-6">
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                İlan Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Örn: Merkeze Yakın 3+1 Satılık Daire"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Açıklama <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="İlan hakkında detaylı açıklama..."
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fiyat (₺) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Örn: 850000"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="location.city" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Şehir <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={form.location.city}
                  onChange={handleChange}
                  placeholder="Örn: İstanbul"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location.district" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  İlçe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location.district"
                  name="location.district"
                  value={form.location.district}
                  onChange={handleChange}
                  placeholder="Örn: Kadıköy"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location.address" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location.address"
                  name="location.address"
                  value={form.location.address}
                  onChange={handleChange}
                  placeholder="Detaylı adres bilgisi"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">Emlak Özellikleri</h2>
            
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="type" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Emlak Tipi <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleTypeChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Durum <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="satilik">Satılık</option>
                  <option value="kiralik">Kiralık</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="konut">Konut</option>
                  <option value="is-yeri">İş Yeri</option>
                  <option value="arsa">Arsa</option>
                  <option value="turizm">Turizm</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subcategory" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alt Kategori
                </label>
                <input
                  type="text"
                  id="subcategory"
                  name="subcategory"
                  value={form.subcategory || ""}
                  onChange={handleChange}
                  placeholder="Opsiyonel alt kategori"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="features.area" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alan (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="features.area"
                  name="features.area"
                  value={form.features.area}
                  onChange={handleChange}
                  placeholder="Örn: 120"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="features.rooms" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Oda Sayısı
                </label>
                <input
                  type="number"
                  id="features.rooms"
                  name="features.rooms"
                  value={form.features.rooms}
                  onChange={handleChange}
                  placeholder="Örn: 3"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="features.bathrooms" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Banyo Sayısı
                </label>
                <input
                  type="number"
                  id="features.bathrooms"
                  name="features.bathrooms"
                  value={form.features.bathrooms}
                  onChange={handleChange}
                  placeholder="Örn: 2"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="features.heating" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Isıtma
                </label>
                <select
                  id="features.heating"
                  name="features.heating"
                  value={form.features.heating || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
            
            <h3 className="mb-4 mt-6 text-lg font-medium dark:text-white">Emlak Özellikleri</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasGarage"
                  name="features.hasGarage"
                  checked={form.features.hasGarage}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasGarage" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Garaj / Otopark
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasGarden"
                  name="features.hasGarden"
                  checked={form.features.hasGarden}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasGarden" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bahçe
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasPool"
                  name="features.hasPool"
                  checked={form.features.hasPool}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasPool" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Havuz
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.isFurnished"
                  name="features.isFurnished"
                  checked={form.features.isFurnished}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.isFurnished" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Eşyalı
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasAirConditioning"
                  name="features.hasAirConditioning"
                  checked={form.features.hasAirConditioning || false}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasAirConditioning" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Klima
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasBalcony"
                  name="features.hasBalcony"
                  checked={form.features.hasBalcony || false}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasBalcony" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Balkon
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasElevator"
                  name="features.hasElevator"
                  checked={form.features.hasElevator || false}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasElevator" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Asansör
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasSecurity"
                  name="features.hasSecurity"
                  checked={form.features.hasSecurity || false}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasSecurity" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Güvenlik
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasInternet"
                  name="features.hasInternet"
                  checked={form.features.hasInternet || false}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasInternet" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  İnternet
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasSatelliteTV"
                  name="features.hasSatelliteTV"
                  checked={form.features.hasSatelliteTV || false}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasSatelliteTV" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Uydu TV
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasFittedKitchen"
                  name="features.hasFittedKitchen"
                  checked={form.features.hasFittedKitchen || false}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasFittedKitchen" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ankastre Mutfak
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.hasParentalBathroom"
                  name="features.hasParentalBathroom"
                  checked={form.features.hasParentalBathroom || false}
                  onChange={handleFeatureCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                />
                <label htmlFor="features.hasParentalBathroom" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ebeveyn Banyosu
                </label>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">Ek Özellikler</h2>
            
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Örn: Panoramik manzara"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                >
                  Ekle
                </button>
              </div>
              
              {form.extraFeatures && form.extraFeatures.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {form.extraFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">İlan Resimleri</h2>
            
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dosya Yükle
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg, image/webp"
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={isUploading || !selectedFile}
                  className={`rounded-lg px-4 py-2 text-white transition-colors ${
                    isUploading || !selectedFile
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isUploading ? "Yükleniyor..." : "Yükle"}
                </button>
              </div>
              
              {isUploading && (
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {uploadProgress}% yüklendi
                  </p>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resim URL'si Ekle
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Örn: https://example.com/resim.jpg"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                >
                  Ekle
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {form.images.map((image, index) => (
                <div key={index} className="relative rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="relative aspect-square">
                    <Image
                      src={image}
                      alt={`İlan resmi ${index + 1}`}
                      fill
                      className="rounded-t-lg object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">İlan Durumu</h2>
            
            <div className="mb-6 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isApproved"
                  name="isApproved"
                  checked={form.isApproved}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="isApproved" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  İlanı Onayla (Ana sayfada görünür)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Öne Çıkarılmış (Özel bölümlerde gösterilir)
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link
              href="/Admin/ilanlar"
              className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`rounded-lg px-6 py-2 text-white transition-colors ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
              }`}
            >
              {submitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PropertyEditPage; 