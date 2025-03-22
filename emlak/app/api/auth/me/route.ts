import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    // NextAuth oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }
    
    // Veritabanı bağlantısını sağla
    await dbConnect();
    
    // E-posta ile kullanıcıyı bul
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }
    
    // Kullanıcı bilgilerini döndür (şifre hariç)
    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("Kullanıcı bilgileri getirme hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı bilgileri getirilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // NextAuth oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }

    // Veritabanı bağlantısını sağla
    await dbConnect();

    // E-posta ile kullanıcıyı bul
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    // Güncellenecek verileri al
    const updateData = await request.json();
    const { name, profileImage, currentPassword, newPassword } = updateData;

    // Güncellenecek alanları hazırla
    const update: { name?: string; profileImage?: string; password?: string } = {};
    
    if (name) update.name = name;
    if (profileImage) update.profileImage = profileImage;

    // Şifre güncellemesi
    if (currentPassword && newPassword) {
      // Mevcut şifreyi kontrol et
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Mevcut şifre yanlış." },
          { status: 400 }
        );
      }

      // Yeni şifreyi hashle ve kaydet
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(newPassword, salt);
    }

    // Kullanıcıyı güncelle
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: update },
      { new: true }
    );

    return NextResponse.json({
      message: "Kullanıcı bilgileri güncellendi",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        createdAt: updatedUser.createdAt,
      }
    });
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı bilgileri güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 