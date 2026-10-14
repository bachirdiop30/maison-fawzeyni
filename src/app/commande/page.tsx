import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false }, // page personnelle : Google n'a pas à l'afficher
};

export default function CheckoutPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20">
        <h1 className="font-display text-5xl leading-tight text-bleu">Commande</h1>
        <div aria-hidden className="mt-8 mb-10 h-px w-16 bg-or-fonce" />
        <CheckoutForm />
      </div>
    </main>
  );
}
