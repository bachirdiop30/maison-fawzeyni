// Le panier du visiteur, gardé dans son navigateur (localStorage).
//
// Pourquoi dans le navigateur et pas dans la base ? Les clients n'ont pas de compte :
// le panier n'est qu'une liste d'intentions, propre à cet appareil. Pas besoin de serveur
// pour la garder, et elle survit à la fermeture de l'onglet.
//
// ⚠️ Le visiteur peut modifier ce qui est stocké ici (prix compris). Les prix du panier
// servent donc seulement à l'AFFICHAGE : au moment de la commande, le serveur relira
// les vrais prix dans la base.
//
// Ce fichier ne sert qu'aux composants « use client » : le serveur n'a pas accès au localStorage.

import { useSyncExternalStore } from "react";

export type CartLine = {
  key: string; // identifie une ligne : même modèle + même formule + même couleur = même ligne
  slug: string;
  name: string;
  formulaId: string;
  formulaName: string;
  color: string;
  priceFcfa: number;
  image: string | null;
  quantity: number;
};

const STORAGE_KEY = "maisonfawzeyni-panier";
export const MAX_QUANTITY = 10;

// --- Lecture et écriture dans le navigateur ---

let cachedRaw: string | null = null;
let cachedLines: CartLine[] = [];

function read(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedLines; // stockage bloqué (navigation privée stricte) : on garde le panier en mémoire
  }
  // React exige le MÊME tableau tant que rien n'a changé : on ne relit le texte que s'il a changé.
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedLines = raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      cachedLines = []; // contenu illisible : on repart d'un panier vide
    }
  }
  return cachedLines;
}

const listeners = new Set<() => void>();

function write(lines: CartLine[]) {
  cachedLines = lines;
  try {
    cachedRaw = JSON.stringify(lines);
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // stockage bloqué : le panier reste en mémoire jusqu'à la fermeture de la page
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Si le panier change dans un autre onglet, celui-ci se met à jour aussi.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// --- Pour les composants ---

// Renvoie les lignes du panier, ou `null` tant que le navigateur ne les a pas encore lues
// (le serveur ne connaît pas le panier : il affiche un état « chargement »).
export function useCart(): CartLine[] | null {
  return useSyncExternalStore<CartLine[] | null>(subscribe, read, () => null);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.priceFcfa * line.quantity, 0);
}

// --- Les actions ---

export function addToCart(item: Omit<CartLine, "key" | "quantity">) {
  const key = `${item.slug}:${item.formulaId}:${item.color}`;
  const lines = read();
  const existing = lines.find((line) => line.key === key);

  write(
    existing
      ? lines.map((line) =>
          line.key === key ? { ...line, quantity: Math.min(line.quantity + 1, MAX_QUANTITY) } : line,
        )
      : [...lines, { ...item, key, quantity: 1 }],
  );
}

export function setQuantity(key: string, quantity: number) {
  const safe = Math.max(1, Math.min(quantity, MAX_QUANTITY));
  write(read().map((line) => (line.key === key ? { ...line, quantity: safe } : line)));
}

export function removeFromCart(key: string) {
  write(read().filter((line) => line.key !== key));
}

// Vide le panier : appelé une fois la commande enregistrée.
export function clearCart() {
  write([]);
}
