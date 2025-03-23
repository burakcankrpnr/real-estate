"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// Danışman tipi
interface Advisor {
  _id: string
  name: string
  email: string
  phone: string
  address?: string
  city: string
  role: "admin" | "moderator"
  profileImage: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  bio?: string
}

export default function DanismanlarPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvisors = async () => {
      setLoading(true)
      try {
        // Normalde API'den veri çekilecek
        // const response = await fetch('/api/advisors')
        // const data = await response.json()
        
        // Örnek veri
        const mockAdvisors: Advisor[] = [
          {
            _id: "1",
            name: "Ahmet Yılmaz",
            email: "ahmet.yilmaz@emlak.com",
            phone: "+90 532 123 4567",
            address: "Bağdat Caddesi No:42, Kadıköy",
            city: "İstanbul",
            role: "admin",
            profileImage: "/favicon.ico",
            socialMedia: {
              facebook: "https://facebook.com/ahmetyilmaz",
              twitter: "https://twitter.com/ahmetyilmaz",
              instagram: "https://instagram.com/ahmetyilmaz",
              linkedin: "https://linkedin.com/in/ahmetyilmaz"
            },
            bio: "10 yıllık gayrimenkul deneyimi ile İstanbul'un en değerli bölgelerinde uzmanlaşmış, sektörün önde gelen danışmanlarından."
          },
          {
            _id: "2",
            name: "Ayşe Demir",
            email: "ayse.demir@emlak.com",
            phone: "+90 535 456 7890",
            address: "Nişantaşı, Şişli",
            city: "İstanbul",
            role: "moderator",
            profileImage: "/favicon.ico",
            socialMedia: {
              facebook: "https://facebook.com/aysedemir",
              instagram: "https://instagram.com/aysedemir",
              linkedin: "https://linkedin.com/in/aysedemir"
            },
            bio: "Lüks konut segmentinde uzmanlaşmış, müşteri memnuniyetini ön planda tutan deneyimli gayrimenkul danışmanı."
          },
          {
            _id: "3",
            name: "Mehmet Kaya",
            email: "mehmet.kaya@emlak.com",
            phone: "+90 533 789 0123",
            address: "Ataşehir, Batı Ataşehir",
            city: "İstanbul",
            role: "moderator",
            profileImage: "/favicon.ico",
            socialMedia: {
              twitter: "https://twitter.com/mehmetkaya",
              instagram: "https://instagram.com/mehmetkaya",
              linkedin: "https://linkedin.com/in/mehmetkaya"
            },
            bio: "Yatırım amaçlı gayrimenkul alımlarında uzmanlaşmış, portföy yönetimi konusunda deneyimli danışman."
          },
          {
            _id: "4",
            name: "Zeynep Aksoy",
            email: "zeynep.aksoy@emlak.com",
            phone: "+90 534 234 5678",
            address: "Kozyatağı, Kadıköy",
            city: "İstanbul",
            role: "admin",
            profileImage: "/favicon.ico",
            socialMedia: {
              facebook: "https://facebook.com/zeynepaksoy",
              instagram: "https://instagram.com/zeynepaksoy",
              linkedin: "https://linkedin.com/in/zeynepaksoy"
            },
            bio: "Sektörde 15 yıllık deneyimiyle özellikle Anadolu yakasında uzmanlaşmış, pazar bilgisi güçlü danışman."
          },
          {
            _id: "5",
            name: "Burak Öztürk",
            email: "burak.ozturk@emlak.com",
            phone: "+90 536 345 6789",
            address: "Beylikdüzü",
            city: "İstanbul",
            role: "moderator",
            profileImage: "/favicon.ico",
            socialMedia: {
              twitter: "https://twitter.com/burakozturk",
              instagram: "https://instagram.com/burakozturk"
            },
            bio: "Yeni gelişen bölgelerde uzmanlaşmış, yatırım fırsatları konusunda tecrübeli danışman."
          }
        ]
        
        setAdvisors(mockAdvisors)
      } catch (error) {
        console.error("Danışmanlar yüklenirken hata oluştu:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAdvisors()
  }, [])
  
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">Danışmanlarımız</h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advisors.map((advisor) => (
            <div 
              key={advisor._id} 
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {advisor.profileImage ? (
                  <Image
                    src={advisor.profileImage}
                    alt={advisor.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                
                {/* Rol etiketi */}
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                  {advisor.role === "admin" ? "Yönetici" : "Moderatör"}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{advisor.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{advisor.city}</p>
                
                {advisor.bio && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 line-clamp-3">{advisor.bio}</p>
                )}
                
                {/* İletişim bilgileri */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${advisor.email}`} className="hover:text-primary transition-colors">
                      {advisor.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${advisor.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                      {advisor.phone}
                    </a>
                  </div>
                  
                  {advisor.address && (
                    <div className="flex items-start text-gray-600 dark:text-gray-300">
                      <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{advisor.address}</span>
                    </div>
                  )}
                </div>
                
                {/* Sosyal medya linkleri */}
                {advisor.socialMedia && (
                  <div className="mt-5 flex space-x-3">
                    {advisor.socialMedia.facebook && (
                      <a 
                        href={advisor.socialMedia.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                        </svg>
                      </a>
                    )}
                    
                    {advisor.socialMedia.twitter && (
                      <a 
                        href={advisor.socialMedia.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500 transition-colors"
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                        </svg>
                      </a>
                    )}
                    
                    {advisor.socialMedia.instagram && (
                      <a 
                        href={advisor.socialMedia.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                    )}
                    
                    {advisor.socialMedia.linkedin && (
                      <a 
                        href={advisor.socialMedia.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-800 transition-colors"
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
                
                {/* İletişim butonları */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <a
                    href={`mailto:${advisor.email}`}
                    className="bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-colors inline-flex items-center justify-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    E-posta
                  </a>
                  <a
                    href={`tel:${advisor.phone.replace(/\s/g, '')}`}
                    className="bg-green-600 text-white text-center py-2 rounded-md hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Ara
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
