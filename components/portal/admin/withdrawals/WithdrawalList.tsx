"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import {
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCcw,
    MoreHorizontal,
    Phone,
    University,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Withdrawal {
    id: string;
    montant: number;
    statut: "EN_ATTENTE" | "APPROUVE" | "TRAITE" | "REJETE";
    methode: "MOBILE_MONEY" | "CARTE_BANCAIRE";
    details: string | null;
    dateDemande: string;
    vendeur: {
        nomBoutique: string;
        nomComplet: string;
        email: string;
    };
}

export default function WithdrawalList() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchWithdrawals = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/withdrawals?page=${page}&pageSize=20`);
            const data = await res.json();
            if (res.ok) {
                setWithdrawals(data.retraits);
                setTotalPages(data.pagination.totalPages);
            } else {
                toast.error("Erreur lors du chargement des retraits");
            }
        } catch {
            toast.error("Erreur réseau");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchWithdrawals();
    }, [fetchWithdrawals]);

    const handleStatusUpdate = async (id: string, newStatus: "TRAITE" | "REJETE") => {
        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/withdrawals/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ statut: newStatus }),
            });

            if (res.ok) {
                toast.success(`Retrait ${newStatus === "TRAITE" ? "traité" : "rejeté"} avec succès`);
                fetchWithdrawals();
            } else {
                const error = await res.json();
                toast.error(error.error || "Une erreur est survenue");
            }
        } catch {
            toast.error("Erreur réseau");
        } finally {
            setProcessingId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-BJ", {
            style: "currency",
            currency: "XOF",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "EN_ATTENTE":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
            case "TRAITE":
                return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Traité</Badge>;
            case "REJETE":
                return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">Rejeté</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-gray-900">Demandes de retrait</h2>
                <Button variant="ghost" size="sm" onClick={fetchWithdrawals}>
                    <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendeur</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode & Détails</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
                                    Chargement des demandes...
                                </td>
                            </tr>
                        ) : withdrawals.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Aucune demande de retrait trouvée.
                                </td>
                            </tr>
                        ) : (
                            withdrawals.map((withdrawal) => (
                                <tr key={withdrawal.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(withdrawal.dateDemande), "dd MMM yyyy", { locale: fr })}
                                        <br />
                                        <span className="text-xs">{format(new Date(withdrawal.dateDemande), "HH:mm")}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{withdrawal.vendeur.nomBoutique}</div>
                                        <div className="text-sm text-gray-500">{withdrawal.vendeur.nomComplet}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900 mb-1">
                                            {withdrawal.methode === "MOBILE_MONEY" ? (
                                                <Phone className="h-4 w-4 mr-2 text-indigo-500" />
                                            ) : (
                                                <University className="h-4 w-4 mr-2 text-indigo-500" />
                                            )}
                                            {withdrawal.methode === "MOBILE_MONEY" ? "Mobile Money" : "Virement"}
                                        </div>
                                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                            {withdrawal.details || "Non spécifié"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                        {formatCurrency(withdrawal.montant)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {getStatusBadge(withdrawal.statut)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {withdrawal.statut === "EN_ATTENTE" && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Ouvrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusUpdate(withdrawal.id, "TRAITE")}
                                                        className="text-green-600 focus:text-green-700 cursor-pointer"
                                                        disabled={processingId === withdrawal.id}
                                                    >
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Marquer comme traité
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusUpdate(withdrawal.id, "REJETE")}
                                                        className="text-red-600 focus:text-red-700 cursor-pointer"
                                                        disabled={processingId === withdrawal.id}
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Rejeter la demande
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Simple */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    Précédent
                </Button>
                <span className="text-sm text-gray-600">
                    Page {page} sur {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
}
