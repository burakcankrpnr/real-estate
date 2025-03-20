import SignupPageClient from "./SignupPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol | Emlak Platformu",
  description: "Hesap oluşturarak daha hızlı bilgi alın.",
  // diğer metadata bilgileri
};

export default function SignupPage() {
  return <SignupPageClient />;
}
