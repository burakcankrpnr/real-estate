// app/api/send-newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

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
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.MAIN_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    // Admin panelinden gönderilecek konu ve mesajı alıyoruz
    const { subject, message } = await request.json();
    if (!subject || !message) {
      return NextResponse.json(
        { error: "Lütfen hem konu hem de mesajı girin." },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını sağlıyoruz
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("newsletterSubscribers");

    // Tüm abone kayıtlarını çekiyoruz
    const subscribers = await collection.find({}).toArray();
    if (!subscribers.length) {
      return NextResponse.json(
        { error: "Gönderilecek abone bulunamadı." },
        { status: 400 }
      );
    }

    // Tüm abonelere e-postaları aynı anda göndermek için Promise.all kullanıyoruz
    await Promise.all(
      subscribers.map(async (subscriber) => {
        await transporter.sendMail({
          from: process.env.MAIN_EMAIL,
          to: subscriber.email,
          subject,
          text: message,
          html: `<p>${message}</p>`,
        });
      })
    );

    return NextResponse.json(
      { message: "E-postalar başarıyla gönderildi!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter gönderme hatası:", error);
    return NextResponse.json(
      { error: "E-posta gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
