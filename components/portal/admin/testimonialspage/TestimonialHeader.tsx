import { Plus, Quote } from "lucide-react";
import { montserrat } from "@/styles/fonts";

interface TestimonialHeaderProps {
    onAdd: () => void;
}

export function TestimonialHeader({ onAdd }: TestimonialHeaderProps) {
    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                    <h1
                        className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
                    >
                        Gestion des Témoignages
                    </h1>
                </div>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:inline">Ajouter un témoignage</span>
                </button>
            </div>

            <div className="mb-8">
                <p className={`text-base sm:text-lg text-gray-700 ${montserrat.className}`}>
                    Gérez les témoignages qui apparaissent sur la page d&apos;accueil de votre boutique.
                </p>
            </div>
        </>
    );
}
