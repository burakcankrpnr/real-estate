import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="relative z-10 pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[530px] text-center">
              <div className="mx-auto text-center mb-9">
                <svg
                  className="w-full mx-auto text-center"
                  height="210"
                  viewBox="0 0 474 210"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.5"
                    d="M25 163.051H101.211V191H133.308V163.051H153V136.111H133.308V32H91.2871L25 136.577V163.051ZM101.831 136.111H58.8025V134.869L100.591 68.6445H101.831V136.111Z"
                    stroke="url(#paint0_linear_116:1137)"
                    strokeWidth="3"
                  />
                  <path
                    opacity="0.5"
                    d="M307 133.051H383.211V161H415.308V133.051H435V106.111H415.308V2H373.287L307 106.577V133.051ZM383.831 106.111H340.803V104.869L382.591 38.6445H383.831V106.111Z"
                    stroke="url(#paint1_linear_116:1137)"
                    strokeWidth="3"
                  />
                  <circle
                    opacity="0.8"
                    cx="227.5"
                    cy="81.5"
                    r="68.5"
                    fill="#4A6CF7"
                  />
                  <mask
                    id="mask0_116:1137"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="159"
                    y="13"
                    width="137"
                    height="137"
                  >
                    <circle
                      cx="227.5"
                      cy="81.5"
                      r="68.5"
                      fill="#4A6CF7"
                    />
                  </mask>
                  <g mask="url(#mask0_116:1137)">
                    <circle
                      cx="227.5"
                      cy="81.5"
                      r="68.5"
                      fill="url(#paint2_radial_116:1137)"
                    />
                    <g opacity="0.5">
                      <path
                        d="M178.779 110.733C178.261 109.356 178 107.884 178 106.4C178 97.1634 196.267 90 219 90C241.733 90 260 97.1634 260 106.4C260 107.884 259.739 109.356 259.221 110.733C278.198 116.156 291 125.312 291 135.8C291 152.138 261.617 165.3 225.5 165.3C189.383 165.3 160 152.138 160 135.8C160 125.312 172.802 116.156 191.779 110.733Z"
                        fill="#4A6CF7"
                      />
                    </g>
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_116:1137"
                      x1="25"
                      y1="183.388"
                      x2="114.156"
                      y2="31.1314"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#4A6CF7" stopOpacity="0" />
                      <stop offset="1" stopColor="#4A6CF7" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_116:1137"
                      x1="307"
                      y1="153.388"
                      x2="396.156"
                      y2="1.13141"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#4A6CF7" stopOpacity="0" />
                      <stop offset="1" stopColor="#4A6CF7" />
                    </linearGradient>
                    <radialGradient
                      id="paint2_radial_116:1137"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(227.5 81.5) rotate(90) scale(73.5368)"
                    >
                      <stop stopOpacity="0.47" />
                      <stop offset="1" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
              <h3 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                Sayfa Bulunamadı
              </h3>
              <p className="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                Aradığınız sayfa taşınmış, kaldırılmış veya hiç var olmamış olabilir.
              </p>
              <Link
                href="/"
                className="inline-block rounded-md bg-primary px-8 py-3 text-base font-semibold text-white duration-300 hover:bg-primary/90"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 