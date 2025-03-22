import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    // Yetkilendirme kontrolü
    const userId = request.headers.get("user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }
    
    await dbConnect();
    const user = await User.findById(userId);
    
    if (!user || (user.role !== "admin" && user.role !== "moderator")) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmamaktadır." },
        { status: 403 }
      );
    }
    
    // Çoklu form veri tipini (FormData) al
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadı" },
        { status: 400 }
      );
    }
    
    // Dosya boyut kontrolü (örn. max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu çok büyük (max 5MB)" },
        { status: 400 }
      );
    }
    
    // Dosya tipi kontrolü
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece JPEG, PNG, WEBP ve GIF formatları desteklenir" },
        { status: 400 }
      );
    }
    
    // Dosya içeriğini al
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Benzersiz dosya adı oluştur
    const fileName = `${uuidv4()}_${file.name.replace(/\s+/g, "_")}`;
    
    // Dosya kayıt yolu
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Dizin yoksa oluştur
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Dizin zaten varsa veya başka bir hata olduysa
      console.log("Upload dizini zaten var veya oluşturma hatası:", err);
    }
    
    const filePath = path.join(uploadDir, fileName);
    
    // Dosyayı kaydet
    await writeFile(filePath, buffer);
    
    // Başarılı yanıt döndür
    return NextResponse.json({
      message: "Dosya başarıyla yüklendi",
      url: `/uploads/${fileName}`,
    });
    
  } catch (error: any) {
    console.error("Dosya yükleme hatası:", error);
    return NextResponse.json(
      { error: "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 