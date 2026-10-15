// Comment afficher une commande : numéro, libellés des statuts, couleurs, dates.
// Utilisable partout (boutique et admin, serveur et navigateur) : aucune donnée sensible ici.

// 7 → « MF-0007 »
export function formatOrderNumber(n: number): string {
  return `MF-${String(n).padStart(4, "0")}`;
}

export const paymentMethodLabels = { WAVE: "Wave", ORANGE_MONEY: "Orange Money" } as const;

export const paymentStatusLabels = { PENDING: "En attente", PAID: "Payé", FAILED: "Échoué" } as const;

export const deliveryStatusLabels = {
  PENDING: "À commencer",
  IN_PROGRESS: "En confection",
  SHIPPED: "En livraison",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
} as const;

export type PaymentStatus = keyof typeof paymentStatusLabels;
export type DeliveryStatus = keyof typeof deliveryStatusLabels;

// La couleur de chaque pastille de statut : vert = bon, ambre = à surveiller, rouge = problème.
export const paymentStatusTones: Record<PaymentStatus, Tone> = { PENDING: "amber", PAID: "green", FAILED: "red" };

export const deliveryStatusTones: Record<DeliveryStatus, Tone> = {
  PENDING: "amber",
  IN_PROGRESS: "blue",
  SHIPPED: "blue",
  DELIVERED: "green",
  CANCELLED: "grey",
};

export type Tone = "green" | "amber" | "red" | "blue" | "grey";

// Les dates sont affichées à l'heure de Dakar, où que soit le serveur.
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Dakar",
});

// → « 14 oct., 16:52 »
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}
