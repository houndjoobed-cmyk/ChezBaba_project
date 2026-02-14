import RestrictedAccess from "@/components/common/RestrictedAccess";
import OrderPageMain from "@/components/store/orderpage";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function OrderPage() {
  const session = await auth();

  if (!session) {
    return <RestrictedAccess />;
  }


  if (!session.user.tel) {
    redirect("/client/settings?error=missing_phone");
  }

  return <OrderPageMain />;
}
