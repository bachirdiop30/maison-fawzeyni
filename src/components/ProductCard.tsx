// La carte d'un modèle : photo, nom, couleurs, prix « à partir de ».
// Utilisée dans le catalogue et sur la page d'accueil. Un clic ouvre la fiche du modèle.
//
// Au survol de la souris (ordinateur) : la 2e photo apparaît en fondu, avec un zoom très lent.
// Sur téléphone, il n'y a pas de survol : la carte reste sur la 1re photo.
import Image from "next/image";
import Link from "next/link";
import { swatchFor } from "@/lib/colors";
import { formatFcfa } from "@/lib/money";
import type { CatalogueItem } from "@/server/catalogue";

type ProductCardProps = {
  item: CatalogueItem;
  sizes: string; // largeur de la photo à l'écran, pour que le navigateur télécharge la bonne taille
  eager?: boolean; // true pour les photos visibles dès l'arrivée sur la page
};

const photoClass = "object-cover transition duration-700 ease-out group-hover:scale-[1.04]";

export function ProductCard({ item, sizes, eager = false }: ProductCardProps) {
  return (
    <Link
      href={`/catalogue/${item.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bleu"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ivoire">
        {item.image && (
          <Image
            src={item.image.url}
            alt={item.image.alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            className={`${photoClass} ${item.hoverImage ? "group-hover:opacity-0" : ""}`}
          />
        )}
        {item.hoverImage && (
          <Image
            src={item.hoverImage.url}
            alt=""
            fill
            sizes={sizes}
            className={`${photoClass} opacity-0 group-hover:opacity-100`}
          />
        )}
      </div>

      <h3 className="mt-4 font-display text-xl leading-snug">{item.name}</h3>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-sm text-gris">{item.category}</p>
        {/* Les couleurs proposées, en pastilles */}
        <ul className="flex shrink-0 items-center -space-x-1" aria-label={`Couleurs : ${item.colors.join(", ")}`}>
          {item.colors.slice(0, 4).map((color) => (
            <li
              key={color}
              title={color}
              className="size-3.5 rounded-full border border-white ring-1 ring-encre/15"
              style={{ backgroundColor: swatchFor(color) }}
            />
          ))}
          {item.colors.length > 4 && (
            <li aria-hidden className="pl-2 text-xs text-gris">
              +{item.colors.length - 4}
            </li>
          )}
        </ul>
      </div>
      <p className="mt-2 font-semibold text-bleu">
        <span className="text-sm font-normal text-gris">à partir de </span>
        {formatFcfa(item.fromPriceFcfa)}
      </p>
    </Link>
  );
}
