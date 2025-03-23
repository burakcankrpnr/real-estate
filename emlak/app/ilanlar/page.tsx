"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// İlan tipi tanımlama
interface Listing {
  _id: string
  title: string
  description: string
  price: number
  location: {
    city: string
    district: string
    address?: string
  }
  propertyType: string
  category: string
  features: {
    rooms?: string | number
    bathrooms?: string | number
    area?: string | number
    floors?: string | number
    floor?: string | number
    bedrooms?: string | number
    buildingAge?: string | number
    heating?: string
    hasGarage?: boolean
    hasGarden?: boolean
    hasPool?: boolean
    isFurnished?: boolean
    hasAirConditioning?: boolean
    hasBalcony?: boolean
    hasElevator?: boolean
    hasSecurity?: boolean
    hasInternet?: boolean
    hasSatelliteTV?: boolean
    hasFittedKitchen?: boolean
    hasParentalBathroom?: boolean
  }
  extraFeatures?: string[]
  rooms?: string
  size?: number
  bathrooms?: number
  isFeatured?: boolean
  images: string[]
  status: string
  createdAt: string
  updatedAt: string
  formattedPrice?: string
}

// Filtre tipi
interface Filters {
  city: string
  district: string
  propertyType: string
  category: string
  minPrice: string
  maxPrice: string
  rooms: string
  minSize: string
  maxSize: string
  features: string[]
}

