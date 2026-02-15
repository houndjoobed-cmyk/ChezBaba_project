import { CommandeStatut } from "@prisma/client";

// Fonction pour déterminer la couleur du statut
export const getStatusColor = (statut: string): string => {
  switch (statut) {
    case CommandeStatut.EN_ATTENTE_PAIEMENT:
      return "text-orange-600 bg-orange-100";
    case CommandeStatut.PAYEE:
      return "text-amber-600 bg-amber-100";
    case CommandeStatut.EN_PREPARATION:
      return "text-blue-500 bg-blue-50";
    case CommandeStatut.EXPEDIEE:
      return "text-blue-600 bg-blue-100";
    case CommandeStatut.LIVREE:
      return "text-indigo-600 bg-indigo-100";
    case CommandeStatut.LIVRAISON_CONFIRMEE:
      return "text-green-600 bg-green-100";
    case CommandeStatut.ANNULEE:
      return "text-red-600 bg-red-100";
    case CommandeStatut.EN_LITIGE:
      return "text-yellow-700 bg-yellow-100";
    case CommandeStatut.REMBOURSEE:
      return "text-purple-600 bg-purple-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

// Fonction pour obtenir le libellé en français du statut
export const getStatusLabel = (statut: string): string => {
  switch (statut) {
    case CommandeStatut.EN_ATTENTE_PAIEMENT:
      return "En attente de paiement";
    case CommandeStatut.PAYEE:
      return "Payée";
    case CommandeStatut.EN_PREPARATION:
      return "En préparation";
    case CommandeStatut.EXPEDIEE:
      return "Expédiée";
    case CommandeStatut.LIVREE:
      return "Livrée";
    case CommandeStatut.LIVRAISON_CONFIRMEE:
      return "Livrée et confirmée";
    case CommandeStatut.ANNULEE:
      return "Annulée";
    case CommandeStatut.EN_LITIGE:
      return "En litige";
    case CommandeStatut.REMBOURSEE:
      return "Remboursée";
    default:
      return statut;
  }
};
