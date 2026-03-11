const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.produit.findUnique({ where: { id: 'cmm3ev3qp0002g2fwinrqhstn' } });
    console.log(p.fichierUrl);
}

main().catch(console.error).finally(() => prisma.$disconnect());
