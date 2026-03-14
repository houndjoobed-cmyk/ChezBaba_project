import WalletView from "@/components/portal/admin/wallet/WalletView";

export const metadata = {
  title: "Portefeuille | Administration ChezBaba",
  description: "Suivi des revenus générés et de l'historique des transactions de la plateforme.",
};

export default function WalletPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      <WalletView />
    </div>
  );
}
