"use client";

import * as React from "react";
import Image from "next/image";
import { Search, ChevronDown, Check } from "lucide-react";
import { countries, Country } from "@/lib/constants/countries";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
    value: string; // Numéro complet avec indicatif (ex: +22956550762)
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

const PhoneInput = ({ value, onChange, className, disabled }: PhoneInputProps) => {
    const [search, setSearch] = React.useState("");

    // Extraire l'indicatif et le numéro de la valeur actuelle
    const selectedCountry = React.useMemo(() => {
        if (!value) return countries.find((c) => c.iso === "BJ") || countries[0];

        // Trier par longueur de code décroissante pour éviter les faux positifs (ex: +1 vs +35818)
        const sortedByCode = [...countries].sort((a, b) => b.code.length - a.code.length);
        return sortedByCode.find((c) => value.startsWith(c.code)) || countries[0];
    }, [value]);

    const phoneNumber = value.replace(selectedCountry.code, "");

    const filteredCountries = countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.includes(search)
    );

    const handleCountrySelect = (country: Country) => {
        onChange(country.code + phoneNumber);
        setSearch("");
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Nettoyer les caractères non numériques
        const cleanNumber = e.target.value.replace(/\D/g, "");
        onChange(selectedCountry.code + cleanNumber);
    };

    return (
        <div className={cn("flex gap-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white hover:bg-gray-50 transition-colors min-w-[110px] disabled:opacity-50 disabled:cursor-not-allowed h-10"
                    >
                        <Image
                            src={selectedCountry.flagUrl}
                            alt=""
                            width={24}
                            height={16}
                            className="w-6 h-4 object-cover rounded-sm border border-gray-100"
                        />
                        <span className="text-sm font-medium">{selectedCountry.code}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px] p-0 shadow-xl border-gray-200">
                    <div className="flex items-center px-3 py-2 border-b bg-gray-50/50">
                        <Search className="h-4 w-4 text-gray-400 mr-2" />
                        <input
                            placeholder="Rechercher un pays..."
                            className="flex-1 bg-transparent border-none outline-none text-sm py-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                        {filteredCountries.length === 0 ? (
                            <p className="text-xs text-center py-4 text-gray-500">Aucun pays trouvé</p>
                        ) : (
                            filteredCountries.map((country) => (
                                <DropdownMenuItem
                                    key={`${country.iso}-${country.code}`}
                                    onSelect={() => handleCountrySelect(country)}
                                    className="flex items-center justify-between py-2 px-3 cursor-pointer focus:bg-orange-50 gap-2"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Image
                                            src={country.flagUrl}
                                            alt=""
                                            width={20}
                                            height={14}
                                            className="w-5 h-3.5 object-cover rounded-sm border border-gray-100 flex-shrink-0"
                                        />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium truncate">{country.name}</span>
                                            <span className="text-xs text-gray-500">{country.code}</span>
                                        </div>
                                    </div>
                                    {selectedCountry.iso === country.iso && (
                                        <Check className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                    )}
                                </DropdownMenuItem>
                            ))
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <Input
                type="tel"
                placeholder="Numéro de téléphone"
                value={phoneNumber}
                onChange={handlePhoneChange}
                disabled={disabled}
                className="flex-1 h-10"
            />
        </div>
    );
};

export { PhoneInput };
