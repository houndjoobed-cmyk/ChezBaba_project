import WithdrawalList from "@/components/portal/admin/withdrawals/WithdrawalList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gestion des Retraits | Admin",
    description: "Traitez les demandes de retrait des vendeurs",
};

export default function WithdrawalsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestion des Retraits</h1>
                <p className="text-muted-foreground">
                    Gérez et validez les demandes de retrait des vendeurs.
                </p>
            </div>

            <WithdrawalList />
        </div>
    );
}
