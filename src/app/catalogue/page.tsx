import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getCatalogue } from "@/server/catalogue";

export const metadata: Metadata = {
  title: "Nos modèles",
};

// Cette page est un composant serveur : elle s'exécute sur le serveur,
// lit la base, et n'envoie au navigateur que le HTML final.
export default function CataloguePage() {
  return (
    <main className="flex-1">
      <header className="bg-ivoire">
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16">
          <h1 className="font-display text-5xl leading-tight text-bleu sm:text-6xl">Nos modèles</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gris">
            Chaque pièce est cousue sur mesure. Choisissez un modèle, une formule et votre couleur : nous nous
            occupons du reste.
          </p>
          <div aria-hidden className="mt-10 h-px w-16 bg-or-fonce" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* La partie fixe s'affiche tout de suite, la liste arrive dès que la base a répondu. */}
        <Suspense fallback={<CatalogueSkeleton />}>
          <CatalogueGrid />
        </Suspense>
      </div>
    </main>
  );
}

async function CatalogueGrid() {
  const items = await getCatalogue();

  if (items.length === 0) {
    return <p className="text-gris">Aucun modèle n&apos;est disponible pour le moment.</p>;
  }

  return (
    <>
      <p className="mb-8 text-sm text-gris">
        {items.length} modèle{items.length > 1 ? "s" : ""} · cousus sur mesure
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4">
        {items.map((item, index) => (
          <li key={item.slug}>
            <ProductCard item={item} sizes="(min-width: 1024px) 25vw, 50vw" eager={index < 2} />
          </li>
        ))}
      </ul>
    </>
  );
}

function CatalogueSkeleton() {
  return (
    <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4" aria-label="Chargement des modèles">
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i}>
          <div className="aspect-[4/5] bg-ivoire" />
          <div className="mt-4 h-5 w-2/3 bg-ivoire" />
          <div className="mt-2 h-4 w-1/2 bg-ivoire" />
        </li>
      ))}
    </ul>
  );
}
