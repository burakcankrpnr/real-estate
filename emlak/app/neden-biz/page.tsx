import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neden Biz? | Tüzgen Group",
  description:
    "Tüzgen Group'u diğer emlak firmalarından ayıran farkları keşfedin: güvenilir hizmet, teknoloji odaklı yaklaşım, birebir danışmanlık ve daha fazlası.",
};

const NedenBizPage = () => {
  return (
    <>
      <Breadcrumb pageName="Neden Biz?"
      description="Tüzgen Group'u diğer emlak firmalarından ayıran farkları keşfedin: güvenilir hizmet, teknoloji odaklı yaklaşım, birebir danışmanlık ve daha fazlası." />

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl text-body-color dark:text-body-color-dark space-y-6 text-base leading-relaxed">
            <p>
              <strong>Emlak sektöründe birçok firma</strong> bulunmasına rağmen,{" "}
              <strong>Tüzgen Group</strong> olarak bizi farklı kılan çok sayıda
              avantaj sunuyoruz. İşte neden bizi tercih etmelisiniz:
            </p>

            <ul className="list-none space-y-4">
              <li className="flex items-start gap-2">
                <span className="text-primary text-xl">✔</span>
                <div>
                  <strong>Geniş Portföy:</strong>{" "}
                  Her bütçeye ve ihtiyaca uygun, sürekli güncellenen zengin bir gayrimenkul portföyüne sahibiz.
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-primary text-xl">✔</span>
                <div>
                  <strong>Hızlı ve Güvenilir Hizmet:</strong>{" "}
                  Tüm süreçleri güvenilir şekilde yöneterek zaman kaybını önlüyor, hızlı çözümler üretiyoruz.
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-primary text-xl">✔</span>
                <div>
                  <strong>Teknoloji Odaklı Yaklaşım:</strong>{" "}
                  Dijital araçlar ve yapay zeka destekli analizlerle müşterilerimize en güncel bilgileri sağlıyoruz.
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-primary text-xl">✔</span>
                <div>
                  <strong>Birebir Danışmanlık:</strong>{" "}
                  Her müşterimizle özel olarak ilgileniyor, onların ihtiyaçlarına göre danışmanlık sağlıyoruz.
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-primary text-xl">✔</span>
                <div>
                  <strong>Pazarlama Gücü:</strong>{" "}
                  Etkili dijital stratejiler ve yenilikçi yöntemlerle ilanlarınızın daha hızlı sonuç vermesini sağlıyoruz.
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-primary text-xl">✔</span>
                <div>
                  <strong>Müşteri Memnuniyeti:</strong>{" "}
                  İşimizin her aşamasında memnuniyeti ön planda tutarak güvene dayalı ilişkiler kuruyoruz.
                </div>
              </li>
            </ul>

            <p>
              Tüzgen Group olarak; sadece gayrimenkul satmıyor,{" "}
              <strong>kaliteli deneyim, güven ve kazanç</strong> sunuyoruz. Bizi
              tercih eden her müşterimizle uzun soluklu, memnuniyet odaklı bir
              iş birliği hedefliyoruz.
            </p>
          </div>
          <div className="pt-6">
              <img
                src="/images/logov1.jpg "
                alt="Hesap Sözleşmesi Görseli"
                className="mx-auto"
              />
            </div></div>

      </section>
    </>
  );
};

export default NedenBizPage;
