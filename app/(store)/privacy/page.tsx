import Link from "next/link";
import {
    FaShieldAlt,
    FaDatabase,
    FaLock,
    FaShareAlt,
    FaUserEdit,
    FaCookieBite,
    FaQuestionCircle,
    FaArrowRight,
    FaEye,
    FaTrashAlt,
    FaExchangeAlt,
    FaBan,
    FaTimesCircle,
} from "react-icons/fa";

export const metadata = {
    title: "Politique de Confidentialité | ChezBaba",
    description: "Engagement envers votre confidentialité et nos pratiques de traitement des données chez ChezBaba.",
};

export default function PrivacyPage() {
    /* ─── Data practices section ─── */
    const practices = [
        {
            icon: <FaDatabase className="text-2xl" />,
            title: "Collecte des données",
            items: [
                "Informations d'identification (nom, email, téléphone)",
                "Informations de livraison et facturation",
                "Historique des commandes et achats",
                "Données de navigation et préférences",
                "Informations de paiement (traitées de manière sécurisée)",
            ],
        },
        {
            icon: <FaShieldAlt className="text-2xl" />,
            title: "Utilisation des données",
            items: [
                "Traitement et livraison des commandes",
                "Communication sur les commandes et services",
                "Amélioration de nos services et produits",
                "Personnalisation de l'expérience utilisateur",
                "Respect des obligations légales",
            ],
        },
        {
            icon: <FaLock className="text-2xl" />,
            title: "Protection des données",
            items: [
                "Chiffrement SSL pour toutes les transmissions",
                "Stockage sécurisé des données sensibles",
                "Accès limité aux données personnelles",
                "Audits de sécurité réguliers",
                "Conformité aux normes de protection des données",
            ],
        },
        {
            icon: <FaShareAlt className="text-2xl" />,
            title: "Partage des données",
            items: [
                "Avec les vendeurs pour le traitement des commandes",
                "Avec les prestataires de services de livraison",
                "Avec les partenaires de paiement sécurisés",
                "Uniquement avec votre consentement explicite",
                "Dans le respect des lois en vigueur",
            ],
        },
    ];

    /* ─── User rights section ─── */
    const rights = [
        {
            icon: <FaEye />,
            title: "Droit d'accès",
            desc: "Vous pouvez demander l'accès à vos données personnelles à tout moment.",
        },
        {
            icon: <FaUserEdit />,
            title: "Droit de rectification",
            desc: "Vous pouvez demander la correction de vos données inexactes ou incomplètes.",
        },
        {
            icon: <FaTrashAlt />,
            title: "Droit à l'effacement",
            desc: "Vous pouvez demander la suppression de vos données dans certaines conditions.",
        },
        {
            icon: <FaExchangeAlt />,
            title: "Droit à la portabilité",
            desc: "Vous pouvez demander la transmission de vos données à un autre service.",
        },
        {
            icon: <FaBan />,
            title: "Droit d'opposition",
            desc: "Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes.",
        },
        {
            icon: <FaTimesCircle />,
            title: "Retrait du consentement",
            desc: "Vous pouvez retirer votre consentement au traitement de vos données à tout moment.",
        },
    ];

    return (
        <main className="min-h-screen bg-[#f5f5f5]">
            {/* ──── Hero ──── */}
            <section className="relative bg-[#0C1B33] overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#9efd38]/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#EA9010]/10 blur-3xl" />

                <div className="relative max-w-frame mx-auto px-4 xl:px-0 py-20 md:py-28 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Politique de Confidentialité
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Chez ChezBaba, nous nous engageons à protéger la confidentialité et
                        la sécurité de vos données personnelles.
                    </p>
                </div>
            </section>

            {/* ──── Introduction ──── */}
            <section className="bg-white py-16 border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-4 xl:px-0 text-center">
                    <h2 className="text-2xl font-bold text-[#333333] mb-4">
                        Engagement envers votre confidentialité
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Cette politique de confidentialité explique comment nous collectons,
                        utilisons, stockons et protégeons vos informations. En utilisant nos
                        services, vous acceptez les pratiques décrites dans cette politique.
                        Nous nous conformons à toutes les réglementations applicables en
                        matière de protection des données.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Cette politique s&apos;applique à toutes les interactions avec notre
                        plateforme, que ce soit via notre site web, nos applications mobiles
                        ou tout autre service ChezBaba.
                    </p>
                </div>
            </section>

            {/* ──── Pratiques des données ──── */}
            <section className="py-16 max-w-frame mx-auto px-4 xl:px-0">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#333333] mb-3">
                        Nos pratiques de traitement des données
                    </h2>
                    <p className="text-gray-500">
                        Comment nous gérons vos données personnelles au quotidien
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {practices.map((practice, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100 group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-[#EA9010]/10 text-[#EA9010] flex items-center justify-center shrink-0 group-hover:bg-[#EA9010] group-hover:text-white transition-colors duration-300">
                                    {practice.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#333333]">
                                    {practice.title}
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {practice.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-3">
                                        <span className="text-[#9efd38] font-bold mt-0.5">•</span>
                                        <span className="text-gray-600 text-sm leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──── Vos Droits ──── */}
            <section className="bg-[#0C1B33] py-16">
                <div className="max-w-frame mx-auto px-4 xl:px-0">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Vos droits concernant vos données
                        </h2>
                        <p className="text-gray-300">
                            Vous avez le contrôle total sur vos informations personnelles
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rights.map((right, idx) => (
                            <div
                                key={idx}
                                className="bg-[#162d52] rounded-2xl p-6 border border-[#1e3d6e] hover:border-[#9efd38]/50 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#9efd38]/10 text-[#9efd38] flex items-center justify-center text-lg mb-4">
                                    {right.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {right.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {right.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── Cookies et Conservation ──── */}
            <section className="py-16 max-w-frame mx-auto px-4 xl:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Cookies */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <FaCookieBite className="text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#333333]">
                                Cookies et suivi
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            Nous utilisons des cookies et des technologies similaires pour
                            améliorer votre expérience sur notre plateforme. Ces technologies
                            nous aident à :
                        </p>
                        <ul className="space-y-2 mb-6 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">✓</span> Mémoriser vos préférences
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">✓</span> Analyser l&apos;utilisation du site
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">✓</span> Personnaliser le contenu
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">✓</span> Assurer la sécurité
                            </li>
                        </ul>
                        <p className="text-gray-500 text-xs leading-relaxed">
                            Vous pouvez contrôler l&apos;utilisation des cookies via les
                            paramètres de votre navigateur. Désactiver certains cookies peut
                            affecter votre expérience.
                        </p>
                    </div>

                    {/* Conservation */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                <FaDatabase className="text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#333333]">
                                Conservation
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            Nous conservons vos données uniquement pendant la durée
                            nécessaire aux finalités pour lesquelles elles ont été collectées :
                        </p>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-600">Données de compte</span>
                                <span className="text-[#333333] font-medium">Compte actif</span>
                            </li>
                            <li className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-600">Historique des commandes</span>
                                <span className="text-[#333333] font-medium">5 ans (légal)</span>
                            </li>
                            <li className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-600">Données de navigation</span>
                                <span className="text-[#333333] font-medium">13 mois max</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-gray-600">Données de marketing</span>
                                <span className="text-[#333333] font-medium">Jusqu&apos;à désinscription</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ──── FAQ / Contact Section ──── */}
            <section className="bg-white py-14 border-t border-gray-100">
                <div className="max-w-frame mx-auto px-4 xl:px-0">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#0C1B33] to-[#162d52] rounded-2xl p-8 md:p-12">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#EA9010]/15 flex items-center justify-center shrink-0">
                                <FaQuestionCircle className="text-[#EA9010] text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                    Questions sur votre confidentialité ?
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Notre équipe de protection des données est là pour vous aider.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#9efd38] hover:bg-[#8de62f] text-[#0C1B33] font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                            >
                                Contacter le support
                                <FaArrowRight className="text-xs" />
                            </Link>
                            <a
                                href="mailto:chezbaba.shop@gmail.com"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all duration-300 whitespace-nowrap"
                            >
                                Email DPO
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
