"use client";

import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { satoshi } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import StockErrorModal from "./StockErrorModal";

export default function CartOrderSummary() {
  const router = useRouter();
  const { cart, totalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );

  const [isChecking, setIsChecking] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;

    setIsChecking(true);
    setErrorMessage(null);

    const payload = {
      produits: cart.items.map((item) => ({
        produitId: item.id,
        quantite: item.quantity,
        couleurId: item.color?.id,
        tailleId: item.size?.id,
      })),
    };

    try {
      const response = await fetch("/api/orders/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Everything is fine, go to payment page
        await response.json();
        router.push("/order");
      } else if (response.status === 409) {
        // Stock error
        const data = await response.json();
        setErrorMessage(data.error);
        setShowErrorModal(true);
      } else {
        // Other error
        const data = await response.json();
        alert(data.error || "Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Checkout check failed:", error);
      alert("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <div className="w-full lg:max-w-[505px] p-6 sm:p-8 rounded-2xl border border-black/10 shadow-md bg-white">
        <h3
          className={cn(
            satoshi.className,
            "text-xl md:text-2xl font-bold text-black mb-6 flex items-center gap-3"
          )}
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
          </div>
          Résumé de la commande
        </h3>

        <div className="flex flex-col space-y-4">
          {cart?.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-black py-2"
            >
              <span className="text-sm md:text-base text-gray-700 truncate max-w-[60%] flex flex-col">
                <span className={cn(satoshi.className, "")}>
                  {item.quantity} × {item.name}
                </span>
                {(item.color || item.size) && (
                  <span className={cn(satoshi.className, "ml-[25px] text-xs")}>
                    {item.color && `Couleur: ${item.color.name}`}
                    {item.color && item.size && ", "}
                    {item.size && `Taille: ${item.size.name}`}
                  </span>
                )}
              </span>

              <span
                className={cn(
                  satoshi.className,
                  "text-sm md:text-base font-medium"
                )}
              >
                {item.quantity * item.price} FCFA
              </span>
            </div>
          ))}

          <hr className="border-t border-gray-200 my-2" />

          <div className="flex items-center justify-between py-2">
            <span
              className={cn(
                satoshi.className,
                "md:text-xl text-gray-800 font-medium"
              )}
            >
              Total
            </span>
            <span
              className={cn(
                satoshi.className,
                "text-xl md:text-2xl font-bold text-black"
              )}
            >
              {totalPrice} FCFA
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleCheckout}
          disabled={isChecking || !cart || cart.items.length === 0}
          className={cn(
            satoshi.className,
            "mt-6 text-sm md:text-base font-medium bg-gradient-to-r from-gray-800 to-black rounded-full w-full py-4 h-[54px] md:h-[60px] text-white group hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          )}
        >
          {isChecking ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : (
            "Passer la commande"
          )}
          {!isChecking && (
            <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all duration-200" />
          )}
        </Button>
      </div>

      <StockErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
      />
    </>
  );
}
