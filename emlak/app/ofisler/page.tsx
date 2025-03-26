"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// Ofis tipi
interface Office {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  district: string
  description?: string
  image?: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  workingHours?: {
    weekdays: string
    saturday?: string
    sunday?: string
  }
  location?: {
    lat: number
    lng: number
  }
  agentCount?: number
  establishedYear?: number
}

export default function OfislerPage() {
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [filteredOffices, setFilteredOffices] = useState<Office[]>([])

  useEffect(() => {
    const fetchOffices = async () => {
      setLoading(true)
      try {
        // Gerçek API'den veri çekilecek, şimdilik mock veri kullanıyoruz
        // const response = await fetch('/api/offices')
        // const data = await response.json()
        
        // Mock veri
        const mockOffices: Office[] = [
          
          {
            _id: "5",
            name: "Antalya Sahil Emlak",
            email: "info@antalyasahilemlak.com",
            phone: "+90 242 555 8901",
            address: "Konyaaltı Cad. No:56",
            city: "Antalya",
            district: "Konyaaltı",
            description: "Antalya'nın en güzel sahil bölgelerinde yazlık, daire ve villa satışı yapan uzman emlak ofisi.",
            image: "/favicon.ico",
            socialMedia: {
              instagram: "antalya_sahil_emlak"
            },
            workingHours: {
              weekdays: "09:00 - 19:00",
              saturday: "10:00 - 17:00",
              sunday: "11:00 - 15:00"
            },
            agentCount: 7,
            establishedYear: 2015
          }
        ]
        
        setOffices(mockOffices)
        setFilteredOffices(mockOffices)
      } catch (error) {
        console.error("Ofisler yüklenirken hata oluştu:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOffices()
  }, [])

  // Filtreleme işlevi
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase()
    setFilter(searchTerm)
    
    if (!searchTerm.trim()) {
      setFilteredOffices(offices)
      return
    }
    
    const filtered = offices.filter(
      office => 
        office.name.toLowerCase().includes(searchTerm) || 
        office.city.toLowerCase().includes(searchTerm) || 
        office.district.toLowerCase().includes(searchTerm)
    )
    
    setFilteredOffices(filtered)
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 pt-40">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h1 className="text-3xl font-bold leading-tight text-black dark:text-white md:text-4xl lg:text-5xl">
            Emlak Ofislerimiz
          </h1>
          <p className="mt-4 text-lg text-body-color dark:text-body-color-dark">
            Türkiye'nin dört bir yanındaki ofislerimizle hizmetinizdeyiz. Size en yakın ofise ulaşın ve gayrimenkul ihtiyaçlarınız için profesyonel destek alın.
          </p>
        </div>

        {/* Filtreleme */}
        <div className="mx-auto max-w-2xl mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Ofis adı veya şehir ile arayın..."
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
        ) : filteredOffices.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredOffices.map((office) => (
              <div 
                key={office._id} 
                className="rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-dark overflow-hidden"
              >
                {office.image ? (
                  <div className="h-48 w-full relative">
                    <Image 
                      src={office.image} 
                      alt={office.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg 
                      className="h-16 w-16 text-gray-400 dark:text-gray-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                      />
                    </svg>
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-black dark:text-white">
                        {office.name}
                      </h3>
                      {office.establishedYear && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {office.establishedYear}'den beri
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
                      {office.district}, {office.city}
                    </p>
                  </div>
                  
                  {office.description && (
                    <p className="mb-4 text-sm text-body-color dark:text-body-color-dark line-clamp-3">
                      {office.description}
                    </p>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-body-color dark:text-body-color-dark">
                      <svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {office.email}
                    </div>
                    <div className="flex items-center text-sm text-body-color dark:text-body-color-dark">
                      <svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {office.phone}
                    </div>
                    <div className="flex items-start text-sm text-body-color dark:text-body-color-dark">
                      <svg className="mr-2 h-4 w-4 mt-0.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{office.address}, {office.district}, {office.city}</span>
                    </div>
                    
                    {office.workingHours && (
                      <div className="flex items-start text-sm text-body-color dark:text-body-color-dark">
                        <svg className="mr-2 h-4 w-4 mt-0.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div>Hafta içi: {office.workingHours.weekdays}</div>
                          {office.workingHours.saturday && <div>Cumartesi: {office.workingHours.saturday}</div>}
                          {office.workingHours.sunday && <div>Pazar: {office.workingHours.sunday}</div>}
                        </div>
                      </div>
                    )}
                    
                    {office.agentCount && (
                      <div className="flex items-center text-sm text-body-color dark:text-body-color-dark">
                        <svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {office.agentCount} Danışman
                      </div>
                    )}
                  </div>
                  
                  {/* Sosyal Medya Linkleri */}
                  {office.socialMedia && Object.values(office.socialMedia).some(value => value) && (
                    <div className="mt-4 flex space-x-3">
                      {office.socialMedia.facebook && (
                        <a 
                          href={`https://facebook.com/${office.socialMedia.facebook}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        </a>
                      )}
                      {office.socialMedia.instagram && (
                        <a 
                          href={`https://instagram.com/${office.socialMedia.instagram}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </a>
                      )}
                      {office.socialMedia.twitter && (
                        <a 
                          href={`https://twitter.com/${office.socialMedia.twitter}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.126 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                          </svg>
                        </a>
                      )}
                      {office.website && (
                        <a 
                          href={office.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-6 flex space-x-3">
                    <a 
                      href={`mailto:${office.email}`} 
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                    >
                      E-posta Gönder
                    </a>
                    <a 
                      href={`tel:${office.phone.replace(/\s+/g, '')}`} 
                      className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      Ara
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-dark">
            <p className="text-lg text-body-color dark:text-body-color-dark">
              Aramanızla eşleşen ofis bulunamadı.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}