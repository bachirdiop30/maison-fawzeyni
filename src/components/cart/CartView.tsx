// Le contenu de la page Panier : les lignes, les quantités, le total.
// Composant client : le panier est stocké dans le navigateur (voir lib/cart.ts).
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { type CartLine, MAX_QUANTITY, cartSubtotal, removeFromCart, setQuantity, useCart } from "@/lib/cart";
import { formatFcfa } from "@/lib/money";

export function CartView() {
  const lines = useCart();

  // Le navigateur n'a pas encore lu le panier : on réserve la place sans rien afficher.
  if (lines === null) {
    return <div className="h-64" aria-label="Chargement du panier" />;
  }

  if (lines.length === 0) {
    return (
      <div className="py-10">
        <p className="text-lg text-gris">Votre panier est vide.</p>
        <Button href="/catalogue" className="mt-8">
          Découvrir nos modèles
        </Button>
      </div>
    );
  }

  const subtotal = cartSubtotal(lines);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
      <ul className="divide-y divide-encre/10 border-y border-encre/10">
        {lines.map((line) => (
          <CartRow key={line.key} line={line} />
        ))}
      </ul>

      <aside className="mt-10 lg:mt-0">
        <div className="bg-ivoire p-6 lg:sticky lg:top-24">
          <h2 className="text-sm tracking-widest text-gris">RÉCAPITULATIF</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gris">Sous-total</dt>
              <dd>{formatFcfa(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gris">Livraison</dt>
              <dd className="text-right text-gris">Selon la ville, confirmée avec vous</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-encre/10 pt-4 text-base">
              <dt className="font-medium">Total</dt>
              <dd className="font-semibold text-bleu">{formatFcfa(subtotal)}</dd>
            </div>
          </dl>

          <Button href="/commande" className="mt-6 w-full">
            Passer commande
          </Button>
          <p className="mt-4 text-xs leading-relaxed text-gris">
            Paiement par Wave ou Orange Money. Nous confirmons ensuite vos mesures sur WhatsApp.
          </p>
        </div>
      </aside>
    </div>
  );
}

function CartRow({ line }: { line: CartLine }) {
  return (
    <li className="flex gap-4 py-6 sm:gap-6">
      <Link
        href={`/catalogue/${line.slug}`}
        className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-ivoire sm:w-28"
      >
        {line.image && <Image src={line.image} alt={line.name} fill sizes="112px" className="object-cover" />}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <Link href={`/catalogue/${line.slug}`} className="font-display text-xl hover:text-bleu">
            {line.name}
          </Link>
          <p className="font-semibold text-bleu">{formatFcfa(line.priceFcfa * line.quantity)}</p>
        </div>
        <p className="mt-1 text-sm text-gris">
          {line.formulaName}
          {line.color && ` · ${line.color}`}
        </p>
        {line.quantity > 1 && <p className="text-sm text-gris">{formatFcfa(line.priceFcfa)} l&apos;unité</p>}

        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          {/* Choix de la quantité : − 1 + */}
          <div className="flex items-center border border-encre/15">
            <button
              type="button"
              onClick={() => setQuantity(line.key, line.quantity - 1)}
              disabled={line.quantity <= 1}
              aria-label={`Retirer un ${line.name}`}
              className={stepperClass}
            >
              −
            </button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(line.key, line.quantity + 1)}
              disabled={line.quantity >= MAX_QUANTITY}
              aria-label={`Ajouter un ${line.name}`}
              className={stepperClass}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(line.key)}
            className="min-h-11 text-sm text-gris underline decoration-gris/30 underline-offset-4 transition-colors hover:text-encre"
          >
            Retirer
          </button>
        </div>
      </div>
    </li>
  );
}

const stepperClass =
  "flex size-10 items-center justify-center text-lg transition-colors hover:bg-ivoire disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bleu";
