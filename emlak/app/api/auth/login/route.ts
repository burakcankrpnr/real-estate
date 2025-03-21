// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Lütfen email ve şifre giriniz!" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Email veya şifre hatalı!" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Email veya şifre hatalı!" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Giriş başarılı!",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Giriş hatası:", err);
    return NextResponse.json({ error: "Giriş sırasında bir hata oluştu." }, { status: 500 });
  }
}
