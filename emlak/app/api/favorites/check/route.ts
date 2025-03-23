import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Favorite from '@/app/models/Favorite';

// Favorilerde olup olmadığını kontrol etmek için GET isteği
export async function GET(request: NextRequest) {
  try {
    // Veritabanına bağlan
    await dbConnect();
    console.log('Veritabanı bağlantısı kuruldu - favori kontrolü');
    
    // URL'den ilan ID'sini al
    const url = new URL(request.url);
    const propertyId = url.searchParams.get('propertyId');
    
    // Kullanıcı ID'sini header'dan al
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      console.log('Kullanıcı ID bulunamadı');
      return NextResponse.json(
        { error: 'Kullanıcı ID bulunamadı' },
        { status: 401 }
      );
    }
    
    if (!propertyId) {
      console.log('İlan ID bulunamadı');
      return NextResponse.json(
        { error: 'İlan ID bulunamadı' },
        { status: 400 }
      );
    }
    
    console.log(`Favori kontrolü: Kullanıcı ${userId}, İlan ${propertyId}`);
    
    // Favori var mı kontrol et
    const favorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
    });
    
    const isFavorite = !!favorite;
    console.log(`Favori durumu: ${isFavorite ? 'Favoride' : 'Favoride değil'}`);
    
    return NextResponse.json(
      { isFavorite },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Favori kontrolü hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Favori kontrolü sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 