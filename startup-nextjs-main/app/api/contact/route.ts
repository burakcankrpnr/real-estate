// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Nodemailer transporter'ını oluştururken artık EMAIL_USER yerine MAIN_EMAIL kullanıyoruz.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // örn: smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // örn: 587
  secure: process.env.EMAIL_SECURE === "true", // 465 için true, diğer portlar için false
  auth: {
    user: process.env.MAIN_EMAIL, // Sitemizin ana maili: burikcankorpinar7@gmail.com
    pass: process.env.EMAIL_PASS, // Uygulama şifreniz
  },
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun!" },
        { status: 400 }
      );
    }

    // Gönderim ayarlarında "from" kısmında ana mailimizi, "to" kısmında ise kullanıcının girdiği maili kullanıyoruz.
    await transporter.sendMail({
      from: process.env.MAIN_EMAIL, // Gönderen: burikcankorpinar7@gmail.com
      to: email, // Alıcı: kullanıcının formda girdiği mail
      subject: `Destek Talebiniz Oluşturuldu: ${name}`,
      text: message,
      html: `<p>${message}</p>`,
    });

    return NextResponse.json(
      { message: "Mesajınız başarıyla gönderildi!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email gönderme hatası:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
