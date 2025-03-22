import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Property } from "@/app/models/Property";
import { User } from "@/app/models/User";
import { checkAdminRole } from "../../middleware/authMiddleware";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Admin için tüm ilanları getir (onaylı veya onaysız)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // URL'den query parametrelerini al
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get("approved");
    const featured = searchParams.get("featured");
    const pending = searchParams.get("pending");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

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

    // Filtreleme
    const filter: any = {};

    // Moderatörler sadece kendi ilanlarını görebilir
    if (adminUser.role === "moderator") {
      filter.createdBy = adminUser._id;
    }

    // Onay durumuna göre filtreleme
    if (approved === "true") {
      filter.isApproved = true;
    } else if (approved === "false") {
      filter.isApproved = false;
    }

    // Öne çıkan durumuna göre filtreleme
    if (featured === "true") {
      filter.isFeatured = true;
    } else if (featured === "false") {
      filter.isFeatured = false;
    }

    // Onay bekleyen ilanları filtreleme
    if (pending === "true") {
      filter.isApproved = false;
      
      // Moderatörler sadece kendi onay bekleyen ilanlarını görebilir
      if (adminUser.role === "moderator") {
        filter.createdBy = adminUser._id;
      }
    }

    // Toplam sayfa sayısını hesapla
    const totalCount = await Property.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // İlanları getir
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email role")
      .lean();

    return NextResponse.json({
      properties,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    console.error("İlanları getirme hatası:", error);
    return NextResponse.json(
      { error: "İlanlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni ilan oluştur
export async function POST(request: NextRequest) {
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

    const requestBody = await request.json();
    
    const {
      title,
      description,
      price,
      address,
      city,
      location,
      type,
      status,
      roomCount,
      bathroomCount,
      area,
      floorCount,
      floorNumber,
      bedroomCount,
      buildingAge,
      heatingType,
      features,
      images,
      isApproved,
      isFeatured,
    } = requestBody;

    // Gerekli alanları kontrol et
    if (!title || !description || !price || !city || !type || !status) {
      return NextResponse.json(
        { error: "Tüm zorunlu alanları doldurunuz" },
        { status: 400 }
      );
    }

    // Şema doğrulaması için ek kontroller
    const missingFields: string[] = [];
    
    if (!title) missingFields.push("Başlık");
    if (!description) missingFields.push("Açıklama");
    if (!price) missingFields.push("Fiyat");
    
    // Location kontrolü
    if (!city) missingFields.push("Şehir");
    if (!location?.district) missingFields.push("İlçe");
    if (!location?.address) missingFields.push("Adres");
    
    // Features kontrolü  
    if (!area && (!features || !features.area)) missingFields.push("Alan (m²)");
    
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

    // Yeni property oluştur
    const newProperty = new Property({
      title,
      description,
      price,
      location: {
        city,
        district: location?.district || "",
        address: location?.address || address || "",
      },
      type,
      status,
      features: {
        rooms: roomCount || features?.rooms || 0,
        bathrooms: bathroomCount || features?.bathrooms || 0,
        area: area || features?.area || 0,
        hasGarage: features?.hasGarage || false,
        hasGarden: features?.hasGarden || false,
        hasPool: features?.hasPool || false,
        isFurnished: features?.isFurnished || false,
      },
      images: images || [],
      // Moderatörler ilan eklerken her zaman onaysız olarak eklenecek
      isApproved: adminUser.role === "admin" ? (isApproved || false) : false,
      isFeatured: isFeatured || false,
      createdBy: adminUser._id,
    });

    await newProperty.save();

    return NextResponse.json(
      { 
        message: "İlan başarıyla oluşturuldu", 
        property: newProperty,
        approvalNote: adminUser.role === "moderator" 
          ? "Moderatör olarak eklediğiniz ilan onay için admin'e gönderildi."
          : undefined
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("İlan oluşturma hatası:", error);
    return NextResponse.json(
      { error: "İlan oluşturulurken bir hata meydana geldi" },
      { status: 500 }
    );
  }
} 