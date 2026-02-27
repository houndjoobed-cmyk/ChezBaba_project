import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES, LOW_STOCK_THRESHOLD } from "@/lib/constants/settings";
import {
  getPaginationParams,
  getSortingOrdersParams,
} from "@/lib/utils/params";
import { Prisma } from "@prisma/client";
import { formatOrderData, getOrderSelect } from "@/lib/helpers/orders";
import {
  formatValidationErrors,
  createOrderSchema,
} from "@/lib/validations";
import { Decimal } from "@prisma/client/runtime/library";
import { BadRequestIdError } from "@/lib/classes/BadRequestIdError";
import { OutOfStockError } from "@/lib/classes/OutOfStockError";

// GET & Search all orders for admin only
export async function GET(request: NextRequest) {
  const session = await auth();

  // Authentication and authorization check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  // Pagination & Sorting
  const { page, pageSize, skip } = getPaginationParams(request);
  const { sortBy, sortOrder } = getSortingOrdersParams(request);

  // Search
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  // Construct the filter
  const whereClause: Prisma.CommandeWhereInput = {
    ...(search && {
      OR: [
        { id: search },
        {
          lignesCommande: {
            some: {
              nomProduit: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
        {
          client: {
            user: {
              nom: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
        {
          client: {
            user: {
              prenom: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
      ],
    }),
  };

  try {
    const total = await prisma.commande.count({
      where: whereClause,
    });

    const commandes = await prisma.commande.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: getOrderSelect(),
      take: pageSize,
      skip,
    });

    const formattedData = commandes.map(formatOrderData);

    const pagination = {
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize,
    };

    return NextResponse.json(
      {
        message: "Commandes récupérées avec succès",
        pagination,
        data: formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET /api/orders]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// POST: Create a new order (client only)
export async function POST(req: NextRequest) {
  const session = await auth();

  // Check authentication
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Check if user has a phone number
  if (!session.user.tel) {
    return NextResponse.json(
      { error: "Un numéro de téléphone est requis pour passer une commande. Veuillez l'ajouter à votre profil." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return formatValidationErrors(parsed);
  }

  const { userId, addresse, produits } = parsed.data;

  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    // Start transaction with increased timeout (15s)
    const order = await prisma.$transaction(
      async (tx) => {
        // Verify that the user exists in the DB (JWT session might be stale if DB was reset)
        const userExists = await tx.user.findUnique({ where: { id: userId } });
        if (!userExists) {
          throw new Error("L'utilisateur n'existe pas dans la base de données. Veuillez vous reconnecter.");
        }

        // Ensure the user has a client profile (required for the FK constraint)
        await tx.client.upsert({
          where: { id: userId },
          create: { id: userId },
          update: {},
        });

        // Create address
        const address = await tx.adresse.create({ data: addresse });

        // Retrieve all products in a single batch to avoid multiple lookups
        const productIds = produits.map((p) => p.produitId);
        const dbProducts = await tx.produit.findMany({
          where: { id: { in: productIds } },
          select: {
            id: true,
            nom: true,
            typeProduit: true,
            prix: true,
            prixPromo: true,
            qteStock: true,
            images: { select: { imagePublicId: true }, take: 1 },
          },
        });

        const productMap = new Map(dbProducts.map((p) => [p.id, p]));

        // Build order lines, calculate total, AND check/decrement stock
        let total = new Decimal(0);
        const ligneCommandeData = [];
        const updatedStocksMap = new Map<string, number>();

        for (const line of produits) {
          const produit = productMap.get(line.produitId);

          if (!produit) {
            throw new BadRequestIdError(
              `Produit avec l'ID ${line.produitId} introuvable.`
            );
          }

          // Check stock
          if (produit.typeProduit !== "DIGITAL" && produit.qteStock < line.quantite) {
            throw new OutOfStockError(
              `Le produit "${produit.nom}" n'est plus disponible en quantité suffisante (Stock restant : ${produit.qteStock}).`
            );
          }

          // Decrement stock (atomic operation) and get updated data
          if (produit.typeProduit !== "DIGITAL") {
            const updatedProduit = await tx.produit.update({
              where: { id: produit.id },
              data: { qteStock: { decrement: line.quantite } },
              select: { qteStock: true },
            });

            updatedStocksMap.set(produit.id, updatedProduit.qteStock);
          } else {
            // Mock infinite stock for digital
            updatedStocksMap.set(produit.id, 9999);
          }

          const prixUnit = (produit.prixPromo && produit.prixPromo.greaterThan(0)) ? produit.prixPromo : produit.prix;
          const sousTotal = prixUnit.mul(line.quantite);
          total = total.add(sousTotal);

          ligneCommandeData.push({
            nomProduit: produit.nom,
            quantite: line.quantite,
            prixUnit,
            imagePublicId: produit.images[0]?.imagePublicId ?? null,
            produitId: produit.id,
            couleurId: line.couleurId ?? null,
            tailleId: line.tailleId ?? null,
          });
        }

        // Create order
        const newOrder = await tx.commande.create({
          data: {
            montant: total,
            clientId: userId,
            adresseId: address.id,
            lignesCommande: { create: ligneCommandeData },
          },
          select: getOrderSelect(),
        });

        // 1. Notify the Customer (paiement now handled via /api/payments/initiate)
        await tx.notification.create({
          data: {
            userId: userId,
            type: "COMMANDE",
            objet: "Commande confirmée !",
            text: `Votre commande n°${newOrder.id} d'un montant de ${total} FCFA a été validée avec succès.`,
            urlRedirection: `/client/orders`,
          },
        });

        // 2. Notify the Vendors
        // Get vendors for all products in this order
        const vendorsToNotify = await tx.produitMarketplace.findMany({
          where: { produitId: { in: productIds } },
          select: { vendeurId: true, produitId: true },
        });

        // Map product names for specific vendor messages
        for (const v of vendorsToNotify) {
          const product = productMap.get(v.produitId);
          const remainingStock = updatedStocksMap.get(v.produitId) ?? 0;

          // Notification de vente
          await tx.notification.create({
            data: {
              userId: v.vendeurId,
              type: "PAIEMENT",
              objet: "Nouvelle vente !",
              text: `Vous avez vendu un exemplaire de "${product?.nom}". Consultez votre tableau de bord vendeur pour plus de détails.`,
              urlRedirection: `/vendor/orders`,
            },
          });

          // Alerte de stock faible
          if (product?.typeProduit !== "DIGITAL" && remainingStock <= LOW_STOCK_THRESHOLD) {
            await tx.notification.create({
              data: {
                userId: v.vendeurId,
                type: "DEFAULT",
                objet: "Alert : Stock faible !",
                text: `Attention, il ne reste plus que ${remainingStock} unité(s) de votre produit "${product?.nom}". Pensez à réapprovisionner !`,
                urlRedirection: `/vendor/store`,
              },
            });
          }
        }

        return newOrder;
      },
      {
        maxWait: 5000,
        timeout: 20000, // Slightly increased to handle multiple notification creations
      }
    );

    const formattedOrder = formatOrderData(order);

    return NextResponse.json(
      {
        message: "Commande et paiement réussis",
        data: formattedOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error [POST /api/orders]:", error);

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
      {
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
