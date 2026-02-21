import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { FeeCalculation } from "@/lib/types/payment.types";

// ---- Types ----

type PaymentMethod = "MOBILE_MONEY" | "CARTE_BANCAIRE" | null;

interface WalletBalance {
    vendeurId: string;
    solde: number;
    totalTransactions: number;
}

interface WithdrawalHistoryItem {
    id: string;
    montant: number;
    statut: string;
    methode: string;
    dateDemande: string;
    dateTraitement: string | null;
    reference: string | null;
}

interface PaymentState {
    selectedMethod: PaymentMethod;
    feeBreakdown: FeeCalculation | null;
    paymentStatus: "idle" | "initiating" | "processing" | "success" | "error";
    paymentError: string | null;
    paiementId: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kkiapayConfig: Record<string, unknown> | null;

    // Wallet (vendor)
    walletBalance: WalletBalance | null;
    walletLoading: boolean;

    // Withdrawals (vendor)
    withdrawals: WithdrawalHistoryItem[];
    withdrawalLoading: boolean;
    withdrawalError: string | null;
}

// ---- État initial ----

const initialState: PaymentState = {
    selectedMethod: null,
    feeBreakdown: null,
    paymentStatus: "idle",
    paymentError: null,
    paiementId: null,
    kkiapayConfig: null,

    walletBalance: null,
    walletLoading: false,

    withdrawals: [],
    withdrawalLoading: false,
    withdrawalError: null,
};

// ---- Thunks ----

/**
 * Initie un paiement KKiaPay pour une commande.
 */
export const initiatePayment = createAsyncThunk(
    "payment/initiate",
    async (
        payload: { commandeId: string; methode: "MOBILE_MONEY" | "CARTE_BANCAIRE" },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch("/api/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error || "Erreur lors de l'initiation du paiement");
            }

            return data.data;
        } catch {
            return rejectWithValue("Erreur réseau lors de l'initiation du paiement");
        }
    }
);

/**
 * Confirme la livraison d'une commande.
 */
export const confirmDelivery = createAsyncThunk(
    "payment/confirmDelivery",
    async (commandeId: string, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/orders/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commandeId }),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error || "Erreur lors de la confirmation");
            }

            return data;
        } catch {
            return rejectWithValue("Erreur réseau lors de la confirmation de livraison");
        }
    }
);

/**
 * Récupère le solde du portefeuille vendeur.
 */
export const fetchWalletBalance = createAsyncThunk(
    "payment/fetchWalletBalance",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/wallet/balance");
            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error || "Erreur lors de la récupération du solde");
            }

            return data.data;
        } catch {
            return rejectWithValue("Erreur réseau lors de la récupération du solde");
        }
    }
);

/**
 * Demande un retrait du portefeuille vendeur.
 */
export const requestWithdrawal = createAsyncThunk(
    "payment/requestWithdrawal",
    async (
        payload: { montant: number; methode: "MOBILE_MONEY" | "CARTE_BANCAIRE"; details: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch("/api/withdrawals/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error || "Erreur lors de la demande de retrait");
            }

            return data.data;
        } catch {
            return rejectWithValue("Erreur réseau lors de la demande de retrait");
        }
    }
);

/**
 * Récupère l'historique des retraits du vendeur.
 */
export const fetchWithdrawalHistory = createAsyncThunk(
    "payment/fetchWithdrawalHistory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/withdrawals/history");
            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error || "Erreur lors de la récupération de l'historique");
            }

            return data.data;
        } catch {
            return rejectWithValue("Erreur réseau lors de la récupération de l'historique");
        }
    }
);

// ---- Slice ----

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
            state.selectedMethod = action.payload;
        },
        setFeeBreakdown: (state, action: PayloadAction<FeeCalculation | null>) => {
            state.feeBreakdown = action.payload;
        },
        resetPaymentState: (state) => {
            state.selectedMethod = null;
            state.feeBreakdown = null;
            state.paymentStatus = "idle";
            state.paymentError = null;
            state.paiementId = null;
            state.kkiapayConfig = null;
        },
        clearPaymentError: (state) => {
            state.paymentError = null;
        },
    },
    extraReducers: (builder) => {
        // Initiate Payment
        builder
            .addCase(initiatePayment.pending, (state) => {
                state.paymentStatus = "initiating";
                state.paymentError = null;
            })
            .addCase(initiatePayment.fulfilled, (state, action) => {
                state.paymentStatus = "processing";
                state.paiementId = action.payload.paiementId;
                state.kkiapayConfig = action.payload.kkiapayConfig;
                state.feeBreakdown = {
                    montantBrut: action.payload.montantBrut,
                    commissionPlateforme: 0, // Not exposed to client
                    fraisTransaction: action.payload.fraisTransaction,
                    supporteurFrais: action.payload.supporteurFrais,
                    montantNetVendeur: 0, // Not exposed to client
                    montantTotalClient: action.payload.montantTotalClient,
                };
            })
            .addCase(initiatePayment.rejected, (state, action) => {
                state.paymentStatus = "error";
                state.paymentError = action.payload as string;
            });

        // Confirm Delivery
        builder
            .addCase(confirmDelivery.fulfilled, (state) => {
                state.paymentStatus = "success";
            })
            .addCase(confirmDelivery.rejected, (state, action) => {
                state.paymentError = action.payload as string;
            });

        // Fetch Wallet Balance
        builder
            .addCase(fetchWalletBalance.pending, (state) => {
                state.walletLoading = true;
            })
            .addCase(fetchWalletBalance.fulfilled, (state, action) => {
                state.walletLoading = false;
                state.walletBalance = action.payload;
            })
            .addCase(fetchWalletBalance.rejected, (state) => {
                state.walletLoading = false;
            });

        // Request Withdrawal
        builder
            .addCase(requestWithdrawal.pending, (state) => {
                state.withdrawalLoading = true;
                state.withdrawalError = null;
            })
            .addCase(requestWithdrawal.fulfilled, (state, action) => {
                state.withdrawalLoading = false;
                state.withdrawals.unshift(action.payload);
                // Mettre à jour le solde localement
                if (state.walletBalance) {
                    state.walletBalance.solde -= action.payload.montant;
                }
            })
            .addCase(requestWithdrawal.rejected, (state, action) => {
                state.withdrawalLoading = false;
                state.withdrawalError = action.payload as string;
            });

        // Fetch Withdrawal History
        builder
            .addCase(fetchWithdrawalHistory.pending, (state) => {
                state.withdrawalLoading = true;
                state.withdrawalError = null;
            })
            .addCase(fetchWithdrawalHistory.fulfilled, (state, action) => {
                state.withdrawalLoading = false;
                state.withdrawals = action.payload;
            })
            .addCase(fetchWithdrawalHistory.rejected, (state, action) => {
                state.withdrawalLoading = false;
                state.withdrawalError = action.payload as string;
            });
    },
});

export const {
    setPaymentMethod,
    setFeeBreakdown,
    resetPaymentState,
    clearPaymentError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
