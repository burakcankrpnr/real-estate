import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import Link from "next/link";
import { Property } from "@/types/property";

export const metadata: Metadata = {
  title: "Satılık Arsa İlanları | Tüzgen Group",
  description: "Satılık arsa, konut imarlı arsa, ticari imarlı arsa ilanlarını inceleyin ve sahibiyle iletişime geçin.",
};

async function getProperties() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties?type=arsa&subtype=arsa&status=satilik&limit=12`,
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

export default async function SatilikArsaPage() {
  const properties: Property[] = await getProperties();

  return (
    <>
      <Breadcrumb
        pageName="Satılık Arsa İlanları"
        description="Yatırımlık veya konut/işyeri yapımı için arsa ilanlarını inceleyebilirsiniz."
      />

      <section className="pt-[80px] pb-[120px]">
        <div className="container">
          <div className="flex flex-wrap justify-between">
            <div className="mb-8 w-full">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Satılık Arsalar
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
                                d="M11.0866 8.96334L8.09328 11.9566C7.91328 12.1366 7.73328 12.3166 7.53995 12.4866C7.44218 12.5802 7.32266 12.6515 7.19116 12.6949C7.05967 12.7383 6.9202 12.7529 6.78162 12.7375C6.64304 12.7221 6.50966 12.6772 6.39056 12.6054C6.27146 12.5337 6.16964 12.4368 6.08995 12.32C5.99995 12.19 5.87995 12.075 5.74995 11.9566L2.91328 9.12001C2.4566 8.66334 2.1066 8.16667 1.85994 7.64001C1.1733 6.12667 1.2733 4.35334 2.14663 2.94001C2.54663 2.31334 3.07994 1.78001 3.69328 1.38001C5.10661 0.506673 6.87994 0.406673 8.3933 1.09334C8.91997 1.34001 9.41664 1.69001 9.87331 2.14667L11.0866 3.36001C11.7933 4.06667 11.7933 5.21334 11.0866 5.92001C10.38 6.62667 9.23331 6.62667 8.52664 5.92001L7.43998 4.83334C7.32903 4.71993 7.18016 4.65523 7.02498 4.65301C6.8698 4.65078 6.71935 4.71119 6.60581 4.82151C6.49227 4.93182 6.42754 5.08074 6.42529 5.2359C6.42304 5.39107 6.48347 5.54156 6.58998 5.65667L7.67664 6.74334C8.91997 7.98667 10.9733 7.72001 11.9533 6.19334C12.842 4.78667 12.713 2.85334 11.6 1.74667L10.3866 0.533339C9.84994 0.0066724 9.25328 -0.406661 8.61327 -0.686661C6.73327 -1.49999 4.5733 -1.37332 2.81327 0.146673C2.0866 0.600006 1.46663 1.21998 0.999966 1.94667C-0.520034 3.70667 -0.646701 6.28 0.726632 8.19334C1.0133 8.83334 1.42664 9.43 1.95331 9.95334L4.78997 12.79C4.90664 12.9067 5.01998 13.0233 5.14998 13.1333C5.43784 13.392 5.81349 13.5371 6.20495 13.5371C6.59641 13.5371 6.97206 13.392 7.25992 13.1333C7.39992 13.0067 7.53329 12.88 7.66662 12.7467L10.66 9.75334C10.7671 9.64059 10.8275 9.4903 10.8275 9.33334C10.8275 9.17638 10.7671 9.02609 10.66 8.91334C10.5512 8.80039 10.4015 8.73603 10.2442 8.73603C10.0869 8.73603 9.9371 8.80039 9.82831 8.91334L6.83997 11.9C6.76622 11.9777 6.67453 12.0359 6.57265 12.0694C6.47077 12.1029 6.36177 12.1106 6.25582 12.0917C6.14988 12.0729 6.0503 12.0282 5.9663 11.9617C5.8823 11.8952 5.81637 11.8093 5.77331 11.7117C5.74687 11.6423 5.73355 11.5687 5.73399 11.4945C5.73444 11.4203 5.74863 11.3468 5.77589 11.2778C5.80315 11.2089 5.84294 11.1459 5.89321 11.0928C5.94349 11.0396 6.00324 10.9973 6.06998 10.9683L9.05997 7.98001C9.16866 7.86588 9.22949 7.71495 9.22949 7.55757C9.22949 7.4002 9.16866 7.24926 9.05997 7.13514C8.95129 7.02102 8.80056 6.96002 8.64341 6.96002C8.48626 6.96002 8.33553 7.02102 8.22685 7.13514L5.23996 10.12C5.02262 10.3429 4.90373 10.6451 4.90987 10.9574C4.91601 11.2697 5.04661 11.5668 5.27329 11.78C5.49996 12.0068 5.797 12.1375 6.10933 12.1438C6.42165 12.15 6.72385 12.0312 6.95997 11.8133L9.94995 8.82L11.0866 8.96334Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                          {property.squareMeters || 0} m²
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