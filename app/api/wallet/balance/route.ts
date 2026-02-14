import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Vérifier si l'utilisateur est un vendeur
        const vendeur = await prisma.vendeur.findUnique({
            where: { id: userId },
            include: {
                portefeuille: {
                    include: {
                        _count: {
                            select: { transactions: true }
                        }
                    }
                }
            }
        });

        if (!vendeur) {
            return NextResponse.json(
                { error: "Compte vendeur introuvable" },
                { status: 404 }
            );
        }

        // Si le portefeuille n'existe pas encore, on retourne 0
        const solde = vendeur.portefeuille?.solde.toNumber() || 0;
        const totalTransactions = vendeur.portefeuille?._count.transactions || 0;

        return NextResponse.json({
            data: {
                vendeurId: vendeur.id,
                solde,
                totalTransactions
            }
        });

    } catch (error) {
        console.error("Erreur récupération solde:", error);
        return NextResponse.json(
            { error: "Erreur interne serveur" },
            { status: 500 }
        );
    }
}
