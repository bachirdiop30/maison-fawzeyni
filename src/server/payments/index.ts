// La logique métier des paiements, quel que soit le prestataire.
//
// Deux moments :
// 1. startPayment   : le client veut payer → on crée une tentative et on obtient l'adresse de paiement.
// 2. applyWebhook   : le prestataire nous prévient du résultat → on met à jour la commande.
//
// Une commande ne devient PAYÉE qu'ici, à la réception d'un webhook vérifié.
// Jamais parce que le navigateur arrive sur une page « paiement réussi ».
import "server-only";
import { db } from "../db";
import { formatOrderNumber } from "../orders";
import { demoProvider } from "./demo";
import type { PaymentProvider } from "./provider";

export class PaymentError extends Error {}

// Le prestataire branché sur la « prise ». Choisi dans .env (PAYMENT_PROVIDER).
// Pour l'instant seul « demo » existe ; le vrai Wave s'ajoutera ici.
export function getPaymentProvider(): PaymentProvider {
  const name = process.env.PAYMENT_PROVIDER ?? "demo";
  if (name === "demo") return demoProvider;
  throw new Error(`Prestataire de paiement inconnu : « ${name} » (PAYMENT_PROVIDER dans .env).`);
}

export function isDemoMode(): boolean {
  return getPaymentProvider() === demoProvider;
}

// --- 1. Démarrer un paiement ---

export async function startPayment(orderId: string): Promise<{ redirectUrl: string }> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { id: true, number: true, totalFcfa: true, paymentMethod: true, paymentStatus: true },
  });
  if (!order) throw new PaymentError("Commande introuvable.");
  if (order.paymentStatus === "PAID") throw new PaymentError("Cette commande est déjà payée.");

  const provider = getPaymentProvider();

  // Une nouvelle tentative, « en attente ». Le MONTANT vient de la commande (calculé par le serveur).
  const payment = await db.payment.create({
    data: {
      orderId: order.id,
      method: order.paymentMethod,
      provider: provider.name,
      amountFcfa: order.totalFcfa,
    },
    select: { id: true },
  });

  const { providerReference, redirectUrl } = await provider.createPayment({
    paymentId: payment.id,
    orderNumber: formatOrderNumber(order.number),
    amountFcfa: order.totalFcfa,
    method: order.paymentMethod,
  });

  // On note le numéro du prestataire : c'est lui qui reviendra dans le webhook.
  await db.payment.update({ where: { id: payment.id }, data: { providerReference } });

  // Si une tentative précédente avait échoué, la commande redevient « en attente ».
  if (order.paymentStatus === "FAILED") {
    await db.order.update({ where: { id: order.id }, data: { paymentStatus: "PENDING" } });
  }

  return { redirectUrl };
}

// --- 2. Appliquer le résultat annoncé par le prestataire ---

export async function applyWebhook(result: {
  providerReference: string;
  status: "PAID" | "FAILED";
  amountFcfa: number;
}) {
  return db.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { providerReference: result.providerReference },
      select: { id: true, status: true, amountFcfa: true, orderId: true, order: { select: { paymentStatus: true } } },
    });
    if (!payment) throw new PaymentError("Paiement inconnu.");

    // Le montant payé doit être EXACTEMENT celui demandé.
    if (result.amountFcfa !== payment.amountFcfa) {
      throw new PaymentError("Le montant annoncé ne correspond pas au montant demandé.");
    }

    // Un prestataire peut envoyer le même avis plusieurs fois : on ne le traite qu'une fois.
    if (payment.status !== "PENDING") return { alreadyProcessed: true };

    await tx.payment.update({ where: { id: payment.id }, data: { status: result.status } });

    // La commande suit : payée si ce paiement a réussi ; échouée s'il a échoué
    // (sauf si une autre tentative l'a déjà payée).
    if (result.status === "PAID") {
      await tx.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "PAID" } });
    } else if (payment.order.paymentStatus !== "PAID") {
      await tx.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "FAILED" } });
    }
    return { alreadyProcessed: false };
  });
}

// --- Pour la page de paiement DÉMO ---

export async function getPaymentForDemoPage(providerReference: string) {
  return db.payment.findUnique({
    where: { providerReference },
    select: {
      status: true,
      method: true,
      amountFcfa: true,
      order: { select: { id: true, number: true } },
    },
  });
}
