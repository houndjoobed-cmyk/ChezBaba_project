"use client";

import Image from "next/image";
import { Store, Star, Package, MessageCircle, Calendar, ShieldCheck, Share2 } from "lucide-react";
import { getImageUrlFromPublicId } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
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
        <section className="bg-white dark:bg-slate-950">
            {/* Banner Section */}
            <div className="relative h-48 md:h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black">
                    <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.png')] bg-repeat" />
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>
            </div>

            {/* Profile Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 -mt-20 md:-mt-24">
                    {/* Logo - Overlapping Banner */}
                    <div className="relative shrink-0 flex flex-row items-start gap-3 mx-auto md:mx-0">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-32 h-32 md:w-48 md:h-48 rounded-2xl border-4 border-white dark:border-slate-950 shadow-xl overflow-hidden bg-white relative z-10"
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
                        <div className="bg-black text-white p-2 md:p-3 rounded-xl shadow-lg border-2 border-white dark:border-slate-950 mt-2 md:mt-4 z-20">
                            <Store className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 pt-2 md:pt-24 pb-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h1 className={cn(integralCF.className, "text-3xl md:text-4xl text-gray-900 dark:text-white mb-2 text-center md:text-left")}>
                                    {shop.nomBoutique}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-full text-sm font-semibold">
                                        <ShieldCheck className="w-4 h-4" />
                                        Vendeur Vérifié
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Depuis {memberSince}
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={handleShare}
                                variant="outline"
                                className="w-full md:w-auto gap-2 rounded-full border-gray-200 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-900"
                            >
                                <Share2 className="w-4 h-4" />
                                Partager la boutique
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Description */}
                            <div className="lg:col-span-2">
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
                            <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
                                <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-slate-800">
                                    <div className="mb-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                        <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{shop.stats.totalProduits}</span>
                                    <span className="text-xs text-gray-500 font-medium uppercase">Produits</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-slate-800">
                                    <div className="mb-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{shop.stats.noteMoyenne.toFixed(1)}/5</span>
                                    <span className="text-xs text-gray-500 font-medium uppercase">Note Moyenne</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-slate-800">
                                    <div className="mb-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                        <MessageCircle className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{shop.stats.totalAvis}</span>
                                    <span className="text-xs text-gray-500 font-medium uppercase">Avis Clients</span>
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
