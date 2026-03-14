import RefundList from "@/components/portal/admin/refunds/RefundList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Remboursements clients | Admin",
    description: "Gérez les demandes de remboursement des clients",
};

export default function RefundsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Remboursements</h1>
                <p className="text-muted-foreground">
                    Gérez et traitez les demandes de remboursement des clients.
                </p>
            </div>

            <RefundList />
        </div>
    );
}
