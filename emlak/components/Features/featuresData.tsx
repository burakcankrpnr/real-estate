import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="fill-current text-primary"
      >
        <path d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0ZM20 37.7778C9.4986 37.7778 2.22222 30.5014 2.22222 20C2.22222 9.4986 9.4986 2.22222 20 2.22222C30.5014 2.22222 37.7778 9.4986 37.7778 20C37.7778 30.5014 30.5014 37.7778 20 37.7778Z" />
        <path d="M20 3.33333C10.9656 3.33333 3.33333 10.9656 3.33333 20C3.33333 29.0344 10.9656 36.6667 20 36.6667C29.0344 36.6667 36.6667 29.0344 36.6667 20C36.6667 10.9656 29.0344 3.33333 20 3.33333ZM20 33.3333C12.6178 33.3333 6.66667 27.3822 6.66667 20C6.66667 12.6178 12.6178 6.66667 20 6.66667C27.3822 6.66667 33.3333 12.6178 33.3333 20C33.3333 27.3822 27.3822 33.3333 20 33.3333Z" />
      </svg>
    ),
    title: "Kolay Emlak Arama",
    paragraph:
      "Gelişmiş filtreleme sistemi ile, lokasyon, fiyat, büyüklük, oda sayısı gibi pek çok parametreyi kullanarak ideal evinizi kolayca bulabilirsiniz. Satılık veya kiralık tüm emlak ilanlarına hızla erişim sağlayın.",
  },
  {
    id: 2,
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="fill-current text-primary"
      >
        <path d="M34.4444 6.66667H5.55556C4.41851 6.66667 3.44444 7.64074 3.44444 8.77778V31.2222C3.44444 32.3593 4.41851 33.3333 5.55556 33.3333H34.4444C35.5815 33.3333 36.5556 32.3593 36.5556 31.2222V8.77778C36.5556 7.64074 35.5815 6.66667 34.4444 6.66667ZM20 29.4444C11.3499 29.4444 4.44444 22.5389 4.44444 14.8889C4.44444 7.2388 11.3499 0.333333 20 0.333333C28.6501 0.333333 35.5556 7.2388 35.5556 14.8889C35.5556 22.5389 28.6501 29.4444 20 29.4444Z" />
        <path d="M20 2.22222C10.8746 2.22222 3.33333 9.76347 3.33333 20C3.33333 30.2365 10.8746 37.7778 20 37.7778C29.1254 37.7778 36.6667 30.2365 36.6667 20C36.6667 9.76347 29.1254 2.22222 20 2.22222Z" />
      </svg>
    ),
    title: "Güvenli İşlem Yöntemleri",
    paragraph:
      "Emlak alım-satım ve kiralama işlemlerinizde güvenli ödeme yöntemleri sunuyoruz. Platformumuz üzerinden güvenli ve hızlı işlem yaparak, mülk alışverişlerinizi gönül rahatlığıyla gerçekleştirebilirsiniz.",
  },
  {
    id: 3,
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="fill-current text-primary"
      >
        <path d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0ZM20 37.7778C9.4986 37.7778 2.22222 30.5014 2.22222 20C2.22222 9.4986 9.4986 2.22222 20 2.22222C30.5014 2.22222 37.7778 9.4986 37.7778 20C37.7778 30.5014 30.5014 37.7778 20 37.7778Z" />
        <path d="M20 3.33333C10.9656 3.33333 3.33333 10.9656 3.33333 20C3.33333 29.0344 10.9656 36.6667 20 36.6667C29.0344 36.6667 36.6667 29.0344 36.6667 20C36.6667 10.9656 29.0344 3.33333 20 3.33333ZM20 33.3333C12.6178 33.3333 6.66667 27.3822 6.66667 20C6.66667 12.6178 12.6178 6.66667 20 6.66667C27.3822 6.66667 33.3333 12.6178 33.3333 20C33.3333 27.3822 27.3822 33.3333 20 33.3333Z" />
      </svg>
    ),
    title: "Mobil Uygulama Desteği",
    paragraph:
      "Gelişmiş mobil uygulamamız sayesinde, istediğiniz yerden ve her zaman emlak aramalarınızı yapabilir, mülk işlemlerinizi yönetebilirsiniz. Platformumuz, mobil cihazlar için optimize edilmiştir, böylece ev ararken veya alım satım yaparken her zaman yanınızda.",
  },
  {
    id: 4,
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="fill-current text-primary"
      >
        <path d="M30 4H10C8.89543 4 8 4.89543 8 6V34C8 35.1046 8.89543 36 10 36H30C31.1046 36 32 35.1046 32 34V6C32 4.89543 31.1046 4 30 4ZM16 34V6H24V34H16Z" />
      </svg>
    ),
    title: "Detaylı Emlak Görselleri",
    paragraph:
      "Her ilan için yüksek çözünürlüklü fotoğraflar ve videolar sunarak, emlakların tüm detaylarını en iyi şekilde görüntülemenize olanak tanıyoruz. Ayrıca, 360 derece sanal turlar sayesinde mülkleri uzaktan gezebilir, daha iyi kararlar verebilirsiniz.",
  },
  {
    id: 5,
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="fill-current text-primary"
      >
        <path d="M32 4H8C6.89543 4 6 4.89543 6 6V34C6 35.1046 6.89543 36 8 36H32C33.1046 36 34 35.1046 34 34V6C34 4.89543 33.1046 4 32 4ZM16 34V6H24V34H16Z" />
      </svg>
    ),
    title: "Anında Bildirimler",
    paragraph:
      "Yeni ilanlar, fiyat değişiklikleri ve mülklerle ilgili önemli gelişmeler hakkında anında bildirimler alarak, hiçbir fırsatı kaçırmazsınız. Özelleştirilmiş bildirim seçenekleri sayesinde sadece ilgilendiğiniz konularda bilgilendirilirsiniz.",
  },
  {
    id: 6,
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="fill-current text-primary"
      >
        <path d="M28 8H12C10.8954 8 10 8.89543 10 10V30C10 31.1046 10.8954 32 12 32H28C29.1046 32 30 31.1046 30 30V10C30 8.89543 29.1046 8 28 8ZM28 30H12V10H28V30Z" />
      </svg>
    ),
    title: "Kullanıcı Dostu Arayüz",
    paragraph:
      "Sade ve anlaşılır kullanıcı arayüzümüzle, siteye gelen her kullanıcı rahatça gezebilir. Mülk arama, filtreleme ve işlem yapma süreçlerini kolayca tamamlayabilirsiniz. Hem deneyimli kullanıcılar hem de ilk defa emlak arayan kişiler için mükemmel bir deneyim sunuyoruz.",
  },
];

export default featuresData;
