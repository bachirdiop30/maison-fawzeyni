// POST /api/payments/demo : les boutons de la page DÉMO (« réussi » / « échoué »).
// Ce guichet joue le rôle de Wave : il envoie à notre serveur un webhook signé.
// Il n'existe QU'EN mode démo : avec un vrai prestataire, il répond 404.
import { z } from "zod";
import { sendDemoWebhook } from "@/server/payments/demo";
import { getPaymentForDemoPage, isDemoMode } from "@/server/payments";

const inputSchema = z.object({
  reference: z.string().min(1),
  outcome: z.enum(["PAID", "FAILED"]),
});

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return Response.json({ error: "Introuvable." }, { status: 404 });
  }

  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const payment = await getPaymentForDemoPage(parsed.data.reference);
  if (!payment) return Response.json({ error: "Paiement introuvable." }, { status: 404 });
  if (payment.status !== "PENDING") {
    return Response.json({ error: "Ce paiement a déjà un résultat." }, { status: 409 });
  }

  try {
    await sendDemoWebhook(new URL(request.url).origin, {
      reference: parsed.data.reference,
      status: parsed.data.outcome,
      amountFcfa: payment.amountFcfa,
    });
    return Response.json({ orderId: payment.order.id });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "La simulation a échoué." }, { status: 500 });
  }
}
