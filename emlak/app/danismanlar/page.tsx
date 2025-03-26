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
  bio?: string
  specialization?: string[]
  experience?: number
  languages?: string[]
  rating?: number
  propertySold?: number
  licenseNumber?: string
  website?: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }
}

export default function DanismanlarPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>([])

  useEffect(() => {
    const fetchAdvisors = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/advisors')
        if (!response.ok) {
          throw new Error('Danışmanlar yüklenirken bir hata oluştu')
        }
        const data = await response.json()
        setAdvisors(data)
        setFilteredAdvisors(data)
      } catch (error) {
        console.error("Danışmanlar yüklenirken hata oluştu:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAdvisors()
  }, [])
  
  // Filtreleme işlevi
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase()
    setFilter(searchTerm)
    
    if (!searchTerm.trim()) {
      setFilteredAdvisors(advisors)
      return
    }
    
    const filtered = advisors.filter(
      advisor => 
        advisor.name.toLowerCase().includes(searchTerm) || 
        advisor.city.toLowerCase().includes(searchTerm) ||
        advisor.specialization?.some(spec => spec.toLowerCase().includes(searchTerm)) ||
        advisor.bio?.toLowerCase().includes(searchTerm)
    )
    
    setFilteredAdvisors(filtered)
  }
  
  return (
    <section className="py-16 md:py-20 lg:py-24 pt-40">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h1 className="text-3xl font-bold leading-tight text-black dark:text-white md:text-4xl lg:text-5xl">
            Danışmanlarımız
          </h1>
          <p className="mt-4 text-lg text-body-color dark:text-body-color-dark">
            Gayrimenkul ihtiyaçlarınızda size yardımcı olacak uzman danışmanlarımız ile tanışın. 
            Deneyimli ve profesyonel ekibimiz, her adımda yanınızda.
          </p>
        </div>

        {/* Filtreleme */}
        <div className="mx-auto max-w-2xl mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="İsim, şehir veya uzmanlık alanı ile arayın..."
              value={filter}
              onChange={handleFilter}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-12 text-base text-black placeholder-gray-500 shadow-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg 
                className="h-5 w-5 text-gray-500 dark:text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
        </div>
      
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredAdvisors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredAdvisors.map((advisor) => (
              <div 
                key={advisor._id} 
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
              >
<div className="relative h-80 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
{advisor.profileImage ? (
                    <Image
                      src={advisor.profileImage}
                      alt={advisor.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Rol etiketi - Admin ve moderatör farklı renkler */}
                  <div className={`absolute top-0 right-0 text-white px-2 py-1 text-xs font-medium rounded-bl-lg ${advisor.role === "admin" ? 'bg-purple-600' : 'bg-primary'}`}>
                    {advisor.role === "admin" ? "Yönetici" : "Danışman"}
                  </div>
                  
                  {/* Rating */}
                  {advisor.rating && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 text-xs font-medium rounded-lg flex items-center">
                      <svg className="h-3 w-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {advisor.rating}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{advisor.name}</h3>
                  
                  <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{advisor.city}</span>
                  </div>
                  
                  {advisor.specialization && advisor.specialization.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {advisor.specialization.slice(0, 3).map((spec, index) => (
                        <span key={index} className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {spec}
                        </span>
                      ))}
                      {advisor.specialization.length > 3 && (
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                          +{advisor.specialization.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {advisor.bio && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">{advisor.bio}</p>
                  )}
                  
                  {/* Deneyim ve Lisans bilgileri - Her zaman göster */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{advisor.experience !== undefined ? `${advisor.experience} Yıl Deneyim` : "Henüz girilmemiş"}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>{advisor.licenseNumber ? `Lisans: ${advisor.licenseNumber}` : "Henüz girilmemiş"}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{advisor.propertySold !== undefined && advisor.propertySold > 0 ? `${advisor.propertySold} Satış` : "Henüz girilmemiş"}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span>{advisor.languages && advisor.languages.length > 0 ? `${advisor.languages.slice(0, 2).join(", ")}${advisor.languages.length > 2 ? "..." : ""}` : "Henüz girilmemiş"}</span>
                    </div>
                  </div>
                  
                  {/* İletişim bilgileri - Her zaman göster */}
                  <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {advisor.email ? (
                        <a href={`mailto:${advisor.email}`} className="hover:text-primary transition-colors">
                          {advisor.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">Henüz girilmemiş</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {advisor.phone ? (
                        <a href={`tel:${advisor.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                          {advisor.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400">Henüz girilmemiş</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      {advisor.website ? (
                        <a href={`https://${advisor.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          {advisor.website}
                        </a>
                      ) : (
                        <span className="text-gray-400">Henüz girilmemiş</span>
                      )}
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="h-3 w-3 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {advisor.address ? (
                        <span>{advisor.address}</span>
                      ) : (
                        <span className="text-gray-400">Henüz girilmemiş</span>
                      )}
                    </div>
                  </div>

                  
                  {/* Sosyal medya linkleri - Her zaman göster */}
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex space-x-2">
                      {advisor.socialMedia?.facebook ? (
                        <a 
                          href={advisor.socialMedia.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="h-4 w-4 text-gray-300 dark:text-gray-600">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                          </svg>
                        </span>
                      )}
                      
                      {advisor.socialMedia?.twitter ? (
                        <a 
                          href={advisor.socialMedia.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-500 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="h-4 w-4 text-gray-300 dark:text-gray-600">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                          </svg>
                        </span>
                      )}
                      
                      {advisor.socialMedia?.instagram ? (
                        <a 
                          href={advisor.socialMedia.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="h-4 w-4 text-gray-300 dark:text-gray-600">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* İletişim butonları - Her zaman göster */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href={advisor.email ? `mailto:${advisor.email}` : '#'}
                      className={`text-white text-center py-1.5 rounded-md transition-colors inline-flex items-center justify-center text-xs ${advisor.email ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      E-posta
                    </a>
                    <a
                      href={advisor.phone ? `tel:${advisor.phone.replace(/\s/g, '')}` : '#'}
                      className={`text-white text-center py-1.5 rounded-md transition-colors inline-flex items-center justify-center text-xs ${advisor.phone ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Ara
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Sonuç Bulunamadı</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Arama kriterlerinize uygun danışman bulunamadı.</p>
            <button 
              onClick={() => setFilter("")}
              className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Tüm Danışmanları Göster
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
