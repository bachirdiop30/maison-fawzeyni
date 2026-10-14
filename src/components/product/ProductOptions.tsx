// Le choix du client sur la fiche d'un modèle : formule, couleur, puis commande.
// C'est un composant client : il réagit aux clics sans recharger la page.
//
// Provisoire : en attendant le panier (prochaine étape), le bouton ouvre WhatsApp
// avec un message déjà rempli. C'est une vraie commande, pas une fausse fonctionnalité.
"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { swatchFor } from "@/lib/colors";
import { formatFcfa } from "@/lib/money";
import { whatsappLink } from "@/lib/whatsapp";
import type { ProductDetail } from "@/server/catalogue";

type ProductOptionsProps = Pick<ProductDetail, "name" | "formulas" | "colors">;

export function ProductOptions({ name, formulas, colors }: ProductOptionsProps) {
  const [formulaId, setFormulaId] = useState(formulas[0].id);
  const [color, setColor] = useState(colors[0] ?? "");

  const formula = formulas.find((f) => f.id === formulaId) ?? formulas[0];
  const price = formatFcfa(formula.priceFcfa);

  const message = [
    "Bonjour MaisonFawzeyni,",
    `je souhaite commander le ${name} — ${formula.name} (${price})${color ? `, couleur ${color}` : ""}.`,
  ].join(" ");
  const orderLink = whatsappLink(site.whatsapp, message);

  return (
    <div>
      {/* `key` : quand le prix change, React recrée la ligne, ce qui rejoue la petite animation. */}
      <p key={price} className="mt-4 animate-prix text-2xl font-semibold text-bleu" aria-live="polite">
        {price}
      </p>

      {formulas.length > 1 && (
        <fieldset className="mt-10">
          <legend className="text-sm tracking-widest text-gris">FORMULE</legend>
          <div className="mt-3 grid gap-3">
            {formulas.map((f) => (
              <label
                key={f.id}
                className="flex cursor-pointer gap-4 border border-encre/15 p-4 transition-colors hover:border-bleu/50 has-checked:border-bleu has-checked:bg-bleu/[0.04] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-bleu"
              >
                <input
                  type="radio"
                  name="formule"
                  value={f.id}
                  checked={f.id === formulaId}
                  onChange={() => setFormulaId(f.id)}
                  className="mt-1 size-4 shrink-0 accent-bleu"
                />
                <span className="flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="font-medium">{f.name}</span>
                    <span className="text-sm text-bleu">{formatFcfa(f.priceFcfa)}</span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-gris">{f.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {colors.length > 0 && (
        <fieldset className="mt-8">
          <legend className="text-sm tracking-widest text-gris">
            COULEUR <span className="ml-2 tracking-normal text-encre normal-case">{color}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((c) => (
              <label
                key={c}
                title={c}
                className="flex size-11 cursor-pointer items-center justify-center rounded-full ring-1 ring-transparent transition has-checked:ring-bleu has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-bleu"
              >
                <input
                  type="radio"
                  name="couleur"
                  value={c}
                  checked={c === color}
                  onChange={() => setColor(c)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className="size-8 rounded-full ring-1 ring-encre/15"
                  style={{ backgroundColor: swatchFor(c) }}
                />
                <span className="sr-only">{c}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <p className="mt-8 text-sm leading-relaxed text-gris">
        <span className="font-medium text-encre">Sur mesure.</span> Après votre commande, nous vous demandons vos
        mesures (ou votre taille habituelle) sur WhatsApp.
      </p>

      <a href={orderLink} target="_blank" rel="noopener noreferrer" className={`mt-6 hidden w-full lg:flex ${orderClass}`}>
        Commander sur WhatsApp
      </a>

      {/* Sur téléphone : le prix et le bouton restent toujours accessibles en bas de l'écran. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-encre/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <p className="text-sm leading-tight">
          <span className="block text-gris">{formula.name}</span>
          <span className="font-semibold text-bleu">{price}</span>
        </p>
        <a href={orderLink} target="_blank" rel="noopener noreferrer" className={`flex flex-1 ${orderClass}`}>
          Commander
        </a>
      </div>
    </div>
  );
}

// Même style que le bouton « primary » (components/Button.tsx), pour un lien externe.
const orderClass =
  "min-h-12 items-center justify-center bg-bleu px-6 text-[0.95rem] font-medium tracking-wide text-white transition-colors hover:bg-nuit focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-bleu";
