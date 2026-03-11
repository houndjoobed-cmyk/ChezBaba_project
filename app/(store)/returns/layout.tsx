import StoreHeader from "@/components/layout/store/Header";
import StoreFooter from "@/components/layout/store/Footer";

export default function ReturnsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <StoreHeader />
            <main className="flex-grow pt-[80px] lg:pt-[100px]">
                {children}
            </main>
            <StoreFooter />
        </div>
    );
}
