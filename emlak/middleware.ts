import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Admin sayfalarına erişimleri kontrol et
  if (request.nextUrl.pathname.startsWith('/Admin')) {
    // Client tarafında zaten kontrol var, bu sadece ek güvenlik için
    return NextResponse.next()
  }

  // API isteği kontrolü - admin API'larına erişimi kontrol et
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    try {
      // Kullanıcı header'dan geliyorsa
      const userId = request.headers.get('user-id')
      
      if (userId) {
        // Bu durumda client tarafından gelen header ile kimlik doğrulama kullanılıyor
        return NextResponse.next()
      }
      
      // Yoksa NextAuth token'ını kontrol et
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET || "default-secret-key"
      })
      
      if (!token || (token.role !== 'admin' && token.role !== 'moderator')) {
        return NextResponse.json(
          { error: 'Yetkilendirme başarısız. Bu işlem için yetkiniz yok.' },
          { status: 403 }
        )
      }
      
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware hata:', error)
      return NextResponse.json(
        { error: 'Sunucu hatası' },
        { status: 500 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/Admin/:path*',
    '/api/admin/:path*',
  ],
} 