// POST /api/webhooks/payment : le prestataire nous annonce le résultat d'un paiement.
//
// Ce n'est PAS le client qui appelle cette adresse : c'est le prestataire, de serveur à serveur.
// N'importe qui pourrait pourtant l'appeler : c'est pourquoi on vérifie la SIGNATURE avant tout.
//
// Réponses : 200 = bien reçu (le prestataire arrête de renvoyer l'avis)
//            401 = signature fausse : on ignore
//            400 = paiement inconnu ou montant différent
import { PaymentError, applyWebhook, getPaymentProvider } from "@/server/payments";

export async function POST(request: Request) {
  // Le texte EXACT reçu : la signature est calculée sur lui, au caractère près.
  const rawBody = await request.text();

  const result = await getPaymentProvider().readWebhook(rawBody, request.headers);
  if (!result) {
    console.warn("Webhook de paiement refusé : signature invalide.");
    return Response.json({ error: "Signature invalide." }, { status: 401 });
  }

  try {
    const { alreadyProcessed } = await applyWebhook(result);
    return Response.json({ received: true, alreadyProcessed });
  } catch (error) {
    if (error instanceof PaymentError) {
      console.warn("Webhook de paiement rejeté :", error.message);
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Traitement du webhook impossible :", error);
    return Response.json({ error: "Erreur interne." }, { status: 500 }); // le prestataire réessaiera
  }
}
