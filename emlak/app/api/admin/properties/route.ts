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
    // İki yöntem var:
    // 1. Header üzerinden kullanıcı ID'si kontrol (client taraflı auth)
    // 2. NextAuth üzerinden oturum kontrolü (server taraflı auth)
    
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
    
    // İlan verileri getirme işlemleri (her iki yöntem için de aynı)
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const approved = searchParams.get("approved");
    const featured = searchParams.get("featured");
    
    const skip = (page - 1) * limit;
    
    // Filtreleme koşulları oluşturma
    const filter: any = {};
    
    if (approved !== null && approved !== undefined) {
      filter.isApproved = approved === "true";
    }
    
    if (featured !== null && featured !== undefined) {
      filter.isFeatured = featured === "true";
    }
    
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email");
    
    const total = await Property.countDocuments(filter);
    
    return NextResponse.json({
      properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Admin ilanları getirme hatası:", error);
    return NextResponse.json(
      { error: "İlanları getirirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Yeni ilan oluştur
export async function POST(request: NextRequest) {
  try {
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
    
    await dbConnect();
    
    const data = await request.json();
    const { 
      title, 
      description, 
      price, 
      location, 
      features, 
      type, 
      status, 
      images, 
      isApproved,
      isFeatured 
    } = data;
    
    // Zorunlu alanların kontrolü
    if (!title || !description || !price || !location || !type || !status) {
      return NextResponse.json(
        { error: "Tüm zorunlu alanları doldurunuz" },
        { status: 400 }
      );
    }
    
    // Yeni ilan oluştur (createdBy, admin kullanıcının ID'si olacak)
    const newProperty = new Property({
      title,
      description,
      price,
      location,
      features,
      type,
      status,
      images: images || [],
      createdBy: adminUser._id,
      isApproved: isApproved || false,
      isFeatured: isFeatured || false,
    });
    
    await newProperty.save();
    
    return NextResponse.json(
      { message: "İlan başarıyla oluşturuldu", property: newProperty },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("İlan oluşturma hatası:", error);
    return NextResponse.json(
      { error: "İlan oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 