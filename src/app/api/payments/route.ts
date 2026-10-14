// POST /api/payments : le client veut payer une commande.
// Réponse : { redirectUrl } = l'adresse de la page de paiement du prestataire.
import { z } from "zod";
import { PaymentError, startPayment } from "@/server/payments";

const inputSchema = z.object({ orderId: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const { redirectUrl } = await startPayment(parsed.data.orderId);
    return Response.json({ redirectUrl }, { status: 201 });
  } catch (error) {
    if (error instanceof PaymentError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    console.error("Démarrage du paiement impossible :", error);
    return Response.json({ error: "Le paiement n'a pas pu démarrer. Réessayez dans un instant." }, { status: 500 });
  }
}
