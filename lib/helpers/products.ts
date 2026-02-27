import { ProductFromDB, ProductFromAPI } from "@/lib/types/product.types";

export function getProductSelect() {
  return {
    // Attributes
    id: true,
    nom: true,
    objet: true,
    description: true,
    prix: true,
    qteStock: true,
    noteMoyenne: true,
    totalEvaluations: true,
    dateCreation: true,
    dateModification: true,
    delaiLivraison: true,
    prixPromo: true,
    garantie: true,
    typeProduit: true,
    fichierUrl: true,
    fichierNom: true,
    messageApresAchat: true,
    lienApresAchat: true,
    // Relations
    genre: true,
    categorie: {
      select: {
        id: true,
        nom: true,
        parent: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    },
    couleurs: true,
    tailles: true,
    produitBoutique: {
      select: { fournisseur: true },
    },
    produitMarketplace: {
      select: {
        vendeur: {
          select: {
            id: true,
            nomBoutique: true,
            description: true,
            client: {
              select: {
                user: {
                  select: { imagePublicId: true },
                },
              },
            },
          },
        },
      },
    },
    images: {
      select: {
        id: true,
        imagePublicId: true,
      },
    },
    video: {
      select: {
        id: true,
        videoPublicId: true,
      },
    },
  };
}

export function formatProductData(product: ProductFromDB): ProductFromAPI {
  const {
    produitMarketplace,
    produitBoutique,
    id,
    nom,
    objet,
    description,
    prix,
    qteStock,
    noteMoyenne,
    video,
    delaiLivraison,
    prixPromo,
    garantie,
    ...rest
  } = product;

  return {
    id,
    type: produitBoutique
      ? "boutique"
      : produitMarketplace
        ? "marketplace"
        : null,
    nom,
    objet,
    description,
    prix: prix.toNumber(),
    qteStock,
    noteMoyenne: noteMoyenne?.toNumber(),
    delaiLivraison,
    prixPromo: prixPromo && typeof (prixPromo as { toNumber?: () => number }).toNumber === 'function'
      ? (prixPromo as { toNumber: () => number }).toNumber()
      : (prixPromo as number | null),
    garantie,
    ...rest,
    video,
    ...(produitBoutique ? { fournisseur: produitBoutique.fournisseur } : {}),
    ...(produitMarketplace
      ? {
        vendeur: {
          id: produitMarketplace.vendeur.id,
          nomBoutique: produitMarketplace.vendeur.nomBoutique,
          description: produitMarketplace.vendeur.description,
          imagePublicId: produitMarketplace.vendeur.client.user.imagePublicId,
        },
      }
      : {}),
  };
}
