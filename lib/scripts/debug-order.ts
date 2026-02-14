import { prisma } from "../utils/prisma";
import fs from 'fs';

async function main() {
    const orderId = "cmlmreino000ng2wsd49dlt0j";
    let output = `Analyzing order: ${orderId}\n`;

    const commande = await prisma.commande.findUnique({
        where: { id: orderId },
        include: {
            paiement: true,
            lignesCommande: true,
        },
    });

    if (!commande) {
        fs.writeFileSync('debug-output.txt', "Order not found!");
        return;
    }

    output += JSON.stringify({
        PAYMENT_DETAILS: {
            id: commande.paiement?.id,
            statut: commande.paiement?.statut,
            montantBrut: commande.paiement?.montantBrut.toString(),
            montantNetVendeur: commande.paiement?.montantNetVendeur.toString(),
        },
        ORDER_STATUS: commande.statut
    }, null, 2) + "\n\n";

    const produitIds = commande.lignesCommande
        .map((l) => l.produitId)
        .filter((id): id is string => id !== null);

    const vendors = await prisma.produitMarketplace.findMany({
        where: { produitId: { in: produitIds } },
        select: { vendeurId: true },
    });

    const vendeurIds = [...new Set(vendors.map(v => v.vendeurId))];
    output += `Vendor IDs: ${JSON.stringify(vendeurIds)}\n\n`;

    for (const vid of vendeurIds) {
        const wallet = await prisma.portefeuilleVendeur.findUnique({
            where: { vendeurId: vid },
            include: { transactions: true }
        });

        output += `WALLET VENDOR ${vid}:\n`;
        output += JSON.stringify({
            id: wallet?.id,
            balance: wallet?.solde.toString(),
            transactions: wallet?.transactions.map(t => ({
                id: t.id,
                type: t.type,
                amount: t.montant.toString(),
                desc: t.description,
                date: t.date
            }))
        }, null, 2) + "\n\n";
    }

    fs.writeFileSync('debug-output.txt', output);
    console.log("Debug output written to debug-output.txt");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
