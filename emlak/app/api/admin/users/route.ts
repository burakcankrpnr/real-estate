import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // İki yöntem var: 
    // 1. Header üzerinden kullanıcı ID'si kontrolü (client taraflı auth)
    // 2. NextAuth üzerinden oturum kontrolü (server taraflı auth)

    const userId = request.headers.get("user-id");
    let adminUser = null;

    if (userId) {
      // Client taraflı auth - localStorage'dan gelen kullanıcı ID'si ile yetkilendirme
      adminUser = await User.findById(userId);
      
      if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "moderator")) {
        return NextResponse.json({ error: "Bu işlem için yetkiniz bulunmamaktadır!" }, { status: 403 });
      }
    } else {
      // Server taraflı auth - NextAuth üzerinden kontrol
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Oturum açmalısınız!" }, { status: 401 });
      }

      // Kullanıcı bilgilerini al
      adminUser = await User.findOne({ email: session.user?.email });

      // Yetki kontrolü
      if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "moderator")) {
        return NextResponse.json({ error: "Bu işlem için yetkiniz bulunmamaktadır!" }, { status: 403 });
      }
    }

    // Tüm kullanıcıları getir
    const users = await User.find({}, {
      name: 1,
      email: 1,
      role: 1,
      createdAt: 1,
      updatedAt: 1
    }).sort({ createdAt: -1 }); // En son kayıt olana göre sırala

    return NextResponse.json(users);
  } catch (err: any) {
    console.error("Kullanıcıları getirme hatası:", err);
    return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Yetki kontrolü
    const userId = request.headers.get("user-id");
    let adminUser = null;

    if (userId) {
      adminUser = await User.findById(userId);
      
      if (!adminUser || adminUser.role !== "admin") {
        return NextResponse.json({ error: "Bu işlem için admin yetkisi gereklidir!" }, { status: 403 });
      }
    } else {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Oturum açmalısınız!" }, { status: 401 });
      }

      adminUser = await User.findOne({ email: session.user?.email });

      if (!adminUser || adminUser.role !== "admin") {
        return NextResponse.json({ error: "Bu işlem için admin yetkisi gereklidir!" }, { status: 403 });
      }
    }

    // Yeni kullanıcı verilerini al
    const body = await request.json();
    const { name, email, password, role } = body;

    // Gerekli alanları kontrol et
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tüm alanları doldurunuz!" }, { status: 400 });
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi giriniz!" }, { status: 400 });
    }

    // E-posta adresi kullanımda mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda!" }, { status: 400 });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcıyı oluştur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    // Hassas bilgileri çıkar
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json({
      message: "Kullanıcı başarıyla oluşturuldu!",
      user: userWithoutPassword
    }, { status: 201 });

  } catch (err: any) {
    console.error("Kullanıcı oluşturma hatası:", err);
    return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
  }
} 