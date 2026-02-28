import React from "react";
import { AlertTriangle, Clock, CreditCard, Apple, ShieldCheck, Mail } from "lucide-react";

export const metadata = {
    title: "Politique de Retour et Remboursement | Chez Baba",
    description: "Découvrez notre politique de retour et de remboursement chez Chez Baba.",
};

export default function ReturnsPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#0C1B33] text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9efd38]/10 to-[#EA9010]/10 opacity-50"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Politique de <span className="text-[#9efd38]">Retours</span> et <span className="text-[#EA9010]">Remboursements</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Chez Baba s&apos;engage à vous offrir des produits de qualité. Voici les conditions applicables pour nos produits frais et non périssables.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">

                        {/* 1. Produits Périssables */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0 w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                <Apple size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#0C1B33] mb-4">
                                    1. Produits Frais et Périssables
                                </h2>
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
                                    <p className="text-red-800 font-medium flex items-center gap-2">
                                        <AlertTriangle size={20} />
                                        Aucun retour ni remboursement n&apos;est possible pour les produits frais.
                                    </p>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    Conformément aux normes d&apos;hygiène et de sécurité sanitaire applicables au Bénin pour la marketplace Chez Baba, nous n&apos;acceptons pas les retours pour les articles périssables (viandes, poissons, fruits, légumes, plats cuisinés, etc.). Veuillez vérifier votre commande lors de la livraison.
                                </p>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* 2. Produits Non Périssables */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0 w-14 h-14 bg-[#9efd38]/20 text-[#0C1B33] rounded-full flex items-center justify-center">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#0C1B33] mb-4">
                                    2. Produits Non Périssables (Épicerie, Accessoires, etc.)
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Vous disposez d&apos;un délai strict de <strong>48 heures</strong> après la réception de la commande pour signaler un problème (article endommagé, erreur de produit) et demander un retour.
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-2">Conditions obligatoires pour accepter un retour :</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                                        <li>Le produit doit être dans son emballage d&apos;origine, non ouvert et non utilisé.</li>
                                        <li>Sceau de sécurité intact.</li>
                                        <li>Accompagné de la preuve d&apos;achat.</li>
                                        <li>Des photos permettant de justifier la demande seront exigées.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* 3. Procédure et Remboursement */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#0C1B33]/5 p-6 rounded-xl border border-gray-100">
                                <Clock className="text-[#EA9010] w-10 h-10 mb-4" />
                                <h3 className="text-xl font-bold text-[#0C1B33] mb-3">La Procédure</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    Toute demande de retour s&apos;effectue depuis votre historique de commandes en déclarant un litige. L&apos;équipe administrative examinera votre demande sous 48 à 72h ouvrées et vous informera de son acceptation.
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    <strong>Frais de retour :</strong> Les frais de renvoi sont à la charge du client, sauf en cas d&apos;erreur avérée de la part de notre équipe ou du vendeur partenaire.
                                </p>
                            </div>

                            <div className="bg-[#0C1B33]/5 p-6 rounded-xl border border-gray-100">
                                <CreditCard className="text-[#9efd38] w-10 h-10 mb-4" />
                                <h3 className="text-xl font-bold text-[#0C1B33] mb-3">Le Remboursement</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    Si le retour est validé après réception et inspection du produit, le statut de la commande passera à &quot;Remboursée&quot;.
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Le remboursement s&apos;effectue manuellement par notre équipe via **KkiaPay / Mobile Money** sur le numéro utilisé lors de la commande, sous un délai de 5 à 7 jours ouvrés après l&apos;approbation.
                                </p>
                            </div>
                        </div>

                        {/* Support Contact Box */}
                        <div className="mt-8 bg-[#0C1B33] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between text-white">
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-[#9efd38]">Un problème avec votre commande ?</h3>
                                <p className="text-gray-300">Notre équipe de support client se tient à votre disposition pour vous aider.</p>
                            </div>
                            <div className="mt-6 md:mt-0 flex gap-4">
                                <a href="mailto:chezbaba.shop@gmail.com" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-5 py-3 rounded-lg font-medium">
                                    <Mail size={18} /> Email
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
