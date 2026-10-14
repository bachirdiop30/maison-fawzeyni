// L'appel à l'action final : parler à la Maison, comme le font aujourd'hui vos clients.
import { Button } from "@/components/Button";
import { site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

export function ContactCta() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 md:py-28">
      <h2 className="font-display text-4xl leading-tight text-bleu sm:text-5xl">Une question sur une tenue ?</h2>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gris">
        Écrivez-nous sur WhatsApp : nous vous conseillons sur le modèle, le tissu et la taille.
      </p>
      <div className="mt-10">
        <Button
          href={whatsappLink(site.whatsapp, "Bonjour MaisonFawzeyni, j'ai une question sur une tenue.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Écrire sur WhatsApp
        </Button>
      </div>
    </section>
  );
}
