import { Suspense } from "react";
import SearchResults from "./SearchResults";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/store/CatalogHeader/NavBar";
import Footer from "@/components/layout/store/Footer";

export const metadata = {
    title: "Recherche | ChezBaba",
    description: "Résultats de recherche sur ChezBaba",
};

export default function SearchPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow pt-24 pb-12">
                <Suspense
                    fallback={
                        <div className="flex flex-col items-center justify-center min-h-[50vh]">
                            <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
                            <p className="text-gray-500 font-medium">Recherche en cours...</p>
                        </div>
                    }
                >
                    <SearchResults />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
