import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="wow fadeInUp relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/about/about-image-2.svg"
                alt="about image"
                fill
                className="drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
  src="/images/about/about-image-2-dark.svg"
  alt="about image"
  fill
  className="drop-shadow-three hidden dark:block dark:drop-shadow-none object-scale-down"
/>

            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
  <div className="wow fadeInUp max-w-[470px]" data-wow-delay=".2s">
    {/* Patron Bilgisi */}
    <div className="mb-9">
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
       Ofis Direktörümüz 
      </h3>
      <div className="flex items-center mb-4">
      <div className="w-128 h-128 rounded-full overflow-hidden relative">
  <Image
    src="/images/burakkucuktuzgen.jpg"
    alt="Burak Küçüktüzgen"
    width={128}
    height={128}
    className="rounded-full object-cover"
  />

        </div>
        <div className="ml-4">
          <p className="text-base font-medium text-body-color">Burak Küçüktüzgen</p>
          <p className="text-sm text-body-color">Emlak sektöründeki 10 yılı aşkın tecrübesiyle, müşterilerimize en iyi hizmeti sunmayı hedefliyoruz.</p>
        </div>
      </div>
    </div>

    {/* Ekibimizle Tanışın */}
    <div className="mb-9">
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
        Ekibimizle Tanışın!
      </h3>
      <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
        Ekibimiz, müşterilerimizin ihtiyaçlarını karşılamak için burada. Bizler, her biri kendi alanında uzmanlaşmış profesyonelleriz ve sizlere en iyi hizmeti sunmak için buradayız.
      </p>
    </div>

    {/* Premier Support */}
    <div className="mb-9">
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
        Birinci Sınıf Destek
      </h3>
      <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
        Müşterilerimize en hızlı ve verimli destek sunmak için her zaman yanlarındayız. Ekip üyelerimiz her sorunuza çözüm üretmek için hazır.
      </p>
    </div>
  </div>
</div>

        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
