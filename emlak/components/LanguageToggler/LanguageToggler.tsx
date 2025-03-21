"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LanguageToggler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Örnek diller
  const languages = [
    { code: "en", label: "English" },
    { code: "tr", label: "Türkçe" },
  ];

  const changeLanguage = async (lang: string) => {
    // searchParams'ı koruyarak sadece dili değiştiriyoruz.
    // Varsayalım, i18n routing kullanıyorsunuz: /tr/slug, /en/slug vs.
    // Eğer next-i18next veya benzeri kullanıyorsanız, 
    // kendi kütüphanenizin yönlendirmesini kullanın (ör: i18n.changeLanguage(lang) vb.)
    const params = new URLSearchParams(searchParams as any);
    const currentLangPathSegment = pathname.split("/")[1];

    // Mevcut path "tr" ya da "en" gibi dil kodu içeriyorsa, onu kırp.
    // (Örneğin /tr/about => /about'a çeviriyoruz, sonra /en/about şeklinde push ediyoruz.)
    let newPath = pathname;

    // Dizin(ler)den ilkini kontrol edip bir dil kodu ise sil.
    if (languages.some((l) => l.code === currentLangPathSegment)) {
      // Örn. "/tr/about" => ["", "tr", "about"] => dil kodunu silince: ["", "about"]
      const pathSegments = pathname.split("/");
      pathSegments.splice(1, 1);
      newPath = pathSegments.join("/");
    }

    // Şimdi başa yeni dil kodunu ekleyelim: "/en/about" gibi
    if (lang !== "default") {
      if (newPath === "/") {
        newPath = `/${lang}`;
      } else {
        newPath = `/${lang}${newPath}`;
      }
    }

    // Mevcut query parametrelerini korumak isterseniz:
    const queryString = params.toString();
    if (queryString) {
      newPath += `?${queryString}`;
    }

    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lng) => (
        <button
          key={lng.code}
          onClick={() => changeLanguage(lng.code)}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {lng.label}
        </button>
      ))}
    </div>
  );
}
