import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaWhatsapp } from "react-icons/fa";

const StoreFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0C1B33] text-white pb-16 md:pb-0">
      {/* Main Footer Content */}
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">

            {/* Logo + Description - desktop only */}
            <div className="hidden md:block">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/images/logo-removebg-preview.png"
                  alt="CHEZ BABA"
                  width={140}
                  height={70}
                  className="brightness-110"
                />
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Plateforme marketplace centralisée pour petits et grands commerces au Bénin.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#bdfe00] hover:text-[#0C1B33] flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#bdfe00] hover:text-[#0C1B33] flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#bdfe00] hover:text-[#0C1B33] flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#bdfe00] hover:text-[#0C1B33] flex items-center justify-center transition-all duration-300"
                aria-label="TikTok"
              >
                <FaTiktok size={18} />
              </Link>
              <Link
                href="https://wa.me/22940551495?text=*Bonjour%20ChezBaba*%2C%0AJe%20vous%20contacte%20depuis%20votre%20site%20afin%20d%27obtenir%20plus%20d%27informations%20sur%20vos%20services."
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#bdfe00] hover:text-[#0C1B33] flex items-center justify-center transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold mb-4 text-[#bdfe00]">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/auth/register-vendor" className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm">
                  Devenir Vendeur
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold mb-4 text-[#bdfe00]">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm">
                  Centre d&apos;aide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm">
                  Conditions d&apos;utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold mb-4 text-[#bdfe00]">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#EA9010]">📧</span>
                <a
                  href="mailto:contact@chezbaba.com"
                  className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm"
                >
                  contact@chezbaba.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#EA9010]">📞</span>
                <a
                  href="tel:+22990000000"
                  className="text-gray-300 hover:text-[#bdfe00] transition-colors text-sm"
                >
                  +229 90 00 00 00
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#EA9010]">📍</span>
                <span className="text-gray-300 text-sm">
                  Cotonou, Bénin
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-frame mx-auto px-4 xl:px-0 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {currentYear} CHEZ BABA. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-[#bdfe00] text-sm transition-colors"
              >
                Politique de confidentialité
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-[#bdfe00] text-sm transition-colors"
              >
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
