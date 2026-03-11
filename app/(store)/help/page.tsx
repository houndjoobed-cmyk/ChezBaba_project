"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FaSearch,
    FaBoxOpen,
    FaTruck,
    FaUndoAlt,
    FaStore,
    FaEnvelope,
    FaPhoneAlt,
    FaWhatsapp,
    FaChevronDown,
    FaFileContract,
    FaShieldAlt,
    FaHeadset,
    FaExchangeAlt,
} from "react-icons/fa";

/* ─── FAQ Data ─── */
const faqCategories = [
    {
        id: "orders",
        title: "Commandes et Paiements",
        icon: <FaBoxOpen />,
        questions: [
            { q: "Comment passer une commande ?", a: "Pour passer une commande, ajoutez les produits souhaités à votre panier (produits alimentaires frais, conserves, etc.), allez dans le panier puis cliquez sur 'Valider la commande'. Suivez ensuite les étapes pour entrer votre adresse de livraison et choisir votre mode de paiement." },
            { q: "Quels sont les moyens de paiement acceptés ?", a: "Nous acceptons les paiements sécurisés via KkiaPay, qui inclut le paiement par Mobile Money (MTN, Moov, Celtiis) et les Cartes Bancaires (Visa, MasterCard)." },
            { q: "Comment suivre ma commande ?", a: "Une fois votre commande confirmée, vous recevrez une notification et un email. Vous pouvez suivre l'état de préparation et de livraison directement depuis votre espace client." },
            { q: "Puis-je modifier ou annuler ma commande ?", a: "La préparation de nos produits alimentaires (surtout les produits frais) est rapide. Vous pouvez annuler votre commande uniquement dans les premières minutes suivant sa validation. Veuillez nous contacter via WhatsApp d'urgence en cas d'erreur." },
        ],
    },
    {
        id: "delivery",
        title: "Livraison",
        icon: <FaTruck />,
        questions: [
            { q: "Quels sont les délais de livraison ?", a: "Étant donné la nature des produits (alimentation afro-caribéenne), nous assurons des livraisons rapides. Le délai dépend de votre localisation précise, généralement dans la journée ou sous 24h-48h selon les stocks et la zone." },
            { q: "Quels sont les frais de livraison ?", a: "Les frais de livraison sont calculés automatiquement à la caisse en fonction du volume/poids de votre panier et de la distance de livraison par rapport à nos points d'expédition." },
            { q: "Puis-je changer l'adresse de livraison ?", a: "Oui, à condition que la commande ne soit pas encore en cours d'acheminement par notre livreur. Contactez le support sur WhatsApp au plus vite." },
            { q: "Que faire si ma commande est incomplète ou endommagée ?", a: "Si votre colis arrive avec des produits manquants ou endommagés, prenez des photos immédiatement à la réception devant le livreur ou contactez notre support client dans l'heure suivant la livraison." },
        ],
    },
    {
        id: "returns",
        title: "Retours et Remboursements",
        icon: <FaUndoAlt />,
        questions: [
            { q: "Quelle est la politique de retour ?", a: "En raison des normes d'hygiène et de sécurité alimentaire strictes de ChezBaba, les denrées périssables, les produits frais et les articles dont l'emballage a été ouvert ne sont pas éligibles au retour." },
            { q: "Comment retourner un produit non-périssable ?", a: "Contactez notre support avec votre numéro de commande pour vérifier l'éligibilité. Si accepté, nous vous fournirons les instructions de retour." },
            { q: "Quand serai-je remboursé ?", a: "En cas de validation d'un remboursement (erreur de notre part, produit indisponible), le montant est restitué selon votre mode de paiement initial sous 3 à 7 jours ouvrés." },
        ],
    },
    {
        id: "vendors",
        title: "Vendeurs / Producteurs",
        icon: <FaStore />,
        questions: [
            { q: "Comment faire référencer mes produits sur ChezBaba ?", a: "Si vous produisez ou vendez des articles exotiques, afro-caribéens ou locaux de qualité, contactez-nous via la page 'Nous Contacter' ou notre email de partenariat pour discuter d'une éventuelle collaboration." },
            { q: "Comment garantissez-vous la qualité des produits ?", a: "BABA s'assure que chaque produit référencé, qu'il vienne de nos stocks ou de partenaires, passe des contrôles de qualité rigoureux avant l'expédition." },
        ],
    },
];

