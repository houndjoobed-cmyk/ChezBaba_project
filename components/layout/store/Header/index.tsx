"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/common/BottomNav";
import UserMenu from "@/components/layout/store/Header/UserMenu";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

import { LayoutGrid, Heart, ShoppingCart, Search } from "lucide-react";

const Navbar = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);
  return (
    <>
      <nav>
        {/* Desktop/navbar classique */}
        <div className="navBar navBar-desktop">
          {/* ...section navBar_connexion_inscription retirée... */}
          {/* ...section navBar_connexion_inscription retirée... */}
          {/* Ligne unique : logo, recherche, catégorie, icônes */}
          <div className="logo_searchBar_button" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {/* Logo */}
            <div className="nav_logo">
              <Link href="/" className="logo_link" aria-label="Accueil ChezBaba">
                <Image src="/images/logo-removebg-preview.png" alt="CHEZ BABA" width={120} height={60} className="logo-image" />
              </Link>
            </div>
            {/* Message de Bienvenue Défilant */}
            <div className="welcome-marquee-container">
              <div className="welcome-marquee-text">
                <span style={{ color: 'var(--primary-color)' }}>ChezBaba</span> : le moins cher! &bull; Profitez de nos offres exceptionnelles &bull; Retrait facile en magasin &bull; la qualité au meilleur prix !
              </div>
            </div>
            {/* Bouton Catégories */}
            <Link href="/categories" className="categorie_button" style={{ display: 'inline-block', marginRight: 24 }}>
              <LayoutGrid size={20} style={{ marginRight: 6, display: 'inline' }} /> Catégories
            </Link>
            {/* Icônes */}
            <div className="button_icons" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Link href="/favorites" className="icone" title="Mes Favoris">
                <Heart size={24} />
              </Link>
              <Link href="/cart" className="icone" style={{ position: 'relative' }}>
                <ShoppingCart size={24} />
                <span className="cart-badge" style={{ background: '#EA9010' }}>{cart ? cart.totalQuantities : 0}</span>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
        {/* Mobile : section haute (logo + panier) */}
        <div className="navBar navBar-mobile-top">
          <div className="navBar_mobile_row">
            <div className="nav_logo">
              <Link href="/" className="logo_link" aria-label="Accueil ChezBaba">
                <Image src="/images/logo-removebg-preview.png" alt="CHEZ BABA" width={100} height={50} className="logo-image" />
              </Link>
            </div>
            <div className="navBar_connexion_cart">
              <Link href="/cart" className="icone" style={{ position: 'relative' }}>
                <ShoppingCart size={24} />
                <span className="cart-badge" style={{ background: '#EA9010' }}>{cart ? cart.totalQuantities : 0}</span>
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile : section basse (Message défilant) */}
        <div className="navBar navBar-mobile-bottom">
          <form className="search_input_button" style={{ flex: 1 }}>
            <input type="text" className="search_input" placeholder="Rechercher un produit" />
            <button type="submit" className="search_icon_btn">
              <Search size={20} />
            </button>
          </form>
        </div>
      </nav>
      {/* Bottom navigation mobile only */}
      <BottomNav />
    </>
  );
}

export default Navbar;
