// L'action serveur qui change le statut de livraison d'une commande.
"use server";

import { refresh } from "next/cache";
import * as z from "zod";
import { AdminOrderError, updateDeliveryStatus } from "@/server/admin/orders";

export type StatusState = { error?: string; saved?: boolean } | undefined;

const schema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["PENDING", "IN_PROGRESS", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function updateDeliveryStatusAction(_previous: StatusState, formData: FormData): Promise<StatusState> {
  const parsed = schema.safeParse({ orderId: formData.get("orderId"), status: formData.get("status") });
  if (!parsed.success) return { error: "Statut invalide." };

  try {
    // updateDeliveryStatus vérifie elle-même que le gérant est connecté.
    await updateDeliveryStatus(parsed.data.orderId, parsed.data.status);
  } catch (error) {
    if (error instanceof AdminOrderError) return { error: error.message };
    throw error;
  }

  refresh(); // la page se réaffiche avec le nouveau statut
  return { saved: true };
}
