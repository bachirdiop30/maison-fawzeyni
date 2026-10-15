// La fiche d'une commande, côté gérant : /admin/commandes/<identifiant>
// Ici, et seulement ici, on voit le coût et le bénéfice de chaque ligne.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DeliveryStatusForm } from "@/components/admin/DeliveryStatusForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatFcfa } from "@/lib/money";
import {
  deliveryStatusLabels,
  deliveryStatusTones,
  formatDate,
  formatOrderNumber,
  paymentMethodLabels,
  paymentStatusLabels,
  paymentStatusTones,
} from "@/lib/order-display";
import { whatsappLink } from "@/lib/whatsapp";
import { getAdminOrder } from "@/server/admin/orders";

export const metadata: Metadata = { title: "Commande" };

export default function AdminOrderPage(props: PageProps<"/admin/commandes/[id]">) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <Link href="/admin/commandes" className="text-sm text-gris underline-offset-4 hover:text-encre hover:underline">
        ← Commandes
      </Link>
      <Suspense fallback={<div className="mt-6 h-96 bg-encre/5" aria-busy="true" />}>
        <OrderDetail params={props.params} />
      </Suspense>
    </main>
  );
}

async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrder(id); // vérifie que le gérant est connecté
  if (!order) notFound();

  const number = formatOrderNumber(order.number);
  const { customer } = order;
  const cost = order.items.reduce((sum, item) => sum + item.unitCostFcfa * item.quantity, 0);
  const profit = order.totalFcfa - cost;
  const message = `Bonjour ${customer.firstName}, ici MaisonFawzeyni, au sujet de votre commande ${number}.`;

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="font-display text-3xl text-bleu sm:text-4xl">{number}</h1>
        <StatusBadge tone={paymentStatusTones[order.paymentStatus]}>{paymentStatusLabels[order.paymentStatus]}</StatusBadge>
        <StatusBadge tone={deliveryStatusTones[order.deliveryStatus]}>
          {deliveryStatusLabels[order.deliveryStatus]}
        </StatusBadge>
      </div>
      <p className="mt-2 text-sm text-gris">Passée le {formatDate(order.createdAt)}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        {/* Colonne principale : le contenu et l'argent */}
        <div className="space-y-6">
          <section className="bg-white p-5 sm:p-6">
            <h2 className="text-sm tracking-widest text-gris">ARTICLES</h2>
            <ul className="mt-4 divide-y divide-encre/10">
              {order.items.map((item) => {
                const lineProfit = (item.unitPriceFcfa - item.unitCostFcfa) * item.quantity;
                return (
                  <li key={item.id} className="py-4 first:pt-0">
                    <div className="flex justify-between gap-4">
                      <p>
                        {item.quantity} × <span className="font-display text-lg">{item.productName}</span>
                        <span className="block text-sm text-gris">
                          {item.formulaName}
                          {item.color && ` · ${item.color}`}
                        </span>
                      </p>
                      <p className="shrink-0 font-medium tabular-nums">{formatFcfa(item.unitPriceFcfa * item.quantity)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gris tabular-nums">
                      Prix {formatFcfa(item.unitPriceFcfa)} − coût {formatFcfa(item.unitCostFcfa)} ={" "}
                      <span className="text-or-fonce">{formatFcfa(item.unitPriceFcfa - item.unitCostFcfa)}</span> par pièce
                      {item.quantity > 1 && ` · ${formatFcfa(lineProfit)} au total`}
                    </p>
                  </li>
                );
              })}
            </ul>

            <dl className="mt-2 space-y-2 border-t border-encre/10 pt-4 text-sm tabular-nums">
              <Row label="Sous-total" value={formatFcfa(order.subtotalFcfa)} />
              <Row label="Livraison" value={formatFcfa(order.deliveryFeeFcfa)} />
              <Row label="Total payé par le client" value={formatFcfa(order.totalFcfa)} strong />
              <Row label="Coût pour la Maison" value={`− ${formatFcfa(cost)}`} />
              <Row label="Bénéfice brut" value={formatFcfa(profit)} strong gold />
            </dl>
          </section>

          <section className="bg-white p-5 sm:p-6">
            <h2 className="text-sm tracking-widest text-gris">PAIEMENTS · {paymentMethodLabels[order.paymentMethod].toUpperCase()}</h2>
            {order.payments.length === 0 ? (
              <p className="mt-4 text-sm text-gris">Le client n&apos;a pas encore lancé de paiement.</p>
            ) : (
              <ul className="mt-4 divide-y divide-encre/10 text-sm">
                {order.payments.map((payment) => (
                  <li key={payment.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                    <span className="text-gris">
                      {formatDate(payment.createdAt)} · {payment.provider}
                    </span>
                    <span className="flex items-center gap-3 tabular-nums">
                      {formatFcfa(payment.amountFcfa)}
                      <StatusBadge tone={paymentStatusTones[payment.status]}>{paymentStatusLabels[payment.status]}</StatusBadge>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Colonne de côté : le client et les actions */}
        <aside className="space-y-6">
          <section className="bg-white p-5 sm:p-6">
            <h2 className="text-sm tracking-widest text-gris">CLIENT</h2>
            <p className="mt-3 text-lg">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-sm text-gris">
              +{customer.phone}
              {customer._count.orders > 1 && ` · ${customer._count.orders} commandes`}
            </p>
            <a
              href={whatsappLink(customer.phone, message)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex min-h-11 items-center justify-center gap-2 bg-[#1f7a4d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#17603c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f7a4d]"
            >
              Écrire sur WhatsApp
            </a>

            <h3 className="mt-6 text-sm text-gris">Livraison</h3>
            <p className="mt-1">
              {order.address}
              <br />
              {order.city}
            </p>
            {order.deliveryNotes && <p className="mt-2 text-sm text-gris">« {order.deliveryNotes} »</p>}
          </section>

          <section className="bg-white p-5 sm:p-6">
            <DeliveryStatusForm orderId={order.id} current={order.deliveryStatus} />
          </section>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value, strong = false, gold = false }: { label: string; value: string; strong?: boolean; gold?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "text-base font-medium" : ""}`}>
      <dt className={strong ? "" : "text-gris"}>{label}</dt>
      <dd className={gold ? "text-or-fonce" : ""}>{value}</dd>
    </div>
  );
}
