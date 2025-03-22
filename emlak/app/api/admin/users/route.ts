import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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