import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Favorite from '@/app/models/Favorite';
import mongoose from 'mongoose';

// Kullanıcının tüm favori ilanlarını getir
export async function GET(request: NextRequest) {
  try {
    // Veritabanına bağlan
    await dbConnect();
    console.log('Veritabanı bağlantısı kuruldu - favorileri getirme');
    
    // Kullanıcı ID'sini header'dan al
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı kimliği bulunamadı' },
        { status: 401 }
      );
    }
    
    console.log('Kullanıcı ID:', userId);
    
    // Kullanıcının tüm favorilerini bul
    const favorites = await Favorite.find({ user: userId }).lean();
    
    if (!favorites || favorites.length === 0) {
      console.log('Kullanıcının favorileri bulunamadı');
      return NextResponse.json(
        { favorites: [] },
        { status: 200 }
      );
    }
    
    // Favori ilanları için property ID'leri
    const propertyIds = favorites.map(fav => fav.property);
    
    console.log('Aranan propertyIds:', propertyIds);
    
    try {
      // Property şeması - sadece temel alanları içerecek şekilde
      const PropertySchema = new mongoose.Schema({
        title: String,
        description: String,
        price: Number,
        location: {
          city: String,
          district: String,
          address: String
        },
        features: {
          rooms: Number,
          bathrooms: Number,
          bedrooms: Number,
          area: Number,
          hasGarage: Boolean,
          hasGarden: Boolean,
          hasPool: Boolean,
          isFurnished: Boolean
        },
        type: String,
        status: String,
        category: String,
        images: [String],
        isApproved: Boolean,
        isFeatured: Boolean,
        createdAt: Date
      }, { collection: 'properties' });
      
      // PropertyModel - eğer zaten varsa onu kullan, yoksa yeni oluştur
      const PropertyModel = mongoose.models.Property || mongoose.model('Property', PropertySchema);
      
      // İlan detaylarını getir
      const properties = await PropertyModel.find({
        _id: { $in: propertyIds }
      }).lean();
      
      console.log('Bulunan ilanlar:', properties.length);
      
      return NextResponse.json(
        { favorites: properties },
        { status: 200 }
      );
    } catch (modelError: any) {
      console.error('Property modeli erişim hatası:', modelError);
      return NextResponse.json(
        { error: modelError.message || 'İlan bilgileri alınırken hata oluştu' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Favori ilanlar getirme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Favori ilanlar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 