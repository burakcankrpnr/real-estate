/** @type {import('tailwindcss').Config} */
module.exports = {
  // İçerik dizinleri
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },

    screens: {
      xs: "450px",
      sm: "575px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },

    extend: {
      colors: {
        // Temel renkler
        current: "currentColor",
        transparent: "transparent",
        white: "#F5F5F5",  // Beyazı biraz daha kırarak ayarladık
        black: "#121723",
        dark: "#1D2430",

        /**
         * "primary" rengini canlı, göz alıcı
         * ve emlak sitesi hissiyatına uygun
         * parlak bir ton olarak ayarlıyoruz.
         * CTA (Call To Action) vb. yerlerde
         * doğrudan kullanılabilir.
         */
        primary: {
          DEFAULT: "#FBB040", // Öne çıkaracağınız asıl ton
          light: "#FFD27A",   // Hover veya açık ton versiyonu
          dark: "#E0A038",    // Daha koyu hali
        },

        /**
         * "secondary" rengini, "primary"yi
         * tamamlayacak daha kontrast bir tonda
         * seçiyoruz. Buton vb. ikincil alanlarda 
         * kullanılabilir.
         */
        secondary: {
          DEFAULT: "#1E3A8A", // Mavi ton (kontrast oluşturur)
          light: "#3B5ABF",
          dark: "#172B6A",
        },

        /**
         * İsteğe bağlı ek renk ya da "accent" rengi
         * ekleyebilirsiniz. Örnek: Güven, yeşil vb. 
         * vurgular için kullanılabilir.
         */
        accent: {
          DEFAULT: "#10B981", // Örneğin yeşil ton
          light: "#34D399",
          dark: "#059669",
        },

        /**
         * Geri kalan nötr tonlar (metin, arkaplan vb.)
         * Site genelinde bütünlüğü korumak adına
         * çok hafif değiştirildi.
         */
        "body-color": "#5A6473",
        "body-color-dark": "#959CB1",
        "gray-dark": "#1E232E",
        "gray-light": "#F8F9FB",
        stroke: "#E5E7EB",
        "stroke-dark": "#353943",
        "bg-color-dark": "#171C28",
      },

      boxShadow: {
        signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
        one: "0px 2px 3px rgba(7, 7, 77, 0.05)",
        two: "0px 5px 10px rgba(6, 8, 15, 0.1)",
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
        sticky: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
        "sticky-dark": "inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)",
        "feature-2": "0px 10px 40px rgba(48, 86, 211, 0.12)",
        submit: "0px 5px 20px rgba(4, 10, 34, 0.1)",
        "submit-dark": "0px 5px 20px rgba(4, 10, 34, 0.1)",
        btn: "0px 1px 2px rgba(4, 10, 34, 0.15)",
        "btn-hover": "0px 1px 2px rgba(0, 0, 0, 0.15)",
        "btn-light": "0px 1px 2px rgba(0, 0, 0, 0.1)",
      },

      dropShadow: {
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
      },

      // Yazı tipi ayarları
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
