// Les commandes vues par le gérant : liste, détail, changement de statut.
// Chaque fonction commence par requireAdmin() : c'est ici, au plus près des données,
// qu'on vérifie qui demande. (Une page oubliée ne pourrait donc rien divulguer.)
import "server-only";
import type { DeliveryStatus } from "@/lib/order-display";
import { requireAdmin } from "../auth";
import { db } from "../db";
import type { Prisma } from "@/generated/prisma/client";

// Les onglets de la liste des commandes.
export const orderFilters = {
  "a-traiter": "À traiter",
  "a-payer": "En attente de paiement",
  livrees: "Livrées",
  annulees: "Annulées",
  toutes: "Toutes",
} as const;

export type OrderFilter = keyof typeof orderFilters;

const filterWhere: Record<OrderFilter, Prisma.OrderWhereInput> = {
  // Payées, mais pas encore livrées : le travail de l'atelier.
  "a-traiter": { paymentStatus: "PAID", deliveryStatus: { in: ["PENDING", "IN_PROGRESS", "SHIPPED"] } },
  "a-payer": { paymentStatus: { in: ["PENDING", "FAILED"] }, deliveryStatus: { not: "CANCELLED" } },
  livrees: { deliveryStatus: "DELIVERED" },
  annulees: { deliveryStatus: "CANCELLED" },
  toutes: {},
};

export async function getAdminOrders(filter: OrderFilter, take = 100) {
  await requireAdmin();
  return db.order.findMany({
    where: filterWhere[filter],
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      number: true,
      createdAt: true,
      city: true,
      totalFcfa: true,
      paymentStatus: true,
      deliveryStatus: true,
      customer: { select: { firstName: true, lastName: true } },
      items: { select: { productName: true, quantity: true } },
    },
  });
}

export async function getAdminOrder(id: string) {
  await requireAdmin();
  return db.order.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      createdAt: true,
      address: true,
      city: true,
      deliveryNotes: true,
      subtotalFcfa: true,
      deliveryFeeFcfa: true,
      totalFcfa: true,
      paymentMethod: true,
      paymentStatus: true,
      deliveryStatus: true,
      customer: { select: { firstName: true, lastName: true, phone: true, _count: { select: { orders: true } } } },
      items: {
        select: {
          id: true,
          productName: true,
          formulaName: true,
          color: true,
          quantity: true,
          unitPriceFcfa: true,
          unitCostFcfa: true,
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        select: { id: true, createdAt: true, provider: true, amountFcfa: true, status: true },
      },
    },
  });
}

export class AdminOrderError extends Error {}

// Avancer une commande dans l'atelier : à commencer → en confection → en livraison → livrée.
export async function updateDeliveryStatus(orderId: string, status: DeliveryStatus) {
  await requireAdmin();
  const order = await db.order.findUnique({ where: { id: orderId }, select: { paymentStatus: true } });
  if (!order) throw new AdminOrderError("Commande introuvable.");

  // Règle de la Maison : on ne coupe pas le tissu avant d'être payé.
  // (Annuler, ou revenir à « À commencer », reste toujours possible.)
  if (order.paymentStatus !== "PAID" && status !== "PENDING" && status !== "CANCELLED") {
    throw new AdminOrderError("Cette commande n'est pas payée : elle ne peut pas passer en confection.");
  }

  await db.order.update({ where: { id: orderId }, data: { deliveryStatus: status } });
}
