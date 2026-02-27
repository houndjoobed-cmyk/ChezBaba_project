import StoreHeader from "@/components/layout/store/Header";
import StoreFooter from "@/components/layout/store/Footer";
import React from "react";

export default function CategoriesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <StoreHeader />
            {children}
            <StoreFooter />
        </>
    );
}
