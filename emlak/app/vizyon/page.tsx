import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vizyonumuz | Tüzgen Group",
  description:
    "Tüzgen Group'un vizyonu: sürdürülebilir projeler, uluslararası marka hedefi ve müşteri deneyimini ön planda tutan lider bir emlak anlayışı.",
};

const VizyonPage = () => {
  return (
    <>
      <Breadcrumb pageName="Vizyonumuz"
      description="Tüzgen Group'un vizyonu: sürdürülebilir projeler, uluslararası marka hedefi ve müşteri deneyimini ön planda tutan lider bir emlak anlayışı" />

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl text-body-color dark:text-body-color-dark space-y-6 text-base leading-relaxed">
            <p>
              <strong>Gayrimenkul sektörünün geleceğini şekillendiren lider
              firmalardan biri olmak</strong> vizyonumuzun temelini oluşturuyor.{" "}
              <strong>Tüzgen Group</strong> olarak, yalnızca Türkiye’de değil,
              uluslararası arenada da söz sahibi olan, yenilikçi ve öncü bir
              marka olmayı hedefliyoruz.
            </p>

            <h3 className="text-lg font-semibold text-dark dark:text-white pt-4">
              Vizyonumuzu Gerçekleştirmek İçin Temel Prensiplerimiz
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-primary">1. Sektöre Yenilik Getirmek</h4>
                <p>
                  Gayrimenkul dünyasında dijital dönüşümü hızlandırıyor, akıllı ev
                  çözümleri, sanal tur hizmetleri ve yapay zeka destekli piyasa
                  analizleriyle sektöre yenilik katıyoruz.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary">
                  2. Sürdürülebilir ve Doğaya Saygılı Projeler Üretmek
                </h4>
                <p>
                  Yatırımların sadece maddi değil, çevresel ve sosyal etkilerini
                  de önemsiyoruz. Yeşil bina konsepti, enerji verimli yapılar ve
                  çevre dostu projelerle fark yaratıyoruz.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary">3. Uluslararası Bir Marka Olmak</h4>
                <p>
                  Yabancı yatırımcılarla iş birlikleri kurarak, küresel pazarda da
                  güçlü ve güvenilir bir marka olmak için çalışıyoruz.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary">
                  4. Müşteri Deneyimini En Üst Seviyeye Çıkarmak
                </h4>
                <p>
                  Emlak alım-satım sürecini hızlı, kolay ve stressiz hale
                  getiriyoruz. 7/24 destek, birebir danışmanlık ve gelişmiş pazar
                  analizleriyle mükemmel müşteri deneyimi sunuyoruz.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary">
                  5. Sosyal Sorumluluk Projeleri ile Topluma Katkı Sağlamak
                </h4>
                <p>
                  Barınma ihtiyacı olan gruplara destek, eğitim projeleri ve
                  sürdürülebilir şehircilik çalışmaları ile toplumsal değer
                  yaratıyoruz.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary">
                  6. Geleceğin Liderlerini Yetiştirmek
                </h4>
                <p>
                  Genç ve dinamik yetenekleri sektöre kazandırmak için eğitim
                  programları, staj fırsatları ve kariyer gelişimi destekliyoruz.
                </p>
              </div>
            </div>

            <p>
              <strong>Tüzgen Group</strong> olarak vizyonumuz doğrultusunda;
              gayrimenkul sektöründe lider, yenilikçi ve güvenilir bir marka olma
              yolunda emin adımlarla ilerliyoruz.
            </p>
          </div>
          <div className="pt-6">
              <img
                src="/images/logov1.jpg "
                alt="Hesap Sözleşmesi Görseli"
                className="mx-auto"
              />
            </div>
        </div>
      </section>
    </>
  );
};

export default VizyonPage;
