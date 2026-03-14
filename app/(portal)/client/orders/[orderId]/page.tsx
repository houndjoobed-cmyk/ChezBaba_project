"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

/**
 * Fallback page to handle old /client/orders/[orderId] links.
 * Redirects them to /client/orders?orderId=[orderId].
 */
export default function OrderRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;

  useEffect(() => {
    if (orderId) {
      router.replace(`/client/orders?orderId=${orderId}`);
    } else {
      router.replace("/client/orders");
    }
  }, [orderId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}
