// La confirmation d'une commande : /commande/<identifiant>
// L'identifiant est long et impossible à deviner : seule la personne qui a commandé connaît cette adresse.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { formatFcfa } from "@/lib/money";
import { formatOrderNumber, getOrderConfirmation } from "@/server/orders";

export const metadata: Metadata = {
  title: "Commande enregistrée",
  robots: { index: false },
};

const paymentLabels = { WAVE: "Wave", ORANGE_MONEY: "Orange Money" } as const;
const statusLabels = { PENDING: "En attente", PAID: "Payé", FAILED: "Échoué" } as const;

export default function ConfirmationPage(props: PageProps<"/commande/[id]">) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20">
        <Suspense fallback={<div className="h-96" />}>
          <Confirmation params={props.params} />
        </Suspense>
      </div>
    </main>
  );
}

async function Confirmation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderConfirmation(id);
  if (!order) notFound();

  return (
    <>
      <p className="text-sm tracking-widest text-or-fonce">COMMANDE {formatOrderNumber(order.number)}</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-bleu sm:text-5xl">
        Merci, {order.customer.firstName}.
      </h1>
      <p className="mt-5 leading-relaxed text-gris">
        Votre commande est enregistrée. Nous vous contactons sur WhatsApp au +{order.customer.phone} pour prendre vos
        mesures et confirmer la livraison.
      </p>

      <ul className="mt-10 divide-y divide-encre/10 border-y border-encre/10">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 py-4">
            <span>
              {item.quantity} × <span className="font-display text-lg">{item.productName}</span>
              <span className="block text-sm text-gris">
                {item.formulaName}
                {item.color && ` · ${item.color}`}
              </span>
            </span>
            <span className="shrink-0">{formatFcfa(item.unitPriceFcfa * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4 text-base">
          <dt className="font-medium">Total</dt>
          <dd className="font-semibold text-bleu">{formatFcfa(order.totalFcfa)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gris">Paiement</dt>
          <dd>
            {paymentLabels[order.paymentMethod]} · {statusLabels[order.paymentStatus]}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gris">Livraison</dt>
          <dd className="text-right">
            {order.address}, {order.city}
          </dd>
        </div>
      </dl>

      <Button href="/catalogue" variant="secondary" className="mt-12">
        Continuer la visite
      </Button>
    </>
  );
}
