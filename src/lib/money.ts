// Formatage des montants, utilisable partout (serveur comme navigateur).

const fcfaFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

// 65000 → « 65 000 FCFA » (avec des espaces insécables : le montant ne se coupe jamais en deux lignes)
export function formatFcfa(amount: number): string {
  return `${fcfaFormatter.format(amount)} FCFA`;
}
