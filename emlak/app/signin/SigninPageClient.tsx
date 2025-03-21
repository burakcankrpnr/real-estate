"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SigninPageClient() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Alert mesajı için state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("error");

  // Alert gösterildiğinde 5 sn sonra kaybolması
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Alert gösteren fonksiyon
  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!email || !password) {
      showAlert("Lütfen Tüm Alanları Doldurun!", "error");
      return;
    }
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        showAlert(data.error || "Giriş başarısız!", "error");
      } else {
        // Giriş başarılı olduğunda, kullanıcı verisini localStorage'a kaydediyoruz.
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // User change event tetikleniyor
        window.dispatchEvent(new Event("userChanged"));
        
        showAlert("Giriş Başarılı, Yönlendiriliyorsunuz...", "success");
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    } catch (error) {
      showAlert("Sunucu hatası oluştu!", "error");
      console.error("Giriş hatası:", error);
    }
  };
  

  return (
    <>
      {/* Sağ üst köşede otomatik kaybolan alert */}
      {alertMessage && (
        <div className="fixed top-20 right-4 z-50 w-full max-w-sm">
          <div
            className={`
              flex items-start gap-3 rounded-md border p-4 shadow-md
              ${alertType === "success"
                ? "border-green-400 bg-green-50 text-green-700"
                : "border-red-400 bg-red-50 text-red-700"
              }
            `}
          >
            {/* İkon */}
            <div className="mt-1">
              {alertType === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            {/* Mesaj */}
            <div className="flex-1 text-sm font-medium">{alertMessage}</div>
          </div>
        </div>
      )}

      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Giriş Yap
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Daha fazla bilgi almak için giriş yapın.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      E-posta Adresiniz
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="E-posta adresinizi girin"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Şifreniz
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Şifrenizi girin"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <label
                        htmlFor="rememberMe"
                        className="flex cursor-pointer select-none items-center text-sm font-medium text-body-color"
                      >
                        <input
                          type="checkbox"
                          id="rememberMe"
                          className="mr-3 h-5 w-5 rounded border border-body-color bg-[#f8f8f8] dark:border-white dark:bg-[#2C303B]"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Beni Hatırla
                      </label>
                    </div>
                    <div>
                      <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                        Şifremi Unuttum
                      </Link>
                    </div>
                  </div>
                  <div className="mb-6">
                    <button
                      type="submit"
                      className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90"
                    >
                      Giriş Yap
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Hesabınız yok mu?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Kayıt Ol
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
}
