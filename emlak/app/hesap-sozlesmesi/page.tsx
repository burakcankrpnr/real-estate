import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesap Sözleşmesi | Tüzgen Group",
  description:
    "Tüzgen Group Portalı'nda hesap oluşturma, kullanım koşulları, gizlilik politikası ve tarafların yükümlülüklerini belirleyen Hesap Sözleşmesini okuyun.",
};

const HesapSozlesmesiPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Hesap Sözleşmesi"
        description="Tüzgen Group Portalı'nda hesap oluşturma, kullanım koşulları, gizlilik politikası ve tarafların yükümlülüklerini belirleyen Hesap Sözleşmesini okuyun."
      />

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-5xl text-body-color dark:text-body-color-dark space-y-6 text-base leading-relaxed">
            {/* 1. Taraflar */}
            <h3 className="text-xl font-semibold">Hesap Sözleşmesi</h3>
            <p>
              İşbu Bireysel Hesap Sözleşmesi (bundan böyle “Hesap Sözleşmesi”
              olarak anılacaktır); “Altınkum Konyaaltı / ANTALYA” adresinde mukim
              Tüzgen Group (bundan böyle kısaca "Tüzgen Group" olarak
              anılacaktır) ile www.tuzgengroup.com Portalda hesap açmak için
              işbu Hesap Sözleşmesi ile ayrılmaz parçası olan eklerine ve
              sahibinden.com Portalında yer alan şartlar ile kurallara onay veren
              "Hesap Sahibi" arasında elektronik ortamda akdedilerek yürürlüğe
              girmiştir.
            </p>

            {/* 2. Tanımlar */}
            <h3 className="text-xl font-semibold">1. Taraflar</h3>
            <p>
              İşbu Bireysel Hesap Sözleşmesi (bundan böyle “Hesap Sözleşmesi”
              olarak anılacaktır); “Altınkum Konyaaltı / ANTALYA ” adresinde
              mukim Tüzgen Group (bundan böyle kısaca "Tüzgen Group" olarak
              anılacaktır) ile www.tuzgengroup.com Portalda hesap açmak için
              işbu Hesap Sözleşmesi ile ayrılmaz parçası olan eklerine ve
              sahibinden.com Portalında yer alan şartlar ile kurallara onay veren
              "Hesap Sahibi" arasında elektronik ortamda akdedilerek yürürlüğe
              girmiştir.
            </p>

            <h3 className="text-xl font-semibold">2. Tanımlar</h3>
            <p>
              “Portal”: www.tuzgengroup.com isimli alan adından ve bu alan
              adına bağlı alt alan adlarından oluşan “Tüzgen Group”’in
              hizmetlerini sunduğu internet sitesi ve/veya mobil uygulamalar.
            </p>
            <p>
              “Kullanıcı”: “Portal”a erişen her gerçek veya tüzel kişi.
            </p>
            <p>
              “Hesap Sahibi”: “Portal”da hesap açan ve "Portal" dahilinde
              sunulan hizmetlerden belirlenen koşullar dahilinde yararlanan
              “Kullanıcı”.
            </p>
            <p>
              “Bireysel Hesap Sahibi”: “Portal”da hesap oluşturan, mesleki veya
              ticari amaç gütmeksizin "Portal" dahilinde sunulan hizmetlerden
              belirlenen koşullar dahilinde yararlanan “Kullanıcı”.
            </p>
            <p>
              “Bireysel Hesap” (“Hesap”): “Bireysel Hesap” oluşturmak isteyen
              “Kullanıcı”nın, “Portal”daki Bireysel Hesap Formu’nu doğru ve
              gerçek bilgilerle eksiksiz olarak doldurması üzerine “Tüzgen
              Group” tarafından yapılan bildirim ile kazanılan statüdür. Hesap
              işlemleri tamamlanmadan “Bireysel Hesap Sahibi” olma hak ve
              yetkisine sahip olunamaz. “Bireysel Hesap Sahibi”nin hak ve
              yükümlülükleri, başvuruda bulunana ait olan, kısmen veya tamamen
              herhangi bir üçüncü şahsa devredilemeyen hak ve yükümlülüklerdir.
              Hesap Oluşturma başvurusu herhangi bir sebep gösterilmeksizin
              “Tüzgen Group” tarafından reddedilebilir veya ek şart ve koşullar
              talep edilebilir. “Tüzgen Group” gerekli görmesi halinde “Bireysel
              Hesap Sahibi”nin hesabını kapatabilir, hesabı herhangi bir sebeple
              kapatılanın yapacağı hesap açma talebini kabul etmeyebilir.
            </p>
            <p>
              "Hesap Sözleşmesi": “Portal”da yer alan şartlar ve koşullar ile
              eklerden oluşan, kullanıcının “Hesap Sözleşmesi”ni anladığına ve
              kabul ettiğine ilişkin elektronik olarak verdiği onay neticesinde
              elektronik ortamda akdedilen, ayrılmaz parçası olan ekler ile
              “Portal”da yer alan şart ve kurallarla birlikte bir bütün olan
              elektronik sözleşme.
            </p>
            <p>
              "Tüzgen Group Hesabı": “Hesap Sahibi”nin "Portal" içerisinde
              sunulan hizmetlerden yararlanmak için gerekli olan iş ve
              işlemleri gerçekleştirdiği, "Hesap” ile ilgili konularda "Tüzgen
              Group"e talepte bulunduğu, "Hesap bilgilerini güncelleyip,
              sunulan hizmetlerle ilgili raporlamaları görüntüleyebildiği,
              kendisinin belirlediği ve münhasıran kendisi tarafından
              kullanılacağını taahhüt ettiği "kullanıcı adı" ve "şifre" ile
              "Portal" üzerinden eriştiği "Hesap Sahibi"ne özel internet
              sayfaları bütünü.
            </p>
            <p>
              “Tüzgen Group Hizmetleri” ("Hizmetler"): "Portal" içerisinde
              "Hesap Sahibi"nin işbu “Hesap Sözleşmesi” içerisinde tanımlı olan
              iş ve işlemlerini gerçekleştirmelerini sağlamak amacıyla “Tüzgen
              Group” tarafından sunulan uygulamalardır. "Tüzgen Group",
              "Portal" içerisinde sunulan "Hizmetler"inde dilediği zaman
              değişiklikler ve/veya uyarlamalar yapabilir. Yapılan değişiklikler
              ve/veya uyarlamalarla ilgili "Hesap Sahibi"nin uymakla yükümlü
              olduğu kural ve koşullar “Portal”dan "Hesap Sahibi"ne duyurulur,
              açıklanan şartlar ve koşullar “Portal”da yayımlandığı tarihte
              yürürlüğe girer.
            </p>
            <p>
              “İçerik”: “Portal”da yayınlanan ve erişimi mümkün olan her türlü
              bilgi, yazı, dosya, resim, video, rakam vb. görsel, yazımsal ve
              işitsel imgeler.
            </p>
            <p>
              "Tüzgen Group Arayüzü" : Tüzgen Group ve "Hesap Sahibi” tarafından
              oluşturulan içeriğin "Kullanıcı”lar tarafından görüntülenebilmesi
              ve "Tüzgen Group Veri tabanı"ından sorgulanabilmesi amacıyla
              "Kullanıcı”lar tarafından kullanılan; 5846 Sayılı Fikir ve Sanat
              Eserleri Kanunu kapsamında korunan ve tüm fikri hakları “Tüzgen
              Group”e ait olan tasarımlar içerisinde “Portal” üzerinden
              yapılabilecek her türlü işlemin gerçekleştirilmesi için bilgisayar
              programına komut veren internet sayfaları ve mobil uygulama
              ekranları/sayfalarıdır.
            </p>
            <p>
              “Tüzgen Group Veri Tabanı” : “Portal” dahilinde erişilen
              içeriklerin depolandığı, tasnif edildiği, sorgulanabildiği ve
              erişilebildiği “Tüzgen Group”e ait olan 5846 Sayılı Fikir ve Sanat
              Eserleri Kanunu gereğince korunan veri tabanıdır.
            </p>
            <p>
              “Bana Özel” sayfası: "Hesap Sahibi"nin "Portal"da yer alan çeşitli
              uygulamalardan ve "Hizmetler”den yararlanabilmesi için gerekli
              işlemleri gerçekleştirebildiği, kişisel bilgilerini, tercihlerini,
              uygulama bazında kendisinden talep eden bilgileri girdiği, sadece
              "Hesap Sahibi" tarafından belirlenen kullanıcı adı ve şifre ile
              erişilebilen "Hesap Sahibi"ne özel sayfa.
            </p>
            <p>
              “Kişisel Veri”: 6698 sayılı Kişisel Verilerin Korunması Hakkında
              Kanun’un (KVKK) 3/d maddesi uyarınca, kimliği belirli veya
              belirlenebilir gerçek kişiye ilişkin her türlü bilgi ile KVKK
              m.6/1’de sayılan özel nitelikli kişisel verilerdir.
            </p>
            <p>
              “Özel nitelikli kişisel veri”: Kişilerin ırkı, etnik kökeni,
              siyasi düşüncesi, felsefi inancı, dini, mezhebi veya diğer
              inançları, kılık ve kıyafeti, dernek, vakıf ya da sendika
              üyeliği, sağlığı, cinsel hayatı, ceza mahkûmiyeti ve güvenlik
              tedbirleriyle ilgili verileri ile biyometrik ve genetik verileri
              özel nitelikli kişisel veridir.
            </p>

            {/* 3. Konu ve Kapsam */}
            <h3 className="text-xl font-semibold">
              3. “Hesap Sözleşmesi”nin Konusu ve Kapsamı
            </h3>
            <p>
              İşbu “Hesap Sözleşmesi”nin konusu, "Portal"da sunulan
              “Hizmetler”in, bu “Hizmetler”den yararlanma şartları ile tarafların
              hak ve yükümlülüklerinin tespitidir. “Hesap Sözleşmesi” ve ekleri
              ile "Portal" içerisinde yer alan kullanıma, hesaba ve
              “Hizmetler”e ilişkin “Tüzgen Group” tarafından yapılan tüm uyarı,
              bildirim, uygulama ve açıklama gibi beyanlar kapsam dâhilindedir.
              "Kullanıcı", işbu “Hesap Sözleşmesi” hükümlerini kabul etmekle,
              "Portal" içinde yer alan kullanıma, hesap sahibi olmaya ve
              hizmetlere ilişkin “Tüzgen Group” tarafından açıklanan her türlü
              beyana uygun davranacağını kabul ve taahhüt etmektedir.
            </p>

            {/* 4. Hesap Şartları */}
            <h3 className="text-xl font-semibold">4. Hesap Şartları</h3>
            <p>
              4.1 "Portal"da “Hesap Sahibi” olabilmek için reşit olmak ve
              “Tüzgen Group” tarafından işbu “Hesap Sözleşmesi” kapsamında
              hesabın geçici olarak durdurulmamış veya hesabın kapatılmamış
              olması gerekmektedir.
            </p>
            <p>
              4.2 “Tüzgen Group” herhangi bir zamanda gerekçe göstermeden,
              bildirimde bulunmadan, tazminat, ceza vb. sair yükümlülüğü
              bulunmaksızın derhal yürürlüğe girecek şekilde işbu “Hesap
              Sözleşmesi”ni tek taraflı olarak feshedebilir, "Hesap Sahibi"nin
              hesabını kapatabilir veya geçici olarak durdurabilir. "Portal"da
              belirtilen kurallara aykırılık halleri, “Hesap Sahibi”nin "Tüzgen
              Group" bilgi güvenliği sistemine risk oluşturması halleri
              hesabının kapatılması veya hesabın geçici olarak durdurulma
              hallerindendir.
            </p>

            {/* 5. Tarafların Hak ve Yükümlülükleri */}
            <h3 className="text-xl font-semibold">
              5. Tarafların Hak ve Yükümlülükleri
            </h3>
            <p>
              5.1 "Hesap Sahibi"nin Hak ve Yükümlülükleri
              <br />
              5.1.1 “Hesap Sahibi", “Portal"da belirtilen kurallara, beyanlara,
              yürürlükteki tüm mevzuata ve ahlak kurallarına uygun hareket
              edeceğini, “Hesap Sözleşmesi” hükümleri ile “Portal”daki tüm şart
              ve kuralları anladığını ve onayladığını kabul ve taahhüt
              etmektedir.
              <br />
              5.1.2 "Hesap Sahibi”, “Tüzgen Group”in yürürlükteki mevzuat
              hükümleri gereğince resmi makamlara açıklama yapmakla yükümlü
              olduğu durumlarda; “Hesap Sahibi”ne ait gizli/özel/kişisel veri-özel
              nitelikli kişisel veri/ticari bilgileri resmi makamlara açıklamaya
              yetkili olduğunu, bu sebeple “Tüzgen Group”den her ne nam altında
              olursa olsun tazminat talep etmeyeceğini kabul ve taahhüt
              etmektedir. Bunun haricinde “Hesap Sahibi”nin “Portal” üzerinde
              verdiği ilanlarla ilgili olarak herhangi bir kişi ya da kurumun
              haklarının ihlal edildiği iddiası ile “Tüzgen Group”e bildirimde
              bulunması, yargı yoluna başvuracağını bildirmesi halinde; “Hesap
              Sahibi”nin kendisine bildirdiği ad-soyad bilgisini “Tüzgen Group”
              ilgili tarafa verebilir.
              <br />
              5.1.3. "Hesap Sahibi”nin, “Tüzgen Group Hesabı”na girişte kullandığı
              "kullanıcı adı" ve "şifre"nin güvenliğini sağlamak kendi
              sorumluluğundadır.
              <br />
              5.1.4. "Hesap Sahibi", "Portal" dahilinde kendisi tarafından
              sağlanan bilgilerin ve içeriklerin doğru ve hukuka uygun olduğunu,
              söz konusu bilgi ve içeriklerin "Portal" üzerinde yayınlanmasının
              yürürlükteki mevzuata aykırılık teşkil etmeyeceğini kabul ve
              taahhüt eder.
              <br />
              5.1.5. "Hesap Sahibi", "Tüzgen Group"in yazılı onayı olmadan işbu
              “Hesap Sözleşmesi”ni veya bu “Hesap Sözleşmesi”nin kapsamındaki
              hak ve yükümlülüklerini kısmen veya tamamen herhangi bir üçüncü
              kişiye devredemez.
              <br />
              5.1.6. “Hesap Sahibi” hukuka uygun amaçlarla "Portal" üzerinde işlem
              yapabilir. Sorumluluk kendisine aittir.
              <br />
              5.1.7. “Tüzgen Group”, “Hesap Sahibi”nin sadece ilgili ilanların
              içeriklerini öğrenme amacıyla ilanları görüntülemesine ve “Tüzgen
              Group Arayüzü”nü kullanmasına izin vermekte olup, bunun dışında
              veri tabanının bütününe yönelik erişim/kopyalama yasaktır.
              <br />
              5.1.8. “Hesap Sahibi”, üçüncü şahıslardan aldığı mal ve
              hizmetlerdeki ayıplarla ilgili “Tüzgen Group”in herhangi bir
              sorumluluğu bulunmadığını kabul ve taahhüt eder.
              <br />
              5.1.9. “Hesap Sahibi”, Hesap oluşturma aşamasında sunduğu
              bilgilerin değişmesi halinde; yeni ve güncel bilgileri “Tüzgen
              Group”e gecikmeksizin bildirmekle yükümlüdür.
              <br />
              5.1.10. “Hesap Sahibi”nin “Portal” veya “Tüzgen Group”
              sistemlerinin güvenliğini tehdit edebilecek eylemlerde bulunması
              kesinlikle yasaktır.
            </p>

            <p>
              5.2. "Tüzgen Group"in Hak ve Yükümlülükleri
              <br />
              5.2.1. "Tüzgen Group", işbu “Hesap Sözleşmesi”nde bahsi geçen
              hizmetleri; ilgili hizmetlerin sunumuyla ilgili "Tüzgen Group
              Hesabı" içerisinde belirtilen açıklamalar ve işbu “Hesap
              Sözleşmesi”nde belirtilen koşullar dâhilinde yerine getirmeyi
              kabul eder. Ancak bu, sınırsız bir hizmet taahhüdü anlamına
              gelmemektedir.
              <br />
              5.2.2. "Tüzgen Group", "Portal"da sunulan hizmetleri ve içerikleri
              her zaman değiştirebilme; "Hesap Sahibi”nin sisteme yüklediği
              bilgileri ve içerikleri "Portal" kullanıcıları da dâhil olmak
              üzere üçüncü kişilerin erişimine kapatabilme ve silme hakkını
              saklı tutar.
              <br />
              5.2.3. "Portal" üzerinden, başka internet sitelerine link
              verilebilir. Linkin yöneldiği sitenin içeriğinden "Tüzgen Group"
              sorumlu değildir.
              <br />
              5.2.4. "Tüzgen Group", "Portal"ın işleyişine, hukuka, mevzuata,
              başkalarının haklarına veya işbu “Hesap Sözleşmesi” koşullarına
              aykırı mesajları ve içerikleri erişimden kaldırabilir; bu
              içerikleri giren "Hesap Sahibi"nin hesabına da son verebilir.
              <br />
              5.2.5. "Tüzgen Group"in, "Tüzgen Group" çalışanlarının ve
              yöneticilerinin, “Portal”da “Hesap Sahibi” ve “Kullanıcı”lar
              tarafından sağlanan içeriklerin hukuka uygun olup olmadığını
              araştırma yükümlülüğü yoktur.
              <br />
              5.2.6. "Tüzgen Group", 5651 sayılı kanun kapsamında "Yer Sağlayıcı"
              olarak faaliyet göstermektedir. Herhangi bir şekilde ilan
              içeriklerinin doğruluğunu garanti etmez.
              <br />
              5.2.7. ”Tüzgen Group” Portal’ı ve “Hizmetler”i; “Olduğu Gibi”
              sağlamakta olup, hatasız veya “Hesap Sahibi”nin özel ihtiyaçlarını
              tam karşılayacağına dair bir taahhütte bulunmamaktadır.
              <br />
              5.2.8. “Tüzgen Group”, hesap oluşturma başvurularını ve mevcut
              hesapları inceleyerek gerekirse kapatma yetkisine sahiptir.
            </p>

            {/* 6. Gizlilik Politikası */}
            <h3 className="text-xl font-semibold">6. Gizlilik Politikası</h3>
            <p>
              6.1 “Tüzgen Group”, "Portal"da "Hesap Sahibi” ile ilgili bilgileri;
              işbu “Hesap Sözleşmesi” ve işbu “Hesap Sözleşmesi”nin eklerinin
              biri ve ayrılmaz parçası olan EK-2’teki Gizlilik Politikası
              kapsamında kullanabilir.
              <br />
              6.2. “Tüzgen Group”, yürürlükte bulunan mevzuata uygun olarak ve
              gerektiğinde ek onayları alarak kişisel verileri tanıtım,
              pazarlama vb. amaçlarla kullanabilir ve iş ortaklarına
              aktarabilir.
              <br />
              6.3."Hesap Sahibi”nin kişisel veri teşkil edebilecek bilgileri
              “Tüzgen Group” tarafından “Hesap Sözleşmesi” kapsamında işlenir.
              <br />
              6.4. ”Hesap Sahibi”, “Portal” dahilinde eriştiği bilgileri; bu
              bilgileri ifşa eden “Hesap Sahibi”nin veya "Tüzgen Group"in ifşa
              ettiği amaçlara uygun olarak kullanmakla yükümlüdür.
              <br />
              6.5. “Hesap Sahibi” bir Avrupa Birliği mukimi gerçek kişi ise,
              kendi kişisel verileri ile ilgili olarak GDPR’nin uygulanmayacağını
              ve Türk hukukuna tabi olacağını kabul eder.
              <br />
              6.6. “Hesap Sahibi”nin hesabı ve/veya ilanları nedeniyle
              alenileşen verilerle ilgili “Tüzgen Group”in bir sorumluluğu
              bulunmamaktadır.
              <br />
              6.7. “Hesap Sahibi” özel nitelikli kişisel verilerini ifşa
              etmemeyi, eder ise bundan doğan sonuçlardan kendisinin
              sorumlu olduğunu kabul eder.
            </p>

            {/* 7. Fikri Mülkiyet Hakları */}
            <h3 className="text-xl font-semibold">
              7. Fikri Mülkiyet Hakları
            </h3>
            <p>
              “Portal” dahilinde erişilen veya hukuka uygun olarak kullanıcılar
              tarafından sağlanan bilgiler ve bu “Portal”ın tüm elemanları
              (“Tüzgen Group”in telif haklarına tabi çalışmaları) “Tüzgen Group”
              aittir ve/veya “Tüzgen Group” tarafından üçüncü bir kişiden lisans
              altında alınmıştır. “Hesap Sahibi”, “Tüzgen Group”in hizmetlerini
              ve telif haklarına tabi çalışmalarını satamaz, işleyemez,
              paylaşamaz, dağıtamaz, sergileyemez veya bu hakları devredemez.
            </p>

            {/* 8. Sözleşme Değişiklikleri */}
            <h3 className="text-xl font-semibold">
              8. “Hesap Sözleşmesi” Değişiklikleri
            </h3>
            <p>
              "Tüzgen Group", tamamen kendi takdirine bağlı ve tek taraflı
              olarak işbu “Hesap Sözleşmesi”ni uygun göreceği herhangi bir
              zamanda "Portal"da yayınlayarak değiştirebilir. Değişiklikler
              “Portal”da yayınlandığı tarihte geçerli olacaktır.
            </p>

            {/* 9. Mücbir Sebepler */}
            <h3 className="text-xl font-semibold">9. Mücbir Sebepler</h3>
            <p>
              Hukuken mücbir sebep sayılan tüm durumlarda, "Tüzgen Group" işbu
              “Hesap Sözleşmesi” ile belirlenen edimlerinden herhangi birini geç
              veya eksik ifa etme veya ifa etmeme nedeniyle sorumlu değildir.
            </p>

            {/* 10. Uygulanacak Hukuk ve Yetki */}
            <h3 className="text-xl font-semibold">
              10. Uygulanacak Hukuk ve Yetki
            </h3>
            <p>
              İşbu “Hesap Sözleşmesi”nden doğan veya doğabilecek her türlü
              ihtilafın hallinde İstanbul Merkez (Çağlayan) Mahkemeleri ve İcra
              Daireleri yetkilidir.
            </p>

            {/* 11. Yürürlük */}
            <h3 className="text-xl font-semibold">11. Yürürlük</h3>
            <p>
              İşbu “Hesap Sözleşmesi” ve “Hesap Sözleşmesi”yle atıfta bulunulan
              ve “Hesap Sözleşmesi”nin ayrılmaz bir parçası olan ekler ile
              “Portal”da yer alan kurallar ve şartlar, "Hesap Sahibi"nin
              elektronik olarak onay vermesi ile elektronik ortamda akdedilerek
              yürürlüğe girmiştir.
            </p>

            {/* 12. Ekler */}
            <h3 className="text-xl font-semibold">12. “Hesap Sözleşmesi”nin Ekleri</h3>
            <p>
              12.1 “Hesap Sahibi”, “Portal”da yayınlanan şartlar ve kuralların,
              işbu “Hesap Sözleşmesi”nin eki ve ayrılmaz olduğunu, içeriklerini
              okuyup anladığını, “Hesap Sahibi” olarak “Hesap Sözleşmesi” ile
              eklerine” ve “Portal”da yayınlanan şartlarla kurallara uygun
              davranacağını kayıtsız ve şartsız olarak kabul ettiğini beyan ve
              taahhüt etmektedir.
            </p>

            {/* Fotoğraf (placeholder) */}
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

export default HesapSozlesmesiPage;
