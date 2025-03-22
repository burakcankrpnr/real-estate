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
  images: string[];
  isApproved: boolean;
  isFeatured: boolean;
}

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

const formData = {
  ...form,
  price: parseFloat(form.price),
  features: {
    ...form.features,
    rooms: form.features.rooms ? parseInt(form.features.rooms) : 0,
    bathrooms: form.features.bathrooms ? parseInt(form.features.bathrooms) : 0,
    area: form.features.area ? parseFloat(form.features.area) : 0,
    floors: form.features.floors ? parseInt(form.features.floors) : undefined,
    floor: form.features.floor ? parseInt(form.features.floor) : undefined,
    bedrooms: form.features.bedrooms ? parseInt(form.features.bedrooms) : undefined,
    buildingAge: form.features.buildingAge ? parseInt(form.features.buildingAge) : undefined,
  },
};

<div className="mb-8">
  <h2 className="mb-4 text-xl font-semibold dark:text-white">Emlak Özellikleri</h2>
  
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