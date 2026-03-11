// Components
import HeroSec from "@/components/store/homepage/HeroSec";
import ProductsSec from "@/components/store/homepage/ProductsSec";
import TestimonialsSec from "@/components/store/homepage/TestimonialsSec";
import NewsLetterSection from "@/components/store/homepage/NewsLetterSecc";

// Data & Prisma
import { testimonialsData } from "@/lib/data";
import { prisma } from "@/lib/utils/prisma";
import { ReviewFromAPI } from "@/lib/types/review.types";
import { UserRole } from "@prisma/client";

// Helpers
import { formatReviewData, getReviewSelect } from "@/lib/helpers/reviews";
import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import { ProductFromAPI, ProductFromDB } from "@/lib/types/product.types";
import { ReviewFromDB } from "@/lib/types/review.types";

export default async function HomePage() {
  let displayTestimonials: ReviewFromAPI[] = [];
  let shopProducts: ProductFromAPI[] = [];
  let marketplaceProducts: ProductFromAPI[] = [];



  try {
    const [dbTestimonials, dbEvaluations, dbShopProducts, dbMarketplaceProducts] =
      await Promise.all([
        prisma.temoignage.findMany({
          orderBy: { date: "desc" },
        }),
        prisma.evaluation.findMany({
          select: getReviewSelect(),
          orderBy: { date: "desc" },
          take: 10,
        }),
        prisma.produit.findMany({
          where: {
            produitBoutique: { isNot: null },
          },
          select: getProductSelect(),
          orderBy: { noteMoyenne: "desc" },
          take: 4,
        }),
        prisma.produit.findMany({
          where: {
            produitMarketplace: { isNot: null },
          },
          select: getProductSelect(),
          orderBy: { noteMoyenne: "desc" },
          take: 4,
        }),
      ]);

    const formattedTestimonials: ReviewFromAPI[] = dbTestimonials.map((t) => ({
      id: t.id,
      note: t.note,
      text: t.texte,
      date: new Date(t.date),
      produitId: "",
      user: {
        id: t.id,
        nom: t.nom,
        prenom: t.prenom,
        imagePublicId: t.imagePublicId,
        role: UserRole.CLIENT,
      },
      reponses: [],
    }));

    const formattedEvaluations: ReviewFromAPI[] = dbEvaluations.map((e) =>
      formatReviewData(e as ReviewFromDB)
    );

    displayTestimonials = [
      ...formattedTestimonials,
      ...formattedEvaluations,
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    if (displayTestimonials.length === 0) {
      displayTestimonials = testimonialsData;
    }

    // Format products
    shopProducts = dbShopProducts.map((p) => formatProductData(p as ProductFromDB));
    marketplaceProducts = dbMarketplaceProducts.map((p) =>
      formatProductData(p as ProductFromDB)
    );
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    displayTestimonials = testimonialsData;
  }

  return (
    <main>
      <HeroSec />
      <ProductsSec
        shopProducts={shopProducts}
        marketplaceProducts={marketplaceProducts}
      />
      <TestimonialsSec data={displayTestimonials} />
      <NewsLetterSection />
    </main>
  );
}
