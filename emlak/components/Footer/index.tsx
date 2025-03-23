"use client";
import Image from "next/image";
import Link from "next/link";
import { FiPhone, FiMail } from "react-icons/fi";



const Footer = () => {
  return (
    <>
      <footer
      
        className="wow fadeInUp dark:bg-gray-dark relative z-10 bg-white pt-16 md:pt-20 lg:pt-24"
        
        data-wow-delay=".1s"
        
      >
        
        <div className="container">
          
          {/* Sütunların ana wrapper'ı */}
          <div className="-mx-4 flex flex-wrap">
            {/* 1. Kolon: Şirket Bilgileri */}
            
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12"> 
            <div className="mb-12 max-w-[360px] lg:mb-16"> 
              <Link href="/" className="mb-0 inline-block"> 
{/* Light Mode Logo */}
<Image
  src="/images/logo/logo.png"
  alt="logo"
  className="block dark:hidden w-full"
  width={140}
  height={30}
/>

{/* Dark Mode Logo */}
<Image
  src="/images/logo/logo.png"
  alt="logo"
  className="hidden dark:block w-full"
  width={140}
  height={30}
/>
              </Link> 
            <p className="dark:text-body-color-dark mb-3 text-base leading-relaxed text-body-color">
               Antalya / Türkiye </p>
               <div className="flex flex-col gap-3 mt-4">
  {/* Mail Linki */}
  <a
    href="mailto:info@tuzgengroup.com"
    className="flex items-center text-base text-body-color dark:text-body-color-dark hover:text-primary dark:hover:text-primary transition"
  >
    <svg
      className="w-5 h-5 mr-2 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4h16v16H4V4zm0 0l8 8 8-8"
      />
    </svg>
    info@tuzgengroup.com
  </a>

  {/* Telefon Linki */}
  <a
    href="tel:05375055590"
    className="flex items-center text-base text-body-color dark:text-body-color-dark hover:text-primary dark:hover:text-primary transition"
  >
    <svg
      className="w-5 h-5 mr-2 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5l2 2a2 2 0 002.8.2l1.4-1.4a1 1 0 011.4 0l2 2a1 1 0 010 1.4l-1.4 1.4a2 2 0 00.2 2.8l2 2a1 1 0 001.4 0l1.4-1.4a2 2 0 00.2-2.8l-2-2"
      />
    </svg>
    0537 505 55 90
  </a>
</div>

<div className="flex items-center mt-4 gap-4">
  {/* Facebook */}
  <a
    href="https://www.facebook.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="text-body-color dark:text-body-color-dark hover:text-primary dark:hover:text-primary duration-300"
  >
    <svg width="9" height="18" viewBox="0 0 9 18" className="fill-current">
      <path d="M8.13643 7H6.78036H6.29605V6.43548V4.68548V4.12097H6.78036H7.79741C8.06378 4.12097 8.28172 3.89516 8.28172 3.55645V0.564516C8.28172 0.254032 8.088 0 7.79741 0H6.02968C4.11665 0 2.78479 1.58064 2.78479 3.92339V6.37903V6.94355H2.30048H0.65382C0.314802 6.94355 0 7.25403 0 7.70564V9.7379C0 10.1331 0.266371 10.5 0.65382 10.5H2.25205H2.73636V11.0645V16.7379C2.73636 17.1331 3.00273 17.5 3.39018 17.5H5.66644C5.81174 17.5 5.93281 17.4153 6.02968 17.3024C6.12654 17.1895 6.19919 16.9919 6.19919 16.8226V11.0927V10.5282H6.70771H7.79741C8.11222 10.5282 8.35437 10.3024 8.4028 9.96371V9.93548V9.90726L8.74182 7.95968C8.76604 7.7621 8.74182 7.53629 8.59653 7.31048C8.54809 7.16935 8.33016 7.02823 8.13643 7Z" />
    </svg>
  </a>

  {/* Twitter */}
  <a
    href="https://x.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Twitter"
    className="text-body-color dark:text-body-color-dark hover:text-primary dark:hover:text-primary duration-300"
  >
    <svg width="19" height="14" viewBox="0 0 19 14" className="fill-current">
      <path d="M16.3024 2.26027L17.375 1.0274C17.6855 0.693493 17.7702 0.436644 17.7984 0.308219C16.9516 0.770548 16.1613 0.924658 15.6532 0.924658H15.4556L15.3427 0.821918C14.6653 0.282534 13.8185 0 12.9153 0C10.9395 0 9.3871 1.48973 9.3871 3.21062C9.3871 3.31336 9.3871 3.46747 9.41532 3.57021L9.5 4.0839L8.90726 4.05822C5.29435 3.95548 2.33065 1.13014 1.85081 0.642123C1.06048 1.92637 1.5121 3.15925 1.99194 3.92979L2.95161 5.36815L1.42742 4.5976C1.45565 5.67637 1.90726 6.52397 2.78226 7.14041L3.54435 7.65411L2.78226 7.93665C3.2621 9.24658 4.33468 9.78596 5.125 9.99144L6.16935 10.2483L5.18145 10.8647C3.60081 11.8921 1.625 11.8151 0.75 11.738C2.52823 12.8682 4.64516 13.125 6.1129 13.125C7.21371 13.125 8.03226 13.0223 8.22984 12.9452C16.1331 11.25 16.5 4.82877 16.5 3.54452V3.36473L16.6694 3.26199C17.629 2.44007 18.0242 2.00342 18.25 1.74658C18.1653 1.77226 18.0524 1.82363 17.9395 1.84932L16.3024 2.26027Z" />
    </svg>
  </a>
<a
  href="https://www.instagram.com/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Instagram"
  className="text-body-color dark:text-body-color-dark hover:text-primary dark:hover:text-primary duration-300"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="fill-current"
  >
    <path d="M7.75 2C5.12665 2 3 4.12665 3 6.75V17.25C3 19.8734 5.12665 22 7.75 22H16.25C18.8734 22 21 19.8734 21 17.25V6.75C21 4.12665 18.8734 2 16.25 2H7.75ZM5 6.75C5 5.23122 6.23122 4 7.75 4H16.25C17.7688 4 19 5.23122 19 6.75V17.25C19 18.7688 17.7688 20 16.25 20H7.75C6.23122 20 5 18.7688 5 17.25V6.75ZM12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7ZM10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11C14 12.1046 13.1046 13 12 13C10.8954 13 10 12.1046 10 11ZM17 7.5C17 8.05228 16.5523 8.5 16 8.5C15.4477 8.5 15 8.05228 15 7.5C15 6.94772 15.4477 6.5 16 6.5C16.5523 6.5 17 6.94772 17 7.5Z" />
  </svg>
</a>

</div>
</div>
</div>

<div className="w-full px-4 md:w-1/2 lg:w-2/12 xl:w-2/12">
  <div className="mb-12 lg:mb-16">
    <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
      Hizmetlerimiz
    </h2>
    <ul>
      <li>
        <Link
          href="/doping"
          className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
        >
          Doping
        </Link>
      </li>
      <li>
        <Link
          href="/reklam"
          className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
        >
          Reklam
        </Link>
      </li>
    </ul>
  </div>
</div>


            {/* 3. Kolon: Kurumsal */}
            <div className="w-full px-4 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  Kurumsal
                </h2>
<ul>
<Link
      href="/about"
      className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
    >
      Hakkımızda
    </Link>
  <li>
    <Link
      href="/misyon"
      className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
    >
      Misyonumuz
    </Link>
  </li>
  <li>
    <Link
      href="/vizyon"
      className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
    >
      Vizyonumuz
    </Link>
  </li>
  <li>
    
  </li>
  <li>
    
  </li>
  <li>
    <Link
      href="/neden-biz"
      className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
    >
      Neden Biz?
    </Link>
  </li>
  <Link
      href="/contact"
      className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
    >
      İletişim
    </Link>
</ul>
              </div>
            </div>
<div className="w-full px-4 md:w-1/2 lg:w-2/12 xl:w-2/12">
  <div className="mb-12 lg:mb-16">
    <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
      Gizlilik ve Kullanım
    </h2>
    <ul>
      <li>
        <Link
          href="/hesap-sozlesmesi"
          className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
        >
          Hesap Sözleşmesi
        </Link>
      </li>
      <li>
        <Link
          href="/CerezYonetimi"
          className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
        >
          Çerez Yönetimi
        </Link>
      </li>
      <li>
        <Link
          href="/sozlesmeler-kurallar"
          className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
        >
          Sözleşmeler ve Kurallar
        </Link>
      </li>
      <li>
        <Link
          href="/kullanim-kosullari"
          className="dark:text-body-color-dark mb-4 block text-base text-body-color duration-300 hover:text-primary dark:hover:text-primary"
        >
          Kullanım Koşulları
        </Link>
      </li>
    </ul>
  </div>
</div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>

          {/* Copyright vb. */}
          <div className="py-8">
            <p className="text-center text-base text-body-color dark:text-white">
            <a href="/" rel="nofollow noopener">
                <b /> Tüzgen Group -
              </a> Tüm hakları saklıdır.
              
              <b />
              {/* <span className="block mt-2 text-sm">V1.0</span> */}
            </p>
          </div>
        </div>

        {/* <div className="absolute right-0 top-14 z-[-1]">
          <svg
            width="55"
            height="99"
            viewBox="0 0 55 99"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="#959CB1" />
            <mask
              id="mask0_94:899"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="99"
              height="99"
            >
              <circle
                opacity="0.8"
                cx="49.5"
                cy="49.5"
                r="49.5"
                fill="#4A6CF7"
              />
            </mask>
            <g mask="url(#mask0_94:899)">
              <circle
                opacity="0.8"
                cx="49.5"
                cy="49.5"
                r="49.5"
                fill="url(#paint0_radial_94:899)"
              />
              <g opacity="0.8" filter="url(#filter0_f_94:899)">
                <circle cx="53.8676" cy="26.2061" r="20.3824" fill="white" />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_f_94:899"
                x="12.4852"
                y="-15.1763"
                width="82.7646"
                height="82.7646"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="10.5"
                  result="effect1_foregroundBlur_94:899"
                />
              </filter>
              <radialGradient
                id="paint0_radial_94:899"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(49.5 49.5) rotate(90) scale(53.1397)"
              >
                <stop stopOpacity="0.47" />
                <stop offset="1" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div> */}
        <div className="absolute bottom-24 left-0 z-[-1]">
          <svg
            width="79"
            height="94"
            viewBox="0 0 79 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              opacity="0.3"
              x="-41"
              y="26.9426"
              width="66.6675"
              height="66.6675"
              transform="rotate(-22.9007 -41 26.9426)"
              fill="url(#paint0_linear_94:889)"
            />
            <rect
              x="-41"
              y="26.9426"
              width="66.6675"
              height="66.6675"
              transform="rotate(-22.9007 -41 26.9426)"
              stroke="url(#paint1_linear_94:889)"
              strokeWidth="0.7"
            />
            <path
              opacity="0.3"
              d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L77.1885 68.2073L50.5215 7.42229Z"
              fill="url(#paint2_linear_94:889)"
            />
            <path
              d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L76.7963 68.2073L50.5215 7.42229Z"
              stroke="url(#paint3_linear_94:889)"
              strokeWidth="0.7"
            />
            <path
              opacity="0.3"
              d="M17.9721 93.3057L-14.9695 88.2076L46.2077 62.325L77.1885 68.2074L17.9721 93.3057Z"
              fill="url(#paint4_linear_94:889)"
            />
            <path
              d="M17.972 93.3057L-14.1852 88.2076L46.2077 62.325L77.1884 68.2074L17.972 93.3057Z"
              stroke="url(#paint5_linear_94:889)"
              strokeWidth="0.7"
            />
            <defs>
              <linearGradient
                id="paint0_linear_94:889"
                x1="-41"
                y1="21.8445"
                x2="36.9671"
                y2="59.8878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_94:889"
                x1="25.6675"
                y1="95.9631"
                x2="-42.9608"
                y2="20.668"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_94:889"
                x1="20.325"
                y1="-3.98039"
                x2="90.6248"
                y2="25.1062"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_94:889"
                x1="18.3642"
                y1="-1.59742"
                x2="113.9"
                y2="80.6826"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_94:889"
                x1="61.1098"
                y1="62.3249"
                x2="-8.82468"
                y2="58.2156"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_94:889"
                x1="65.4236"
                y1="65.0701"
                x2="24.0178"
                y2="41.6598"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </footer>
    </>
  );
};

export default Footer;
