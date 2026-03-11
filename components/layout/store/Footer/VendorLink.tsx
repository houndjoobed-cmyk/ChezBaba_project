"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";

interface VendorLinkProps {
    role?: string;
}

export default function VendorLink({ role }: VendorLinkProps) {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const handleClick = (e: React.MouseEvent) => {
        if (role === "VENDEUR") {
            e.preventDefault();
            toast.info("Vous êtes déjà vendeur sur ChezBaba.");
            startTransition(() => {
                router.push("/vendor/dashboard");
            });
        }
    };

    let href = "/auth/register"; // Default for VISITOR
    if (role === "CLIENT") {
        href = "/client/settings?tab=vendor";
    } else if (role === "VENDEUR") {
        href = "/vendor/dashboard";
    } else if (role === "ADMIN") {
        href = "/admin"; // Or maybe they shouldn't click it, but just in case
    }

    return (
        <Link
            href={href}
            onClick={handleClick}
            className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm"
        >
            Devenir Vendeur
        </Link>
    );
}
