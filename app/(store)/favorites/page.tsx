"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";
import { ProductFromAPI } from "@/lib/types/product.types";
import { FiHeart, FiShoppingBag } from "react-icons/fi";

export default function FavoritesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [favorites, setFavorites] = useState<ProductFromAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFavorites = useCallback(async () => {
        if (!session?.user?.id) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/${session.user.id}/favorites`);
            if (response.ok) {
                const data = await response.json();
                setFavorites(data.data || []);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des favoris:", error);
        } finally {
            setIsLoading(false);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=/favorites");
            return;
        }

        if (status === "authenticated" && session?.user?.id) {
            fetchFavorites();
        }
    }, [status, session?.user?.id, router, fetchFavorites]);

    // Loading state
    if (status === "loading" || isLoading) {
        return (
            <main className="py-10">
                <div className="max-w-frame mx-auto px-4 xl:px-0">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                        <FiHeart className="text-red-500" />
                        Mes Favoris
                    </h1>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-100 rounded-[20px] aspect-square animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    // Empty state
    if (favorites.length === 0) {
        return (
            <main className="py-10">
                <div className="max-w-frame mx-auto px-4 xl:px-0">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                        <FiHeart className="text-red-500" />
                        Mes Favoris
                    </h1>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FiHeart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Aucun favori pour le moment
                        </h2>
                        <p className="text-gray-500 mb-6 max-w-md">
                            Explorez notre catalogue et ajoutez vos produits préférés à vos
                            favoris en cliquant sur le cœur.
                        </p>
                        <Link
                            href="/catalog"
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                        >
                            <FiShoppingBag />
                            Explorer le catalogue
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Favorites list
    return (
        <main className="py-10">
            <div className="max-w-frame mx-auto px-4 xl:px-0">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                        <FiHeart className="text-red-500" />
                        Mes Favoris
                    </h1>
                    <span className="text-gray-500">
                        {favorites.length} produit{favorites.length > 1 ? "s" : ""}
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {favorites.map((product) => (
                        <ProductCard key={product.id} data={product} />
                    ))}
                </div>
            </div>
        </main>
    );
}
