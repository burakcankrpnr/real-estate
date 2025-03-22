import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Property } from "@/app/models/Property";
import mongoose from "mongoose";

// Belirli bir ilanı getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Geçersiz ilan ID'si" },
        { status: 400 }
      );
    }
    
    const property = await Property.findById(id)
      .populate("createdBy", "name email");
      
    if (!property) {
      return NextResponse.json(
        { error: "İlan bulunamadı" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(property);
  } catch (error: any) {
    console.error("İlan detayı getirme hatası:", error);
    return NextResponse.json(
      { error: "İlan detayını getirirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 