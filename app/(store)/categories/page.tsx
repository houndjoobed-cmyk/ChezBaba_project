"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowLeft } from "lucide-react";
import categories from "@/lib/data/categories";

const CategoriesPage = () => {
    return (
        <div className="ctg-categories-page min-h-screen bg-light-gray pb-20">
            {/* Header Section - Minimalist Redesign (Pure White) */}
            <div className="bg-white pt-8 pb-3 md:pt-10 md:pb-16 px-4 border-b border-gray-100 mb-4 md:mb-12">
                <div className="max-w-frame mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center text-[#0C1B33] hover:text-[#bdfe00] mb-6 md:mb-10 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full border border-[#0C1B33]/20 flex items-center justify-center mr-3 group-hover:border-[#0C1B33] transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-medium tracking-wide text-[#0C1B33]">Retour à l&apos;accueil</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-4">
                        <div className="max-w-3xl hidden md:block">
                            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-[#0C1B33] mb-4 md:mb-6 tracking-tighter leading-none">
                                Nos <span style={{ color: 'var(--primary-color)' }}>Catégories</span>
                            </h1>
                            <p className="text-gray-600 text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed font-normal">
                                Explorez notre large sélection de produits classés par univers.
                                Trouvez exactement ce que vous cherchez chez <span className="text-[#0C1B33] font-bold">Chez Baba</span>.
                            </p>
                        </div>

                        <div className="hidden lg:block">
                            <div className="h-1 w-32 bg-[#0C1B33] rounded-full mb-4"></div>
                            <p className="text-[#0C1B33] font-mono text-sm tracking-widest uppercase italic opacity-70">Plus de 1000 produits</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-frame mx-auto px-4">
                <div className="ctg-category-grid">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/catalog?category=${category.id}`}
                            className="ctg-category-card"
                        >
                            <div className="ctg-card-image">
                                <Image
                                    src={category.img || "/images/placeholder.png"}
                                    alt={category.nom}
                                    width={400}
                                    height={300}
                                />
                                <span className="ctg-product-count">{category.count} Produits</span>
                            </div>
                            <div className="ctg-card-info">
                                <h3 className="text-2xl font-bold">{category.nom}</h3>
                                <p className="text-gray-600">{category.description}</p>
                                <div className="ctg-card-footer mt-4 flex items-center justify-between">
                                    <div className="ctg-price-range"></div>
                                    <div className="ctg-explore-btn inline-flex items-center">
                                        <ChevronRight size={20} className="text-secondary-color" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Aesthetic Background Elements */}
            <div className="fixed top-0 right-0 -z-10 opacity-5 pointer-events-none">
                <div className="w-[500px] h-[500px] bg-primary-color rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            </div>
        </div>
    );
};

export default CategoriesPage;
