import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import Link from "next/link";
import { Property } from "@/types/property";

export const metadata: Metadata = {
  title: "Kiralık Apartman Dairesi İlanları | Tüzgen Group",
  description: "Kiralık apartman dairesi ilanlarını inceleyebilir, konut kiralama fırsatlarını değerlendirebilirsiniz.",
};

async function getProperties() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties?category=konut&status=kiralik&type=apartman-dairesi&limit=24`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error("İlanlar yüklenirken bir hata oluştu");
    }
    
    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error("İlanları getirme hatası:", error);
    return [];
  }
}

export default async function KiralikApartmanDairesiPage() {
  const properties: Property[] = await getProperties();

  return (
    <>
      <Breadcrumb
        pageName="Kiralık Apartman Dairesi İlanları"
        description="Kiralık apartman dairesi ilanlarını inceleyin ve konut kiralama fırsatlarını değerlendirin."
      />

      <section className="pt-[80px] pb-[120px]">
        <div className="container">
          <div className="flex flex-wrap justify-between">
            <div className="mb-8 w-full">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Kiralık Apartman Dairesi İlanları
              </h2>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="flex h-60 w-full items-center justify-center rounded-md bg-gray-50 dark:bg-gray-800">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Aradığınız kriterlere uygun ilan bulunamadı
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="overflow-hidden rounded-lg bg-white shadow-1 duration-300 hover:shadow-3 dark:bg-dark-2 dark:shadow-card dark:hover:shadow-3"
                >
                  <Link href={`/ilan/${property.slug}`} className="relative block h-[240px] w-full">
                    <img
                      src={property.images?.[0] || "/images/placeholder.jpg"}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 inline-block rounded bg-primary px-3 py-1 text-xs font-semibold text-white">
                      {property.status === "satilik" ? "Satılık" : "Kiralık"}
                    </span>
                  </Link>
                  <div className="p-6">
                    <h3>
                      <Link
                        href={`/ilan/${property.slug}`}
                        className="mb-3 block text-xl font-semibold text-black hover:text-primary dark:text-white dark:hover:text-primary"
                      >
                        {property.title}
                      </Link>
                    </h3>
                    <p className="mb-5 text-base font-medium text-body-color">
                      {property.address?.city}, {property.address?.district}
                    </p>
                    <div className="border-b border-body-color border-opacity-10 pb-5 dark:border-white dark:border-opacity-10">
                      <div className="flex flex-wrap justify-between">
                        <span className="mb-2 mr-2 flex items-center text-base font-medium text-body-color">
                          <span className="mr-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.6667 5.83333V2.33333C12.6667 1.87333 12.2934 1.5 11.8334 1.5H11V2.33333C11 2.79333 10.6267 3.16667 10.1667 3.16667C9.70668 3.16667 9.33334 2.79333 9.33334 2.33333V1.5H4.66668V2.33333C4.66668 2.79333 4.29334 3.16667 3.83334 3.16667C3.37334 3.16667 3.00001 2.79333 3.00001 2.33333V1.5H2.16668C1.70668 1.5 1.33334 1.87333 1.33334 2.33333V5.83333H12.6667ZM1.33334 11.6667C1.33334 12.1267 1.70668 12.5 2.16668 12.5H11.8334C12.2934 12.5 12.6667 12.1267 12.6667 11.6667V6.66667H1.33334V11.6667ZM4.66668 0.666666C4.66668 0.206666 4.29334 -0.166668 3.83334 -0.166668C3.37334 -0.166668 3.00001 0.206666 3.00001 0.666666V1.5H2.16668C1.24668 1.5 0.500008 2.24667 0.500008 3.16667V11.6667C0.500008 12.5867 1.24668 13.3333 2.16668 13.3333H11.8334C12.7534 13.3333 13.5 12.5867 13.5 11.6667V3.16667C13.5 2.24667 12.7534 1.5 11.8334 1.5H11V0.666666C11 0.206666 10.6267 -0.166668 10.1667 -0.166668C9.70668 -0.166668 9.33334 0.206666 9.33334 0.666666V1.5H4.66668V0.666666Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                          {new Date(property.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                        <span className="mb-2 flex items-center text-base font-medium text-body-color">
                          <span className="mr-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5 10.5C10.5 10.9033 10.3314 11.2889 10.0314 11.5889C9.73137 11.8889 9.34572 12.0575 8.94238 12.0575C8.53904 12.0575 8.15339 11.8889 7.85338 11.5889C7.55337 11.2889 7.38477 10.9033 7.38477 10.5C7.38477 10.0966 7.55337 9.71101 7.85338 9.41101C8.15339 9.111 8.53904 8.94239 8.94238 8.94239C9.34572 8.94239 9.73137 9.111 10.0314 9.41101C10.3314 9.71101 10.5 10.0966 10.5 10.5ZM3.5 4.66667C3.5 5.07001 3.33139 5.45566 3.03139 5.75566C2.73138 6.05567 2.34573 6.22428 1.94239 6.22428C1.53905 6.22428 1.1534 6.05567 0.853395 5.75566C0.55339 5.45566 0.384781 5.07001 0.384781 4.66667C0.384781 4.26333 0.55339 3.87768 0.853395 3.57767C1.1534 3.27767 1.53905 3.10906 1.94239 3.10906C2.34573 3.10906 2.73138 3.27767 3.03139 3.57767C3.33139 3.87768 3.5 4.26333 3.5 4.66667ZM12.0576 1.94239C12.0576 2.34573 11.889 2.73138 11.589 3.03139C11.289 3.33139 10.9033 3.5 10.5 3.5C10.0967 3.5 9.71103 3.33139 9.41103 3.03139C9.11102 2.73138 8.94241 2.34573 8.94241 1.94239C8.94241 1.53905 9.11102 1.1534 9.41103 0.853394C9.71103 0.553389 10.0967 0.38478 10.5 0.38478C10.9033 0.38478 11.289 0.553389 11.589 0.853394C11.889 1.1534 12.0576 1.53905 12.0576 1.94239Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                          {property.area ? `${property.area} m²` : "Belirtilmemiş"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <h4 className="text-xl font-semibold text-dark dark:text-white">
                        {property.price?.toLocaleString("tr-TR")} ₺
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
} 