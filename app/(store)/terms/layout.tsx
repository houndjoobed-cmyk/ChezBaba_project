import Navbar from "@/components/layout/store/Header";
import Footer from "@/components/layout/store/Footer";

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
