// Le cadre des pages de la boutique : en-tête, puis la page, puis le pied de page.
// Les parenthèses de « (boutique) » regroupent ces pages SANS changer leur adresse :
// « (boutique)/panier/page.tsx » reste « /panier ».
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
