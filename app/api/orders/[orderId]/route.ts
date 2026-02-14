import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { formatOrderData, getOrderSelect } from "@/lib/helpers/orders";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.UNAUTHORIZED },
            { status: 401 }
        );
    }

    try {
        console.log(`[GET /api/orders/${orderId}] Fetching order for user ${session.user.id}`);
        const order = await prisma.commande.findUnique({
            where: { id: orderId },
            select: getOrderSelect(),
        });

        if (!order) {
            console.error(`[GET /api/orders/${orderId}] Order not found`);
            return NextResponse.json(
                { error: ERROR_MESSAGES.NOT_FOUND, details: `Order ${orderId} not found in database.` },
                { status: 404 }
            );
        }

        // Ownership check: Only owner or admin can see order details
        if (session.user.role !== "ADMIN" && order.clientId !== session.user.id) {
            console.error(`[GET /api/orders/${orderId}] Forbidden: Owner is ${order.clientId}, requester is ${session.user.id}`);
            return NextResponse.json(
                { error: ERROR_MESSAGES.FORBIDDEN },
                { status: 403 }
            );
        }

        const formattedData = formatOrderData(order);

        return NextResponse.json(
            {
                message: "Commande récupérée avec succès",
                data: formattedData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API Error [GET /api/orders/[orderId]]:", error);
        return NextResponse.json(
            {
                error: ERROR_MESSAGES.INTERNAL_ERROR,
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
