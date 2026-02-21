"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchWalletBalance, fetchWithdrawalHistory, requestWithdrawal } from "@/redux/features/payment/paymentSlice";
import {
    Wallet,
    ArrowUpRight,
    RefreshCcw,
    Calendar,
    AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner"; // Assuming sonner is used, or replace with existing toast

export default function VendorWallet() {
    const dispatch = useAppDispatch();
    const { walletBalance, walletLoading, withdrawals, withdrawalLoading } = useAppSelector(
        (state) => state.payment
    );

    const [withdrawalAmount, setWithdrawalAmount] = useState("");
    const [withdrawalDetails, setWithdrawalDetails] = useState("");
    const [withdrawalMethod, setWithdrawalMethod] = useState<"MOBILE_MONEY" | "CARTE_BANCAIRE">("MOBILE_MONEY");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchWalletBalance());
        dispatch(fetchWithdrawalHistory());
    }, [dispatch]);

    const handleWithdrawal = async () => {
        const amount = parseFloat(withdrawalAmount);

        if (isNaN(amount) || amount < 2000) {
            toast.error("Le montant minimum de retrait est de 2 000 FCFA");
            return;
        }

        if (walletBalance && amount > walletBalance.solde) {
            toast.error("Solde insuffisant");
            return;
        }

        if (withdrawalDetails.length < 5) {
            toast.error("Veuillez fournir les détails de paiement (Numéro ou RIB)");
            return;
        }

        try {
            await dispatch(requestWithdrawal({
                montant: amount,
                methode: withdrawalMethod,
                details: withdrawalDetails
            })).unwrap();
            toast.success("Demande de retrait envoyée avec succès");
            setOpen(false);
            setWithdrawalAmount("");
            setWithdrawalDetails("");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
            toast.error(errorMessage || "Erreur lors de la demande");
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-BJ", {
            style: "currency",
            currency: "XOF",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Wallet className="h-32 w-32 text-primary" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Solde disponible</p>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {walletLoading ? (
                                    <span className="animate-pulse bg-gray-200 h-8 w-32 block rounded"></span>
                                ) : (
                                    formatCurrency(walletBalance?.solde || 0)
                                )}
                            </h2>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => dispatch(fetchWalletBalance())}
                            className="h-8 w-8"
                        >
                            <RefreshCcw className={`h-4 w-4 ${walletLoading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto" disabled={!walletBalance || walletBalance.solde < 2000}>
                                <ArrowUpRight className="mr-2 h-4 w-4" />
                                Demander un retrait
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Effectuer un retrait</DialogTitle>
                                <DialogDescription>
                                    Les fonds seront transférés vers votre compte Mobile Money ou bancaire sous 24-48h.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Montant (FCFA)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="Ex: 50000"
                                        value={withdrawalAmount}
                                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                                        min={2000}
                                        max={walletBalance?.solde || undefined}
                                    />
                                    <div className="flex justify-between items-center text-xs">
                                        <p className="text-gray-500">Minimum: 2 000 FCFA</p>
                                        {withdrawalAmount && Number(withdrawalAmount) > (walletBalance?.solde || 0) && (
                                            <p className="text-red-500 font-medium flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                Solde insuffisant
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Méthode de réception</Label>
                                    <RadioGroup
                                        value={withdrawalMethod}
                                        onValueChange={(v: "MOBILE_MONEY" | "CARTE_BANCAIRE") => setWithdrawalMethod(v)}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <div>
                                            <RadioGroupItem value="MOBILE_MONEY" id="momo" className="peer sr-only" />
                                            <Label
                                                htmlFor="momo"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <span className="text-sm font-medium">Mobile Money</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="CARTE_BANCAIRE" id="bank" className="peer sr-only" />
                                            <Label
                                                htmlFor="bank"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <span className="text-sm font-medium">Virement</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="details">
                                        {withdrawalMethod === "MOBILE_MONEY" ? "Numéro Mobile Money" : "RIB / Numéro de compte"}
                                    </Label>
                                    <Input
                                        id="details"
                                        placeholder={withdrawalMethod === "MOBILE_MONEY" ? "+229 01..." : "BJ061..."}
                                        value={withdrawalDetails}
                                        onChange={(e) => setWithdrawalDetails(e.target.value)}
                                    />
                                </div>

                                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 flex gap-2">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                                    <p className="text-xs text-yellow-700">
                                        Des frais de retrait de 1% (max 2000 FCFA) peuvent s&apos;appliquer selon l&apos;opérateur.
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    onClick={handleWithdrawal}
                                    disabled={
                                        withdrawalLoading ||
                                        (withdrawalAmount ? Number(withdrawalAmount) > (walletBalance?.solde || 0) : false)
                                    }
                                >
                                    {withdrawalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Confirmer le retrait
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Transaction History Placeholder (Expand later with real data) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Derniers mouvements</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {withdrawals.length > 0 ? (
                        withdrawals.map((w) => (
                            <div key={w.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Demande de retrait</p>
                                        <p className="text-xs text-gray-500">
                                            {format(new Date(w.dateDemande), "dd MMM yyyy à HH:mm", { locale: fr })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-600">- {formatCurrency(w.montant)}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${w.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                                        w.statut === 'TRAITE' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {w.statut.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            Aucune transaction récente
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { Loader2 } from "lucide-react";
