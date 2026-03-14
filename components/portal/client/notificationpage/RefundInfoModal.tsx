"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MethodePaiement } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, University, Loader2, CheckCircle } from "lucide-react";

interface RefundInfoModalProps {
    commandeId: string;
    montant?: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RefundInfoModal({
    commandeId,
    montant,
    isOpen,
    onClose,
    onSuccess,
}: RefundInfoModalProps) {
    const [methode, setMethode] = useState<MethodePaiement>("MOBILE_MONEY");
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (details.trim().length < 5) {
            toast.error("Veuillez renseigner vos coordonnées (minimum 5 caractères)");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/refunds", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commandeId,
                    methode,
                    detailsDestination: details.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de la soumission");
                return;
            }

            setSubmitted(true);
            toast.success("Vos informations ont été transmises à l'équipe support !");
            onSuccess();
        } catch {
            toast.error("Erreur réseau, veuillez réessayer");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setDetails("");
            setMethode("MOBILE_MONEY");
            setSubmitted(false);
            onClose();
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("fr-BJ", {
            style: "currency",
            currency: "XOF",
            maximumFractionDigits: 0,
        }).format(amount);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        💸 Recevoir mon remboursement
                    </DialogTitle>
                    <DialogDescription>
                        {montant && (
                            <span className="block text-lg font-semibold text-green-600 mb-1">
                                Montant : {formatCurrency(montant)}
                            </span>
                        )}
                        Indiquez comment vous souhaitez recevoir votre remboursement. Notre équipe
                        traitera le transfert manuellement sous 24-48h.
                    </DialogDescription>
                </DialogHeader>

                {submitted ? (
                    <div className="py-6 flex flex-col items-center gap-3 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                        <p className="font-semibold text-gray-800">Demande envoyée !</p>
                        <p className="text-sm text-gray-500">
                            Notre équipe traitera votre remboursement et vous notifiera dès que c&apos;est fait.
                        </p>
                        <Button variant="outline" size="sm" onClick={handleClose}>
                            Fermer
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="py-4 space-y-5">
                            {/* Méthode */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Méthode de réception</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setMethode("MOBILE_MONEY")}
                                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                            methode === "MOBILE_MONEY"
                                                ? "border-[var(--green,#9efd38)] bg-green-50 text-green-800"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                        }`}
                                    >
                                        <Phone className="h-4 w-4 shrink-0" />
                                        Mobile Money
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMethode("CARTE_BANCAIRE")}
                                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                            methode === "CARTE_BANCAIRE"
                                                ? "border-[var(--green,#9efd38)] bg-green-50 text-green-800"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                        }`}
                                    >
                                        <University className="h-4 w-4 shrink-0" />
                                        Virement
                                    </button>
                                </div>
                            </div>

                            {/* Détails */}
                            <div className="space-y-2">
                                <Label htmlFor="refund-details" className="text-sm font-semibold">
                                    {methode === "MOBILE_MONEY"
                                        ? "Numéro Mobile Money"
                                        : "RIB / Numéro de compte"}
                                </Label>
                                <Input
                                    id="refund-details"
                                    placeholder={
                                        methode === "MOBILE_MONEY"
                                            ? "Ex: +229 96 00 00 00 (MTN/Moov)"
                                            : "Ex: BJ12345678901234567890123"
                                    }
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="font-mono"
                                    disabled={loading}
                                />
                                <p className="text-xs text-gray-500">
                                    Ces informations seront utilisées uniquement pour effectuer votre remboursement.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={handleClose} disabled={loading}>
                                Annuler
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || details.trim().length < 5}
                                className="bg-[var(--darkblue,#0C1B33)] hover:bg-[var(--darkblue,#0C1B33)]/90 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Envoi...
                                    </>
                                ) : (
                                    "Soumettre mes coordonnées"
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
