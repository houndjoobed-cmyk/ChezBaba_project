"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { satoshi } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { AlertTriangle, PackageX } from "lucide-react";

interface StockErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorMessage: string | null;
}

export default function StockErrorModal({
    isOpen,
    onClose,
    errorMessage,
}: StockErrorModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <PackageX className="h-12 w-12 text-red-500" />
                    </div>
                    <DialogTitle
                        className={cn(
                            satoshi.className,
                            "text-2xl font-bold text-red-900 text-center"
                        )}
                    >
                        Stock Insuffisant
                    </DialogTitle>
                </div>

                <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="mt-1">
                            <AlertTriangle className="h-6 w-6 text-amber-500" />
                        </div>
                        <DialogDescription
                            className={cn(
                                satoshi.className,
                                "text-base text-gray-700 leading-relaxed font-medium"
                            )}
                        >
                            {errorMessage ||
                                "Désolé, certains articles de votre panier ne sont plus disponibles dans la quantité demandée."}
                        </DialogDescription>
                    </div>

                    <p className={cn(satoshi.className, "text-sm text-gray-500 mb-8")}>
                        Veuillez ajuster les quantités ou retirer les produits concernés
                        pour continuer.
                    </p>

                    <DialogFooter>
                        <Button
                            onClick={onClose}
                            className={cn(
                                satoshi.className,
                                "w-full py-6 text-base font-bold bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl hover:scale-[1.02] transition-all duration-200 shadow-xl"
                            )}
                        >
                            Compris, j&apos;ajuste mon panier
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
