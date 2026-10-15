// La liste des commandes : /admin/commandes?filtre=a-traiter
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OrderList } from "@/components/admin/OrderList";
import { type OrderFilter, getAdminOrders, orderFilters } from "@/server/admin/orders";

export const metadata: Metadata = { title: "Commandes" };

const emptyMessages: Record<OrderFilter, string> = {
  "a-traiter": "Aucune commande payée à traiter.",
  "a-payer": "Aucune commande en attente de paiement.",
  livrees: "Aucune commande livrée pour l'instant.",
  annulees: "Aucune commande annulée.",
  toutes: "Aucune commande pour l'instant.",
};

export default function OrdersPage(props: PageProps<"/admin/commandes">) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl text-bleu sm:text-4xl">Commandes</h1>
      <Suspense fallback={<div className="mt-8 h-96 bg-encre/5" aria-busy="true" />}>
        <Orders searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function Orders({ searchParams }: { searchParams: PageProps<"/admin/commandes">["searchParams"] }) {
  const requested = (await searchParams).filtre;
  const filter: OrderFilter =
    typeof requested === "string" && requested in orderFilters ? (requested as OrderFilter) : "a-traiter";
  // getAdminOrders vérifie que le gérant est connecté.
  const orders = await getAdminOrders(filter);

  return (
    <>
      <nav aria-label="Filtrer les commandes" className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          {Object.entries(orderFilters).map(([value, label]) => (
            <li key={value}>
              <Link
                href={`/admin/commandes?filtre=${value}`}
                aria-current={filter === value ? "page" : undefined}
                className={`inline-flex min-h-10 items-center border px-4 text-sm whitespace-nowrap transition-colors ${
                  filter === value
                    ? "border-bleu bg-bleu text-white"
                    : "border-encre/15 bg-white text-gris hover:border-bleu/50 hover:text-encre"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6">
        <OrderList orders={orders} empty={emptyMessages[filter]} />
      </div>
      {orders.length === 100 && <p className="mt-4 text-sm text-gris">Les 100 commandes les plus récentes.</p>}
    </>
  );
}
