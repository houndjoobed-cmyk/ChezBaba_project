"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/layout/store/Header/UserMenu";

// Bootstrap Icons (assume they are globally available or use <i> tags)
// Icon names: house, grid, heart, person

import { Home, LayoutGrid, Heart, User } from "lucide-react";

// Icon components mapping
const icons = {
  Home,
  LayoutGrid,
  Heart,
  User,
};

const navItems = [
  { href: "/", label: "Accueil", icon: "Home" },
  { href: "/categories", label: "Catégories", icon: "LayoutGrid" },
  { href: "/favorites", label: "Favoris", icon: "Heart" },
  { href: "/profile", label: "Compte", icon: "User" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="bottom-nav" role="navigation">
        {navItems.map((item) => {
          if (item.label === "Compte") {
            return (
              <div key="usermenu" className="bottom-nav-link">
                <UserMenu />
              </div>
            );
          }

          const IconComponent = icons[item.icon as keyof typeof icons];

          return (
            <Link
              key={item.href}
              href={item.href}
              className="bottom-nav-link"
              aria-label={item.label}
            >
              <span
                className="bottom-nav-icon"
                aria-hidden="true"
                style={{ color: "white" }}
              >
                <IconComponent size={24} />
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
