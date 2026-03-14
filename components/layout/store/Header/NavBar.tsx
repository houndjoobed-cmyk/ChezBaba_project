"use client";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, ShoppingCart } from "lucide-react";
import BottomNav from "@/components/common/BottomNav";
import NotificationBtn from "@/components/layout/store/Header/NotificationBtn";
import UserMenu from "@/components/layout/store/Header/UserMenu";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

const Navbar = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);

  const Marquee = () =>
    <div className="welcome-marquee-container">
      <div className="welcome-marquee-content">
        <div className="welcome-marquee-text">
          <span style={{ color: 'var(--primary-color)' }}>ChezBaba</span> : le moins cher! &bull; Profitez de nos offres exceptionnelles &bull; Retrait facile en magasin &bull; La qualité au meilleur prix !
        </div>
        <div className="welcome-marquee-text">
          <span style={{ color: 'var(--primary-color)' }}>ChezBaba</span> : le moins cher! &bull; Profitez de nos offres exceptionnelles &bull; Retrait facile en magasin &bull; La qualité au meilleur prix !
        </div>
      </div>
    </div>
    ;

  return (
    <>
      <nav className="sticky top-0 z-50">
        {/* Desktop/navbar classique */}
        <div className="navBar navBar-desktop shadow-lg">
          <div className="max-w-frame mx-auto logo_searchBar_button" style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '20px 20px' }}>
            <div className="nav_logo">
              <Link href="/" className="logo_link transition-transform hover:scale-105" aria-label="Accueil ChezBaba">
                <Image src="/images/logo-removebg-preview.png" alt="CHEZ BABA" width={120} height={60} className="logo-image" />
              </Link>
            </div>

            {/* Message de Bienvenue Défilant */}
            <Marquee />

            {/* Bouton Catégories */}
            <Link
              href="/categories"
              className="categorie_button group flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-secondary text-white font-bold transition-all hover:bg-white hover:text-brand-secondary border-2 border-transparent hover:border-brand-secondary shadow-md"
            >
              <LayoutGrid size={20} className="transition-transform group-hover:rotate-90" />
              <span>Catégories</span>
            </Link>

            {/* Icônes */}
            <div className="button_icons flex items-center gap-6">
              <NotificationBtn size={26} />
              <Link href="/cart" className="icone group relative p-2 transition-colors hover:text-brand-primary" aria-label="Panier">
                <ShoppingCart size={26} />
                <span className="cart-badge absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in duration-300">
                  {cart ? cart.totalQuantities : 0}
                </span>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Mobile : section haute (logo + panier) */}
        <div className="navBar navBar-mobile-top shadow-md">
          <div className="navBar_mobile_row">
            <div className="nav_logo">
              <Link href="/" className="logo_link" aria-label="Accueil ChezBaba">
                <Image src="/images/logo-removebg-preview.png" alt="CHEZ BABA" width={100} height={50} className="logo-image" />
              </Link>
            </div>
            <div className="navBar_connexion_cart flex items-center gap-3">
              <NotificationBtn size={24} />
              <Link href="/cart" className="icone relative p-2" aria-label="Panier">
                <ShoppingCart size={24} />
                <span className="cart-badge absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                  {cart ? cart.totalQuantities : 0}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile : section basse (Message défilant) */}
        <div className="navBar navBar-mobile-bottom">
          <Marquee />
        </div>
      </nav>
      {/* Bottom navigation mobile only */}
      <BottomNav />
    </>
  );
}

export default Navbar;
