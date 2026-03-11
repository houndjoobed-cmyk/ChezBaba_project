"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Menu, X } from "lucide-react";

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  notificationCount: number;
  notificationLink: string;
}

export default function MobileHeader({
  isMobileMenuOpen,
  toggleMobileMenu,
  notificationCount,
  notificationLink,
}: MobileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/icons/baba.png"
            alt="Logo de ChezBaba"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification badge */}
        <Link href={notificationLink} className="relative">
          <Bell className="h-6 w-6 text-gray-700 hover:text-[#0C1B33] transition-colors" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>

        {/* Hamburger button */}
        <button
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-[#0C1B33]" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
}
