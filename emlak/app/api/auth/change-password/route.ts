import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    const userId = request.headers.get("user-id");

    if (!currentPassword || !newPassword || !userId) {
      return NextResponse.json(
        { error: "Tüm alanları doldurunuz!" },
        { status: 400 }
      );
    }

    // Şifre uzunluk kontrolü
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Yeni şifre en az 6 karakter olmalıdır!" },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Kullanıcıyı ID ile bul
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }

    // Mevcut şifreyi kontrol et
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Mevcut şifre yanlış!" },
        { status: 401 }
      );
    }

    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Şifreyi güncelle
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Şifre başarıyla değiştirildi!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Şifre değiştirme hatası:", err);
    return NextResponse.json(
      { error: "Şifre değiştirilirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 