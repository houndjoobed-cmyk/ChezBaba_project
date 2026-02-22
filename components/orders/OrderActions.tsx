"use client";

import { useAppDispatch } from "@/redux/hooks";
import { confirmDelivery } from "@/redux/features/payment/paymentSlice";
import { Button } from "@/components/ui/button";
import { CheckCircle, Truck, AlertTriangle, CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface OrderActionsProps {
    orderId: string;
    status: string;
    userRole: "CLIENT" | "VENDEUR" | "ADMIN";
}

export default function OrderActions({ orderId, status, userRole }: OrderActionsProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [disputeOpen, setDisputeOpen] = useState(false);
    const [disputeReason, setDisputeReason] = useState("");

    // Handler for Client Confirming Delivery
    const handleConfirmDelivery = async () => {
        try {
            setLoading(true);
            await dispatch(confirmDelivery(orderId)).unwrap();
            toast.success("Réception confirmée ! Le vendeur sera payé.");
            // Optional: force refresh or redirect
            window.location.reload();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
            toast.error(errorMessage || "Erreur lors de la confirmation");
        } finally {
            setLoading(false);
        }
    };

    // Handler for Vendor Marking as Shipped
    const handleMarkShipped = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "EXPEDIEE" }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur lors de la mise à jour");
            }

            toast.success("Commande marquée comme expédiée !");
            window.location.reload();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
            toast.error(errorMessage || "Impossible de mettre à jour le statut");
        } finally {
            setLoading(false);
        }
    };

    // Handler for creating dispute
    const handleCreateDispute = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/disputes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, motif: disputeReason })
            });

            if (!res.ok) throw new Error("Erreur");

            toast.success("Litige ouvert. L'équipe support va intervenir.");
            setDisputeOpen(false);
            window.location.reload();
        } catch {
            toast.error("Impossible d'ouvrir le litige");
        } finally {
            setLoading(false);
        }
    };

    if (userRole === "CLIENT") {
        if (status === "EXPEDIEE") {
            return (
                <div className="flex flex-col gap-2 mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                    <h4 className="font-semibold text-green-800">Avez-vous reçu votre commande ?</h4>
                    <p className="text-sm text-green-700 mb-2">
                        Confirmez la réception pour libérer le paiement au vendeur.
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleConfirmDelivery}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                            disabled={loading}
                        >
                            {loading ? "Traitement..." : "Oui, j&apos;ai reçu ma commande"}
                            <CheckCircle className="ml-2 h-4 w-4" />
                        </Button>

                        <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Signaler un problème
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Signaler un problème</DialogTitle>
                                    <DialogDescription>
                                        Décrivez le problème rencontré (produit non conforme, colis abîmé, etc.). Le paiement sera bloqué en attendant la résolution.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-2">
                                    <Textarea
                                        placeholder="Détails du problème..."
                                        value={disputeReason}
                                        onChange={(e) => setDisputeReason(e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button variant="destructive" onClick={handleCreateDispute} disabled={!disputeReason}>
                                        Ouvrir un litige
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            );
        }

        if (status === "PAYEE") {
            return (
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded text-sm flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    En attente d&apos;expédition par le vendeur
                </div>
            );
        }

        if (status === "EN_ATTENTE_PAIEMENT") {
            return (
                <div className="flex flex-col gap-2 mt-4 p-4 bg-orange-50 border border-orange-100 rounded-lg w-full">
                    <h4 className="font-semibold text-orange-800">Finalisez votre achat</h4>
                    <p className="text-sm text-orange-700 mb-2">
                        Cette commande est en attente de paiement. Cliquez sur le bouton ci-dessous pour payer.
                    </p>
                    <Button
                        onClick={() => router.push(`/checkout/${orderId}`)}
                        className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                    >
                        Payer maintenant
                        <CreditCard className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        }
    }

    if (userRole === "VENDEUR") {
        if (status === "PAYEE") {
            return (
                <Button onClick={handleMarkShipped} className="w-full mt-4">
                    <Truck className="mr-2 h-4 w-4" />
                    Marquer comme expédiée
                </Button>
            );
        }
    }

    return null;
}
