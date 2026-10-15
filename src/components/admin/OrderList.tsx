// La liste des commandes (tableau de bord et page Commandes).
// Sur téléphone : une carte par commande. Sur ordinateur : des lignes alignées en colonnes.
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatFcfa } from "@/lib/money";
import {
  deliveryStatusLabels,
  deliveryStatusTones,
  formatDate,
  formatOrderNumber,
  paymentStatusLabels,
  paymentStatusTones,
} from "@/lib/order-display";
import type { getAdminOrders } from "@/server/admin/orders";

type Orders = Awaited<ReturnType<typeof getAdminOrders>>;

export function OrderList({ orders, empty }: { orders: Orders; empty: string }) {
  if (orders.length === 0) {
    return <p className="bg-white px-5 py-10 text-center text-gris">{empty}</p>;
  }

  return (
    <ul className="divide-y divide-encre/10 bg-white">
      {orders.map((order) => {
        const pieces = order.items.reduce((sum, item) => sum + item.quantity, 0);
        return (
          <li key={order.id}>
            <Link
              href={`/admin/commandes/${order.id}`}
              className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-ivoire/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bleu md:grid-cols-[6rem_minmax(0,1fr)_8rem_7rem_8rem] md:items-center"
            >
              <span className="text-sm font-medium tracking-wide text-bleu">{formatOrderNumber(order.number)}</span>

              <span className="col-span-2 row-start-2 min-w-0 md:col-span-1 md:row-start-auto">
                <span className="block truncate font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </span>
                <span className="block truncate text-sm text-gris">
                  {pieces} pièce{pieces > 1 ? "s" : ""} · {order.items[0]?.productName}
                  {order.items.length > 1 && "…"} · {order.city} · {formatDate(order.createdAt)}
                </span>
              </span>

              <span className="col-start-2 row-start-1 text-right font-medium tabular-nums md:col-start-auto md:row-start-auto">
                {formatFcfa(order.totalFcfa)}
              </span>

              <span className="row-start-3 flex gap-2 md:row-start-auto md:justify-end">
                <StatusBadge tone={paymentStatusTones[order.paymentStatus]}>
                  {paymentStatusLabels[order.paymentStatus]}
                </StatusBadge>
              </span>
              <span className="row-start-3 flex justify-end md:row-start-auto">
                <StatusBadge tone={deliveryStatusTones[order.deliveryStatus]}>
                  {deliveryStatusLabels[order.deliveryStatus]}
                </StatusBadge>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
