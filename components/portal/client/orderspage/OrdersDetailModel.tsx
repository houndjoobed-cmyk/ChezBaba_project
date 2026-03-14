"use client";

import { useState } from "react";
import { X, Download, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderActions from "@/components/orders/OrderActions";
import { OrderFromAPI } from "@/lib/types/order.types";
import { extractDateString, formatPrice } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/helpers/orderStatus";
import RefundInfoModal from "../notificationpage/RefundInfoModal";

interface OrderDetailModalProps {
  order: OrderFromAPI | null;
  onClose: () => void;
}

export default function OrderDetailModal({
  order,
  onClose,
}: OrderDetailModalProps) {
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-[90%] sm:max-w-3xl w-full p-4 sm:p-8 border border-gray-200 overflow-y-auto max-h-[calc(100dvh-100px)] relative"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <div className="space-y-4 sm:space-y-6">
          {/* En-tête de la commande */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 sm:pb-4 mt-1 gap-4 sm:gap-0">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Commande #{order.id}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full font-bold ${
                  order.statut === "REMBOURSEE" && order.demandeRemboursement?.statut === "TRAITE"
                    ? "text-green-600 bg-green-100"
                    : getStatusColor(order.statut!)
                }`}
              >
                {order.statut === "REMBOURSEE" && order.demandeRemboursement?.statut === "TRAITE"
                  ? "Traité"
                  : getStatusLabel(order.statut)}
              </span>
            </div>
          </div>
          {/* Informations vendeur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl">
            <div>
              <span className="text-gray-700 font-semibold text-sm sm:text-base">
                Client :
              </span>
              <span className="text-gray-900 block text-sm sm:text-base font-semibold">
                {order.client?.prenom} {order.client?.nom}
              </span>
            </div>

            <div>
              <span className="text-gray-700 font-semibold text-sm sm:text-base">
                Date :
              </span>
              <span className="text-gray-900 block text-sm sm:text-base font-semibold">
                {extractDateString(order.date)}
              </span>
            </div>

            <div>
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Adresse :
              </span>
              <span className="text-gray-900 font-semibold block text-sm sm:text-base">
                {[
                  order.adresse?.rue,
                  order.adresse?.ville,
                  order.adresse?.quartier,
                  order.adresse?.codePostal
                ].filter(Boolean).join(", ")}
              </span>
            </div>

            <div>
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Articles :
              </span>
              <span className="text-gray-900 font-semibold block text-sm sm:text-base">
                {order.produits.length}
              </span>
            </div>
          </div>

          {/* Liste des produits */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              Détails des articles
            </h4>
            <div className="space-y-3">
              {order.produits.map((produit, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-2 last:border-b-0"
                >
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium text-sm sm:text-base">
                      {produit.nomProduit}
                    </span>
                    {produit.typeProduit === "DIGITAL" ? (
                      <p className="text-xs sm:text-sm text-green-600 font-medium">
                        Produit Digital
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-600">
                        Couleur: {produit.couleur?.nom}, Taille:{" "}
                        {produit.taille?.nom}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600">
                      Quantité: {produit.quantite}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 mt-1 sm:mt-0">
                    <span className="text-gray-900 font-semibold text-sm sm:text-base">
                      {formatPrice(produit.prixUnit * produit.quantite)}
                    </span>

                    {/* Access/Download button for digital products */}
                    {produit.typeProduit === "DIGITAL" && (order.statut === "PAYEE" || order.statut === "EN_COURS" || order.statut === "LIVRE" || order.statut === "LIVRAISON_CONFIRMEE") && (
                      <a
                        href={`/api/products/${produit.produitId}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-darkblue text-xs font-semibold rounded-md hover:bg-green-400 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-green-50 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-green-700 font-medium text-base sm:text-lg">
              Total de la commande :
            </span>
            <span className="text-green-900 font-bold text-lg sm:text-2xl">
              {formatPrice(order.montant)}
            </span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
            {order.statut === "REMBOURSEE" && !order.demandeRemboursement && (
                <button
                    onClick={() => setIsRefundModalOpen(true)}
                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-200 animate-pulse"
                >
                    <Landmark className="w-5 h-5" />
                    Transférer mes infos de remboursement
                </button>
            )}
            <OrderActions orderId={order.id} status={order.statut} userRole="CLIENT" />
          </div>
        </div>

        <AnimatePresence>
            {isRefundModalOpen && (
                <RefundInfoModal 
                    commandeId={order.id}
                    montant={order.montant}
                    isOpen={isRefundModalOpen}
                    onClose={() => setIsRefundModalOpen(false)}
                    onSuccess={() => {
                        setIsRefundModalOpen(false);
                        onClose(); // Fermer aussi le détail de la commande après succès
                    }}
                />
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
