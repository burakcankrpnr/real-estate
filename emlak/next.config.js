/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
  typescript: {
    // !! UYARI !!
    // Bu seçenek build sırasında TypeScript hatalarını görmezden gelir
    // Sadece geçici bir çözüm olarak kullanılmalıdır
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! UYARI !!
    // Bu seçenek build sırasında ESLint hatalarını görmezden gelir
    // Sadece geçici bir çözüm olarak kullanılmalıdır
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
