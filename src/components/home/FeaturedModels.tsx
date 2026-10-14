// Les modèles mis en avant, lus dans la base.
// Sur téléphone : une rangée qu'on fait glisser du doigt. Sur ordinateur : quatre colonnes décalées.
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getCatalogue } from "@/server/catalogue";

export function FeaturedModels() {
  return (
    <section className="mx-auto max-w-6xl py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4 px-4 sm:px-6">
        <h2 className="font-display text-4xl leading-tight text-bleu sm:text-5xl">Les modèles de la Maison</h2>
        <Link
          href="/catalogue"
          className="inline-flex min-h-11 items-center text-bleu underline decoration-bleu/30 underline-offset-8 transition-colors hover:decoration-bleu focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bleu"
        >
          Voir tous les modèles
        </Link>
      </div>

      <Suspense fallback={<div className="mt-12 h-96" />}>
        <FeaturedList />
      </Suspense>
    </section>
  );
}

async function FeaturedList() {
  const items = (await getCatalogue()).slice(0, 4);

  return (
    <ul className="mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:scroll-px-6 sm:px-6 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0">
      {items.map((item) => (
        // Une colonne sur deux est décalée vers le bas : un rythme de magazine plutôt qu'une grille rigide.
        <li key={item.slug} className="w-[72vw] max-w-xs shrink-0 snap-start md:w-auto md:max-w-none md:even:mt-16">
          <ProductCard item={item} sizes="(min-width: 768px) 25vw, 72vw" />
        </li>
      ))}
    </ul>
  );
}
