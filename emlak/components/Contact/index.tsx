"use client";
import { useState } from "react";
import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("error");

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showAlert("Lütfen tüm alanları doldurun!", "error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "Mesaj gönderilemedi!", "error");
      } else {
        showAlert(data.message || "Mesajınız gönderildi!", "success");
        // Formu temizleyin
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      showAlert("Sunucu hatası oluştu!", "error");
      console.error("Mesaj gönderim hatası:", error);
    }
  };

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        {alertMessage && (
          <div className={`mb-4 rounded-md p-4 text-center text-sm font-medium ${alertType === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {alertMessage}
          </div>
        )}
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div className="shadow-three dark:bg-gray-dark mb-12 rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Yardıma mı ihtiyacınız var?
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Destek ekibimiz en kısa sürede e-posta yoluyla size geri dönüş yapacaktır.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label htmlFor="name" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        İsminiz
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="İsminizi girin"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label htmlFor="email" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        E-posta Adresiniz
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="E-posta adresinizi girin"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label htmlFor="message" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Mesajınız
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="Mesajınızı buraya yazınız"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button className="shadow-submit dark:shadow-submit-dark rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                      Bilet Gönder
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
