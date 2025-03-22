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
    
    // Güncelleme verileri
    let updateObject = { ...updateData };
    
    // Admin ise veya moderatör kendi ilanını güncelliyorsa onay ve öne çıkarma durumlarını ayarla
    if (adminUser.role === "admin") {
      if (data.hasOwnProperty('isApproved')) updateObject.isApproved = isApproved;
      if (data.hasOwnProperty('isFeatured')) updateObject.isFeatured = isFeatured;
    } else if (adminUser.role === "moderator" && data.hasOwnProperty('isFeatured')) {
      updateObject.isFeatured = isFeatured;
    }
    
    // Güncelleme
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updateObject,
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