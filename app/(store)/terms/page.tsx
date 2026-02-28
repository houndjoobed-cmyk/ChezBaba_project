"use client";

import { useEffect } from "react";
import "../terms.css";

import Acceptation from "./sections/Acceptation";
import ConditionsGenerales from "./sections/ConditionsGenerales";
import ActivitesInterdites from "./sections/ActivitesInterdites";
import LimitationResponsabilite from "./sections/LimitationResponsabilite";
import Resiliation from "./sections/Resiliation";
import DroitApplicable from "./sections/DroitApplicable";

export default function TermsPage() {
    useEffect(() => {
        const links = document.querySelectorAll(".tc-sidebar-link");
        const sections = document.querySelectorAll(".tc-section");

        const updateActive = () => {
            let current = "";
            const offset = 150; // Use const for consistency

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                // Check if section is in viewport (near top)
                if (rect.top <= offset && rect.bottom >= offset) {
                    current = section.id;
                }
            });

            links.forEach(link => {
                link.classList.remove("tc-active");
                const href = link.getAttribute("href")?.substring(1);
                if (href === current) {
                    link.classList.add("tc-active");
                }
            });
        };

        window.addEventListener("scroll", updateActive);
        updateActive(); // Initial call

        const handleClick = (e: Event) => {
            e.preventDefault();
            const targetLink = e.currentTarget as HTMLAnchorElement;
            const href = targetLink.getAttribute("href");
            if (!href) return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Smooth scroll with offset
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        };

        links.forEach(link => {
            link.addEventListener("click", handleClick);
        });

        return () => {
            window.removeEventListener("scroll", updateActive);
            links.forEach(link => {
                link.removeEventListener("click", handleClick);
            });
        };
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="tc-hero">
                <div className="tc-hero-content">
                    <h1>Conditions d&apos;utilisation</h1>
                    <p>Découvrez les règles générales de la plateforme.</p>
                    <div className="tc-update-date">
                        Dernière mise à jour : 18/01/2026
                    </div>
                </div>
            </section>

            <div className="tc-main-content">
                <main className="tc-terms-content">
                    <Acceptation />
                    <ConditionsGenerales />
                    <ActivitesInterdites />
                    <LimitationResponsabilite />
                    <Resiliation />
                    <DroitApplicable />
                </main>

                <aside className="tc-sidebar">
                    <div className="tc-sidebar-nav">
                        <h3 className="tc-sidebar-title"><i className="fas fa-list"></i> Navigation</h3>
                        <div className="tc-sidebar-links">
                            <a href="#acceptation" className="tc-sidebar-link tc-active"><i className="fas fa-chevron-right"></i> Acceptation</a>
                            <a href="#conditions-generales" className="tc-sidebar-link"><i className="fas fa-chevron-right"></i> Conditions générales</a>
                            <a href="#activites-interdites" className="tc-sidebar-link"><i className="fas fa-chevron-right"></i> Activités interdites</a>
                            <a href="#limitation-responsabilite" className="tc-sidebar-link"><i className="fas fa-chevron-right"></i> Limitation responsabilité</a>
                            <a href="#resiliation" className="tc-sidebar-link"><i className="fas fa-chevron-right"></i> Résiliation</a>
                            <a href="#droit-applicable" className="tc-sidebar-link"><i className="fas fa-chevron-right"></i> Droit applicable</a>
                        </div>

                        <div className="tc-contact-card">
                            <h3><i className="fas fa-question-circle"></i> Questions ?</h3>
                            <p className="tc-p text-sm text-gray-600 mb-2">Notre équipe juridique est là pour répondre à vos questions</p>
                            <a href="https://wa.me/+33749300302" target="_blank" className="tc-contact-btn">
                                <i className="fab fa-whatsapp"></i> Nous contacter
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
