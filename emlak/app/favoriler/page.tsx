"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

// İlan tipi
interface Property {
  _id: string
  title: string
  description: string
  price: number
  location: {
    city: string
    district: string
  }
  type: string
  category: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: string[]
  features: string[]
  isFeatured: boolean
  isApproved: boolean
  createdAt: string
}

const FavorilerPage = () => {
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Kullanıcı bilgilerini localStorage'dan getir
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Kullanıcı verileri ayrıştırılamadı:", error)
        router.push("/signin")
      }
    } else {
      router.push("/signin")
    }
  }, [router])

  // Favori ilanları getir
  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    // Normalde burada bir API endpoint'i çağrılır
    // Örnek olarak localStorage'dan favori ilanları alıyoruz
    try {
      setLoading(true)
      const storedFavorites = localStorage.getItem(`favorites_${user._id}`)
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      } else {
        // Örnek favoriler (gerçek projede API'dan gelecek)
        const dummyFavorites: Property[] = [
          {
            _id: "1",
            title: "Deniz Manzaralı 3+1 Daire",
            description: "Muhteşem deniz manzaralı, modern tasarımlı, ferah daire",
            price: 2500000,
            location: {
              city: "İstanbul",
              district: "Kadıköy"
            },
            type: "Satılık",
            category: "Daire",
            bedrooms: 3,
            bathrooms: 2,
            area: 145,
            images: ["/images/properties/property-1.jpg"],
            features: ["Otopark", "Havuz", "Güvenlik"],
            isFeatured: true,
            isApproved: true,
            createdAt: new Date().toISOString()
          },
          {
            _id: "2",
            title: "Bahçeli Müstakil Ev",
            description: "Geniş bahçeli, doğa ile iç içe, huzurlu bir yaşam alanı",
            price: 4750000,
            location: {
              city: "İzmir",
              district: "Karşıyaka"
            },
            type: "Satılık",
            category: "Müstakil Ev",
            bedrooms: 4,
            bathrooms: 3,
            area: 220,
            images: ["/images/properties/property-2.jpg"],
            features: ["Bahçe", "Otopark", "Şömine"],
            isFeatured: false,
            isApproved: true,
            createdAt: new Date().toISOString()
          }
        ]
        setFavorites(dummyFavorites)
        localStorage.setItem(`favorites_${user._id}`, JSON.stringify(dummyFavorites))
      }
    } catch (error) {
      console.error("Favoriler getirilemedi:", error)
    } finally {
      setLoading(false)
    }
  }

  // Favorilerden kaldır
  const removeFavorite = (propertyId: string) => {
    // Favorilerden kaldır
    const updatedFavorites = favorites.filter(property => property._id !== propertyId)
    setFavorites(updatedFavorites)
    
    // LocalStorage güncelle (Gerçek uygulamada API çağrısı yapılır)
    localStorage.setItem(`favorites_${user._id}`, JSON.stringify(updatedFavorites))
  }

  // Para formatı
  const formatPrice = (price: number) => {
    return price.toLocaleString("tr-TR") + " ₺"
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
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Favori İlanlarım</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Beğendiğiniz ilanları takip edin, gelişmelerden haberdar olun.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-200">Henüz Favori İlanınız Yok</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              İlanları favorilere ekleyip daha sonra kolayca erişebilirsiniz.
            </p>
            <Link href="/ilanlar" className="mt-6 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
              İlanları Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((property) => (
              <div key={property._id} className="group relative overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg dark:bg-gray-800">
                {/* İlan Resmi */}
                <div className="relative h-48 w-full overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Favoriden kaldır butonu */}
                  <button
                    onClick={() => removeFavorite(property._id)}
                    className="absolute top-2 right-2 rounded-full bg-white p-2 text-red-500 shadow-md transition hover:bg-red-500 hover:text-white dark:bg-gray-700 dark:hover:bg-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* İlan Tipi */}
                  <div className="absolute top-2 left-2 rounded bg-primary px-2 py-1 text-xs font-semibold text-white">
                    {property.type}
                  </div>
                </div>
                
                {/* İlan Bilgileri */}
                <div className="p-4">
                  <Link href={`/ilan/${property._id}`}>
                    <h3 className="mb-2 text-xl font-bold text-gray-800 hover:text-primary dark:text-white dark:hover:text-primary">
                      {property.title}
                    </h3>
                  </Link>
                  
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
                    {property.description}
                  </p>
                  
                  <div className="mb-4 flex items-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{property.location.district}, {property.location.city}</span>
                  </div>
                  
                  {/* Özellikler */}
                  <div className="mb-4 flex justify-between border-t border-b border-gray-100 py-2 dark:border-gray-700">
                    {property.bedrooms !== undefined && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms} Oda
                      </div>
                    )}
                    
                    {property.bathrooms !== undefined && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {property.bathrooms} Banyo
                      </div>
                    )}
                    
                    {property.area !== undefined && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {property.area} m²
                      </div>
                    )}
                  </div>
                  
                  {/* Fiyat ve Detaylar */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{formatPrice(property.price)}</span>
                    <Link
                      href={`/ilan/${property._id}`}
                      className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                    >
                      Detaylar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavorilerPage 