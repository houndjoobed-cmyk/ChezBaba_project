"use client";

import { useState, useEffect } from "react";
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
import { fetchPaginatedDataFromAPI } from "@/lib/utils/fetchData";
import { NotificationFromAPI } from "@/lib/types/notification.types";

import { User } from "lucide-react";

const UserMenu = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchUnreadCount = async () => {
        const url = `/api/users/${session.user.id}/notifications?statut=nonlu&pageSize=1`;
        const result = await fetchPaginatedDataFromAPI<NotificationFromAPI[]>(
          url
        );
        if (result.data) {
          setUnreadCount(result.data.pagination.totalItems);
        }
      };

      fetchUnreadCount();
      // Poll every 60 seconds for new notifications
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [session]);

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
        <Button variant="ghost" className="p-1 md:p-2 relative">
          <User size={28} color="white" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {session ? (
          session.user.role === "ADMIN" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard" className="w-full">
                  Portail Admin
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </>
          ) : session.user.role === "VENDEUR" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/vendor/dashboard" className="w-full">
                  Portail Vendeur
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/vendor/notifications"
                  className="w-full flex justify-between items-center"
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href="/client/settings" className="w-full">
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/client/notifications"
                  className="w-full flex justify-between items-center"
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/client/orders" className="w-full">
                  Commandes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </>
          )
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/register" className="w-full">
                S&apos;inscrire
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/login" className="w-full">
                Se connecter
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
