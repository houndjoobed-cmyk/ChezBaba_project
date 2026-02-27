"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

// UI components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  color?: string;
  className?: string;
}

const UserMenu = ({ color, className }: UserMenuProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast("Déconnexion réussie");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast("Erreur lors de la déconnexion");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`p-1 md:p-2 relative user-menu-btn ${className || ""}`}>
          <Image
            priority
            src="/icons/user.svg"
            height={30}
            width={30}
            alt="user"
            className={`cursor-pointer w-auto h-[24px] sm:h-[26px] md:h-[28px] lg:h-[30px] user-icon-img ${!color || color === "white" ? "user-icon-white" : ""}`}
            style={{
              filter: color === "#bdfe00"
                ? "invert(80%) sepia(85%) saturate(1635%) hue-rotate(32deg) brightness(104%) contrast(106%)" // Vert primaire
                : color === "#0C1B33"
                  ? "invert(8%) sepia(35%) saturate(2361%) hue-rotate(185deg) brightness(95%) contrast(97%)" // Bleu foncé
                  : undefined
            }}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {session ? (
          session.user.role === "ADMIN" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard">Portail Admin</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </>
          ) : session.user.role === "VENDEUR" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/vendor/dashboard">Portail Vendeur</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href="/client/settings">Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/client/notifications">Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/client/orders">Commandes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </>
          )
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/register">S&apos;inscrire</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/login">Se connecter</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;