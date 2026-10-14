// Lecture du catalogue pour les pages publiques du site.
import "server-only";
import { cache } from "react";
import { db } from "./db";

// Ce que le site public a le droit de recevoir pour un modèle.
// Le coût (costFcfa) n'en fait volontairement PAS partie.
export type CatalogueItem = {
  slug: string;
  name: string;
  category: string;
  fromPriceFcfa: number; // prix de la formule la moins chère : « à partir de »
  colors: string[];
  image: { url: string; alt: string } | null;
  hoverImage: { url: string; alt: string } | null; // 2e photo, montrée au survol
};

export async function getCatalogue(): Promise<CatalogueItem[]> {
  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    // `select` liste exactement les colonnes lues dans la base.
    // Tout ce qui n'est pas listé (dont costFcfa) ne quitte jamais la base.
    select: {
      slug: true,
      name: true,
      colors: true,
      category: { select: { name: true } },
      formulas: { where: { isActive: true }, select: { priceFcfa: true } },
      images: { orderBy: { position: "asc" }, take: 2, select: { url: true, alt: true } },
    },
  });

  return products
    .filter((product) => product.formulas.length > 0) // un modèle sans formule ne peut pas être acheté
    .map((product) => ({
      slug: product.slug,
      name: product.name,
      category: product.category.name,
      fromPriceFcfa: Math.min(...product.formulas.map((formula) => formula.priceFcfa)),
      colors: product.colors,
      image: product.images[0] ?? null,
      hoverImage: product.images[1] ?? null,
    }));
}

// Ce que la fiche d'un modèle a le droit de recevoir. Toujours sans le coût.
export type ProductDetail = {
  slug: string;
  name: string;
  description: string;
  category: string;
  colors: string[];
  formulas: { id: string; name: string; description: string; priceFcfa: number }[];
  images: { url: string; alt: string }[];
};

// `cache` : si la page et son titre (generateMetadata) demandent le même modèle,
// la base n'est interrogée qu'une seule fois par visite.
export const getProduct = cache(async (slug: string): Promise<ProductDetail | null> => {
  const product = await db.product.findFirst({
    where: { slug, isActive: true },
    select: {
      slug: true,
      name: true,
      description: true,
      colors: true,
      category: { select: { name: true } },
      formulas: {
        where: { isActive: true },
        orderBy: { position: "asc" },
        select: { id: true, name: true, description: true, priceFcfa: true },
      },
      images: { orderBy: { position: "asc" }, select: { url: true, alt: true } },
    },
  });

  if (!product || product.formulas.length === 0) return null;

  return { ...product, category: product.category.name };
});
