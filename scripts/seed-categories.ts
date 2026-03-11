// This seed script is no longer needed (insertCategories module was removed).
// Categories are now managed through the admin dashboard.

import { prisma } from "@/lib/utils/prisma";

async function main() {
    console.log("Categories seeding is no longer supported via this script.");
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
