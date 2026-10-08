import type { Metadata } from "next";
import { site } from "@/config/site";
import "./globals.css";

// Titre et description lus par Google et affichés dans l'onglet du navigateur.
export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

// Le cadre commun à toutes les pages : chaque page s'affiche à la place de {children}.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
