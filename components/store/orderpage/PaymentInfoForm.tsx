import InputGroup from "@/components/ui/input-group";
import { satoshi } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

interface PaymentInfoFormProps {
  paymentInfo: {
    cardNumber: string;
    cvc: string;
    cardholderName: string;
    expirationDate: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

export default function PaymentInfoForm({
  paymentInfo,
  onChange,
  errors,
}: PaymentInfoFormProps) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-black/10 shadow-md bg-white">
      <h3
        className={cn(
          satoshi.className,
          "text-xl md:text-2xl font-bold text-black mb-6 flex items-center gap-3"
        )}
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
          <CreditCard className="h-5 w-5 text-gray-700" />
        </div>
        Informations de paiement
      </h3>

      <div className="space-y-4">
        <p className={cn(satoshi.className, "text-gray-600")}>
          Le paiement est sécurisé par notre partenaire <strong>KKiaPay</strong>.
        </p>
        <p className={cn(satoshi.className, "text-sm text-gray-500")}>
          Après avoir cliqué sur &quot;Passer la commande&quot;, vous serez redirigé vers l&apos;interface de paiement sécurisée pour finaliser votre achat par <strong>Carte Bancaire</strong> ou <strong>Mobile Money</strong>.
        </p>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
          <div className="mt-1">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className={cn(satoshi.className, "text-sm text-blue-700")}>
            Vos informations bancaires ne sont jamais stockées sur nos serveurs.
          </p>
        </div>
      </div>
    </div>
  );
}
