"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Link from "next/link"

// Kullanıcı tipi
interface User {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  role?: string
  profileImage?: string
  accountStatus?: string
  lastNameChange?: number // İsim değişikliği için zaman damgası
  favoriteListings?: string[]
  notifications?: {
    newListings?: boolean
    priceDrops?: boolean
    messages?: boolean
    marketing?: boolean
  }
  securitySettings?: {
    twoFactorEnabled?: boolean
    lastLogin?: number
    loginHistory?: Array<{ip: string, date: number, device: string}>
  }
}

const HesabimPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    facebook: "",
    instagram: "",
    twitter: "",
    newPassword: "",
    confirmPassword: "",
    currentPassword: "", // Mevcut şifre ekledik
    notifyNewListings: false,
    notifyPriceDrops: false,
    notifyMessages: false,
    notifyMarketing: false,
    twoFactorEnabled: false,
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Favori ilanlar için state
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  
  // Fotoğraf kırpma için
  const [showCropModal, setShowCropModal] = useState(false)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [cropAspect, setCropAspect] = useState(1) // 1:1 oran varsayılan
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  // Kullanıcı bilgilerini localStorage'dan getir
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          city: userData.city || "",
          facebook: userData.socialMedia?.facebook || "",
          instagram: userData.socialMedia?.instagram || "",
          twitter: userData.socialMedia?.twitter || "",
          newPassword: "",
          confirmPassword: "",
          currentPassword: "",
          notifyNewListings: userData.notifications?.newListings || false,
          notifyPriceDrops: userData.notifications?.priceDrops || false,
          notifyMessages: userData.notifications?.messages || false,
          notifyMarketing: userData.notifications?.marketing || false,
          twoFactorEnabled: userData.securitySettings?.twoFactorEnabled || false,
        })
        setProfileImage(userData.profileImage || null)
        
        // API'den güncel kullanıcı bilgilerini al
        fetchUserData(userData._id)
      } catch (error) {
        console.error("Kullanıcı verileri ayrıştırılamadı:", error)
        router.push("/signin")
      }
    } else {
      router.push("/signin")
    }
    setLoading(false)
  }, [router])
  
  // API'den kullanıcı bilgilerini getir
  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'user-id': userId
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const userData = data.user
        
        if (userData) {
          // State'leri güncelle
          setUser(userData)
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            city: userData.city || "",
            facebook: userData.socialMedia?.facebook || "",
            instagram: userData.socialMedia?.instagram || "",
            twitter: userData.socialMedia?.twitter || "",
            newPassword: "",
            confirmPassword: "",
            currentPassword: "",
            notifyNewListings: userData.notifications?.newListings || false,
            notifyPriceDrops: userData.notifications?.priceDrops || false,
            notifyMessages: userData.notifications?.messages || false,
            notifyMarketing: userData.notifications?.marketing || false,
            twoFactorEnabled: userData.securitySettings?.twoFactorEnabled || false,
          })
          setProfileImage(userData.profileImage || null)
          
          // LocalStorage'ı da güncelle
          localStorage.setItem("user", JSON.stringify(userData))
        }
      } else {
        console.error("Kullanıcı bilgileri alınamadı")
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri getirme hatası:", error)
    }
  }

  // Favori ilanları getir
  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  // Favori ilanları getir
  const fetchFavorites = async () => {
    if (!user) return
    
    try {
      setLoadingFavorites(true)
      
      // API'dan favori ilanları getir
      const response = await fetch('/api/favorites/user', {
        headers: {
          'user-id': user._id
        }
      })
      
      if (!response.ok) {
        throw new Error('Favoriler yüklenirken bir hata oluştu')
      }
      
      const data = await response.json()
      setFavoriteProperties(data.favorites || [])
    } catch (error) {
      console.error("Favoriler getirilemedi:", error)
      setFavoriteProperties([])
    } finally {
      setLoadingFavorites(false)
    }
  }

  // Para formatı
  const formatPrice = (price: number) => {
    return price.toLocaleString("tr-TR") + " ₺"
  }

  // Form verilerini güncelle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  // Profil fotoğrafı seçme
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // Dosyayı base64 formatına çevir ve kırpma modalını göster
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setProfileImage(e.target.result)
          setShowCropModal(true) // Kırpma modalını göster
          // Varsayılan kırpma alanını oluştur
          const image = new window.Image()
          image.src = e.target.result
          image.onload = () => {
            const crop = centerCrop(
              makeAspectCrop(
                {
                  unit: '%',
                  width: 90,
                },
                cropAspect,
                image.width,
                image.height
              ),
              image.width,
              image.height
            )
            setCrop(crop)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Kırpma oranını değiştir
  const handleAspectChange = (newAspect: number) => {
    setCropAspect(newAspect)
    if (imgRef.current) {
      const { width, height } = imgRef.current
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          newAspect,
          width,
          height
        ),
        width,
        height
      )
      setCrop(crop)
    }
  }

  // Resmi önizleme
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      // Resmi önizleme için oluştur
      const image = imgRef.current
      const canvas = previewCanvasRef.current
      const crop = completedCrop

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        return
      }

      const pixelRatio = window.devicePixelRatio
      canvas.width = crop.width * pixelRatio * scaleX
      canvas.height = crop.height * pixelRatio * scaleY

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.imageSmoothingQuality = 'high'

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      )
    }
  }, [completedCrop])

  // Kırpılmış resmi al
  const getCroppedImg = () => {
    if (
      !completedCrop || 
      !previewCanvasRef.current
    ) {
      return null;
    }

    const canvas = previewCanvasRef.current;
    const base64Image = canvas.toDataURL('image/jpeg');
    return base64Image;
  }

  // Kırpma işlemini tamamla
  const handleCropComplete = () => {
    const croppedImageUrl = getCroppedImg();
    if (croppedImageUrl) {
      setCroppedImage(croppedImageUrl);
      setProfileImage(croppedImageUrl);
    }
    setShowCropModal(false);
  }

  // Kırpma işlemini iptal et
  const handleCropCancel = () => {
    setShowCropModal(false);
    // İptal edilirse önceki resmi geri yükle veya null yap
    if (!user?.profileImage) {
      setProfileImage(null);
    } else {
      setProfileImage(user.profileImage);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Şifre değiştirme kontrolü
  const validatePasswordChange = () => {
    if (!formData.currentPassword) {
      toast.error("Mevcut şifrenizi girmelisiniz")
      return false
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Şifreler eşleşmiyor")
      return false
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır")
      return false
    }

    // API entegrasyonu olmadığı için ve localStorage'dan şifre hash'i alınamadığı için 
    // mevcut şifre kontrolünü atlamak için hep true dönüyoruz
    // Gerçek uygulamada API'ye mevcut şifre ve yeni şifre gönderilmeli
    return true
  }

  // İsim değiştirme kontrolü
  const canChangeName = () => {
    if (!user) return true
    
    // Eğer daha önce isim değişikliği yapılmamışsa izin ver
    if (!user.lastNameChange) return true
    
    // Son değişiklikten bu yana 1 saat geçmiş mi kontrol et
    const hoursPassed = (Date.now() - user.lastNameChange) / (1000 * 60 * 60)
    return hoursPassed >= 1
  }

  // Profil fotoğrafı yükleme
  const uploadProfileImage = async () => {
    if (!selectedFile) return null

    try {
      setUploading(true)
      // Burada normalde bir API endpoint'ine dosya yükleyebilirsiniz
      // Örnek olarak base64 formatında saklıyoruz
      const reader = new FileReader()
      
      return new Promise<string | null>((resolve) => {
        reader.onload = (e) => {
          if (e.target && typeof e.target.result === "string") {
            resolve(e.target.result)
          } else {
            resolve(null)
          }
        }
        reader.readAsDataURL(selectedFile)
      })
    } catch (error) {
      console.error("Profil fotoğrafı yükleme hatası:", error)
      return null
    } finally {
      setUploading(false)
    }
  }

  // Profil güncelleme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // İsim değişikliği kontrolü
    if (user && formData.name !== user.name) {
      if (!canChangeName()) {
        toast.error("İsminizi 1 saat içinde sadece bir kez değiştirebilirsiniz")
        return
      }
    }

    // Şifre değiştiriliyorsa kontrol et
    if (formData.newPassword) {
      if (!validatePasswordChange()) {
        return
      }
    }

    try {
      // Profil fotoğrafını yükle
      let uploadedImageUrl: string | null = null
      if (selectedFile) {
        uploadedImageUrl = croppedImage || await uploadProfileImage()
      }

      // Kullanıcı bilgilerini güncelle
      if (!user) return;
      
      // İsim değişikliği zaman damgası
      const nameChanged = formData.name !== user.name
      
      const updatedUser: User = {
        _id: user._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        socialMedia: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
        },
        notifications: {
          newListings: formData.notifyNewListings,
          priceDrops: formData.notifyPriceDrops,
          messages: formData.notifyMessages,
          marketing: formData.notifyMarketing,
        },
        securitySettings: {
          ...user.securitySettings,
          twoFactorEnabled: formData.twoFactorEnabled,
        },
        role: user.role,
        profileImage: uploadedImageUrl || user.profileImage,
        accountStatus: user.accountStatus || "active",
        lastNameChange: nameChanged ? Date.now() : user.lastNameChange,
        favoriteListings: user.favoriteListings || [],
      }

      // API aracılığıyla kullanıcı bilgilerini güncelle
      try {
        const response = await fetch('/api/users/update-profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'user-id': user._id
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            socialMedia: {
              facebook: formData.facebook,
              instagram: formData.instagram,
              twitter: formData.twitter,
            },
            notifications: {
              newListings: formData.notifyNewListings,
              priceDrops: formData.notifyPriceDrops,
              messages: formData.notifyMessages,
              marketing: formData.notifyMarketing,
            },
            securitySettings: {
              twoFactorEnabled: formData.twoFactorEnabled,
            },
            profileImage: uploadedImageUrl || user.profileImage,
            lastNameChange: nameChanged ? Date.now() : user.lastNameChange,
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Profil güncellenemedi");
        }
      } catch (error) {
        console.error("API profil güncelleme hatası:", error);
        // API hatası olsa bile localStorage güncellemeye devam edelim
      }

      // Sayfanın yenilenmesi durumunda profil bilgilerinin kaybolmaması için localStorage'a kaydediyoruz
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      // Profil resmini güncellemek için
      if (uploadedImageUrl) {
        setProfileImage(uploadedImageUrl)
      }
      
      window.dispatchEvent(new Event("userChanged"))

      // Şifre değiştirme API isteği
      if (formData.newPassword) {
        try {
          // API'ye şifre değiştirme isteği gönder
          const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'user-id': user._id
            },
            body: JSON.stringify({
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword
            })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            toast.error(data.error || "Şifre değiştirilemedi. Mevcut şifre yanlış olabilir.");
            return;
          }
          
          toast.success("Şifreniz ve profil bilgileriniz güncellendi");
        } catch (error) {
          console.error("Şifre değiştirme hatası:", error);
          toast.error("Şifre değiştirilirken bir hata oluştu");
        }
      } else {
        toast.success("Profil bilgileriniz güncellendi");
      }
      
      // Şifre alanlarını temizle
      setFormData(prev => ({ 
        ...prev, 
        newPassword: "", 
        confirmPassword: "",
        currentPassword: "" 
      }))
      
      // Dosya seçimini sıfırla
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setCroppedImage(null)
      
    } catch (error) {
      console.error("Profil güncelleme hatası:", error)
      toast.error("Profil güncellenirken bir hata oluştu")
    }
  }

  // Hesabı devre dışı bırak
  const deactivateAccount = () => {
    if (window.confirm("Hesabınızı devre dışı bırakmak istediğinizden emin misiniz?")) {
      try {
        if (!user) return;
        
        const updatedUser = {
          ...user,
          accountStatus: "inactive"
        }
        
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
        window.dispatchEvent(new Event("userChanged"))
        
        toast.success("Hesabınız devre dışı bırakıldı")
        setTimeout(() => {
          localStorage.removeItem("user")
          router.push("/signin")
        }, 2000)
      } catch (error) {
        console.error("Hesap devre dışı bırakma hatası:", error)
        toast.error("Hesabınız devre dışı bırakılırken bir hata oluştu")
      }
    }
  }

  // Kullanıcı isim baş harflerini al (profil fotoğrafı yoksa)
  const getInitials = (name: string) => {
    const parts = name.split(" ")
    return parts.map((part) => part.charAt(0).toUpperCase()).join("")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Router yönlendirmesi gerçekleşiyor
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-12">
      <Toaster position="top-right" />
      
      {/* Fotoğraf Kırpma Modalı */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Profil Fotoğrafını Düzenle</h3>
            
            <div className="relative mb-4">
              {profileImage && (
                <div className="flex flex-col items-center gap-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={cropAspect}
                    circularCrop={cropAspect === 1}
                    keepSelection
                  >
                    <img
                      ref={imgRef}
                      alt="Kırpılacak fotoğraf"
                      src={profileImage}
                      style={{ maxHeight: '400px' }}
                      className="max-w-full"
                    />
                  </ReactCrop>
                  
                  <div className="hidden">
                    <canvas
                      ref={previewCanvasRef}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Kırpma Oranı
                </label>
                <div className="flex space-x-4">
                  <button 
                    className={`px-3 py-1 rounded ${cropAspect === 1 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onClick={() => handleAspectChange(1)}
                    type="button"
                  >
                    1:1 (Kare)
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${cropAspect === 4/3 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onClick={() => handleAspectChange(4/3)}
                    type="button"
                  >
                    4:3
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${cropAspect === 16/9 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onClick={() => handleAspectChange(16/9)}
                    type="button"
                  >
                    16:9
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${cropAspect === 3/4 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onClick={() => handleAspectChange(3/4)}
                    type="button"
                  >
                    3:4 (Dikey)
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={handleCropCancel}
                type="button"
              >
                İptal
              </button>
              <button 
                className="px-4 py-2 text-white bg-primary rounded hover:bg-primary/90"
                onClick={handleCropComplete}
                type="button"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text:dark">Hesap Bilgilerim</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Profil bilgilerinizi buradan güncelleyebilirsiniz.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Sol taraf - Profil Fotoğrafı */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {profileImage ? (
                    <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-primary">
                      <Image 
                        src={profileImage} 
                        alt={user.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 w-40 items-center justify-center rounded-full bg-primary text-4xl font-bold text-white">
                      {getInitials(user.name)}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute bottom-0 right-0 rounded-full bg-gray-100 p-2 text-gray-600 shadow-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageSelect} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                
                {user.role && (
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {user.role}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sağ taraf - Bilgi Formu */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                  Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Adres
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Şehir
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sosyal Medya Hesapları</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">İsterseniz sosyal medya hesaplarınızı ekleyebilirsiniz.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Facebook
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          facebook.com/
                        </span>
                        <input
                          type="text"
                          id="facebook"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleChange}
                          className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 bg-white px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Instagram
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          instagram.com/
                        </span>
                        <input
                          type="text"
                          id="instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleChange}
                          className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 bg-white px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Twitter
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          twitter.com/
                        </span>
                        <input
                          type="text"
                          id="twitter"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                          className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 bg-white px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bildirim Tercihleri</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Hangi konularda bildirim almak istediğinizi seçin.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyNewListings"
                          name="notifyNewListings"
                          type="checkbox"
                          checked={formData.notifyNewListings}
                          onChange={handleChange}
                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyNewListings" className="font-medium text-gray-700 dark:text-gray-300">Yeni İlanlar</label>
                        <p className="text-gray-500 dark:text-gray-400">Arama kriterlerinize uyan yeni ilanlar eklendiğinde bildirim alın.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyPriceDrops"
                          name="notifyPriceDrops"
                          type="checkbox"
                          checked={formData.notifyPriceDrops}
                          onChange={handleChange}
                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyPriceDrops" className="font-medium text-gray-700 dark:text-gray-300">Fiyat Düşüşleri</label>
                        <p className="text-gray-500 dark:text-gray-400">Favori ilanlarınızda fiyat düşüşü olduğunda bildirim alın.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyMessages"
                          name="notifyMessages"
                          type="checkbox"
                          checked={formData.notifyMessages}
                          onChange={handleChange}
                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyMessages" className="font-medium text-gray-700 dark:text-gray-300">Mesajlar</label>
                        <p className="text-gray-500 dark:text-gray-400">Size yeni bir mesaj geldiğinde bildirim alın.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyMarketing"
                          name="notifyMarketing"
                          type="checkbox"
                          checked={formData.notifyMarketing}
                          onChange={handleChange}
                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyMarketing" className="font-medium text-gray-700 dark:text-gray-300">Pazarlama</label>
                        <p className="text-gray-500 dark:text-gray-400">Kampanyalar ve özel teklifler hakkında bildirim alın.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Güvenlik Ayarları</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Hesabınızın güvenliği için ayarları yapılandırın.</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="twoFactorEnabled"
                        name="twoFactorEnabled"
                        type="checkbox"
                        checked={formData.twoFactorEnabled}
                        onChange={handleChange}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="twoFactorEnabled" className="font-medium text-gray-700 dark:text-gray-300">İki Faktörlü Kimlik Doğrulama</label>
                      <p className="text-gray-500 dark:text-gray-400">Hesabınıza giriş yaparken SMS veya e-posta ile doğrulama kodu isteyin.</p>
                    </div>
                  </div>
                  
                  {user?.securitySettings?.lastLogin && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 mt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Son giriş: </span>
                        {new Date(user.securitySettings.lastLogin).toLocaleString('tr-TR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Favori İlanlarım</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kaydettiğiniz ilanları buradan görüntüleyebilirsiniz.</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 mt-2">
                    {loadingFavorites ? (
                      <div className="flex justify-center py-6">
                        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-solid border-primary"></div>
                      </div>
                    ) : favoriteProperties.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {favoriteProperties.slice(0, 4).map((property) => (
                          <Link href={`/emlak/${property._id}`} key={property._id} className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-3 flex items-center hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-md mr-3 flex-shrink-0 relative overflow-hidden">
                              {property.images && property.images.length > 0 ? (
                                <Image
                                  src={property.images[0]}
                                  alt={property.title}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-md"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white text-sm">{property.title}</h4>
                              <p className="text-gray-500 dark:text-gray-400 text-xs">{property.location.district}, {property.location.city}</p>
                              <p className="text-primary font-medium text-sm mt-1">{formatPrice(property.price)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Henüz favori ilanınız bulunmuyor.</p>
                    )}
                    
                    <div className="mt-4 text-center">
                      <Link href="/favoriler" className="text-primary hover:text-primary/80 text-sm font-medium">
                        Tüm Favori İlanlarımı Görüntüle
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Şifre Değiştir</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Şifrenizi değiştirmek istiyorsanız, önce mevcut şifrenizi girin.</p>
                  </div>
                  
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Şifre Tekrar
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={deactivateAccount}
                      className="rounded-md bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Hesabımı Devre Dışı Bırak
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="rounded-md bg-primary px-4 py-2 text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {uploading ? "Güncelleniyor..." : "Bilgileri Güncelle"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HesabimPage 