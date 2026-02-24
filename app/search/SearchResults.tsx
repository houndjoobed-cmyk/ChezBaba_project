"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductFromAPI } from "@/lib/types/product.types";
import ProductCard from "@/components/common/ProductCard";
import { Loader2, PackageSearch, FilterX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");

    const [products, setProducts] = useState<ProductFromAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/products?q=${encodeURIComponent(query)}&page=1&pageSize=48`);

                if (!response.ok) {
                    throw new Error("Erreur lors de la recherche.");
                }

                const result = await response.json();
                setProducts(result.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur est survenue.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (!query) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-[40vh] text-center">
                <div className="bg-white p-6 rounded-full shadow-sm mb-6 ring-1 ring-gray-100 placeholder-glow">
                    <PackageSearch className="w-12 h-12 text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Recherche de produits</h1>
                <p className="text-gray-500">Utilisez la barre de recherche ci-dessus pour trouver ce que vous cherchez.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Résultats pour &quot;<span className="text-primary">{query}</span>&quot;
                </h1>
                <p className="text-gray-500 mt-2 font-medium">
                    {isLoading ? (
                        "Recherche en cours..."
                    ) : (
                        `${products.length} produit${products.length !== 1 ? 's' : ''} trouvé${products.length !== 1 ? 's' : ''}`
                    )}
                </p>
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-24"
                    >
                        <Loader2 className="w-12 h-12 animate-spin text-black mb-4" />
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100"
                    >
                        <p className="font-semibold">{error}</p>
                    </motion.div>
                ) : products.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-gray-100 shadow-sm text-center px-4"
                    >
                        <div className="bg-gray-50 p-6 rounded-full mb-6">
                            <FilterX className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h2>
                        <p className="text-gray-500 max-w-md">
                            Nous n&apos;avons trouvé aucun produit correspondant à &quot;{query}&quot;.
                            Essayez de vérifier l&apos;orthographe ou d&apos;utiliser des termes plus génériques.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ProductCard data={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
