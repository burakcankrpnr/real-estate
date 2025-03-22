import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Oturum açmalısınız!" }, { status: 401 });
    }

    // Kullanıcı bilgilerini al
    await dbConnect();
    const user = await User.findOne({ email: session.user?.email });

    // Yetki kontrolü
    if (!user || (user.role !== "admin" && user.role !== "moderator")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz bulunmamaktadır!" }, { status: 403 });
    }

    // Tüm kullanıcıları getir
    const users = await User.find({}, {
      name: 1,
      email: 1,
      role: 1,
      createdAt: 1,
    }).sort({ createdAt: -1 }); // En son kayıt olana göre sırala

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("Kullanıcıları getirme hatası:", err);
    return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
  }
} 