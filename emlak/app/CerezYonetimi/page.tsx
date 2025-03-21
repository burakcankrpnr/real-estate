import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çerez Yönetimi | Tüzgen Group",
  description:
    "Tüzgen Group internet sitesinde kullanılan çerez türlerini öğrenin, gizliliğiniz üzerinde kontrol sağlayın.",
};

const CerezYonetimiPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Çerez Yönetimi"
        description="Tüzgen Group internet sitesinde kullanılan çerez türlerini öğrenin, gizliliğiniz üzerinde kontrol sağlayın."
      />

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl text-body-color dark:text-body-color-dark space-y-6 text-base leading-relaxed">
            <h2 className="text-2xl font-semibold font-medium text-primary">Çerez Yönetimi</h2>
            <p>
              Herhangi bir internet sitesini ziyaret ettiğinizde, sitenin
              işlevlerinden en iyi şekilde faydalanabilmeniz için kullandığınız
              tarayıcı üzerinden genellikle “tanımlama bilgileri” (çerezler)
              başlığı altında çeşitli bilgiler alınabilir ve depolanabilir.
              Söz konusu bilgiler kullanım tercihleriniz veya kullandığınız
              cihaz hakkında olabilir ya da sitenin doğru ve beklediğiniz şekilde
              çalışabilmesi için kullanılabilir.
            </p>
            <p>
              Bu bilgiler çoğunlukla sizi doğrudan ve kişisel olarak tanımlamaz;
              ancak size ve kullanım alışkanlıklarınıza daha uygun bir internet
              deneyimi sunarak, internet sitemizden en kapsamlı şekilde
              faydalanmanızı sağlar.
            </p>
            <p>
              Bazı tanımlama bilgisi türlerinin sitemiz tarafından kullanılmasına
              izin vermemeyi tercih edebilirsiniz. Ancak bu durumda sitemizdeki
              deneyiminizin ve size sunacağımız bazı hizmetlerin bu tercihinizden
              olumsuz etkilenebileceğini hatırlatmak isteriz.
            </p>
            <p>
              Tanımlama bilgisi kategorileri hakkında daha fazla bilgi almak,
              sitemizden en iyi şekilde faydalanabilmek ve önceden belirlediğimiz
              ayarları değiştirmek için aşağıdaki başlıkları inceleyebilirsiniz.
            </p>

            {/* Hedefleme */}
            <h3 className="text-2xl font-semibold font-medium text-primary">
              Hedefleme Amaçlı Tanımlama Bilgileri
            </h3>
            <p>
              Bu tanımlama bilgileri, sitemizde reklam ortaklarımız tarafından
              ayarlanır. İlgili şirketler tarafından ilgi alanları profilinizi
              oluşturmak ve diğer sitelerde size daha alakalı reklamlar
              göstermek amacıyla kullanılır. Genellikle tarayıcınızı ve cihazınızı
              benzersiz şekilde tanımlar. Bu kapsamda çerezler ve piksel
              etiketleri gibi teknolojiler aracılığıyla bilgiler toplanabilir.
            </p>
            <p>
              Bu çerezlere izin vermezseniz, farklı sitelerde size özel reklam
              deneyimi sunamayız.

            </p>

            {/* Zorunlu */}
            <h3 className="text-2xl font-semibold font-medium text-primary">
              Zorunlu Tanımlama Bilgileri
            </h3>
            <p>
              Bu tanımlama bilgileri, web sitesinin çalışması için gereklidir ve
              sistemlerimizde kapatılamaz. Genellikle yalnızca sizin işlemlerinizi
              gerçekleştirmek için ayarlanır – örneğin, gizlilik tercihlerinizi
              hatırlamak, oturum açmak veya form doldurmak gibi.
            </p>
            <p>
              Tarayıcınızı bu çerezleri engelleyecek şekilde ayarlayabilirsiniz
              ancak bu durumda sitenin bazı bölümleri düzgün çalışmayabilir.
            </p>

            {/* İşlevsel */}
            <h3 className="text-2xl font-semibold font-medium text-primary">
              İşlevsel Tanımlama Bilgileri
            </h3>
            <p>
              Bu tanımlama bilgileri, videolar ve canlı sohbet gibi gelişmiş
              işlevler ile kişiselleştirme olanakları sunmamızı sağlar. Bu
              çerezler, bizim tarafımızdan ya da hizmetlerinden faydalandığımız
              üçüncü taraf sağlayıcılarca ayarlanabilir.
            </p>
            <p>
              Bu çerezlere izin vermezseniz ilgili işlevlerin tümü ya da bir
              kısmı doğru şekilde çalışmayabilir.
            </p>

            {/* Performans */}
            <h3 className="text-2xl font-semibold font-medium text-primary">
              Performans Tanımlama Bilgileri
            </h3>
            <p>
              Bu tanımlama bilgileri, sitemizin performansını ölçebilmemiz ve
              iyileştirebilmemiz için ziyaret ve trafik kaynaklarını analiz
              etmemize yardımcı olur.
            </p>
            <p>
              Hangi sayfaların en çok veya en az ziyaret edildiğini ve
              ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur.
              Toplanan tüm bilgiler anonimdir. Bu çerezlere izin vermezseniz,
              sitemizi ne zaman ziyaret ettiğinizi bilemeyiz ve performans
              geliştirmeleri yapmamız zorlaşır.
            </p>

            {/* Görsel alanı */}
            <div className="pt-6">
              <img
                src="/images/logov1.jpg "
                alt="Hesap Sözleşmesi Görseli"
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CerezYonetimiPage;
