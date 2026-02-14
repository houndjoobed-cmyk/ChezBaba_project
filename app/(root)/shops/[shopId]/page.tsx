import { notFound } from "next/navigation";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopProductGrid from "@/components/shop/ShopProductGrid";

interface ShopPageProps {
    params: Promise<{ shopId: string }>;
}

async function getShopData(shopId: string) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/vendors/${shopId}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        return null;
    }

    const result = await response.json();
    return result.data;
}

export async function generateMetadata({ params }: ShopPageProps) {
    const { shopId } = await params;
    const shop = await getShopData(shopId);

    if (!shop) {
        return {
            title: "Boutique introuvable | CHEZ BABA",
        };
    }

    return {
        title: `${shop.nomBoutique} | CHEZ BABA`,
        description: shop.description || `Découvrez les produits de ${shop.nomBoutique} sur CHEZ BABA`,
    };
}

export default async function ShopPage({ params }: ShopPageProps) {
    const { shopId } = await params;
    const shop = await getShopData(shopId);

    if (!shop) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <ShopHeader shop={shop} />
            <ShopProductGrid vendorId={shopId} />
        </main>
    );
}
