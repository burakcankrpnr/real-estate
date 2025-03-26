import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const advisors = await db.collection("users").find({
      role: { $in: ["admin", "moderator"] }
    }).project({
      _id: 1,
      name: 1,
      email: 1,
      phone: 1,
      address: 1,
      city: 1,
      role: 1,
      profileImage: 1,
      socialMedia: 1,
      bio: 1,
      specialization: 1,
      experience: 1,
      languages: 1,
      rating: 1,
      propertySold: 1,
      website: 1,
      licenseNumber: 1
    }).toArray()

    return NextResponse.json(advisors)
  } catch (error) {
    console.error("Danışmanlar yüklenirken hata oluştu:", error)
    return NextResponse.json(
      { error: "Danışmanlar yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
} 