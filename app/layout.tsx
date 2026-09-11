import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: { icon: "/logo/aupro-logo.png", apple: "/logo/aupro-logo.png" },
  title: "Aupro — Vos demandes deviennent des chantiers organisés",
  description:
    "Centralisez les demandes reçues par WhatsApp, email et téléphone. Transformez-les en devis, tâches et chantiers sans ressaisie.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
