// Le prestataire DÉMO : il se comporte comme Wave, mais aucun argent ne bouge.
//
// Il joue les DEUX rôles :
// - côté « prestataire » : il ouvre une page de paiement (la nôtre, marquée DÉMO)
//   et, quand on clique sur un résultat, il envoie un webhook SIGNÉ à notre serveur ;
// - côté « boutique » : il vérifie la signature des webhooks reçus.
// Avec le vrai Wave, le 1er rôle est tenu par Wave lui-même.
import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { PaymentProvider, PaymentResult } from "./provider";

const SIGNATURE_HEADER = "x-demo-signature";

// La clé secrète partagée entre le « prestataire » et la boutique, rangée dans .env.
function secret(): string {
  const value = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!value || value.length < 32) {
    throw new Error("PAYMENT_WEBHOOK_SECRET manque dans .env (au moins 32 caractères). Voir .env.example.");
  }
  return value;
}

// La signature : une empreinte du message calculée avec la clé secrète (HMAC-SHA256).
// Sans la clé, impossible de fabriquer la bonne empreinte ; et si on change UNE lettre
// du message, l'empreinte ne correspond plus.
function sign(rawBody: string): string {
  return createHmac("sha256", secret()).update(rawBody).digest("hex");
}

export const demoProvider: PaymentProvider = {
  name: "DEMO",

  async createPayment() {
    const providerReference = `demo_${randomUUID()}`;
    return { providerReference, redirectUrl: `/paiement/demo/${providerReference}` };
  },

  async readWebhook(rawBody, headers) {
    const received = headers.get(SIGNATURE_HEADER) ?? "";
    const expected = sign(rawBody);
    // Comparaison « à temps constant » : on ne laisse pas deviner la signature lettre par lettre.
    const valid =
      received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected));
    if (!valid) return null;

    try {
      const data = JSON.parse(rawBody);
      if (typeof data.reference !== "string" || typeof data.amountFcfa !== "number") return null;
      if (data.status !== "PAID" && data.status !== "FAILED") return null;
      return { providerReference: data.reference, status: data.status, amountFcfa: data.amountFcfa };
    } catch {
      return null;
    }
  },
};

// Côté « faux Wave » : envoie à notre serveur le webhook qu'enverrait le prestataire.
// Il passe par la vraie adresse /api/webhooks/payment, exactement comme le ferait Wave.
export async function sendDemoWebhook(
  origin: string,
  payload: { reference: string; status: PaymentResult; amountFcfa: number },
) {
  const rawBody = JSON.stringify(payload);
  const response = await fetch(`${origin}/api/webhooks/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json", [SIGNATURE_HEADER]: sign(rawBody) },
    body: rawBody,
  });
  if (!response.ok) throw new Error(`Le webhook de démonstration a été refusé (${response.status}).`);
}
