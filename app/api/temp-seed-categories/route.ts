import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

export async function GET() {
    try {
        const newCategories = [
            { nom: "Livres & Média", description: "Littérature, éducation, musique et contenus multimédias" },
            { nom: "Produits digitaux", description: "Logiciels, abonnements, e-books et biens virtuels" }
        ];

        const results = [];
        for (const cat of newCategories) {
            const existing = await prisma.categorie.findFirst({
                where: { nom: cat.nom }
            });

            if (!existing) {
                await prisma.categorie.create({
                    data: cat
                });
                results.push(`Added category: ${cat.nom}`);
            } else {
                results.push(`Category already exists: ${cat.nom}`);
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
