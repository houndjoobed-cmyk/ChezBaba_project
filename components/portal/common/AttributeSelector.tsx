"use client";

import React from "react";
import { ColorFromAPI } from "@/lib/types/color.types";
import { SizeFromAPI } from "@/lib/types/size.types";
import { cn } from "@/lib/utils";
import { IoMdCheckmark } from "react-icons/io";

interface AttributeSelectorProps {
    type: "color" | "size";
    options: (ColorFromAPI | SizeFromAPI)[];
    selectedIds: string[];
    onSelect: (id: string) => void;
    onDeselect: (id: string) => void;
}

export const AttributeSelector = ({
    type,
    options,
    selectedIds,
    onSelect,
    onDeselect,
}: AttributeSelectorProps) => {
    const handleToggle = (id: string) => {
        if (selectedIds.includes(id)) {
            onDeselect(id);
        } else {
            onSelect(id);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {options.map((option) => {
                const isSelected = selectedIds.includes(option.id);

                if (type === "color") {
                    const color = option as ColorFromAPI;
                    return (
                        <button
                            key={color.id}
                            type="button"
                            title={color.nom}
                            onClick={() => handleToggle(color.id)}
                            className={cn(
                                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 relative group",
                                isSelected ? "border-black scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"
                            )}
                            style={{ backgroundColor: color.code }}
                        >
                            {isSelected && (
                                <IoMdCheckmark
                                    className={cn(
                                        "text-lg",
                                        color.nom.toLowerCase() === "noir" || color.code.toLowerCase() === "#000000"
                                            ? "text-white"
                                            : "text-black"
                                    )}
                                />
                            )}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                {color.nom}
                            </span>
                        </button>
                    );
                } else {
                    const size = option as SizeFromAPI;
                    return (
                        <button
                            key={size.id}
                            type="button"
                            onClick={() => handleToggle(size.id)}
                            className={cn(
                                "px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-200",
                                isSelected
                                    ? "border-black bg-black text-white shadow-md scale-105"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                            )}
                        >
                            {size.nom}
                        </button>
                    );
                }
            })}
        </div>
    );
};
