"use client";

import Image from "next/image";
import { Star, Package, MessageCircle, Calendar, ShieldCheck, Share2 } from "lucide-react";
import { getImageUrlFromPublicId } from "@/lib/utils";
import { satoshi } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ShopHeaderProps {
    shop: {
        id: string;
        nomBoutique: string;
        description: string | null;
        imagePublicId: string | null;
        proprietaire: {
            nom: string;
            prenom: string;
        };
        dateCreation: string;
        stats: {
            totalProduits: number;
            noteMoyenne: number;
            totalAvis: number;
        };
    };
}

const ShopHeader = ({ shop }: ShopHeaderProps) => {
    const memberSince = new Date(shop.dateCreation).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
    });

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: shop.nomBoutique,
                    text: shop.description || `Découvrez la boutique ${shop.nomBoutique} sur CHEZ BABA`,
                    url: url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success("Lien de la boutique copié !");
            }
        } catch (error) {
            console.error("Error sharing:", error);
            // Fallback to clipboard if share fails or is cancelled
            await navigator.clipboard.writeText(url);
            toast.success("Lien de la boutique copié !");
        }
    };

    return (
        <section className="bg-white dark:bg-slate-950 relative">
            {/* Banner Section */}
            <div className="relative h-64 md:h-96 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black">
                    <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.png')] bg-repeat" />
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>
                {/* Smooth Gradient Fade at the bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
            </div>

            {/* Profile Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 -mt-24 md:-mt-32">
                    {/* Logo - Overlapping Banner */}
                    <div className="relative shrink-0 flex flex-row items-start gap-3 mx-auto md:mx-0">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-32 h-32 md:w-48 md:h-48 rounded-3xl ring-4 ring-white dark:ring-slate-950 shadow-2xl overflow-hidden bg-white relative z-10"
                        >
                            <Image
                                src={
                                    shop.imagePublicId
                                        ? getImageUrlFromPublicId(shop.imagePublicId)
                                        : "/icons/user.svg"
                                }
                                alt={shop.nomBoutique}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 pt-2 md:pt-24 pb-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h1 className={cn(satoshi.className, "text-3xl md:text-4xl text-gray-900 dark:text-white mb-2 text-center md:text-left")}>
                                    {shop.nomBoutique}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 rounded-full text-sm font-semibold ring-1 ring-green-200 dark:ring-green-500/20 shadow-sm">
                                        <ShieldCheck className="w-4 h-4" />
                                        Vendeur Vérifié
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-3 py-1 rounded-full">
                                        <Calendar className="w-4 h-4" />
                                        Depuis {memberSince}
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={handleShare}
                                variant="outline"
                                className="w-full md:w-auto gap-2 rounded-2xl border-gray-200 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-900 shadow-sm hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                            >
                                <Share2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                <span className="font-semibold">Partager la boutique</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Description */}
                            <div className="lg:col-span-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">À propos</h3>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                                    <div className={cn("relative transition-all duration-300", !isDescriptionExpanded && "max-h-[120px] overflow-hidden")}>
                                        <p className="whitespace-pre-line">
                                            {shop.description || "Une boutique passionnée par la mode et la qualité sur CHEZ BABA. Découvrez nos produits exclusifs et profitez de nos offres exceptionnelles."}
                                        </p>
                                        {!isDescriptionExpanded && (shop.description?.length || 0) > 200 && (
                                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
                                        )}
                                    </div>
                                    {(shop.description?.length || 0) > 200 && (
                                        <button
                                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                            className="mt-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                                        >
                                            {isDescriptionExpanded ? "Voir moins" : "Lire la suite"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-3 md:gap-4 lg:grid-cols-3 lg:col-span-3">
                                <div className="bg-gray-50/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-slate-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <div className="mb-3 p-2.5 bg-blue-100/50 dark:bg-blue-500/10 text-blue-600 rounded-full">
                                        <Package className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{shop.stats.totalProduits}</span>
                                    <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Produits</span>
                                </div>
                                <div className="bg-gray-50/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-slate-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <div className="mb-3 p-2.5 bg-yellow-100/50 dark:bg-yellow-500/10 text-yellow-600 rounded-full">
                                        <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                                    </div>
                                    <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{shop.stats.noteMoyenne.toFixed(1)}<span className="text-sm font-medium text-gray-400">/5</span></span>
                                    <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Note</span>
                                </div>
                                <div className="bg-gray-50/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-slate-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <div className="mb-3 p-2.5 bg-purple-100/50 dark:bg-purple-500/10 text-purple-600 rounded-full">
                                        <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{shop.stats.totalAvis}</span>
                                    <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Avis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShopHeader;
