// La « prise standard » des paiements : ce que TOUT prestataire doit savoir faire.
//
// Le reste du site ne connaît que cette forme. Aujourd'hui on y branche le prestataire DÉMO ;
// demain, un prestataire Wave ou Orange Money qui respecte la même forme, sans toucher au reste.
import "server-only";

export type PaymentResult = "PAID" | "FAILED";

export interface PaymentProvider {
  // Nom enregistré dans le tableau Payment (colonne `provider`) : « DEMO », « WAVE »…
  name: string;

  // ① Demander au prestataire d'ouvrir un paiement.
  // Il répond avec SON numéro pour ce paiement, et l'adresse où envoyer le client pour payer.
  createPayment(input: {
    paymentId: string; // notre identifiant, pour que le prestataire nous le rappelle
    orderNumber: string; // « MF-0007 », affiché au client sur la page de paiement
    amountFcfa: number;
    method: "WAVE" | "ORANGE_MONEY";
  }): Promise<{ providerReference: string; redirectUrl: string }>;

  // ② Lire un webhook reçu : vérifier qu'il vient VRAIMENT du prestataire (signature),
  // puis en extraire le résultat. Renvoie null si le message est faux ou illisible.
  readWebhook(rawBody: string, headers: Headers): Promise<{
    providerReference: string;
    status: PaymentResult;
    amountFcfa: number;
  } | null>;
}
