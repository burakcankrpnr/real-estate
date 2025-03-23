import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Property } from "@/app/models/Property";
import { User } from "@/app/models/User";
import mongoose from "mongoose";
import { checkAdminRole } from "../../../middleware/authMiddleware";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Admin kimlik doğrulama işlemini gerçekleştiren yardımcı fonksiyon
async function authenticateAdmin(request: NextRequest) {
  const userId = request.headers.get("user-id");
  let adminUser = null;
  
  if (userId) {
    // Client taraflı auth - middleware authMiddleware üzerinden kontrol edildi
    const authResult = await checkAdminRole(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Yetki hatası durumunda döndür
    }
    
    adminUser = authResult.user;
  } else {
    // Server taraflı auth - NextAuth üzerinden kontrol
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }
    
    await dbConnect();
    adminUser = await User.findOne({ email: session.user.email });
    
    if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "moderator")) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmamaktadır." },
        { status: 403 }
      );
    }
  }
  
  return { success: true, adminUser };
}

// Belirli bir ilanı getir (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Admin kimlik doğrulama
    const userId = request.headers.get("user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Yetkilendirme hatası" }, { status: 401 });
    }
    
    const adminUser = await User.findById(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    
    if (adminUser.role !== "admin" && adminUser.role !== "moderator") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Geçersiz ilan ID'si" },
        { status: 400 }
      );
    }

    // İlanı bul
    const property = await Property.findById(params.id)
      .populate("createdBy", "name email role");

    if (!property) {
      return NextResponse.json({ error: "İlan bulunamadı" }, { status: 404 });
    }

    // Moderatör kısıtlaması: Sadece kendi ilanlarını görebilir
    if (adminUser.role === "moderator" && 
        property.createdBy && 
        property.createdBy._id.toString() !== adminUser._id.toString()) {
      return NextResponse.json(
        { error: "Bu ilana erişim izniniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error("İlan detayı getirme hatası:", error);
    return NextResponse.json(
      { error: "İlan detayları alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// İlanı güncelle - PUT metodu
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Admin kimlik doğrulama
    const userId = request.headers.get("user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Yetkilendirme hatası" }, { status: 401 });
    }
    
    const adminUser = await User.findById(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    
    if (adminUser.role !== "admin" && adminUser.role !== "moderator") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Geçersiz ilan ID'si" },
        { status: 400 }
      );
    }

    // İlanı bul
    const property = await Property.findById(params.id);

    if (!property) {
      return NextResponse.json({ error: "İlan bulunamadı" }, { status: 404 });
    }

    // Moderatör kısıtlaması: Sadece kendi ilanlarını düzenleyebilir
    if (adminUser.role === "moderator" && 
        property.createdBy.toString() !== adminUser._id.toString()) {
      return NextResponse.json(
        { error: "Bu ilanı düzenleme izniniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    const requestBody = await request.json();
    
    // Güncelleme verilerini hazırla
    const updateData = { ...requestBody };
    
    // Moderatör onay durumunu değiştiremez
    if (adminUser.role === "moderator") {
      delete updateData.isApproved;
    }

    // Zorunlu alanları kontrol et
    const {
      title,
      description,
      price,
      city,
      location,
      type,
      status,
      area,
      features,
    } = updateData;
    
    // Şema doğrulaması için ek kontroller
    const missingFields: string[] = [];
    
    if (!title) missingFields.push("Başlık");
    if (!description) missingFields.push("Açıklama");
    if (!price) missingFields.push("Fiyat");
    
    // Location kontrolü - şehir ya doğrudan ya da location içinde olmalı
    const cityValue = city || (location?.city);
    if (!cityValue) missingFields.push("Şehir");
    if (!location?.district) missingFields.push("İlçe");
    if (!location?.address) missingFields.push("Adres");
    
    // Features kontrolü - alan bilgisi ya doğrudan ya da features içinde olmalı 
    const areaValue = area || (features?.area);
    if (!areaValue) missingFields.push("Alan (m²)");
    
    // Diğer zorunlu alanlar
    if (!type) missingFields.push("Emlak Türü");
    if (!status) missingFields.push("İlan Durumu");
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: "Lütfen aşağıdaki zorunlu alanları doldurunuz:", 
          missingFields 
        },
        { status: 400 }
      );
    }

    // İlanı güncelle - yeni alanları ekle
    const updatedProperty = await Property.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email role");

    return NextResponse.json({ 
      message: "İlan başarıyla güncellendi", 
      property: updatedProperty 
    });
  } catch (error) {
    console.error("İlan güncelleme hatası:", error);
    return NextResponse.json(
      { error: "İlan güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// İlanı güncelle - PATCH metodu (kısmi güncelleme)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Admin kimlik doğrulama
    const userId = request.headers.get("user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Yetkilendirme hatası" }, { status: 401 });
    }
    
    const adminUser = await User.findById(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    
    if (adminUser.role !== "admin" && adminUser.role !== "moderator") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }
    
    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Geçersiz ilan ID'si" },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const { isApproved, isFeatured, ...updateData } = data;
    
    // İlanı bul
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json(
        { error: "İlan bulunamadı" },
        { status: 404 }
      );
    }
    
    // Moderatör kısıtlaması: Sadece kendi ilanlarını düzenleyebilir ve onaylayamaz
    if (adminUser.role === "moderator") {
      if (property.createdBy.toString() !== adminUser._id.toString()) {
        return NextResponse.json(
          { error: "Bu ilanı düzenleme izniniz bulunmamaktadır" },
          { status: 403 }
        );
      }
      
      // Moderatörler onaylama işlemi yapamaz
      if (data.hasOwnProperty('isApproved')) {
        return NextResponse.json(
          { error: "Moderatörler ilan onaylama/red işlemi yapamaz. Sadece adminler ilanları onaylayabilir." },
          { status: 403 }
        );
      }
    }
    
    // Güncelleme yapılacak verilerin geçerliliğini kontrol et
    const existingProperty = property.toObject();
    const mergedData = {
      ...existingProperty,
      ...updateData,
      location: { ...existingProperty.location, ...(updateData.location || {}) },
      features: { ...existingProperty.features, ...(updateData.features || {}) }
    };
    
    // isApproved ve isFeatured değerlerini güncelle (eğer gönderilmişlerse)
    if (data.hasOwnProperty('isApproved')) {
      mergedData.isApproved = isApproved;
    }
    
    if (data.hasOwnProperty('isFeatured')) {
      mergedData.isFeatured = isFeatured;
    }
    
    // Şema doğrulaması için ek kontroller
    const missingFields: string[] = [];
    
    if (!mergedData.title) missingFields.push("Başlık");
    if (!mergedData.description) missingFields.push("Açıklama");
    if (!mergedData.price) missingFields.push("Fiyat");
    
    // Location kontrolü
    // Şehir ya doğrudan ya da location içinde olmalı
    const cityValue = mergedData.city || (mergedData.location?.city);
    if (!cityValue) missingFields.push("Şehir");
    if (!mergedData.location?.district) missingFields.push("İlçe");
    if (!mergedData.location?.address) missingFields.push("Adres");
    
    // Features kontrolü
    // Alan bilgisi ya doğrudan ya da features içinde olmalı
    const areaValue = mergedData.area || mergedData.features?.area;
    if (!areaValue) missingFields.push("Alan (m²)");
    
    // Diğer zorunlu alanlar
    if (!mergedData.type) missingFields.push("Emlak Türü");
    if (!mergedData.status) missingFields.push("İlan Durumu");
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: "Lütfen aşağıdaki zorunlu alanları doldurunuz:", 
          missingFields 
        },
        { status: 400 }
      );
    }

    // İlanı güncelle - yeni alanları ekle
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: mergedData },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email role");

    return NextResponse.json({ 
      message: "İlan başarıyla güncellendi", 
      property: updatedProperty 
    });
  } catch (error) {
    console.error("İlan güncelleme hatası:", error);
    return NextResponse.json(
      { error: "İlan güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// İlanı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Admin kimlik doğrulama
    const userId = request.headers.get("user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Yetkilendirme hatası" }, { status: 401 });
    }
    
    const adminUser = await User.findById(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    
    if (adminUser.role !== "admin" && adminUser.role !== "moderator") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Geçersiz ilan ID'si" },
        { status: 400 }
      );
    }

    // İlanı bul
    const property = await Property.findById(params.id);

    if (!property) {
      return NextResponse.json({ error: "İlan bulunamadı" }, { status: 404 });
    }

    // Moderatör kısıtlaması: Sadece kendi ilanlarını silebilir
    if (adminUser.role === "moderator" && 
        property.createdBy.toString() !== adminUser._id.toString()) {
      return NextResponse.json(
        { error: "Bu ilanı silme izniniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    // İlanı sil
    await Property.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "İlan başarıyla silindi" });
  } catch (error) {
    console.error("İlan silme hatası:", error);
    return NextResponse.json(
      { error: "İlan silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 