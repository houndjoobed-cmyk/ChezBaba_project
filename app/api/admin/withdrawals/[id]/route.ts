import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateWithdrawalStatus } from "@/lib/services/wallet.service";
import { UserRole, StatutRetrait } from "@prisma/client";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { z } from "zod";

const updateStatusSchema = z.object({
    statut: z.nativeEnum(StatutRetrait),
});

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.UNAUTHORIZED },
                { status: 401 }
            );
        }

        const body = await req.json();
        const parsed = updateStatusSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Statut invalide" },
                { status: 400 }
            );
        }

        await updateWithdrawalStatus(
            id,
            parsed.data.statut,
            session.user.id
        );

        return NextResponse.json({ message: "Statut mis à jour avec succès" });
    } catch (error) {
        console.error("Error updating withdrawal status:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
