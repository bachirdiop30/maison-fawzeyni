// Le haut de la page d'accueil : le moment fort du site.
// C'est la SEULE animation d'entrée du site (le tissu qui se dévoile, puis le texte).
import { getImageProps } from "next/image";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Hero() {
  // Deux cadrages du même tissu : en hauteur pour les téléphones, en largeur pour les ordinateurs.
  // Photo de démonstration : Unsplash, cecil yang.
  const common = { alt: "", sizes: "100vw" }; // alt vide : image décorative
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/images/site/tissu-bleu-nuit-paysage.jpg", width: 2000, height: 1125 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    src: "/images/site/tissu-bleu-nuit-portrait.jpg",
    width: 1600,
    height: 2000,
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-end overflow-hidden bg-nuit text-white sm:min-h-[calc(100svh-5rem)] sm:items-center">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop} />
        <source srcSet={mobile} />
        <img {...rest} alt="" className="absolute inset-0 -z-20 size-full animate-hero-tissu object-cover" />
      </picture>
      {/* Un voile bleu nuit pour que le texte reste lisible sur le tissu */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-nuit via-nuit/70 to-nuit/30" />

      <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:py-24">
        <div className="max-w-2xl animate-hero-texte">
          <Logo className="w-10 text-or sm:w-12" />
          <h1 className="mt-8 font-display text-5xl leading-[1.05] text-white sm:text-7xl">{site.tagline}</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
            Boubous traditionnels cousus sur mesure, en Getzner et en fil à fil italien. De Touba à Paris.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <Button href="/catalogue" variant="onDark">
              Voir les modèles
            </Button>
            <a
              href={whatsappLink(site.whatsapp, "Bonjour MaisonFawzeyni, je souhaite commander une tenue.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-white/85 underline decoration-or/60 underline-offset-8 transition-colors hover:text-or focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or"
            >
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
