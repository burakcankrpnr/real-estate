// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Giriş Yap | Emlak Platformu",
    description: "Giriş yapın ve daha hızlı bilgi alın.",
    // other metadata
  };

export async function POST(request: NextRequest) {
  try {
    // Body'den gelen veriyi parse edelim.
    const { name, email, password } = await request.json();

    // Zorunlu alanların dolu olup olmadığını kontrol edelim.
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Eksik bilgiler mevcut!" }, { status: 400 });
    }

    // Veritabanına bağlan
    await dbConnect();

    // Aynı email ile kayıtlı kullanıcı var mı kontrolü
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: "Bu email ile zaten bir kullanıcı mevcut!" },
        { status: 400 }
      );
    }

    // Şifreyi bcrypt ile hash'leyelim
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı kaydı oluşturalım
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return NextResponse.json(
      {
        message: "Kullanıcı kaydı başarılı!",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Kayıt hatası:", err);
    return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
