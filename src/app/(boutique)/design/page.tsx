// Page interne qui montre le design system : couleurs, polices, boutons.
// Elle n'existe qu'en développement (npm run dev) : en ligne, elle renvoie une page 404.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { formatFcfa } from "@/lib/money";

export const metadata: Metadata = { title: "Design system" };

const colors = [
  { name: "bleu", hex: "#1B5289", usage: "La marque : en-tête, boutons principaux, prix" },
  { name: "nuit", hex: "#0E2F55", usage: "Fonds sombres, pied de page, survol" },
  { name: "or", hex: "#D2AE60", usage: "Logo, filets, accents — uniquement sur fond bleu ou nuit" },
  { name: "or-fonce", hex: "#7D5F22", usage: "L'or lisible sur fond clair" },
  { name: "ivoire", hex: "#F6F2EA", usage: "Fonds clairs des sections" },
  { name: "encre", hex: "#12233A", usage: "Texte courant" },
  { name: "gris", hex: "#5B6675", usage: "Texte secondaire" },
];

export default function DesignPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl text-bleu sm:text-5xl">Design system</h1>
        <p className="mt-3 max-w-xl text-gris">
          Les briques de MaisonFawzeyni. Chaque couleur et chaque police viennent de{" "}
          <code className="text-encre">src/app/globals.css</code> et{" "}
          <code className="text-encre">src/app/layout.tsx</code>.
        </p>

        <h2 className="mt-14 text-sm font-medium text-gris">Couleurs</h2>
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {colors.map((color) => (
            <li key={color.name}>
              <div className="aspect-[4/3] border border-encre/10" style={{ backgroundColor: color.hex }} />
              <p className="mt-2 font-medium">{color.name}</p>
              <p className="text-sm text-gris">{color.hex}</p>
              <p className="mt-1 text-sm leading-snug text-gris">{color.usage}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-sm font-medium text-gris">Typographie</h2>
        <div className="mt-4 space-y-6">
          <div>
            <p className="font-display text-5xl leading-tight text-encre sm:text-6xl">L&apos;élégance en héritage</p>
            <p className="mt-1 text-sm text-gris">Bodoni Moda — grands titres, noms des modèles</p>
          </div>
          <div>
            <p className="font-display text-3xl text-encre">Baye Sonhibou</p>
            <p className="mt-1 text-sm text-gris">Bodoni Moda — nom d&apos;un modèle</p>
          </div>
          <div className="max-w-xl">
            <p className="text-lg leading-relaxed">
              Le grand boubou ample de la Maison, en Getzner, cousu sur mesure avec une finition soignée.
            </p>
            <p className="mt-1 text-sm text-gris">Jost — texte courant</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-bleu">{formatFcfa(85000)}</p>
            <p className="mt-1 text-sm text-gris">Jost semi-gras — prix</p>
          </div>
        </div>

        <h2 className="mt-14 text-sm font-medium text-gris">Boutons sur fond clair</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button>Ajouter au panier</Button>
          <Button variant="secondary">Voir les modèles</Button>
          <Button disabled>Indisponible</Button>
        </div>
      </section>

      <section className="bg-nuit px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-sm font-medium text-or">Sur fond nuit</h2>
          <div className="mt-6 flex items-center gap-6">
            <Logo className="w-14 text-or" />
            <p className="font-display text-3xl text-or">MaisonFawzeyni</p>
          </div>
          <p className="mt-6 max-w-xl leading-relaxed text-white/85">
            Maison de couture mouride &amp; de personal shopping.
          </p>
          <div className="mt-6">
            <Button href="/catalogue" variant="onDark">
              Voir les modèles
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
