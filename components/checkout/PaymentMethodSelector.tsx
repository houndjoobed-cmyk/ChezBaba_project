"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPaymentMethod } from "@/redux/features/payment/paymentSlice";
import { MOMO_COMMISSION } from "@/lib/constants/settings";
import { AlertCircle, CreditCard, Smartphone } from "lucide-react";
import { RootState } from "@/redux/store";
import Image from "next/image";

interface PaymentMethodSelectorProps {
    orderTotal: number;
}

export default function PaymentMethodSelector({ orderTotal }: PaymentMethodSelectorProps) {
    const dispatch = useAppDispatch();
    const selectedMethod = useAppSelector((state: RootState) => state.payment.selectedMethod);

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-XOF", {
            style: "currency",
            currency: "XOF",
        }).format(amount);
    };

    const handleSelect = (method: "MOBILE_MONEY" | "CARTE_BANCAIRE") => {
        dispatch(setPaymentMethod(method));
    };

    // Fees calculation for display (client-side estimation)
    const momoFees = Math.ceil(orderTotal * MOMO_COMMISSION);


    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Moyen de paiement</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobile Money Option */}
                <div
                    onClick={() => handleSelect("MOBILE_MONEY")}
                    className={`cursor-pointer border rounded-lg p-4 transition-all ${selectedMethod === "MOBILE_MONEY"
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-gray-200 hover:border-primary/50"
                        }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <span className="font-medium">Mobile Money</span>
                        </div>
                        {selectedMethod === "MOBILE_MONEY" && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                    </div>
                    <div className="flex gap-2 mb-2">
                        <Image src="/images/mtn-momo.png" alt="MTN" width={30} height={20} className="object-contain" />
                        <Image src="/images/moov.png" alt="Moov" width={30} height={20} className="object-contain" />
                        <Image src="/images/celtis.png" alt="Celtis" width={30} height={20} className="object-contain" />
                    </div>
                    <p className="text-sm text-gray-500">
                        Frais de transaction : <span className="font-semibold text-gray-700">1.9%</span>
                    </p>
                    {selectedMethod === "MOBILE_MONEY" && (
                        <div className="mt-2 text-xs text-primary bg-primary/10 p-2 rounded">
                            Total estimé : {formatCurrency(orderTotal + momoFees)}
                        </div>
                    )}
                </div>

                {/* Credit Card Option */}
                <div
                    onClick={() => handleSelect("CARTE_BANCAIRE")}
                    className={`cursor-pointer border rounded-lg p-4 transition-all ${selectedMethod === "CARTE_BANCAIRE"
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-gray-200 hover:border-primary/50"
                        }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="font-medium">Carte Bancaire</span>
                        </div>
                        {selectedMethod === "CARTE_BANCAIRE" && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                    </div>
                    <div className="flex gap-2 mb-2">
                        <Image src="/images/visa.png" alt="Visa" width={30} height={20} className="object-contain" />
                        <Image src="/images/mastercard.png" alt="Mastercard" width={30} height={20} className="object-contain" />
                    </div>
                    <p className="text-sm text-gray-500">
                        Frais de transaction : <span className="font-semibold text-gray-700">Pris en charge</span> par la plateforme
                    </p>
                    {selectedMethod === "CARTE_BANCAIRE" && (
                        <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Aucun frais supplémentaire pour vous !
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
