import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Checking and inserting new categories...");

    const newCategories = [
        { nom: "Livres & Média", description: "Littérature, éducation, musique et contenus multimédias" },
        { nom: "Produits digitaux", description: "Logiciels, abonnements, e-books et biens virtuels" }
    ];

    for (const cat of newCategories) {
        const existing = await prisma.categorie.findFirst({
            where: { nom: cat.nom }
        });

        if (!existing) {
            await prisma.categorie.create({
                data: cat
            });
            console.log(`Added category: ${cat.nom}`);
        } else {
            console.log(`Category already exists: ${cat.nom}`);
        }
    }

    console.log("Done updating categories.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
