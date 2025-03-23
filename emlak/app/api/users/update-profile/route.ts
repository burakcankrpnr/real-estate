import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı kimliği gerekli!" },
        { status: 401 }
      );
    }
    
    // Güncellenecek verileri al
    const updateData = await request.json();
    
    // Veritabanına bağlan
    await dbConnect();
    
    // Kullanıcıyı ID ile bul
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }
    
    // Güncellenecek alanları hazırla
    const allowedFields = [
      'name', 'phone', 'address', 'city', 'socialMedia', 
      'notifications', 'securitySettings', 'profileImage',
      'lastNameChange'
    ];
    
    const updateObject = {};
    
    // İzin verilen alanları kontrol et ve güncelleme nesnesine ekle
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateObject[field] = updateData[field];
      }
    }
    
    // Kullanıcıyı güncelle
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateObject },
      { new: true } // Güncellenmiş kullanıcıyı döndür
    );
    
    // Hassas verileri çıkar
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    
    return NextResponse.json({
      message: "Profil başarıyla güncellendi!",
      user: userResponse
    });
    
  } catch (err: any) {
    console.error("Profil güncelleme hatası:", err);
    return NextResponse.json(
      { error: "Profil güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 