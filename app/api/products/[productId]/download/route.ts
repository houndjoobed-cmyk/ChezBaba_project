import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { CommandeStatut } from "@prisma/client";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const session = await auth();
        const { productId } = await params;

        if (!session) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.UNAUTHORIZED },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // 1. Verify if the product exists and is DIGITAL
        const product = await prisma.produit.findUnique({
            where: { id: productId },
            select: {
                id: true,
                typeProduit: true,
                fichierUrl: true,
                fichierNom: true,
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.NOT_FOUND },
                { status: 404 }
            );
        }

        if (product.typeProduit !== "DIGITAL" || !product.fichierUrl) {
            return NextResponse.json(
                { error: "Ce produit n'est pas téléchargeable." },
                { status: 400 }
            );
        }

        // 2. Verify if the user has purchased this product
        const userPurchases = await prisma.ligneCommande.findFirst({
            where: {
                produitId: productId,
                commande: {
                    clientId: userId,
                    statut: {
                        in: [CommandeStatut.PAYEE, CommandeStatut.EXPEDIEE, CommandeStatut.LIVREE, CommandeStatut.LIVRAISON_CONFIRMEE],
                    },
                },
            },
        });

        if (!userPurchases) {
            return NextResponse.json(
                { error: "Vous devez acheter ce produit pour le télécharger." },
                { status: 403 }
            );
        }

        try {

            // Fetch the file directly from Cloudinary
            const fileResponse = await fetch(product.fichierUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Accept": "*/*",
                }
            });

            if (!fileResponse.ok) {
                console.error("Server fetch failed:", fileResponse.status, await fileResponse.text());
                // Fallback: Redirect user to the URL directly
                return NextResponse.redirect(product.fichierUrl);
            }

            const arrayBuffer = await fileResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename="${product.fichierNom || 'download'}"`,
                    "Content-Type": fileResponse.headers.get("content-type") || "application/octet-stream",
                },
            });

        } catch (fetchError) {
            console.error("Fetch exception:", fetchError);
            return NextResponse.redirect(product.fichierUrl);
        }

    } catch (error) {
        console.error("API Error [GET /api/products/:productId/download] :", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
