"use client";

import { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Filter, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { montserrat } from "@/styles/fonts";

interface Transaction {
  id: string;
  type: string;
  montant: number;
  description: string;
  date: string;
  commandeId: string | null;
  status: string;
  commande?: {
    id: string;
    montant: string;
    statut: string;
  };
}

interface WalletData {
  soldeTotal: number;
  soldeFiltre: number;
  transactions: Transaction[];
}

export default function WalletView() {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Determine if filters are active
  const hasFilters = typeFilter !== "ALL" || startDate !== "" || endDate !== "";

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (typeFilter !== "ALL") params.append("type", typeFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`/api/admin/wallet?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Erreur de récupération du portefeuille");
      }
      
      const walletData = await response.json();
      setData(walletData);
    } catch (err: unknown) {
      console.error("Erreur WalletView:", err);
      setError("Impossible de charger les données du portefeuille.");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchWalletData();
  }, [typeFilter, startDate, endDate]);

  const clearFilters = () => {
    setTypeFilter("ALL");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className={`${montserrat.className} text-2xl font-bold text-[#0C1B33]`}>
            Portefeuille Administrateur
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Suivi des revenus générés et historique des transactions de la plateforme.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARTE SOLDE GLOBAL */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-900 to-[#0C1B33] text-white rounded-xl shadow-sm border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="h-6 w-6 text-brand-primary" />
            <h2 className={`text-lg sm:text-xl font-bold ${montserrat.className}`}>
              Revenus Nets (Global)
            </h2>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm mb-6">
            Cumul historique des commissions et frais
          </p>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#9efd38]">
            {data ? formatPrice(data.soldeTotal) : "..."}
          </div>
        </div>

        {/* CARTE SOLDE FILTRÉ (affichée uniquement si filtres actifs) */}
        {hasFilters ? (
          <div className="p-6 sm:p-8 bg-white border border-[#0C1B33] rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#9efd38] opacity-10 rounded-bl-full"></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <Filter className="h-6 w-6 text-[#0C1B33]" />
              <h2 className={`text-lg sm:text-xl font-bold text-[#0C1B33] ${montserrat.className}`}>
                Revenus de la Période
              </h2>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mb-6 relative z-10">
              Total correspondant à vos critères actuels
            </p>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#0C1B33] relative z-10">
              {data ? formatPrice(data.soldeFiltre) : "..."}
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 bg-gray-50 text-gray-500 rounded-xl shadow-inner border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
            <Filter className="w-8 h-8 mb-3 text-gray-400 opacity-50" />
            <p className="text-sm">Appliquez des filtres ci-dessous pour voir le solde d&apos;une période spécifique.</p>
          </div>
        )}
      </div>

      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        
        {/* BARRE DE FILTRES */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Type de transaction</label>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border-gray-300 rounded-lg text-sm focus:ring-[#0C1B33] focus:border-[#0C1B33]"
              >
                <option value="ALL">Toutes les transactions</option>
                <option value="VENTE">Ventes (Paiements)</option>
                <option value="COMMISSION">Commissions prélevées</option>
                <option value="RETRAIT">Retraits vendeurs</option>
                <option value="REMBOURSEMENT">Remboursements clients</option>
                <option value="FRAIS">Frais de plateforme</option>
              </select>
            </div>
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date début</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border-gray-300 rounded-lg text-sm focus:ring-[#0C1B33] focus:border-[#0C1B33]"
              />
            </div>
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date fin</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border-gray-300 rounded-lg text-sm focus:ring-[#0C1B33] focus:border-[#0C1B33]"
              />
            </div>
            
            {hasFilters && (
              <div className="w-full sm:w-auto flex items-end pt-5">
                 <button 
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors w-full sm:w-auto justify-center"
                 >
                   <X className="w-4 h-4" /> Effacer
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* HISTORIQUE TRANSACTIONS */}
        <div>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <h3 className={`font-semibold text-gray-800 ${montserrat.className}`}>
                Historique des Transactions
              </h3>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {data ? `${data.transactions.length} résultat(s)` : "..."}
            </span>
          </div>

          {loading && !data ? (
            <div className="p-8 flex justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C1B33]"></div>
            </div>
          ) : error ? (
             <div className="p-8 text-center text-red-600 bg-red-50">
               {error}
             </div>
          ) : !data || data.transactions.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <Filter className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600">Aucune transaction trouvée</p>
              <p className="text-sm mt-1">Modifiez vos filtres ou vérifiez plus tard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">Date</th>
                    <th scope="col" className="px-6 py-4 font-medium">Type</th>
                    <th scope="col" className="px-6 py-4 font-medium">Description</th>
                    <th scope="col" className="px-6 py-4 font-medium hidden md:table-cell">ID Lien</th>
                    <th scope="col" className="px-6 py-4 font-medium">Statut</th>
                    <th scope="col" className="px-6 py-4 font-medium text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((tx) => {
                    const isIncome = ['VENTE', 'COMMISSION'].includes(tx.type) || (tx.montant > 0 && !['RETRAIT', 'REMBOURSEMENT', 'FRAIS_CARTE', 'FRAIS_REVERSEMENT'].includes(tx.type));
                    
                    let typeColor = 'bg-gray-50 text-gray-700 border-gray-200';
                    if (tx.type === 'COMMISSION') typeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                    else if (tx.type === 'VENTE') typeColor = 'bg-green-50 text-green-700 border-green-200';
                    else if (tx.type.includes('FRAIS')) typeColor = 'bg-orange-50 text-orange-700 border-orange-200';
                    else if (tx.type === 'RETRAIT') typeColor = 'bg-purple-50 text-purple-700 border-purple-200';
                    else if (tx.type === 'REMBOURSEMENT') typeColor = 'bg-red-50 text-red-700 border-red-200';

                    let statusColor = 'text-gray-500 bg-gray-100';
                    if (['PAYE', 'APPROUVE', 'TRAITE'].includes(tx.status)) statusColor = 'text-green-700 bg-green-100';
                    else if (['EN_ATTENTE'].includes(tx.status)) statusColor = 'text-yellow-700 bg-yellow-100';
                    else if (['ECHOUE', 'REJETE'].includes(tx.status)) statusColor = 'text-red-700 bg-red-100';

                    return (
                      <tr 
                        key={tx.id} 
                        className="bg-white border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(tx.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColor}`}>
                            {tx.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {tx.description || "-"}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {tx.commandeId ? (
                             <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                               {tx.commandeId.substring(0, 8)}...
                             </span>
                          ) : "-"}
                        </td>
                        <td className="px-6 py-4">
                          {tx.status && tx.status !== 'N/A' ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${statusColor}`}>
                              {tx.status}
                            </span>
                          ) : "-"}
                        </td>
                        <td className={`px-6 py-4 font-bold text-right flex items-center justify-end gap-1 ${
                          isIncome ? "text-green-600" : "text-gray-900"
                        }`}>
                          {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                          {formatPrice(Math.abs(tx.montant))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
