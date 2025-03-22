"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import toast, { Toaster } from "react-hot-toast"

// Kullanıcı tipi
interface User {
  _id: string
  name: string
  email: string
  role?: string
  profileImage?: string
}

const HesabimPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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
          newPassword: "",
          confirmPassword: "",
        })
        setProfileImage(userData.profileImage || null)
      } catch (error) {
        console.error("Kullanıcı verileri ayrıştırılamadı:", error)
        router.push("/signin")
      }
    } else {
      router.push("/signin")
    }
    setLoading(false)
  }, [router])

  // Form verilerini güncelle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Profil fotoğrafı seçme
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // Dosyayı base64 formatına çevir ve önizleme olarak göster
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setProfileImage(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
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

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Şifreler eşleşmiyor")
      return
    }

    // Şifre minimum uzunluk kontrolü
    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır")
      return
    }

    try {
      // Profil fotoğrafını yükle
      let uploadedImageUrl: string | null = null
      if (selectedFile) {
        uploadedImageUrl = await uploadProfileImage()
      }

      // Kullanıcı bilgilerini güncelle
      // Burada API endpoint'inize bir güncelleme isteği gönderebilirsiniz
      // Örnek olarak localStorage'da güncelliyoruz
      if (!user) return;
      
      const updatedUser: User = {
        _id: user._id,
        name: formData.name,
        email: formData.email,
        role: user.role,
        profileImage: uploadedImageUrl || user.profileImage,
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      window.dispatchEvent(new Event("userChanged"))

      toast.success("Profil bilgileriniz güncellendi")
      
      // Şifre alanlarını temizle
      setFormData(prev => ({ 
        ...prev, 
        newPassword: "", 
        confirmPassword: "" 
      }))
    } catch (error) {
      console.error("Profil güncelleme hatası:", error)
      toast.error("Profil güncellenirken bir hata oluştu")
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
      
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hesap Bilgilerim</h1>
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Şifre Değiştir</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Şifrenizi değiştirmek istiyorsanız, yeni şifrenizi aşağıya girin.</p>
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
                  
                  <div className="flex justify-end">
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