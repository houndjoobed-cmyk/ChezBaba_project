import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { formatValidationErrors, prepareOrderSchema } from "@/lib/validations";
import { Decimal } from "@prisma/client/runtime/library";
import { BadRequestIdError } from "@/lib/classes/BadRequestIdError";
import { OutOfStockError } from "@/lib/classes/OutOfStockError";
import { PrepareOrderFromAPI } from "@/lib/types/order.types";

// POST: Prepare a new order (client only) - Checks stock availability
export async function POST(req: NextRequest) {
  const session = await auth();

  // Check authentication
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Parse and validate request body
  const body = await req.json();
  const parsed = prepareOrderSchema.safeParse(body);

  if (!parsed.success) {
    return formatValidationErrors(parsed);
  }

  const { produits } = parsed.data;

  try {
    // Retrieve all products in a single batch to avoid multiple lookups
    const productIds = produits.map((p) => p.produitId);
    const tailleIds = produits.map((p) => p.tailleId).filter((id): id is string => id !== undefined);

    const dbProducts = await prisma.produit.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        nom: true,
        prix: true,
        qteStock: true,
        couleurs: {
          select: { id: true, nom: true, code: true },
        },
        tailles: {
          select: { id: true, nom: true },
        },
        images: { select: { imagePublicId: true }, take: 1 },
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Fetch product details and calculate total
    let total = new Decimal(0);
    const ligneCommandeData = [];

    for (const line of produits) {
      const produit = productMap.get(line.produitId);

      if (!produit) {
        throw new BadRequestIdError(
          `Produit avec l'ID ${line.produitId} non trouvé.`
        );
      }

      // Check stock at preparation step
      if (produit.qteStock < line.quantite) {
        throw new OutOfStockError(
          `Le produit "${produit.nom}" n'est plus disponible en quantité suffisante (Stock restant : ${produit.qteStock}).`
        );
      }

      const prixUnit = produit.prix;
      const quantite = line.quantite;
      const sousTotal = prixUnit.mul(quantite);
      total = total.add(sousTotal);

      // Filter the exact color/size if provided
      const selectedCouleur = line.couleurId
        ? produit.couleurs.find((c) => c.id === line.couleurId)
        : null;
      const selectedTaille = line.tailleId
        ? produit.tailles.find((t) => t.id === line.tailleId)
        : null;

      // If ID was provided but not found in product variants
      if ((line.couleurId && !selectedCouleur) || (line.tailleId && !selectedTaille)) {
        throw new BadRequestIdError(
          `Variante (couleur/taille) pour le produit "${produit.nom}" non trouvée.`
        );
      }

      ligneCommandeData.push({
        id: produit.id,
        nomProduit: produit.nom,
        quantite,
        prixUnit: prixUnit.toNumber(),
        imagePublicId: produit.images[0]?.imagePublicId ?? null,
        produitId: produit.id,
        couleur: selectedCouleur,
        taille: selectedTaille,
        couleurId: line.couleurId ?? null,
        tailleId: line.tailleId ?? null,
      });
    }

    const order: PrepareOrderFromAPI = {
      montant: total.toNumber(),
      produits: ligneCommandeData,
    };

    return NextResponse.json(
      { message: "La commande a été préparée avec succès.", data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error [POST /api/orders/prepare]:", error);

    if (error instanceof BadRequestIdError) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BAD_REQUEST_ID },
        { status: 400 }
      );
    }

    if (error instanceof OutOfStockError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
