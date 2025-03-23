import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Property } from "@/app/models/Property";
import { User } from "@/app/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Client-side auth kontrolü (header'dan user ID alınır)
    const userId = request.headers.get("user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }
    
    let adminUser;
    
    // Kullanıcıyı DB'den bul
    try {
      adminUser = await User.findById(userId);
      
      if (!adminUser) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı" },
          { status: 404 }
        );
      }

      // Sadece adminler onaylama yapabilir
      if (adminUser.role !== "admin") {
        return NextResponse.json(
          { error: "Bu işlemi yapmak için admin yetkiniz bulunmamaktadır" },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Kullanıcı sorgusu hatası:", error);
      return NextResponse.json(
        { error: "Kullanıcı doğrulama hatası" },
        { status: 500 }
      );
    }
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Geçersiz ilan ID'si" },
        { status: 400 }
      );
    }

    const property = await Property.findById(id);
    
    if (!property) {
      return NextResponse.json(
        { error: "İlan bulunamadı" },
        { status: 404 }
      );
    }

    // İlanı onayla
    property.isApproved = true;
    await property.save();

    return NextResponse.json(
      { message: "İlan başarıyla onaylandı", property },
      { status: 200 }
    );
  } catch (error) {
    console.error("İlan onaylama hatası:", error);
    return NextResponse.json(
      { error: "İlan onaylanırken bir hata oluştu" },
      { status: 500 }
    );
  }
} 