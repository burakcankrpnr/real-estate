import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Property } from "@/app/models/Property";

// Tüm onaylanmış ilanları getir
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    const rooms = searchParams.get("rooms");
    const featured = searchParams.get("featured");
    
    const skip = (page - 1) * limit;
    
    // Filtreleme koşulları oluşturma
    const filter: any = { isApproved: true };
    
    if (city) filter["location.city"] = city;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (minPrice) filter.price = { ...filter.price, $gte: parseInt(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseInt(maxPrice) };
    if (minArea) filter["features.area"] = { ...filter["features.area"], $gte: parseInt(minArea) };
    if (maxArea) filter["features.area"] = { ...filter["features.area"], $lte: parseInt(maxArea) };
    if (rooms) filter["features.rooms"] = parseInt(rooms);
    if (featured === "true") filter.isFeatured = true;
    
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email");
    
    const total = await Property.countDocuments(filter);
    
    return NextResponse.json({
      properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("İlanları getirme hatası:", error);
    return NextResponse.json(
      { error: "İlanları getirirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 