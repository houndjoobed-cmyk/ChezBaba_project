"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/common/BottomNav";
import UserMenu from "@/components/layout/store/Header/UserMenu";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

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
              <i className="bi bi-grid" style={{ marginRight: 6 }}></i> Catégories
            </Link>
            {/* Icônes */}
            <div className="button_icons" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Link href="/favorites" className="icone" title="Mes Favoris">
                <i className="bi bi-heart"></i>
              </Link>
              <Link href="/cart" className="icone" style={{ position: 'relative' }}>
                <i className="bi bi-cart3"></i>
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
                <i className="bi bi-cart3"></i>
                <span className="cart-badge" style={{ background: '#EA9010' }}>{cart ? cart.totalQuantities : 0}</span>
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile : section basse (Message défilant) */}
        <div className="navBar navBar-mobile-bottom">
          <div className="welcome-marquee-container">
            <div className="welcome-marquee-text">
              <span style={{ color: 'var(--primary-color)' }}>ChezBaba</span>:le moins cher! &bull; Retrait facile &bull; Livraison partout !
            </div>
          </div>
        </div>
      </nav>
      {/* Bottom navigation mobile only */}
      <BottomNav />
    </>
  );
}

export default Navbar;
