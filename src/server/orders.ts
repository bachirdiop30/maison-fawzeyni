// La création d'une commande : la logique métier, séparée de l'API qui l'appelle.
//
// Règle d'or : on ne fait JAMAIS confiance aux prix envoyés par le navigateur.
// Le client nous dit seulement QUOI il veut (formule, couleur, quantité) ;
// le serveur relit les prix et les coûts dans la base et calcule lui-même le total.
import "server-only";
import { z } from "zod";
import { db } from "./db";

z.config(z.locales.fr()); // messages d'erreur de validation en français

// --- Ce que le navigateur a le droit d'envoyer ---

// Un numéro sénégalais (77 123 45 67) ou international (+33 6…).
// On garde uniquement les chiffres ; un numéro à 9 chiffres reçoit l'indicatif 221.
const phoneSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .transform((digits) => (digits.length === 9 ? `221${digits}` : digits))
  .refine((digits) => digits.length >= 10 && digits.length <= 15, "Numéro de téléphone invalide");

const text = (max: number) => z.string().trim().min(1, "Champ obligatoire").max(max);

export const orderInputSchema = z.object({
  firstName: text(60),
  lastName: text(60),
  phone: phoneSchema,
  address: text(200),
  city: text(80),
  deliveryNotes: z.string().trim().max(500).optional(),
  paymentMethod: z.enum(["WAVE", "ORANGE_MONEY"]),
  items: z
    .array(
      z.object({
        formulaId: z.string().min(1),
        color: z.string().max(40),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "Le panier est vide")
    .max(20),
});

export type OrderInput = z.input<typeof orderInputSchema>;

// Une erreur « attendue » (formule disparue, couleur inconnue…) : son message peut être montré au client.
export class OrderError extends Error {}

// --- La création ---

export async function createOrder(input: z.output<typeof orderInputSchema>) {
  // 1. Relire dans la base les formules demandées, avec leur VRAI prix et leur coût.
  const formulaIds = [...new Set(input.items.map((item) => item.formulaId))];
  const formulas = await db.formula.findMany({
    where: { id: { in: formulaIds }, isActive: true, product: { isActive: true } },
    select: {
      id: true,
      name: true,
      priceFcfa: true,
      costFcfa: true,
      product: { select: { id: true, name: true, colors: true } },
    },
  });

  // 2. Vérifier chaque ligne et préparer sa « photo » figée.
  const lines = input.items.map((item) => {
    const formula = formulas.find((f) => f.id === item.formulaId);
    if (!formula) {
      throw new OrderError("Un article de votre panier n'est plus disponible. Retirez-le puis réessayez.");
    }
    if (formula.product.colors.length > 0 && !formula.product.colors.includes(item.color)) {
      throw new OrderError(`La couleur « ${item.color} » n'est pas proposée pour le ${formula.product.name}.`);
    }
    return {
      productId: formula.product.id,
      formulaId: formula.id,
      productName: formula.product.name,
      formulaName: formula.name,
      color: item.color,
      quantity: item.quantity,
      unitPriceFcfa: formula.priceFcfa,
      unitCostFcfa: formula.costFcfa,
    };
  });

  // 3. Calculer les montants.
  const subtotalFcfa = lines.reduce((sum, line) => sum + line.unitPriceFcfa * line.quantity, 0);
  const deliveryFeeFcfa = 0; // confirmée avec le client pour l'instant
  const totalFcfa = subtotalFcfa + deliveryFeeFcfa;

  // 4. Tout enregistrer en une seule opération : soit tout réussit, soit rien n'est écrit.
  return db.$transaction(async (tx) => {
    // Le client est reconnu à son téléphone : on met à jour sa fiche, ou on la crée.
    const customer = await tx.customer.upsert({
      where: { phone: input.phone },
      update: { firstName: input.firstName, lastName: input.lastName },
      create: { firstName: input.firstName, lastName: input.lastName, phone: input.phone },
      select: { id: true },
    });

    return tx.order.create({
      data: {
        customerId: customer.id,
        address: input.address,
        city: input.city,
        deliveryNotes: input.deliveryNotes || null,
        subtotalFcfa,
        deliveryFeeFcfa,
        totalFcfa,
        paymentMethod: input.paymentMethod,
        items: { create: lines },
      },
      select: { id: true, number: true, totalFcfa: true },
    });
  });
}

// Le numéro affiché au client : 7 → « MF-0007 ».
export { formatOrderNumber } from "@/lib/order-display";

// Ce que la page de confirmation a le droit de montrer au client. Sans aucun coût.
export async function getOrderConfirmation(id: string) {
  return db.order.findUnique({
    where: { id },
    select: {
      number: true,
      address: true,
      city: true,
      totalFcfa: true,
      paymentMethod: true,
      paymentStatus: true,
      customer: { select: { firstName: true, phone: true } },
      items: {
        select: {
          id: true,
          productName: true,
          formulaName: true,
          color: true,
          quantity: true,
          unitPriceFcfa: true,
        },
      },
    },
  });
}
