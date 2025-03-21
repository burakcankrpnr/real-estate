import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | Tüzgen Group",
  description: "Emlak platformumuz hakkında daha fazla bilgi edinin. Emlak işlemleri, mülk alım-satım ve kiralama hakkında her türlü sorunuz için bizimle iletişime geçebilirsiniz.",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Hakkımızda"
        description="Emlak platformumuz hakkında daha fazla bilgi edinin. Emlak işlemleri, mülk alım-satım ve kiralama hakkında her türlü sorunuz için bizimle iletişime geçebilirsiniz."
      />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
