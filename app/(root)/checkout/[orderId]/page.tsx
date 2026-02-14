
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import KKiaPyWidget from "@/components/checkout/KKiaPyWidget";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paymentConfig, setPaymentConfig] = useState<any>(null);
    const [initializing, setInitializing] = useState(false);

    // From Redux (or props if integrated differently)
    const [selectedMethod, setSelectedMethod] = useState<"MOBILE_MONEY" | "CARTE_BANCAIRE" | null>(null);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const [error, setError] = useState<string | null>(null);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details || data.error || "Commande introuvable");
            }

            setOrder(data.data);

            // If already paid, redirect
            if (data.data.paiement && data.data.paiement.statut === "REUSSI") {
                router.push(`/client/orders/${orderId}?payment=success`);
            }
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInitiatePayment = async () => {
        if (!selectedMethod) {
            toast.error("Veuillez sélectionner un moyen de paiement");
            return;
        }

        setInitializing(true);
        try {
            const res = await fetch("/api/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commandeId: orderId,
                    methode: selectedMethod
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur d'initialisation");

            setPaymentConfig(data.data.kkiapayConfig);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setInitializing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) return <div className="p-8 text-center text-red-500 font-medium">{error || "Calcul de la commande impossible."}</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h1 className="text-2xl font-bold mb-6">Paiement sécurisé</h1>

                <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-100 flex gap-3">
                    <ShieldCheck className="h-6 w-6 text-orange-600 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-orange-800">Argents sécurisés (Escrow)</h3>
                        <p className="text-sm text-orange-700">
                            Votre paiement est cantonné sur un compte sécurisé et ne sera reversé au vendeur
                            que lorsque vous aurez confirmé la bonne réception de votre commande.
                        </p>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-gray-600">Commande #{order.id}</span>
                        <span className="font-medium">{order.montant} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center py-3 font-semibold text-lg">
                        <span>Total à payer</span>
                        <span>{order.montant} FCFA</span>
                    </div>
                </div>

                {!paymentConfig ? (
                    <div key="selector-section" className="space-y-6">
                        {/* Reuse PaymentMethodSelector Logic locally or via Redux */}
                        {/* Simplified local version for this page */}
                        <div className="space-y-4">
                            <label className="font-medium text-gray-700">Choisissez votre méthode :</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSelectedMethod("MOBILE_MONEY")}
                                    className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${selectedMethod === "MOBILE_MONEY"
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "hover:border-primary/50"
                                        }`}
                                >
                                    <span className="font-semibold">Mobile Money</span>
                                    <span className="text-xs text-gray-500">MTN, Moov, Celtis</span>
                                </button>
                                <button
                                    onClick={() => setSelectedMethod("CARTE_BANCAIRE")}
                                    className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${selectedMethod === "CARTE_BANCAIRE"
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "hover:border-primary/50"
                                        }`}
                                >
                                    <span className="font-semibold">Carte Bancaire</span>
                                    <span className="text-xs text-gray-500">Visa, Mastercard</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleInitiatePayment}
                            disabled={!selectedMethod || initializing}
                            className="w-full py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {initializing && <Loader2 className="h-5 w-5 animate-spin" />}
                            Payer maintenant ({order.montant} FCFA)
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Paiement sécurisé par KKiaPay
                        </p>
                    </div>
                ) : (
                    <div key="widget-section">
                        <KKiaPyWidget
                            amount={paymentConfig.amount} // Utiliser le montant calculé (avec frais éventuels)
                            paymentConfig={paymentConfig}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
