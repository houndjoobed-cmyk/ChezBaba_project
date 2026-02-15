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
            const isActive = pathname === item.href;
            return (
              <div key="usermenu" className="bottom-nav-link">
                <UserMenu
                  color={isActive ? "#bdfe00" : "#0C1B33"}
                  className={isActive ? "active" : ""}
                />
              </div>
            );
          }

          const isActive = pathname === item.href;
          const IconComponent = icons[item.icon as keyof typeof icons];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-link ${isActive ? "active" : ""}`}
              aria-label={item.label}
            >
              <span
                className={`bottom-nav-icon ${isActive ? "active" : ""}`}
                aria-hidden="true"
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
