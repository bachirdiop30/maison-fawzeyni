// Qui est la Maison : la raison d'être de la marque, avec les mots de ses publications.
import Image from "next/image";

export function BrandStory() {
  return (
    <section className="bg-ivoire">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:gap-16 md:py-28">
        <div className="relative aspect-[4/5] md:order-2">
          {/* Photo de démonstration : Unsplash, Bruno Ngarukiye */}
          <Image
            src="/images/produits/baye-sonhibou-1.jpg"
            alt="Un homme vêtu d'un boubou gris brodé"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-lg">
          <h2 className="font-display text-4xl leading-tight text-bleu sm:text-5xl">
            Plus qu&apos;un vêtement, un héritage.
          </h2>
          <div aria-hidden className="mt-8 h-px w-16 bg-or-fonce" />
          <p className="mt-8 text-lg leading-relaxed">
            Maison de couture mouride et de personal shopping, nous créons et sélectionnons des pièces inspirées
            de notre patrimoine vestimentaire, avec une touche moderne, élégante et raffinée.
          </p>
          <p className="mt-5 leading-relaxed text-gris">
            De Baye Lahad à Baye Sonhibou, de Njitlay à Turki Njaareem, chaque tenue est cousue pour vous, à vos
            mesures.
          </p>
        </div>
      </div>
    </section>
  );
}
