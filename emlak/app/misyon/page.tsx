import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Misyonumuz | Tüzgen Group",
  description:
    "Tüzgen Group'un misyonunu keşfedin: güven, şeffaflık, profesyonellik ve teknoloji odaklı hizmet anlayışıyla emlak sektöründe fark yaratıyoruz.",
};

const MisyonPage = () => {
  return (
    <>
      <Breadcrumb pageName="Misyonumuz"
      description="Tüzgen Group'un misyonunu keşfedin: güven, şeffaflık, profesyonellik ve teknoloji odaklı hizmet anlayışıyla emlak sektöründe fark yaratıyoruz."/>

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl text-body-color dark:text-body-color-dark space-y-6 text-base leading-relaxed">
            <p>
              <strong>Tüzgen Group</strong> olarak misyonumuz; gayrimenkul
              sektöründe <strong>güvenilir</strong>, <strong>yenilikçi</strong> ve{" "}
              <strong>müşteri odaklı</strong> bir anlayışla hareket ederek,
              müşterilerimize en iyi çözümleri sunmaktır.
            </p>

            <p>
              Her müşterimizin farklı ihtiyaçları olduğunu biliyor, onlara
              <strong> kişiye özel hizmet</strong> sunarak, gayrimenkul
              yatırımlarında en iyi deneyimi yaşamalarını sağlıyoruz.
            </p>

            <h3 className="text-lg font-semibold text-dark dark:text-white pt-4">
              Temel İlkelerimiz
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-primary">1. Güven ve Şeffaflık</h4>
                <p>
                  Güven, işimizin temelidir. Tüm hizmet sürecinde şeffaf ve
                  dürüst iletişim kurarak müşterilerimizin doğru kararlar
                  almasına yardımcı oluyoruz.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary">2. Profesyonellik ve Uzmanlık</h4>
                <p>
                  Alanında uzman danışmanlarımızla, piyasa analizleri, yatırım
                  rehberliği ve danışmanlık hizmetleri sunarak bilinçli yatırım
                  yapılmasını sağlıyoruz.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary">3. Yenilikçi ve Teknoloji Odaklı</h4>
                <p>
                  Dijital pazarlama, veri analizi ve yapay zeka destekli
                  çözümlerle müşterilerimize daha hızlı ve etkili hizmetler
                  sunuyoruz.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary">4. Müşteri Memnuniyeti</h4>
                <p>
                  Müşterilerimizin beklenti ve ihtiyaçlarına uygun özel
                  çözümler geliştirerek en yüksek memnuniyeti sağlamayı
                  hedefliyoruz.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary">5. Uzun Vadeli Değer</h4>
                <p>
                  Sadece bugünü değil, geleceği de düşünerek yatırımların uzun
                  vadeli değer yaratmasını hedefliyoruz.
                </p>
              </div>
            </div>

            <p>
              <strong>Tüzgen Group</strong> olarak, değişen piyasa koşullarına
              hızla uyum sağlayarak müşterilerimizin her zaman kazançlı
              çıkmasını sağlamak için çalışıyoruz.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default MisyonPage;
