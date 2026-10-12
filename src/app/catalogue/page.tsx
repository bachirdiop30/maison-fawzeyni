import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { formatFcfa } from "@/lib/money";
import { getCatalogue } from "@/server/catalogue";

export const metadata: Metadata = {
  title: "Nos modèles",
};

// Cette page est un composant serveur : elle s'exécute sur le serveur,
// lit la base, et n'envoie au navigateur que le HTML final.
export default function CataloguePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 max-w-xl sm:mb-14">
        <h1 className="text-4xl font-light tracking-tight text-bleu sm:text-5xl">Nos modèles</h1>
        <p className="mt-4 leading-relaxed text-encre/75">
          Chaque pièce est cousue sur mesure. Choisissez un modèle, une formule et votre couleur :
          nous nous occupons du reste.
        </p>
      </header>

      {/* La partie fixe s'affiche tout de suite, la liste arrive dès que la base a répondu. */}
      <Suspense fallback={<CatalogueSkeleton />}>
        <CatalogueGrid />
      </Suspense>
    </main>
  );
}

async function CatalogueGrid() {
  const items = await getCatalogue();

  if (items.length === 0) {
    return <p className="text-encre/75">Aucun modèle n&apos;est disponible pour le moment.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {items.map((item, index) => (
        <li key={item.slug}>
          <div className="relative aspect-[4/5] overflow-hidden bg-bleu/10">
            {item.image && (
              <Image
                src={item.image.url}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
                priority={index < 2}
              />
            )}
          </div>
          <h2 className="mt-4 text-lg leading-snug">{item.name}</h2>
          <p className="mt-1 text-sm text-encre/65">
            {item.category} · {item.colorCount} couleur{item.colorCount > 1 ? "s" : ""}
          </p>
          <p className="mt-2 font-semibold text-bleu">
            <span className="text-sm font-normal text-encre/65">à partir de </span>
            {formatFcfa(item.fromPriceFcfa)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function CatalogueSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4" aria-label="Chargement des modèles">
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i}>
          <div className="aspect-[4/5] bg-bleu/10" />
          <div className="mt-4 h-5 w-2/3 bg-bleu/10" />
          <div className="mt-2 h-4 w-1/2 bg-bleu/10" />
        </li>
      ))}
    </ul>
  );
}
