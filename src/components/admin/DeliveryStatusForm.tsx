// Le choix du statut de livraison sur la fiche d'une commande.
// Le serveur vérifie tout (gérant connecté, commande payée) : ce formulaire ne fait que demander.
"use client";

import { useActionState } from "react";
import { type StatusState, updateDeliveryStatusAction } from "@/app/admin/commandes/actions";
import { type DeliveryStatus, deliveryStatusLabels } from "@/lib/order-display";

export function DeliveryStatusForm({ orderId, current }: { orderId: string; current: DeliveryStatus }) {
  const [state, action, pending] = useActionState<StatusState, FormData>(updateDeliveryStatusAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="orderId" value={orderId} />
      <label htmlFor="status" className="block text-sm text-gris">
        Statut de la commande
      </label>
      <div className="flex gap-2">
        {/* key : le menu se remet sur la bonne valeur après chaque enregistrement */}
        <select
          key={current}
          id="status"
          name="status"
          defaultValue={current}
          className="min-h-11 min-w-0 flex-1 border border-encre/20 bg-white px-3 focus:border-bleu focus:outline-2 focus:outline-bleu/30"
        >
          {Object.entries(deliveryStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 bg-bleu px-4 text-sm font-medium text-white transition-colors hover:bg-nuit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bleu disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "…" : "Enregistrer"}
        </button>
      </div>
      {state?.error && (
        <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      )}
      {state?.saved && !pending && (
        <p role="status" className="text-sm text-emerald-800">
          ✓ Statut enregistré.
        </p>
      )}
    </form>
  );
}
