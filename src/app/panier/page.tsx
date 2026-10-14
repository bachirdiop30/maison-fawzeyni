import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Panier",
};

// La page est préparée à l'avance par le serveur (titre, mise en page) ;
// le contenu du panier, lui, est lu dans le navigateur du visiteur.
export default function CartPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20">
        <h1 className="font-display text-5xl leading-tight text-bleu">Votre panier</h1>
        <div aria-hidden className="mt-8 mb-10 h-px w-16 bg-or-fonce" />
        <CartView />
      </div>
    </main>
  );
}
