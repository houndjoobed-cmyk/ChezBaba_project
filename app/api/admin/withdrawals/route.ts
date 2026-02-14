import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllWithdrawals } from "@/lib/services/wallet.service";
import { UserRole, DemandeRetraitStatut } from "@prisma/client";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.UNAUTHORIZED },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const pageSize = Number(searchParams.get("pageSize")) || 20;
        const statut = searchParams.get("statut") as DemandeRetraitStatut | undefined;

        const result = await getAllWithdrawals(page, pageSize, statut);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching withdrawals:", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
