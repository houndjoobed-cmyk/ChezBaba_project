"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

// UI Components

// hooks
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

import { Bell } from "lucide-react";

interface NotificationBtnProps {
  size?: number;
  className?: string;
  badgeColor?: string;
}

const NotificationBtn = ({ size = 24, className = "", badgeColor = "#EA9010" }: NotificationBtnProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const { unreadCount } = useUnreadNotifications(userId);

  if (!session) return null;

  let notificationPath = "/client/notifications";
  if (userRole === "ADMIN") {
    notificationPath = "/admin/notifications";
  } else if (userRole === "VENDEUR") {
    notificationPath = "/vendor/notifications";
  }

  return (
    <Link href={notificationPath} className={`icone relative group p-2 transition-colors hover:text-brand-primary ${className}`} aria-label="Notifications">
      <Bell size={size} />
      {unreadCount > 0 && (
        <span 
          className="cart-badge absolute -top-1 -right-1 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in duration-300"
          style={{ background: badgeColor }}
        >
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBtn;
