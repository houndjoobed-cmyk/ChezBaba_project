"use client";

import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { ProductFromAPI } from "@/lib/types/product.types";
import { getImageUrlFromPublicId } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";
import QuickAddToCartButton from "./QuickAddToCartButton";

type ProductCardProps = {
  data: ProductFromAPI;
  showFavorite?: boolean;
  showAddToCart?: boolean;
};

const ProductCard = ({ data, showFavorite = true, showAddToCart = true }: ProductCardProps) => {
  return (
    <div className="relative flex flex-col items-start justify-start aspect-auto">
      {/* Action Buttons - Top Right */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        {showFavorite && (
          <FavoriteButton
            productId={data.id}
            initialIsFavorite={(data as { isFavorite?: boolean }).isFavorite}
            size="sm"
          />
        )}
        {showAddToCart && (
          <QuickAddToCartButton
            productId={data.id}
            productName={data.nom}
            productPrice={data.prixPromo || data.prix}
            productImagePublicId={data.images[0]?.imagePublicId || null}
            size="sm"
          />
        )}
      </div>

      <Link
        href={`/product/${data.id}`}
        className="flex flex-col items-start justify-start w-full relative"
      >
        <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden relative">
          {/* Badge New */}
          {new Date(data.dateCreation) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <span className="absolute top-2 left-2 bg-[#EA9010] text-white text-[10px] xl:text-xs font-bold px-2 py-1 rounded-full z-20">
              New
            </span>
          )}

          {/* Out of Stock Overlay */}
          {data.qteStock === 0 && (
            <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center rounded-[13px] lg:rounded-[20px]">
              <span className="bg-white/90 text-amber-600 text-xs xl:text-sm font-bold px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                Rupture de stock
              </span>
            </div>
          )}

          <Image
            src={
              data.images[0]?.imagePublicId
                ? getImageUrlFromPublicId(data.images[0].imagePublicId)
                : "/images/placeholder.png"
            }
            width={295}
            height={298}
            className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
            alt={data.nom}
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-1 w-full mt-1">
          {/* Vendeur / Boutique Name */}
          {data.vendeur?.nomBoutique && (
            <span className="text-gray-400 text-[11px] xl:text-xs truncate">
              {data.vendeur.nomBoutique}
            </span>
          )}

          <strong className="text-black text-sm xl:text-base text-start line-clamp-1 leading-tight" title={data.nom}>
            {data.nom}
          </strong>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Rating
              initialValue={data.noteMoyenne}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={14}
              readonly
            />
            <span className="text-black/70 text-[11px] xl:text-xs">
              {data.noteMoyenne.toFixed(1)}/5
            </span>
          </div>

          {/* Price Row */}
          {data.prixPromo && data.prixPromo > 0 ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-green-600 text-base xl:text-lg leading-tight">
                {data.prixPromo} FCFA
              </span>
              <span className="text-gray-400 text-xs line-through">
                {data.prix} FCFA
              </span>
              <span className="text-[10px] xl:text-xs font-semibold bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">
                -{Math.round(((data.prix - data.prixPromo) / data.prix) * 100)}%
              </span>
            </div>
          ) : (
            <span className="font-bold text-black text-base xl:text-lg leading-tight">
              {data.prix} FCFA
            </span>
          )}

          {/* Delivery Badge */}
          {data.delaiLivraison && (
            <span className="text-gray-400 text-[10px] xl:text-xs flex items-center gap-1">
              <span>🚚</span> {data.delaiLivraison}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
