// La page de paiement DÉMO : elle remplace la page Wave tant qu'on n'a pas de vrai prestataire.
// Elle est volontairement très différente du reste du site : personne ne doit croire payer pour de vrai.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DemoPaymentActions } from "@/components/payment/DemoPaymentActions";
import { formatFcfa } from "@/lib/money";
import { formatOrderNumber } from "@/server/orders";
import { getPaymentForDemoPage, isDemoMode } from "@/server/payments";

export const metadata: Metadata = {
  title: "Paiement de démonstration",
  robots: { index: false },
};

const methodLabels = { WAVE: "Wave", ORANGE_MONEY: "Orange Money" } as const;

export default function DemoPaymentPage(props: PageProps<"/paiement/demo/[reference]">) {
  return (
    <main className="flex-1 bg-amber-50">
      <div className="bg-amber-400 px-4 py-3 text-center text-sm font-semibold tracking-wide text-amber-950">
        ⚠️ MODE DÉMONSTRATION — aucun argent n&apos;est prélevé, ce n&apos;est pas un vrai paiement
      </div>
      <div className="mx-auto max-w-md px-4 py-14">
        <Suspense fallback={<div className="h-96" />}>
          <DemoPayment params={props.params} />
        </Suspense>
      </div>
    </main>
  );
}

async function DemoPayment({ params }: { params: Promise<{ reference: string }> }) {
  if (!isDemoMode()) notFound();
  const { reference } = await params;
  const payment = await getPaymentForDemoPage(reference);
  if (!payment) notFound();

  return (
    <div className="border-2 border-dashed border-amber-500 bg-white p-6 sm:p-8">
      <p className="text-sm tracking-widest text-gris">SIMULATEUR {methodLabels[payment.method].toUpperCase()}</p>
      <p className="mt-6 text-sm text-gris">Commande {formatOrderNumber(payment.order.number)}</p>
      <p className="mt-1 text-4xl font-semibold tabular-nums">{formatFcfa(payment.amountFcfa)}</p>

      <p className="mt-6 text-sm leading-relaxed text-gris">
        Sur le vrai {methodLabels[payment.method]}, le client confirmerait ici avec son code secret. Choisissez le
        résultat à simuler : un webhook signé sera envoyé au serveur, comme le ferait le prestataire.
      </p>

      {payment.status === "PENDING" ? (
        <DemoPaymentActions reference={reference} orderId={payment.order.id} />
      ) : (
        <p className="mt-10 text-sm">Ce paiement a déjà un résultat ({payment.status}).</p>
      )}
    </div>
  );
}
