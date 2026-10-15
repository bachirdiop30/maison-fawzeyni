// Les chiffres du tableau de bord du gérant.
//
// Les définitions (voir PROJET.md §15) :
// - Chiffre d'affaires (CA) : ce que les clients ont PAYÉ (commandes payées, non annulées).
// - Coût : ce que ces boubous ont coûté à la Maison (tissu + couture), au moment de l'achat.
// - Bénéfice brut : CA − coût.
// - À encaisser : commandes enregistrées mais pas encore payées (ni annulées).
//
// Les coûts et prix viennent des lignes de commande (OrderItem), qui gardent une copie
// figée du moment de l'achat : changer un prix demain ne modifie pas les chiffres d'hier.
import "server-only";
import { requireAdmin } from "../auth";
import { db } from "../db";

export type Period = "mois" | "tout";

export async function getDashboard(period: Period) {
  await requireAdmin(); // les chiffres ne sortent JAMAIS sans gérant connecté

  // Début du mois en cours (heure de Dakar = heure universelle).
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  // Une boutique de quelques centaines de commandes : on lit tout et on additionne ici.
  // Avec des dizaines de milliers de commandes, on ferait faire les additions par la base.
  const orders = await db.order.findMany({
    where: period === "mois" ? { createdAt: { gte: monthStart } } : {},
    select: {
      totalFcfa: true,
      paymentStatus: true,
      deliveryStatus: true,
      items: { select: { quantity: true, unitCostFcfa: true } },
    },
  });

  let revenue = 0;
  let cost = 0;
  let pieces = 0;
  let paidOrders = 0;
  let toCollect = 0;
  let unpaidOrders = 0;
  let toProcess = 0;

  for (const order of orders) {
    if (order.deliveryStatus === "CANCELLED") continue; // une commande annulée ne compte nulle part

    if (order.paymentStatus === "PAID") {
      paidOrders += 1;
      revenue += order.totalFcfa;
      for (const item of order.items) {
        cost += item.unitCostFcfa * item.quantity;
        pieces += item.quantity;
      }
      if (order.deliveryStatus !== "DELIVERED") toProcess += 1;
    } else {
      unpaidOrders += 1;
      toCollect += order.totalFcfa;
    }
  }

  const profit = revenue - cost;
  return {
    revenue,
    cost,
    profit,
    margin: revenue > 0 ? Math.round((profit / revenue) * 100) : 0, // en %
    pieces,
    paidOrders,
    toCollect,
    unpaidOrders,
    toProcess,
  };
}
