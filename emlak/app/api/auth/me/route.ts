import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    // NextAuth oturumunu veya header'dan gelen kullanıcı ID'sini kontrol et
    let userId = null;
    let userData = null;
    
    // Header'dan user-id kontrolü
    const headerUserId = request.headers.get("user-id");
    if (headerUserId) {
      userId = headerUserId;
      
      // Veritabanı bağlantısını sağla
      await dbConnect();
      
      // ID ile kullanıcıyı bul
      userData = await User.findById(userId);
    } else {
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
      userData = await User.findOne({ email: session.user.email });
    }
    
    if (!userData) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }
    
    // Kullanıcı bilgilerini döndür (şifre hariç)
    return NextResponse.json({
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        profileImage: userData.profileImage,
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        bio: userData.bio || "",
        specialization: userData.specialization || [],
        experience: userData.experience || 0,
        languages: userData.languages || [],
        rating: userData.rating || 0,
        propertySold: userData.propertySold || 0,
        website: userData.website || "",
        licenseNumber: userData.licenseNumber || "",
        socialMedia: userData.socialMedia || {
          facebook: "",
          instagram: "",
          twitter: "",
          linkedin: "",
          youtube: "",
          tiktok: ""
        },
        notifications: userData.notifications || {
          newListings: false,
          priceDrops: false,
          messages: true,
          marketing: false
        },
        securitySettings: userData.securitySettings || {
          twoFactorEnabled: false
        },
        createdAt: userData.createdAt,
        lastNameChange: userData.lastNameChange,
        accountStatus: userData.accountStatus || "active",
        favoriteListings: userData.favoriteListings || []
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
    const { 
      name, 
      profileImage, 
      currentPassword, 
      newPassword,
      phone,
      address,
      city,
      bio,
      specialization,
      experience,
      languages,
      website,
      licenseNumber,
      socialMedia,
      notifications,
      securitySettings,
      lastNameChange
    } = updateData;

    // Güncellenecek alanları hazırla
    const update: any = {};
    
    if (name) update.name = name;
    if (profileImage) update.profileImage = profileImage;
    if (phone !== undefined) update.phone = phone;
    if (address !== undefined) update.address = address;
    if (city !== undefined) update.city = city;
    if (bio !== undefined) update.bio = bio;
    if (specialization !== undefined) update.specialization = specialization;
    if (experience !== undefined) update.experience = experience;
    if (languages !== undefined) update.languages = languages;
    if (website !== undefined) update.website = website;
    if (licenseNumber !== undefined) update.licenseNumber = licenseNumber;
    if (socialMedia) update.socialMedia = socialMedia;
    if (notifications) update.notifications = notifications;
    if (securitySettings) update.securitySettings = securitySettings;
    if (lastNameChange) update.lastNameChange = lastNameChange;

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
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        city: updatedUser.city || "",
        bio: updatedUser.bio || "",
        specialization: updatedUser.specialization || [],
        experience: updatedUser.experience || 0,
        languages: updatedUser.languages || [],
        rating: updatedUser.rating || 0,
        propertySold: updatedUser.propertySold || 0,
        website: updatedUser.website || "",
        licenseNumber: updatedUser.licenseNumber || "",
        socialMedia: updatedUser.socialMedia || {
          facebook: "",
          instagram: "",
          twitter: "",
          linkedin: "",
          youtube: "",
          tiktok: ""
        },
        notifications: updatedUser.notifications || {
          newListings: false,
          priceDrops: false,
          messages: true,
          marketing: false
        },
        securitySettings: updatedUser.securitySettings || {
          twoFactorEnabled: false
        },
        createdAt: updatedUser.createdAt,
        lastNameChange: updatedUser.lastNameChange,
        accountStatus: updatedUser.accountStatus || "active",
        favoriteListings: updatedUser.favoriteListings || []
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