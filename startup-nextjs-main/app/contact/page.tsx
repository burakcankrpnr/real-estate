import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Emlak Platformu",
  description: "Emlak platformumuza dair tüm sorularınız ve ihtiyaçlarınız için bizimle iletişime geçin.",
  // diğer meta veriler
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="İletişim"
        description="Emlak işlemleriniz, mülk alım-satım ve kiralama hakkında her türlü sorunuz için bizimle iletişime geçebilirsiniz. Size yardımcı olmak için buradayız."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
