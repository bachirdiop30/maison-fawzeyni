// Lecture du catalogue pour les pages publiques du site.
import "server-only";
import { db } from "./db";

// Ce que le site public a le droit de recevoir pour un modèle.
// Le coût (costFcfa) n'en fait volontairement PAS partie.
export type CatalogueItem = {
  slug: string;
  name: string;
  category: string;
  fromPriceFcfa: number; // prix de la formule la moins chère : « à partir de »
  colorCount: number;
  image: { url: string; alt: string } | null;
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
      images: { orderBy: { position: "asc" }, take: 1, select: { url: true, alt: true } },
    },
  });

  return products
    .filter((product) => product.formulas.length > 0) // un modèle sans formule ne peut pas être acheté
    .map((product) => ({
      slug: product.slug,
      name: product.name,
      category: product.category.name,
      fromPriceFcfa: Math.min(...product.formulas.map((formula) => formula.priceFcfa)),
      colorCount: product.colors.length,
      image: product.images[0] ?? null,
    }));
}
