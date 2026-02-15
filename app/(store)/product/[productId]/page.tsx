import { notFound } from "next/navigation";

// Components
import BreadcrumbProduct from "@/components/store/productpage/BreadcrumbProduct";
import ProductHero from "@/components/store/productpage/ProductHero";
import Tabs from "@/components/store/productpage/Tabs";
import LastArrivals from "@/components/store/productpage/LastArrivals";

// Types
import { ProductFromAPI } from "@/lib/types/product.types";

// Data utils
import { prisma } from "@/lib/utils/prisma";
import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import { ProductFromDB } from "@/lib/types/product.types";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  let product: ProductFromAPI | null = null;
  let newProducts: ProductFromAPI[] = [];

  try {
    const [dbProduct, dbNewProducts] = await Promise.all([
      prisma.produit.findUnique({
        where: { id: productId },
        select: getProductSelect(),
      }),
      prisma.produit.findMany({
        orderBy: { dateCreation: "desc" },
        take: 4,
        select: getProductSelect(),
      }),
    ]);

    if (!dbProduct) return notFound();

    product = formatProductData(dbProduct as ProductFromDB);
    newProducts = dbNewProducts.map((p) => formatProductData(p as ProductFromDB));
  } catch (error) {
    console.error("Error fetching product page data:", error);
    return notFound();
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct
          title={product.nom}
          genre={product.genre?.nom}
          categorie={product.categorie?.nom}
        />
        <ProductHero product={product} />
        <Tabs product={product} />
      </div>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
      </div>
      <LastArrivals products={newProducts} />
    </main>
  );
}
