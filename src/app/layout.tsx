import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/config/site";
import "./globals.css";

// Jost : sans-serif géométrique, proche des lettres du logo. Pour tout le texte.
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

// Bodoni Moda : le style des grandes maisons de couture. Uniquement pour les grands titres.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  axes: ["opsz"], // le dessin s'affine automatiquement dans les grandes tailles
});

// Titre et description lus par Google et affichés dans l'onglet du navigateur.
export const metadata: Metadata = {
  // Sur chaque page : « Nos modèles · MaisonFawzeyni »
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
};

// Le cadre commun à toutes les pages : chaque page s'affiche à la place de {children}.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.locale} className={`${jost.variable} ${bodoni.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
