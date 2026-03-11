import React from "react";
import { ProductFromAPI } from "@/lib/types/product.types";

const ProductDetails = ({ product }: { product: ProductFromAPI }) => {
  const details: { label: string; value: string | null | undefined }[] = [
    {
      label: "Catégorie",
      value: product.categorie?.parent?.nom
        ? `${product.categorie.parent.nom} > ${product.categorie.nom}`
        : product.categorie?.nom,
    },
    {
      label: "Genre",
      value: product.genre?.nom,
    },
    {
      label: "Prix",
      value: `${product.prix} FCFA`,
    },
    ...(product.prixPromo && product.prixPromo > 0
      ? [
        {
          label: "Prix promotionnel",
          value: `${product.prixPromo} FCFA (-${Math.round(((product.prix - product.prixPromo) / product.prix) * 100)}%)`,
        },
      ]
      : []),
    {
      label: "Couleurs",
      value:
        product.couleurs.length > 0
          ? product.couleurs.map((c) => c.nom).join(", ")
          : null,
    },
    {
      label: "Tailles",
      value:
        product.tailles.length > 0
          ? product.tailles.map((t) => t.nom).join(", ")
          : null,
    },
    {
      label: "Fournisseur",
      value: product.fournisseur,
    },
    {
      label: "Délai de livraison",
      value: product.delaiLivraison,
    },
    {
      label: "Garantie",
      value: product.garantie,
    },
    {
      label: "Stock disponible",
      value:
        product.typeProduit === "DIGITAL"
          ? "Disponible (Produit Digital)"
          : product.qteStock > 0
            ? `${product.qteStock} unité(s)`
            : "Rupture de stock",
    },
  ];

  // Filter out null/undefined values
  const filteredDetails = details.filter(
    (d) => d.value !== null && d.value !== undefined && d.value !== ""
  );

  if (filteredDetails.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Aucun détail disponible pour ce produit.
      </p>
    );
  }

  return (
    <div>
      {filteredDetails.map((item, i) => (
        <div className="grid grid-cols-3" key={i}>
          <div>
            <p className="text-sm py-3 w-full leading-7 lg:py-4 pr-2 text-neutral-500">
              {item.label}
            </p>
          </div>
          <div className="col-span-2 py-3 lg:py-4 border-b">
            <p className="text-sm w-full leading-7 text-neutral-800 font-medium">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductDetails;
