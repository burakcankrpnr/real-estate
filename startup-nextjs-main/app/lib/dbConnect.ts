// app/lib/dbConnect.ts
import mongoose from "mongoose";

let isConnected = false; // globalde tutulacak bir flag

export async function dbConnect() {
  if (isConnected) {
    // Bağlantı zaten varsa aynı bağlantıyı kullan
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
    console.log("MongoDB bağlantısı başarılı!");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    throw new Error("Veritabanına bağlanılamadı!");
  }
}
