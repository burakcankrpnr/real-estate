import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doping | Tüzgen Group",
  description:
    "tuzgengroup.com doping hizmetleri ile ilanlarınızı öne çıkarın, daha hızlı alıcıya ulaşın.",
};

const DopingPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Doping"
        description="İlanlarını öne çıkararak daha geniş kitlelere ulaş!"
      />

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl text-body-color dark:text-body-color-dark space-y-6 text-base leading-relaxed">
            <h2 className="text-2xl font-semibold">Tüzgen Group Doping</h2>
            <p>
              tuzgengroup.com dopingleri, ilanlarınızı ön plana çıkararak benzerlerinden ayrıştıran özel tanıtım araçlarıdır. Bu sayede ilanlarınız, daha geniş bir kitleye ulaşır ve çok daha fazla kişi tarafından görüntülenir.
            </p>
            <p>
              Doping seçenekleri, ilanınızın görünürlüğünü artırarak alıcılara daha hızlı ulaşmanızı sağlar. Böylece, satılık ya da kiralık ilanlarınız kısa sürede daha fazla ilgi görür ve hedefinize çok daha hızlı ulaşırsınız.
            </p>
            <p>
              Eğer ilanlarınızın daha fazla kişiye erişmesini ve rakip ilanlar arasından sıyrılmasını istiyorsanız, <strong>tuzgengroup.com dopingleri</strong> tam size göre!
            </p>
          </div>
          
        </div>
        <img
            src="/images/logov1.jpg "
            alt="Sözleşme ve Kurallar Görseli"
            className="mx-auto"
          />
      </section>
    </>
  );
};

export default DopingPage;
