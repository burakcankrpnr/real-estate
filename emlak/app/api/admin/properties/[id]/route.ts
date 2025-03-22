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
    // Admin kimlik doğrulama
    const authResult = await authenticateAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Hata durumunda response döndür
    }
    
    await dbConnect();
    
    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Geçersiz ilan ID'si" },
        { status: 400 }
      );
    }
    
    const property = await Property.findById(id)
      .populate("createdBy", "name email");
      
    if (!property) {
      return NextResponse.json(
        { error: "İlan bulunamadı" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(property);
  } catch (error: any) {
    console.error("İlan detayı getirme hatası:", error);
    return NextResponse.json(
      { error: "İlan detayını getirirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// İlanı güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Admin kimlik doğrulama
    const authResult = await authenticateAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Hata durumunda response döndür
    }
    
    await dbConnect();
    
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
    
    // Güncelleme
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { ...updateData, isApproved, isFeatured },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      message: "İlan başarıyla güncellendi",
      property: updatedProperty,
    });
  } catch (error: any) {
    console.error("İlan güncelleme hatası:", error);
    return NextResponse.json(
      { error: "İlanı güncellerken bir hata oluştu" },
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
    // Admin kimlik doğrulama
    const authResult = await authenticateAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Hata durumunda response döndür
    }
    
    await dbConnect();
    
    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Geçersiz ilan ID'si" },
        { status: 400 }
      );
    }
    
    // İlanı bul
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json(
        { error: "İlan bulunamadı" },
        { status: 404 }
      );
    }
    
    // İlanı sil
    await Property.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: "İlan başarıyla silindi",
    });
  } catch (error: any) {
    console.error("İlan silme hatası:", error);
    return NextResponse.json(
      { error: "İlanı silerken bir hata oluştu" },
      { status: 500 }
    );
  }
} 