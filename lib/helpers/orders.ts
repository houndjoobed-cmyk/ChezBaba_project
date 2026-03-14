import { OrderFromAPI, OrderFromDB } from "@/lib/types/order.types";

export function getOrderSelect() {
  return {
    id: true,
    date: true,
    montant: true,
    statut: true,
    clientId: true,
    client: {
      select: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            tel: true,
            imagePublicId: true,
          },
        },
      },
    },
    adresse: {
      select: {
        id: true,
        rue: true,
        ville: true,
        quartier: true,
        codePostal: true,
      },
    },
    lignesCommande: {
      select: {
        id: true,
        nomProduit: true,
        quantite: true,
        prixUnit: true,
        imagePublicId: true,
        produitId: true,
        produit: {
          select: {
            id: true,
            typeProduit: true,
            fichierNom: true,
          }
        },
        taille: {
          select: {
            id: true,
            nom: true,
          },
        },
        couleur: {
          select: {
            id: true,
            nom: true,
            code: true,
          },
        },
      },
    },
    paiement: {
      select: {
        id: true,
        statut: true,
        date: true,
      },
    },
    demandeRemboursement: {
      select: {
        id: true,
        statut: true,
        dateDemande: true,
        dateTraitement: true,
      }
    }
  };
}

export function formatOrderData(order: OrderFromDB): OrderFromAPI {
  const {
    id,
    date,
    montant,
    statut,
    adresse,
    lignesCommande,
    paiement,
    client,
    demandeRemboursement,
  } = order;

  return {
    id,
    date,
    montant: montant.toNumber(),
    statut,
    adresse,
    client: client
      ? {
        id: client.user.id,
        nom: client.user.nom,
        prenom: client.user.prenom,
        email: client.user.email,
        tel: client.user.tel,
        imagePublicId: client.user.imagePublicId,
      }
      : null,
    produits: lignesCommande.map((ligne) => ({
      ...ligne,
      prixUnit: ligne.prixUnit.toNumber(),
      typeProduit: ligne.produit?.typeProduit,
      fichierNom: ligne.produit?.fichierNom,
    })),
    paiement,
    demandeRemboursement: demandeRemboursement ? {
      id: (demandeRemboursement as { id: string; statut: string; dateDemande: Date; dateTraitement: Date | null }).id,
      statut: (demandeRemboursement as { id: string; statut: string; dateDemande: Date; dateTraitement: Date | null }).statut,
      dateDemande: (demandeRemboursement as { id: string; statut: string; dateDemande: Date; dateTraitement: Date | null }).dateDemande,
      dateTraitement: (demandeRemboursement as { id: string; statut: string; dateDemande: Date; dateTraitement: Date | null }).dateTraitement,
    } : null,
  };
}
