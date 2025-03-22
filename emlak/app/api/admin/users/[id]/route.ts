import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Admin kimlik doğrulama - İki yöntem kullanılıyor
    const userId = request.headers.get("user-id");
    let adminUser = null;

    if (userId) {
      // Client-side auth ile doğrulama
      adminUser = await User.findById(userId);
      
      if (!adminUser || adminUser.role !== "admin") {
        return NextResponse.json({ 
          error: "Bu işlem için yetkiniz bulunmamaktadır! Sadece admin rolüne sahip kullanıcılar kullanıcı silebilir." 
        }, { status: 403 });
      }
    } else {
      // Server-side NextAuth ile doğrulama
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Oturum açmalısınız!" }, { status: 401 });
      }

      // Kullanıcı bilgilerini al
      adminUser = await User.findOne({ email: session.user?.email });

      // Yetki kontrolü
      if (!adminUser || adminUser.role !== "admin") {
        return NextResponse.json({ 
          error: "Bu işlem için yetkiniz bulunmamaktadır! Sadece admin rolüne sahip kullanıcılar kullanıcı silebilir." 
        }, { status: 403 });
      }
    }

    // Admin kullanıcının kendisini silmeye çalışmasını engelle
    if (adminUser._id.toString() === params.id) {
      return NextResponse.json({ 
        error: "Kendinizi silemezsiniz!" 
      }, { status: 400 });
    }

    // Geçerli bir MongoDB ObjectId olup olmadığını kontrol et
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Geçersiz kullanıcı ID'si!" }, { status: 400 });
    }

    // Silinecek kullanıcıyı bul
    const userToDelete = await User.findById(params.id);
    
    // Kullanıcı bulunamadıysa hata döndür
    if (!userToDelete) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı!" }, { status: 404 });
    }

    // Kullanıcıyı sil
    await User.findByIdAndDelete(params.id);

    return NextResponse.json({ 
      message: "Kullanıcı başarıyla silindi!", 
      deletedUser: {
        id: userToDelete._id,
        email: userToDelete.email,
        name: userToDelete.name
      }
    });
  } catch (err: any) {
    console.error("Kullanıcı silme hatası:", err);
    return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
  }
} 