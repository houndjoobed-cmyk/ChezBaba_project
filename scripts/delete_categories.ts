import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const categoryNamesToRemove = [
        "Hauts",
        "Bas",
        "Robes & Ensembles",
        "Vestes & Manteaux",
        "Chaussures",
        "Accessoires"
    ];

    console.log('Fetching categories to delete...');

    const categories = await prisma.categorie.findMany({
        where: {
            nom: {
                in: categoryNamesToRemove
            }
        }
    });

    console.log(`Found ${categories.length} categories to delete:`, categories.map(c => c.nom));

    if (categories.length > 0) {
        const ids = categories.map(c => c.id);

        // First need to handle any products that might be attached to these categories
        // or cascading deletes. Assuming Prisma schema handles cascading deletes or we need to detach them.
        // For safety, let's just delete the categories. If it fails due to foreign keys, we'll know.

        try {
            const result = await prisma.categorie.deleteMany({
                where: {
                    id: {
                        in: ids
                    }
                }
            });
            console.log(`Successfully deleted ${result.count} categories.`);
        } catch (error) {
            console.error("Error deleting categories:", error);
        }
    } else {
        console.log("No categories found matching the names.");
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
