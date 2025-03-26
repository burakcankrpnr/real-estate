// app/lib/dbConnect.ts
import mongoose from "mongoose";

// Bağlantıdan önce tüm model şemalarının yüklenmesini sağlamak için modelleri import ediyoruz
import "../models/User";
import "../models/Property";
import "../models/Favorite";

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

export default dbConnect;