/* ─── Additional Resources ─── */
const resources = [
    {
        title: "Nous contacter",
        desc: "Formulaire de contact et informations",
        icon: <FaHeadset />,
        href: "/contact",
    },
    {
        title: "Retours",
        desc: "Politique de retour et remboursement",
        icon: <FaExchangeAlt />,
        href: "/returns",
    },
    {
        title: "Confidentialité",
        desc: "Protection de vos données personnelles",
        icon: <FaShieldAlt />,
        href: "/privacy",
    },
    {
        title: "Conditions",
        desc: "Conditions d'utilisation du service",
        icon: <FaFileContract />,
        href: "/terms",
    },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openQuestion, setOpenQuestion] = useState<string | null>(null);

    const toggleQuestion = (id: string) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    return (
        <main className="min-h-screen bg-[#f5f5f5]">
            {/* ──── Hero ──── */}
            <section className="relative bg-[#0C1B33] pt-24 pb-32 overflow-hidden px-4">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#9efd38]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#EA9010]/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Centre d&apos;Aide
                    </h1>
                    <p className="text-gray-300 text-lg mb-10">
                        Trouvez rapidement des réponses à vos questions. Notre équipe est là
                        pour vous aider.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher une question, un mot-clé..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9efd38] backdrop-blur-md transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* ──── FAQ Content ──── */}
            <section className="max-w-4xl mx-auto px-4 xl:px-0 -mt-16 relative z-10 pb-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-[#333333] mb-8 text-center">
                            Questions Fréquentes
                        </h2>

                        <div className="space-y-12">
                            {faqCategories.map((category) => {
                                // Filter questions based on search query
                                const filteredQuestions = category.questions.filter((q) =>
                                    q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    q.a.toLowerCase().includes(searchQuery.toLowerCase())
                                );

                                if (filteredQuestions.length === 0) return null;

                                return (
                                    <div key={category.id}>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-[#EA9010]/10 text-[#EA9010] flex items-center justify-center text-lg">
                                                {category.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-[#0C1B33]">
                                                {category.title}
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            {filteredQuestions.map((q, idx) => {
                                                const qId = `${category.id}-${idx}`;
                                                const isOpen = openQuestion === qId;

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`border rounded-2xl transition-all duration-300 ${isOpen
                                                            ? "border-[#9efd38]/50 bg-[#9efd38]/5"
                                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                                            }`}
                                                    >
                                                        <button
                                                            onClick={() => toggleQuestion(qId)}
                                                            className="w-full flex items-center justify-between p-5 text-left"
                                                        >
                                                            <span className="font-semibold text-[#333333] pr-4">
                                                                {q.q}
                                                            </span>
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#0C1B33] text-[#9efd38]" : "bg-gray-100 text-gray-400"}`}>
                                                                <FaChevronDown className="text-sm" />
                                                            </div>
                                                        </button>
                                                        <div
                                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                                                }`}
                                                        >
                                                            <p className="px-5 pb-5 text-gray-600 leading-relaxed text-sm">
                                                                {q.a}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ──── Support Contact ──── */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="max-w-frame mx-auto px-4 xl:px-0">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#333333] mb-4">
                            Besoin d&apos;aide supplémentaire ?
                        </h2>
                        <p className="text-gray-500">
                            Notre équipe de support client est à votre écoute
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <a href="mailto:chezbaba.shop@gmail.com" className="bg-[#f8f9fa] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:bg-[#9efd38] group-hover:text-[#0C1B33] text-[#EA9010] transition-colors">
                                <FaEnvelope className="text-2xl" />
                            </div>
                            <h3 className="font-bold text-[#333333] mb-2">Email</h3>
                            <p className="text-sm text-gray-500">chezbaba.shop@gmail.com</p>
                        </a>

                        <a href="https://wa.me/33749300302" target="_blank" rel="noopener noreferrer" className="bg-[#f8f9fa] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:bg-[#25D366] group-hover:text-white text-[#EA9010] transition-colors">
                                <FaWhatsapp className="text-2xl" />
                            </div>
                            <h3 className="font-bold text-[#333333] mb-2">WhatsApp</h3>
                            <p className="text-sm text-gray-500">+33 7 49 30 03 02</p>
                        </a>

                        <a href="tel:+33749300302" className="bg-[#f8f9fa] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:bg-[#0C1B33] group-hover:text-[#9efd38] text-[#EA9010] transition-colors">
                                <FaPhoneAlt className="text-2xl" />
                            </div>
                            <h3 className="font-bold text-[#333333] mb-2">Téléphone</h3>
                            <p className="text-sm text-gray-500">+33 7 49 30 03 02</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* ──── Extra Resources ──── */}
            <section className="py-20 bg-[#0C1B33]">
                <div className="max-w-frame mx-auto px-4 xl:px-0">
                    <h2 className="text-2xl font-bold text-white mb-10 text-center">
                        Ressources Supplémentaires
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resources.map((resource, idx) => (
                            <Link
                                key={idx}
                                href={resource.href}
                                className="bg-[#162d52] rounded-2xl p-6 border border-[#1e3d6e] hover:border-[#9efd38]/50 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 text-white flex items-center justify-center text-xl mb-4 group-hover:bg-[#9efd38] group-hover:text-[#0C1B33] transition-colors">
                                    {resource.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {resource.title}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {resource.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
