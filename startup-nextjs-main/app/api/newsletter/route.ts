// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

// MongoDB bağlantısı için URI
const uri = process.env.MONGODB_URI || "";
if (!uri) {
  throw new Error("MONGODB_URI environment variable not set");
}

// Global bağlantı önbellekleme
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

// Nodemailer transporter'ı (ana mail adresimiz kullanılarak ayarlanır)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Örn: smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // Örn: 587
  secure: process.env.EMAIL_SECURE === "true", // 465 için true, diğer portlar için false
  auth: {
    user: process.env.MAIN_EMAIL, // Sitemizin ana maili
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun!" },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını alıyoruz
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("newsletterSubscribers");

    // Aynı e-posta ile abone olup olmadığını kontrol ediyoruz
    const existingSubscriber = await collection.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Bu e-posta zaten abone!" },
        { status: 400 }
      );
    }

    // Yeni abone kaydını ekliyoruz
    const result = await collection.insertOne({
      name,
      email,
      subscribedAt: new Date(),
    });

    if (!result.insertedId) {
      return NextResponse.json(
        { error: "Abonelik işlemi başarısız oldu." },
        { status: 500 }
      );
    }

    // Abone olduktan sonra hoş geldiniz maili gönderiyoruz
    await transporter.sendMail({
      from: process.env.MAIN_EMAIL, // Gönderen: Sitemizin ana maili
      to: email, // Alıcı: kullanıcının girdiği e-posta
      subject: "Aboneliğiniz için teşekkürler!",
      text: `Merhabalar ${name},\n\nAboneliğiniz başarıyla tamamlandı. Gelecekteki güncellemeler için bizi tercih ettiğiniz için teşekkürler!`,
      html: `<h1>Merhaba ${name},</h1><p>Aboneliğiniz başarıyla tamamlandı. Gelecekteki güncellemeler için bizi tercih ettiğiniz için teşekkürler!</p>`,
    });

    return NextResponse.json(
      { message: "Abonelik başarılı! Hoş geldiniz mailiniz gönderildi." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Abonelik hatası:", error);
    return NextResponse.json(
      { error: "Abonelik işlemi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
