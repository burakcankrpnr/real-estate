import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/app/lib/dbConnect";
import { User } from "@/app/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gerekli");
        }
        
        await dbConnect();
        
        // Kullanıcıyı e-posta ile ara
        const user = await User.findOne({ email: credentials.email });
        
        // Kullanıcı bulunamazsa
        if (!user) {
          throw new Error("Email veya şifre hatalı");
        }
        
        // Şifre kontrolü
        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        // Şifre eşleşmezse
        if (!isPasswordMatch) {
          throw new Error("Email veya şifre hatalı");
        }
        
        // Kullanıcı bilgilerini döndür
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        };
      }
    })
  ],
  callbacks: {
    // Oturum içindeki bilgileri özelleştirme
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
        };
      }
      return session;
    },
    // JWT token içine ek bilgiler ekleme
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "default-secret-key",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    signOut: "/signin",
    error: "/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 