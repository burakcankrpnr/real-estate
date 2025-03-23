import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Favorite from '@/app/models/Favorite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Favorilere eklemek için POST isteği
export async function POST(request: NextRequest) {
  try {
    // Veritabanına bağlan
    await dbConnect();
    console.log('Veritabanı bağlantısı kuruldu - favorilere ekleme');
    
    // Kullanıcı ID'sini header'dan al
    const userId = request.headers.get('user-id');
    if (!userId) {
      console.log('Kullanıcı ID bulunamadı');
      return NextResponse.json(
        { error: 'Kullanıcı ID bulunamadı' },
        { status: 401 }
      );
    }
    
    console.log('Kullanıcı ID:', userId);
    
    // İstek gövdesini al
    const body = await request.json();
    const { propertyId } = body;
    
    if (!propertyId) {
      console.log('İlan ID bulunamadı');
      return NextResponse.json(
        { error: 'İlan ID bulunamadı' },
        { status: 400 }
      );
    }
    
    console.log('İlan ID:', propertyId);
    
    // Favori zaten var mı kontrol et
    const existingFavorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
    });
    
    if (existingFavorite) {
      console.log('Bu ilan zaten favorilerde bulunuyor');
      return NextResponse.json(
        { message: 'Bu ilan zaten favorilerinizde' },
        { status: 200 }
      );
    }
    
    // Yeni favori oluştur
    const favorite = new Favorite({
      user: userId,
      property: propertyId,
    });
    
    console.log('Yeni favori oluşturuldu:', favorite);
    
    await favorite.save();
    console.log('Favori kaydedildi');
    
    return NextResponse.json(
      { message: 'İlan favorilere eklendi', favorite },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Favorilere ekleme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Favorilere ekleme sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Favorilerden çıkarmak için DELETE isteği
export async function DELETE(request: NextRequest) {
  try {
    // Veritabanına bağlan
    await dbConnect();
    console.log('Veritabanı bağlantısı kuruldu - favorilerden çıkarma');
    
    // Kullanıcı ID'sini header'dan al
    const userId = request.headers.get('user-id');
    if (!userId) {
      console.log('Kullanıcı ID bulunamadı');
      return NextResponse.json(
        { error: 'Kullanıcı ID bulunamadı' },
        { status: 401 }
      );
    }
    
    console.log('Kullanıcı ID:', userId);
    
    // İstek gövdesini al
    const body = await request.json();
    const { propertyId } = body;
    
    if (!propertyId) {
      console.log('İlan ID bulunamadı');
      return NextResponse.json(
        { error: 'İlan ID bulunamadı' },
        { status: 400 }
      );
    }
    
    console.log('İlan ID:', propertyId);
    
    // Favoriyi bul ve sil
    const deletedFavorite = await Favorite.findOneAndDelete({
      user: userId,
      property: propertyId,
    });
    
    if (!deletedFavorite) {
      console.log('Favori bulunamadı');
      return NextResponse.json(
        { error: 'Favori bulunamadı' },
        { status: 404 }
      );
    }
    
    console.log('Favori silindi:', deletedFavorite);
    
    return NextResponse.json(
      { message: 'İlan favorilerden çıkarıldı' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Favorilerden çıkarma hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Favorilerden çıkarma sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 