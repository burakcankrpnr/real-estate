import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reklam | Tüzgen Group",
  description: "Web sitemizde reklam vermek için bizimle iletişime geçmeniz yeterlidir.",
};

const ReklamPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Reklam"
        description="Web sitemizde reklam vermek için bizimle iletişime geçmeniz yeterlidir."
      />

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center text-base leading-relaxed text-body-color dark:text-body-color-dark">
            <p>
            Hedef kitlenize hızlıca ulaşmak ve markanızı ön plana çıkarmak için bize{" "}
            </p>
            <p className="mt-4">
              <a
                href="/contact"
                className="text-primary underline hover:text-opacity-80"
              >
                iletişim sayfamızdan
              </a>{" "}
              ulaşabilirsiniz.
            </p>
          </div>
        </div><img
            src="/images/logov1.jpg "
            alt="Sözleşme ve Kurallar Görseli"
            className="mx-auto mt-8"
          />
      </section>
    </>
  );
};

export default ReklamPage;
