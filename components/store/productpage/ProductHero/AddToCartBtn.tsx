"use client";

// Redux
import { RootState } from "@/redux/store";
import { useState } from "react";
import { addToCart } from "@/redux/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Types
import { ProductFromAPI } from "@/lib/types/product.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AddToCartBtn = ({
  data,
}: {
  data: ProductFromAPI & { quantity: number };
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  return (
    <button
      type="button"
      className={cn(
        "bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white transition-all active:scale-95",
        {
          "hover:bg-black/80 cursor-pointer": data.quantity > 0 && !isAdded,
          "bg-green-600 hover:bg-green-700": isAdded,
          "bg-gray-400 cursor-not-allowed opacity-60": data.quantity === 0 && !isAdded,
        }
      )}
      disabled={data.quantity === 0 || isAdded}
      onClick={() => {
        dispatch(
          addToCart({
            id: data.id,
            name: data.nom,
            imagePublicId: data.images[0].imagePublicId,
            price: data.prix,
            color: colorSelection.id
              ? { id: colorSelection.id, name: colorSelection.nom }
              : undefined,
            size: sizeSelection.id
              ? { id: sizeSelection.id, name: sizeSelection.nom }
              : undefined,
            quantity: data.quantity,
          })
        );
        setIsAdded(true);
        toast.success("Produit ajouté au panier");
        setTimeout(() => setIsAdded(false), 2000);
      }}
    >
      {isAdded ? "Ajouté au panier !" : "Ajouter au panier"}
    </button>
  );
};

export default AddToCartBtn;
