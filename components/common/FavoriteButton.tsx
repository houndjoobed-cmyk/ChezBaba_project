"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

type FavoriteButtonProps = {
    productId: string;
    initialIsFavorite?: boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
};

export default function FavoriteButton({
    productId,
    initialIsFavorite = false,
    className = "",
    size = "md",
}: FavoriteButtonProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isChecked, setIsChecked] = useState(false);

    const checkFavoriteStatus = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch(
                `/api/users/${session.user.id}/favorites/${productId}`
            );
            if (response.ok) {
                const data = await response.json();
                setIsFavorite(data.data?.isFavorite || false);
            }
        } catch (error) {
            console.error("Error checking favorite status:", error);
        } finally {
            setIsChecked(true);
        }
    }, [session?.user?.id, productId]);

    // Check favorite status on mount if authenticated (only once)
    useEffect(() => {
        if (status === "authenticated" && session?.user?.id && !isChecked) {
            checkFavoriteStatus();
        }
    }, [status, session?.user?.id, isChecked, checkFavoriteStatus]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Redirect to login if not authenticated
        if (status !== "authenticated" || !session?.user?.id) {
            router.push(`/auth/login?callbackUrl=${window.location.pathname}`);
            return;
        }

        // Optimistic update - change UI immediately
        const previousState = isFavorite;
        setIsFavorite(!isFavorite);

        // Make API call in background
        try {
            if (previousState) {
                // Was favorite, now removing
                const response = await fetch(
                    `/api/users/${session.user.id}/favorites/${productId}`,
                    { method: "DELETE" }
                );
                // Revert if failed
                if (!response.ok) {
                    setIsFavorite(previousState);
                }
            } else {
                // Was not favorite, now adding
                const response = await fetch(
                    `/api/users/${session.user.id}/favorites`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ produitId: productId }),
                    }
                );
                // Revert if failed
                if (!response.ok) {
                    setIsFavorite(previousState);
                }
            }
        } catch (error) {
            // Revert on error
            console.error("Error toggling favorite:", error);
            setIsFavorite(previousState);
        }
    };

    const sizeClasses = {
        sm: "w-7 h-7 text-sm",
        md: "w-9 h-9 text-base",
        lg: "w-11 h-11 text-lg",
    };

    const iconSize = {
        sm: 14,
        md: 18,
        lg: 22,
    };

    return (
        <button
            onClick={toggleFavorite}
            className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        bg-white/90 backdrop-blur-sm
        shadow-md
        transition-all duration-200
        hover:scale-110 hover:bg-white
        active:scale-95
        ${className}
      `}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
            {isFavorite ? (
                <FaHeart
                    className="text-green-600 transition-transform duration-200 animate-[heartPop_0.3s_ease-out]"
                    size={iconSize[size]}
                />
            ) : (
                <FiHeart
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                    size={iconSize[size]}
                />
            )}
        </button>
    );
}
