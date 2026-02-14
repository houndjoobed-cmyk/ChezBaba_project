"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// UI components
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Components
import FormErrorMessage from "@/components/auth/FormErrorMessage";
import FieldErrorMessage from "@/components/auth/FieldErrorMessage";

// Utils
import { cn } from "@/lib/utils";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { update } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams && typeof searchParams.get === 'function' ? searchParams.get("callbackUrl") : null;
  const loginHref = callbackUrl
    ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/auth/login";

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setErrorMessage("Vous devez accepter les Conditions d'utilisation et la Politique de confidentialité.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nom,
          prenom,
          tel,
        }),
      });

      const responseJson = await response.json();
      if (!response.ok) {
        setErrorMessage(responseJson?.error || "Une erreur est survenue.");
        if (responseJson?.data) {
          const errors: Record<string, string> = {};
          responseJson.data.forEach(
            (err: { field: string; message: string }) => {
              errors[err.field] = err.message;
            }
          );
          setFieldErrors(errors);
        }
        return;
      }

      await update();
      toast(responseJson.message || "Inscription réussie.");

      const safeCallbackUrl =
        callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : "/";

      router.push(
        `/auth/verify-email?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`
      );
      router.refresh();
    } catch {
      setErrorMessage("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitForm}>
            <div className="flex flex-col gap-6">
              {/* email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {fieldErrors.email && (
                  <FieldErrorMessage message={fieldErrors.email} />
                )}
              </div>

              {/* password */}
              <div className="grid gap-3 relative">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3/4 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                {fieldErrors.password && (
                  <FieldErrorMessage message={fieldErrors.password} />
                )}
              </div>

              {/* nom */}
              <div className="grid gap-3">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  type="text"
                  placeholder="ZANNOU"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
                {fieldErrors.nom && (
                  <FieldErrorMessage message={fieldErrors.nom} />
                )}
              </div>

              {/* prenom */}
              <div className="grid gap-3">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  type="text"
                  placeholder="Théophile"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
                {fieldErrors.prenom && (
                  <FieldErrorMessage message={fieldErrors.prenom} />
                )}
              </div>

              {/* téléphone */}
              <div className="grid gap-3">
                <Label htmlFor="tel">Téléphone</Label>
                <PhoneInput
                  value={tel}
                  onChange={setTel}
                  disabled={isLoading}
                />
                {fieldErrors.tel && (
                  <FieldErrorMessage message={fieldErrors.tel} />
                )}
              </div>


              {/* accept terms */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="accept-terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                  className="mt-1"
                />
                <Label htmlFor="accept-terms" className="font-normal leading-snug text-muted-foreground cursor-pointer">
                  <span>
                    J&apos;accepte les <Link href="/terms" className="underline underline-offset-4 hover:text-primary">Conditions d&apos;utilisation</Link> et la <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">Politique de confidentialité</Link>
                  </span>
                </Label>
              </div>


              {/* submit button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>

              {/* Error Message */}
              <FormErrorMessage message={errorMessage} />
            </div>

            {/* link to register page  */}
            <div className="mt-4 text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <Link href={loginHref} className="underline underline-offset-4">
                Connectez-vous
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
