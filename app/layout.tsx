import type { Metadata, Viewport } from "next";

// styles
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";

// components
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/app/providers";
import ClientHolyLoader from "@/components/common/HolyLoader";


export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "CHEZ BABA",
  description: "Plateforme marketplace centralisée pour petits et grands commerces au Bénin.",
  icons: {
    icon: "/icons/smalllogo.png",
    apple: "/icons/smalllogo.png",
  },
};

export default function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={satoshi.className} suppressHydrationWarning>
        <ClientHolyLoader />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
