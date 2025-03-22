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
      "banyo sayısı": form.features.bathrooms
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
  } 