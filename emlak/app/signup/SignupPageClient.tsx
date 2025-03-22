"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function SignupPageClient() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Giriş alanı doldurulduğunda hata mesajını temizle
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};
    
    // İsim doğrulama
    if (!formData.name) {
      newErrors.name = "Ad ve soyad gereklidir";
    } else if (formData.name.length < 3) {
      newErrors.name = "Ad ve soyad en az 3 karakter olmalıdır";
    }
    
    // E-posta doğrulama
    if (!formData.email) {
      newErrors.email = "E-posta adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }
    
    // Şifre doğrulama
    if (!formData.password) {
      newErrors.password = "Şifre gereklidir";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }
    
    // Şifre tekrar doğrulama
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Şifre tekrarı gereklidir";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }
    
    // Şartlar ve koşullar doğrulama
    if (!acceptTerms) {
      newErrors.terms = "Kayıt olmak için şartları ve koşulları kabul etmelisiniz";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Kayıt işlemi başarısız oldu");
      } else {
        toast.success("Kayıt işlemi başarılı, giriş yapılıyor");

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Dispatch userChanged event
        window.dispatchEvent(new Event("userChanged"));

        // Redirect to the homepage after success
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (error) {
      toast.error("Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin");
      console.error("Kayıt Hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />

      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Kayıt Ol
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Hesap oluşturarak daha hızlı bilgi alabilirsiniz.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-8">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      Adınız ve Soyadınız
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Adınız ve Soyadınız"
                      className={`border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none ${
                        errors.name ? "border-red-500 focus:border-red-500 dark:focus:border-red-500" : ""
                      }`}
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      E-posta Adresiniz
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="E-posta Adresiniz"
                      className={`border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none ${
                        errors.email ? "border-red-500 focus:border-red-500 dark:focus:border-red-500" : ""
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      Şifreniz
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Şifreniz (en az 6 karakter)"
                      className={`border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none ${
                        errors.password ? "border-red-500 focus:border-red-500 dark:focus:border-red-500" : ""
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="mb-8">
                    <label
                      htmlFor="confirmPassword"
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      Şifre Tekrar
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Şifrenizi tekrar girin"
                      className={`border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none ${
                        errors.confirmPassword ? "border-red-500 focus:border-red-500 dark:focus:border-red-500" : ""
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Gizlilik ve Şartlar Onayı */}
                  <div className="mb-8 flex">
                    <label
                      htmlFor="acceptTerms"
                      className={`flex cursor-pointer select-none text-sm font-medium ${
                        errors.terms ? "text-red-500" : "text-body-color"
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="acceptTerms"
                          className="sr-only"
                          checked={acceptTerms}
                          onChange={(e) => {
                            setAcceptTerms(e.target.checked);
                            if (errors.terms) {
                              setErrors({...errors, terms: undefined});
                            }
                          }}
                          disabled={isLoading}
                        />
                        <div className={`box mr-4 mt-1 flex h-5 w-5 items-center justify-center rounded border ${
                          errors.terms 
                            ? "border-red-500" 
                            : "border-body-color border-opacity-20 dark:border-white dark:border-opacity-10"
                        }`}>
                          {acceptTerms && (
                            <span>
                              <svg
                                width="11"
                                height="8"
                                viewBox="0 0 11 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                  fill="#3056D3"
                                  stroke="#3056D3"
                                  strokeWidth="0.4"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                      <span>
                        Hesap oluşturmak için{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Şartlar - Koşullar
                        </Link>{" "}
                        ve{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Gizlilik Politikasını
                        </Link>{" "}
                        kabul ediyorum.
                      </span>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="mb-4 -mt-6 text-sm text-red-500">{errors.terms}</p>
                  )}

                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Kayıt Yapılıyor...
                        </>
                      ) : (
                        "Kayıt Ol"
                      )}
                    </button>
                  </div>
                </form>
                
                <p className="text-center text-base font-medium text-body-color">
                  Zaten hesabınız var mı?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Giriş Yap
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background */}
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
