import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { formatUserData, getUserSelect } from "@/lib/helpers/users";

// Get all users (Admin only)
export async function GET(_req: NextRequest) {
  const session = await auth();

  // Authentication Check
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

  // Authorization Check: Only Admins
  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      select: getUserSelect(),
    });

    const data = users.map(formatUserData);

    return NextResponse.json(
      { message: "Les utilisateurs ont été récupérés avec succès", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error [GET ALL /api/users]:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

