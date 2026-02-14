import type { Metadata, Viewport } from "next";

// styles
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";

// components
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/app/providers";


export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "CHEZ BABA",
  description: "Plateforme marketplace centralisée pour petits et grands commerces au Bénin.",
};

export default function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={satoshi.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
