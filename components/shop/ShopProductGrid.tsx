"use client";

import { useState, useEffect } from "react";
import { Loader2, PackageX, Filter } from "lucide-react";
import ProductCard from "@/components/common/ProductCard";
import { ProductFromAPI } from "@/lib/types/product.types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShopProductGridProps {
    vendorId: string;
}

const ShopProductGrid = ({ vendorId }: ShopProductGridProps) => {
    const [products, setProducts] = useState<ProductFromAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("dateCreation");

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/vendors/${vendorId}/products?page=${page}&pageSize=12&sortBy=${sortBy}&sortOrder=desc`
                );

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des produits");
                }

                const result = await response.json();
                setProducts(result.data);
                setTotalPages(result.pagination.totalPages);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur est survenue");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [vendorId, page, sortBy]);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Barre d'outils / Filtres */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Catalogue de la boutique</h2>
                    <p className="text-gray-500 mt-1.5 font-medium">Découvrez tous nos articles et exclusivités</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-3 pl-4 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 hover:border-gray-300 transition-all cursor-pointer text-sm font-semibold shadow-sm"
                        >
                            <option value="dateCreation">Nouveautés</option>
                            <option value="prix">Prix</option>
                            <option value="noteMoyenne">Mieux notés</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 group-hover:text-gray-600 transition-colors">
                            <Filter className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-32"
                    >
                        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
                        <span className="text-gray-500 font-medium">Préparation du catalogue...</span>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-red-50 rounded-3xl border border-red-100"
                    >
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 text-sm font-bold underline hover:no-underline"
                        >
                            Réessayer
                        </button>
                    </motion.div>
                ) : products.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 text-gray-400 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 bg-white p-6 rounded-3xl shadow-sm mb-6 ring-1 ring-gray-100">
                            <PackageX className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="relative z-10 text-2xl font-bold text-gray-900 tracking-tight">Aucun produit trouvé</p>
                        <p className="relative z-10 max-w-sm text-center mt-3 text-gray-500 text-sm">Cette boutique n&apos;a pas encore de produits disponibles dans cette catégorie ou selon ces filtres.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-12"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ProductCard data={product} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination Design Premium */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 pt-12">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-all duration-300 shadow-sm active:scale-95"
                                >
                                    &larr;
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={cn(
                                            "w-12 h-12 flex items-center justify-center rounded-2xl font-bold transition-all duration-300 active:scale-95 text-sm",
                                            page === i + 1
                                                ? "bg-black text-white shadow-lg shadow-black/20"
                                                : "bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 shadow-sm"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-all duration-300 shadow-sm active:scale-95"
                                >
                                    &rarr;
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ShopProductGrid;
