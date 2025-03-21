import SigninPageClient from "./SigninPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap |  Tüzgen Group",
  description: "Giriş yapın ve daha hızlı bilgi alın.",
  // diğer metadata bilgileri
};

export default function SigninPage() {
  return <SigninPageClient />;
}
