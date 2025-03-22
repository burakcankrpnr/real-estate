import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/models/User";
import { dbConnect } from "@/app/lib/dbConnect";

// Kullanıcı ve rol kontrolü için middleware
export async function checkAuth(request: NextRequest) {
  const userId = request.headers.get("user-id");
  if (!userId) {
    return NextResponse.json(
      { error: "Yetkilendirme başarısız. Oturum açmanız gerekiyor." },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 401 }
      );
    }

    return { user };
  } catch (error) {
    console.error("Yetkilendirme hatası:", error);
    return NextResponse.json(
      { error: "Yetkilendirme sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Admin veya moderatör rolü kontrolü
export async function checkAdminRole(request: NextRequest) {
  const result = await checkAuth(request);
  
  if (result instanceof NextResponse) {
    return result; // Hata durumunda response döndür
  }
  
  const { user } = result;
  
  if (user.role !== "admin" && user.role !== "moderator") {
    return NextResponse.json(
      { error: "Bu işlem için yetkiniz bulunmamaktadır." },
      { status: 403 }
    );
  }
  
  return { user };
}

// Sadece admin rolü kontrolü
export async function checkOnlyAdminRole(request: NextRequest) {
  const result = await checkAuth(request);
  
  if (result instanceof NextResponse) {
    return result; // Hata durumunda response döndür
  }
  
  const { user } = result;
  
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Bu işlem için yetkiniz bulunmamaktadır." },
      { status: 403 }
    );
  }
  
  return { user };
} 