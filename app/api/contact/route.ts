import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/utils/prisma";
import { resend } from "@/lib/utils/resend";

export const dynamic = "force-dynamic";

/* ── Validation schema ── */
const contactSchema = z.object({
    name: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(100),
    email: z.string().email("Adresse email invalide").max(255),
    subject: z
        .string()
        .min(1, "Veuillez sélectionner un sujet")
        .max(100),
    message: z
        .string()
        .min(10, "Le message doit contenir au moins 10 caractères")
        .max(2000),
});

/* ── Subject labels ── */
const subjectLabels: Record<string, string> = {
    general: "Question générale",
    order: "Suivi de commande",
    vendor: "Devenir vendeur",
    technical: "Problème technique",
    partnership: "Partenariat",
    other: "Autre",
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        /* ── Validate ── */
        const parsed = contactSchema.safeParse(body);
        if (!parsed.success) {
            const errors = parsed.error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return NextResponse.json(
                { error: "Données invalides", details: errors },
                { status: 422 }
            );
        }

        const { name, email, subject, message } = parsed.data;
        const subjectLabel = subjectLabels[subject] ?? subject;

        /* ── 1. Save to database ── */
        await prisma.messageContact.create({
            data: {
                nom: name,
                email,
                sujet: subjectLabel,
                message,
            },
        });

        /* ── 2. Send email via Resend ── */
        const { error: emailError } = await resend.emails.send({
            from: "ChezBaba Contact <onboarding@resend.dev>",
            to: ["chezbaba.shop@gmail.com"],
            replyTo: email,
            subject: `[Contact] ${subjectLabel} — ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #0C1B33; padding: 24px; border-radius: 12px 12px 0 0;">
                        <h2 style="color: #9efd38; margin: 0;">📬 Nouveau message de contact</h2>
                    </div>
                    <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e5e5;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #888; width: 100px;">Nom</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #333;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #888;">Email</td>
                                <td style="padding: 8px 0; color: #333;">
                                    <a href="mailto:${email}" style="color: #EA9010;">${email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #888;">Sujet</td>
                                <td style="padding: 8px 0; color: #333;">${subjectLabel}</td>
                            </tr>
                        </table>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
                        <p style="color: #888; margin: 0 0 8px;">Message :</p>
                        <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                    <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5; border-top: none;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            Envoyé depuis le formulaire de contact ChezBaba
                        </p>
                    </div>
                </div>
            `,
        });

        if (emailError) {
            console.error("Resend email error:", emailError);
            // Message is already saved in DB, so we still return success
            // but log the email error for debugging
        }

        return NextResponse.json(
            { message: "Message envoyé avec succès" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Contact API error:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'envoi du message" },
            { status: 500 }
        );
    }
}
