"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { confirmDelivery } from "@/redux/features/payment/paymentSlice";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface KKiaPayWidgetProps {
    amount: number;
    paymentConfig: Record<string, unknown>; // Configuration retournée par /api/payments/initiate
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

declare global {
    interface Window {
        openKkiapayWidget: (config: Record<string, unknown>) => void;
        addSuccessListener: (callback: (response: Record<string, unknown>) => void) => void;
        addFailedListener: (callback: (error: unknown) => void) => void;
    }
}

export default function KKiaPyWidget({
    amount,
    paymentConfig,
    onSuccess,
    onError,
}: KKiaPayWidgetProps) {
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const [widgetOpened, setWidgetOpened] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isSdkLoaded && paymentConfig && !widgetOpened) {
            openWidget();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSdkLoaded, paymentConfig]);

    const openWidget = () => {
        if (window.openKkiapayWidget) {
            setWidgetOpened(true);

            // Setup listeners BEFORE opening
            window.addSuccessListener((response) => {
                console.log("[KKiaPay] Succès callback reçu:", response);
                if (onSuccess) onSuccess();

                // Extraire l'ID de transaction de manière robuste
                const tid = response.transactionId || response.id || response.reference || response.kkiapayId;

                if (!tid) {
                    console.error("[KKiaPay] Impossible d'extraire l'ID de transaction du succès:", response);
                    toast.error("Paiement réussi mais erreur de redirection. Veuillez contacter le support.");
                    router.push("/client/orders?status=manual-check");
                    return;
                }

                // Redirection vers page succès
                const targetUrl = `/client/orders?status=success&transactionId=${tid}`;
                console.log("[KKiaPay] Redirection vers:", targetUrl);
                router.push(targetUrl);
            });

            window.addFailedListener((error) => {
                console.error("Paiement échoué:", error);
                if (onError) onError(error);
                setWidgetOpened(false); // Allow retry
            });

            // Open Widget
            window.openKkiapayWidget({
                amount: amount,
                key: paymentConfig.publicKey,
                sandbox: paymentConfig.sandbox,
                email: paymentConfig.email,
                phone: paymentConfig.phone,
                name: paymentConfig.name,
                reason: `Commande ChezBaba #${paymentConfig.reference}`,
                callback: "", // Webhook handles backend update
                data: paymentConfig.metadata,
                theme: "#FF6B00", // ChezBaba Orange
            });
        }
    };

    return (
        <>
            <Script
                src="https://cdn.kkiapay.me/k.js"
                onLoad={() => setIsSdkLoaded(true)}
            />
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-gray-500">Chargement du module de paiement sécurisé...</p>
                {!widgetOpened && isSdkLoaded && (
                    <button
                        onClick={openWidget}
                        className="mt-4 text-primary text-sm underline hover:text-primary/80"
                    >
                        Si la fenêtre ne s&apos;ouvre pas, cliquez ici
                    </button>
                )}
            </div>
        </>
    );
}