export default function IlanlarPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtre değerleri
  const [filters, setFilters] = useState<Filters>({
    city: "",
    district: "",
    propertyType: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rooms: "",
    minSize: "",
    maxSize: "",
    features: []
  })
  
  // Filter seçenekleri
  const [cities, setCities] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [allFeatures, setAllFeatures] = useState<string[]>([])
  
  // Fiyat formatı
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price)
  }

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        // Admin tarafından onaylanmış ilanları çekelim
        const response = await fetch('/api/properties?isApproved=true')
        const data = await response.json()
        
        // Property tipini uyarlayalım ve formatlı fiyat ekleyelim
        const formattedData = data.properties.map((property: any) => ({
          _id: property._id,
          title: property.title,
          description: property.description || "",
          price: property.price,
          location: {
            city: property.location?.city || "",
            district: property.location?.district || "",
            address: property.location?.address || ""
          },
          propertyType: property.type || "",
          category: property.status || "",
          features: property.features || {},
          extraFeatures: property.extraFeatures || [],
          rooms: property.features?.rooms || "",
          size: property.features?.area || 0,
          bathrooms: property.features?.bathrooms || 0,
          isFeatured: property.isFeatured || false,
          images: property.images || [],
          status: "Aktif",
          createdAt: property.createdAt,
          updatedAt: property.updatedAt,
          formattedPrice: formatPrice(property.price)
        }))
        
        setListings(formattedData)
        setFilteredListings(formattedData)
        
        // Filtre seçeneklerini oluşturalım
        const uniqueCities = [...new Set(formattedData.map((item: Listing) => item.location.city).filter(Boolean))] as string[]
        const uniqueDistricts = [...new Set(formattedData.map((item: Listing) => item.location.district).filter(Boolean))] as string[]
        const uniquePropertyTypes = [...new Set(formattedData.map((item: Listing) => item.propertyType).filter(Boolean))] as string[]
        const uniqueCategories = [...new Set(formattedData.map((item: Listing) => item.category).filter(Boolean))] as string[]
        const uniqueFeatures = [...new Set(formattedData.flatMap((item: Listing) => 
          Object.entries(item.features || {})
            .filter(([_, value]) => value === true)
            .map(([key]) => {
              // hasGarage, hasGarden vb. isimleri daha kullanıcı dostu hale getir
              const keyWithoutPrefix = key.startsWith('has') ? key.substring(3) : key;
              const keyWithoutIs = key.startsWith('is') ? key.substring(2) : keyWithoutPrefix;
              // İlk harfi büyük yap ve camelCase'den normal metine çevir
              return keyWithoutIs.charAt(0).toUpperCase() + keyWithoutIs.slice(1).replace(/([A-Z])/g, ' $1').trim();
            })
        ).filter(Boolean))] as string[]
        
        setCities(uniqueCities)
        setDistricts(uniqueDistricts)
        setPropertyTypes(uniquePropertyTypes)
        setCategories(uniqueCategories)
        setAllFeatures(uniqueFeatures)
      } catch (error) {
        console.error("İlanlar yüklenirken hata oluştu:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchListings()
  }, [])
  
  // Filtreleme işlevi
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }
  
  // Özellik filtreleme
  const handleFeatureChange = (feature: string) => {
    setFilters(prev => {
      const isFeatureSelected = prev.features.includes(feature)
      
      if (isFeatureSelected) {
        return {
          ...prev,
          features: prev.features.filter(f => f !== feature)
        }
      } else {
        return {
          ...prev,
          features: [...prev.features, feature]
        }
      }
    })
  }
  
  // Filtreleri uygula
  const applyFilters = () => {
    let filtered = [...listings]
    
    // Şehir filtresi
    if (filters.city) {
      filtered = filtered.filter(listing => listing.location.city === filters.city)
    }
    
    // İlçe filtresi
    if (filters.district) {
      filtered = filtered.filter(listing => listing.location.district === filters.district)
    }
    
    // Emlak tipi filtresi
    if (filters.propertyType) {
      filtered = filtered.filter(listing => listing.propertyType === filters.propertyType)
    }
    
    // Kategori filtresi
    if (filters.category) {
      filtered = filtered.filter(listing => listing.category === filters.category)
    }
    
    // Minimum fiyat filtresi
    if (filters.minPrice) {
      filtered = filtered.filter(listing => listing.price >= parseInt(filters.minPrice))
    }
    
    // Maksimum fiyat filtresi
    if (filters.maxPrice) {
      filtered = filtered.filter(listing => listing.price <= parseInt(filters.maxPrice))
    }
    
    // Oda sayısı filtresi
    if (filters.rooms) {
      filtered = filtered.filter(listing => listing.rooms === filters.rooms)
    }
    
    // Minimum boyut filtresi
    if (filters.minSize) {
      filtered = filtered.filter(listing => listing.size && listing.size >= parseInt(filters.minSize))
    }
    
    // Maksimum boyut filtresi
    if (filters.maxSize) {
      filtered = filtered.filter(listing => listing.size && listing.size <= parseInt(filters.maxSize))
    }
    
    // Özellikler filtresi
    if (filters.features.length > 0) {
      filtered = filtered.filter(listing => 
        filters.features.every(feature => {
          // Özellik adını API'deki property anahtarına dönüştür
          const featureKey = feature
            .toLowerCase()
            // Boşlukları kaldır ve camelCase'e çevir
            .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
            // Boolean özelliklere 'has' veya 'is' öneki ekle
            .replace(/^([a-z])/, (_, firstChar) => {
              // Eğer zaten has veya is ile başlıyorsa değiştirme
              if (feature.toLowerCase().startsWith('has') || feature.toLowerCase().startsWith('is')) {
                return firstChar;
              }
              return 'has' + firstChar.toUpperCase();
            });
          
          return listing.features[featureKey as keyof typeof listing.features] === true;
        })
      )
    }
    
    setFilteredListings(filtered)
  }
  
  // Filtreleri sıfırla
  const resetFilters = () => {
    setFilters({
      city: "",
      district: "",
      propertyType: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      rooms: "",
      minSize: "",
      maxSize: "",
      features: []
    })
    setFilteredListings(listings)
  }
  
  // Filtre değişikliklerini izleme
  useEffect(() => {
    applyFilters()
  }, [filters])

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">Emlak İlanları</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filtre bölümü */}
        <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Filtreleme Seçenekleri</h2>
          
          <div className="space-y-4">
            {/* Kategori filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategori
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
              >
                <option value="">Tümü</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Şehir filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Şehir
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
              >
                <option value="">Tümü</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            {/* İlçe filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                İlçe
              </label>
              <select
                name="district"
                value={filters.district}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
              >
                <option value="">Tümü</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </select>
            </div>
            
            {/* Emlak tipi filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emlak Tipi
              </label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
              >
                <option value="">Tümü</option>
                {propertyTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Fiyat aralığı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fiyat Aralığı
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min ₺"
                  className="w-1/2 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max ₺"
                  className="w-1/2 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            {/* Oda sayısı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Oda Sayısı
              </label>
              <select
                name="rooms"
                value={filters.rooms}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
              >
                <option value="">Tümü</option>
                <option value="1+0">1+0</option>
                <option value="1+1">1+1</option>
                <option value="2+1">2+1</option>
                <option value="3+1">3+1</option>
                <option value="4+1">4+1</option>
                <option value="5+1">5+1</option>
                <option value="6+">6+ Oda</option>
              </select>
            </div>
            
            {/* Boyut aralığı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Boyut (m²)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minSize"
                  value={filters.minSize}
                  onChange={handleFilterChange}
                  placeholder="Min m²"
                  className="w-1/2 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                />
                <input
                  type="number"
                  name="maxSize"
                  value={filters.maxSize}
                  onChange={handleFilterChange}
                  placeholder="Max m²"
                  className="w-1/2 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            {/* Özellikler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Özellikler
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {allFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-${index}`}
                      checked={filters.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`feature-${index}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Filtre butonları */}
            <div className="pt-4 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sıfırla
              </button>
              <button
                onClick={applyFilters}
                className="w-1/2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
        
        {/* İlanlar listesi */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Filtrelere uygun ilan bulunamadı
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Lütfen filtreleri değiştirerek tekrar deneyin
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{filteredListings.length}</span> ilan listeleniyor
                </p>
                <div className="flex items-center">
                  <label className="mr-2 text-sm text-gray-600 dark:text-gray-400">Sırala:</label>
                  <select 
                    className="p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm focus:ring-primary focus:border-primary"
                    onChange={(e) => {
                      // Sıralama işlevi eklenebilir
                      console.log(e.target.value)
                    }}
                  >
                    <option value="newest">En Yeni</option>
                    <option value="price_asc">Fiyat (Artan)</option>
                    <option value="price_desc">Fiyat (Azalan)</option>
                  </select>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Önce öne çıkan ilanları listeleme */}
                {filteredListings
                  .sort((a, b) => {
                    // Öne çıkan ilanları üste getir
                    if (a.isFeatured && !b.isFeatured) return -1
                    if (!a.isFeatured && b.isFeatured) return 1
                    return 0
                  })
                  .map((listing) => (
                    <div 
                      key={listing._id} 
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 group"
                    >
                      {/* İlan resmi ve öne çıkan rozeti */}
                      <div className="relative h-48 overflow-hidden">
                        {listing.images && listing.images.length > 0 ? (
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Öne çıkan rozeti */}
                        {listing.isFeatured && (
                          <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-semibold rounded-bl-lg shadow-md z-10">
                            Öne Çıkan
                          </div>
                        )}
                        
                        {/* Kategori etiketi */}
                        <div className="absolute bottom-0 left-0 bg-black/60 text-white px-3 py-1 text-xs font-medium">
                          {listing.category}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 hover:text-primary transition-colors">{listing.title}</h3>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <svg className="h-4 w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{listing.location.district}, {listing.location.city}</span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{listing.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {listing.features && Object.keys(listing.features).length > 0 ? (
                            <>
                              {Object.entries(listing.features)
                                .filter(([key, value]) => value === true)
                                .slice(0, 3)
                                .map(([key, _], index) => {
                                  // hasGarage, hasGarden vb. isimleri daha kullanıcı dostu hale getir
                                  const keyWithoutPrefix = key.startsWith('has') ? key.substring(3) : key;
                                  const keyWithoutIs = key.startsWith('is') ? key.substring(2) : keyWithoutPrefix;
                                  // İlk harfi büyük yap ve camelCase'den normal metine çevir
                                  const displayName = keyWithoutIs.charAt(0).toUpperCase() + keyWithoutIs.slice(1).replace(/([A-Z])/g, ' $1').trim();
                                  
                                  return (
                                    <span key={index} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                                      {displayName}
                                    </span>
                                  );
                                })
                              }
                              {Object.entries(listing.features).filter(([_, value]) => value === true).length > 3 && (
                                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                                  +{Object.entries(listing.features).filter(([_, value]) => value === true).length - 3}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">Özellik belirtilmemiş</span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                          <div className="text-lg font-bold text-primary">{listing.formattedPrice}</div>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            {listing.size && (
                              <span>{listing.size} m²</span>
                            )}
                            {listing.rooms && (
                              <span className="flex items-center">
                                <span className="mx-1">•</span>
                                {listing.rooms}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Link
                          href={`/emlak/${listing._id}`}
                          className="mt-3 block w-full bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          İncele
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 