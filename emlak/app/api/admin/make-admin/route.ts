import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import { checkOnlyAdminRole } from "../../middleware/authMiddleware";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Admin kimlik doğrulama işlemini gerçekleştiren yardımcı fonksiyon - sadece admin rolüne sahip olanlar erişebilir
async function authenticateOnlyAdmin(request: NextRequest) {
  const userId = request.headers.get("user-id");
  let adminUser = null;
  
  if (userId) {
    // Client taraflı auth - middleware authMiddleware üzerinden kontrol edildi
    const authResult = await checkOnlyAdminRole(request);
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
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmamaktadır. Sadece admin rolüne sahip kullanıcılar erişebilir." },
        { status: 403 }
      );
    }
  }
  
  return { success: true, adminUser };
}

export async function POST(request: NextRequest) {
  try {
    // Sadece admin rolüne sahip kullanıcılar bu işlemi yapabilir
    const authResult = await authenticateOnlyAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Hata durumunda response döndür
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email gerekli!" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }

    // Kullanıcıya admin rolü ata
    user.role = "admin";
    await user.save();

    return NextResponse.json(
      {
        message: "Kullanıcı başarıyla admin yapıldı!",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Admin yapma hatası:", err);
    return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
  }
} 