import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sözleşmeler ve Kurallar | Tüzgen Group",
  description:
    "tuzgengroup.com üzerinde geçerli olan hesap sözleşmesi, platform kuralları ve emlak analiz raporları kullanım koşulları hakkında detaylı bilgi alın.",
};

const SozlesmelerKurallarPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Sözleşmeler ve Kurallar"
        description="tuzgengroup.com üzerinde geçerli olan hesap sözleşmesi, platform kuralları ve emlak analiz raporları kullanım koşulları hakkında detaylı bilgi alın."
      />

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-5xl text-body-color dark:text-body-color-dark space-y-6 text-base leading-relaxed">

            <h2 className="text-2xl font-semibold">Sözleşmeler ve Kurallar</h2>
            <p>
              tuzgengroup.com, alıcı ve satıcıların elektronik ortamda ticaret yapabildikleri bir platformdur. Bu platformda yürürlükte olan tüm ticari kural ve kanunlar geçerlidir.
            </p>
            <p>
              tuzgengroup.com üzerinden yapılan faaliyetler ve alım satım işlemleri sözleşmeler ve kurallarla belirlenmiştir.
            </p>
            <p>Bu bölümde;</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Kullanıcılar ve tuzgengroup.com arasındaki ilişkileri düzenleyen <strong>Hesap Sözleşmesi</strong>'ni okuyabilir,</li>
              <li>tuzgengroup.com kuralları ve politikalarını inceleyebilir,</li>
              <li>tuzgengroup.com'da satışı yasak olan <strong>Yasaklı Ürünler Listesi</strong>'ni görebilirsiniz.</li>
            </ul>

            <p>
              Güven Damgası, sadece ilgili Tebliğ uyarınca GDS tarafından incelemesi, takibi ve kontrolü sağlanan mevzuata uygunluk kriterlerinin varlığına delalet eder.
            </p>
            <p>
              Bunun haricinde Güven Damgası Sağlayıcısı, hiçbir suretle taraflar arasındaki sözleşmenin garantörü ya da taahhüt edeni olarak anlaşılamayacağı gibi, e-ticaret sitesinde bulunan mal ya da hizmetlerin ayıptan ari vasıflarının ve eksiksiz temin ve tesliminin kefili de değildir.
            </p>
            <p>
              Ayrıca Güven Damgası Sağlayıcısı; malın teslim edilmemesi, geç teslim edilmesi ya da taahhüt edilen niteliklere uygun olarak teslim edilmemesi hallerinden hukuken hiçbir surette sorumlu tutulamaz.
            </p>

            <h2 className="text-2xl font-semibold">Emlak Analiz Raporları Kullanım Kuralları</h2>

            <p>
              <strong>Emlak Analiz Raporları</strong>; Portal’da “Emlak” kategorisinde <strong>Profesyonel Mağaza</strong> sahibi olan <strong>Kurumsal Hesap Sahipleri</strong>’nin portföyündeki gayrimenkullerin veya portföyüne eklemek istediği gayrimenkullerin kapsamlı analizini yapabileceği ve profesyonel bir sunum oluşturarak müşterilerine sunabileceği raporlardır.
            </p>
            <p>
              Detaylı bilgiye “Ofisim” sayfasında yer alan “Satın Al” sekmesinden ulaşabilirsiniz.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Ürün taahhütsüzdür ve bedeli aylık bazda kesilen faturaya yansıtılır.</li>
              <li>İptal edilmediği sürece otomatik olarak yenilenir.</li>
              <li>İptal talepleri sadece <strong>Kurumsal Müşteri Hizmetleri</strong> aracılığıyla yapılabilir.</li>
              <li>İptal işlemleri, ilgili fatura kesim dönemi sonunda geçerli olur ve son kesilen faturaya ilişkin ücret iadesi yapılmaz.</li>
              <li>Oluşturulabilecek rapor sayısı, satın alınan ürün içeriği kadardır.</li>
              <li>Daha fazla rapor oluşturmak için <strong>Ek Emlak Analiz Raporları</strong> ürünü satın alınmalıdır.</li>
              <li>Ek raporlar yalnızca ilgili fatura kesim tarihine kadar geçerlidir ve yenilenmez.</li>
              <li>Ek raporlar için iptal talebi alınmaz; fatura kesim tarihi sonunda otomatik iptal edilir.</li>
              <li>Kullanılmayan raporlar geçerliliğini yitirir, ücret iadesi yapılmaz.</li>
              <li>Yalnızca “Konut” kategorisinde yer alan aktif ilanlar için rapor oluşturulabilir.</li>
              <li><strong>TÜZGEN GROUP</strong>, ürünün fiyatlandırma politikasında değişiklik yapma hakkını saklı tutar.</li>
              <li>
                Raporlar, Portal’daki ilanlar ile <strong>ODTÜ Uygulamalı Matematik Enstitüsü</strong> işbirliğiyle oluşturulan istatistiksel modele dayanan <strong>Emlak Endeksi</strong> verilerine göre hazırlanır.
              </li>
              <li>
                Raporlardaki değerlerin birebir gerçek değerlere uygun olmamasından ve/veya tahmini verilerin gerçekleşmemesinden doğabilecek zararlardan <strong>TÜZGEN GROUP</strong> sorumlu değildir.
              </li>
              <li>
                “Kurumsal Hesap Sahibi”, rapora dayanarak yaptığı işlemlerde oluşabilecek her türlü zarardan TÜZGEN GROUP’un sorumlu olmayacağını peşinen kabul ve taahhüt eder.
              </li>
            </ul>

          </div>
          <div className="pt-6">
              <img
                src="/images/logov1.jpg "
                alt="Sözleşme ve Kurallar Görseli"
                className="mx-auto"
              />
            </div>
        </div>
      </section>
    </>
  );
};

export default SozlesmelerKurallarPage;
