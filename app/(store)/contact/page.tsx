"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
    FaPaperPlane,
    FaQuestionCircle,
    FaArrowRight,
} from "react-icons/fa";

/* ──────────────────── Contact Page ──────────────────── */

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erreur lors de l'envoi");
            }

            setSent(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setSent(false), 5000);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Une erreur est survenue. Veuillez réessayer."
            );
        } finally {
            setSending(false);
        }
    };

    /* ─── Contact info cards data ─── */
    const contactCards = [
        {
            icon: <FaEnvelope className="text-2xl" />,
            title: "Email",
            info: "chezbaba.shop@gmail.com",
            action: { label: "Envoyer un email →", href: "mailto:chezbaba.shop@gmail.com" },
        },
        {
            icon: <FaPhone className="text-2xl" />,
            title: "Téléphone",
            info: "+33 7 49 30 03 02",
            action: { label: "Appeler maintenant →", href: "tel:+33749300302" },
        },
        {
            icon: <FaMapMarkerAlt className="text-2xl" />,
            title: "Adresse",
            info: "Cotonou, Bénin",
            action: null,
        },
        {
            icon: <FaClock className="text-2xl" />,
            title: "Horaires d'ouverture",
            info: "Disponible 24h/24",
            action: null,
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
                        Nous contacter
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Notre équipe est là pour vous aider. N&apos;hésitez pas à nous
                        contacter pour toute question ou assistance.
                    </p>
                </div>
            </section>

            {/* ──── Content ──── */}
            <section className="max-w-frame mx-auto px-4 xl:px-0 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* ── Form ── */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                            <h2 className="text-2xl font-bold text-[#333333] mb-6">
                                Envoyez-nous un message
                            </h2>

                            {sent && (
                                <div className="mb-6 p-4 rounded-xl bg-[#9efd38]/15 border border-[#9efd38]/40 text-[#333333] text-sm flex items-center gap-3">
                                    <span className="text-[#9efd38] text-xl">✓</span>
                                    Votre message a été envoyé avec succès ! Nous vous répondrons
                                    dans les plus brefs délais.
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                                    <span className="text-red-500 text-xl">✕</span>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name & Email row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            htmlFor="contact-name"
                                            className="block text-sm font-medium text-[#333333] mb-1.5"
                                        >
                                            Nom complet
                                        </label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Votre nom"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9efd38] focus:ring-2 focus:ring-[#9efd38]/20 outline-none transition-all text-sm text-[#333333] placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="contact-email"
                                            className="block text-sm font-medium text-[#333333] mb-1.5"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="contact-email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="votre@email.com"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9efd38] focus:ring-2 focus:ring-[#9efd38]/20 outline-none transition-all text-sm text-[#333333] placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label
                                        htmlFor="contact-subject"
                                        className="block text-sm font-medium text-[#333333] mb-1.5"
                                    >
                                        Sujet
                                    </label>
                                    <select
                                        id="contact-subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9efd38] focus:ring-2 focus:ring-[#9efd38]/20 outline-none transition-all text-sm text-[#333333] bg-white"
                                    >
                                        <option value="">Sélectionnez un sujet</option>
                                        <option value="general">Question générale</option>
                                        <option value="order">Suivi de commande</option>
                                        <option value="vendor">Devenir vendeur</option>
                                        <option value="technical">Problème technique</option>
                                        <option value="partnership">Partenariat</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label
                                        htmlFor="contact-message"
                                        className="block text-sm font-medium text-[#333333] mb-1.5"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Décrivez votre demande en détail..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9efd38] focus:ring-2 focus:ring-[#9efd38]/20 outline-none transition-all text-sm text-[#333333] placeholder:text-gray-400 resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-[#9efd38] hover:bg-[#8de62f] text-[#0C1B33] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                >
                                    {sending ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-[#0C1B33]/30 border-t-[#0C1B33] rounded-full animate-spin" />
                                            Envoi en cours…
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane />
                                            Envoyer le message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ── Info cards ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <h2 className="text-2xl font-bold text-[#333333] mb-2">
                            Informations de contact
                        </h2>

                        {contactCards.map((card) => (
                            <div
                                key={card.title}
                                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#EA9010]/10 text-[#EA9010] flex items-center justify-center shrink-0 group-hover:bg-[#EA9010] group-hover:text-white transition-colors duration-300">
                                        {card.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[#333333] text-base mb-1">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm break-all">{card.info}</p>
                                        {card.action && (
                                            <a
                                                href={card.action.href}
                                                className="inline-flex items-center gap-1 text-[#EA9010] hover:text-[#d07e0c] text-sm font-medium mt-2 transition-colors"
                                            >
                                                {card.action.label}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── FAQ Section ──── */}
            <section className="bg-white py-14">
                <div className="max-w-frame mx-auto px-4 xl:px-0">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#0C1B33] to-[#162d52] rounded-2xl p-8 md:p-12">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#9efd38]/15 flex items-center justify-center shrink-0">
                                <FaQuestionCircle className="text-[#9efd38] text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                    Questions fréquentes
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Trouvez rapidement des réponses à vos questions dans notre
                                    centre d&apos;aide.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/help"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#9efd38] hover:bg-[#8de62f] text-[#0C1B33] font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                            Consulter l&apos;aide
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ──── Map placeholder ──── */}
            <section className="bg-[#f5f5f5] py-14">
                <div className="max-w-frame mx-auto px-4 xl:px-0">
                    <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
                        Où nous trouver
                    </h2>
                    <p className="text-gray-500 text-center mb-8">
                        Notre siège social est situé au cœur de Cotonou
                    </p>

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="h-72 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-4">
                            <FaMapMarkerAlt className="text-5xl text-[#EA9010]/40" />
                            <p className="text-gray-400 text-sm font-medium">
                                Carte interactive à venir
                            </p>
                            <span className="text-[#333333] font-semibold text-base">
                                📍 Cotonou, Bénin
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
