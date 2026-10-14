// Le pied de page, présent sur toutes les pages.
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { mainNav, site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

const linkClass =
  "inline-flex min-h-11 items-center text-white/80 transition-colors hover:text-or focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-or";

export function Footer() {
  return (
    <footer className="bg-nuit text-white">
      <div className="mx-auto grid max-w-6xl gap-12 border-t border-or/20 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="inline-flex items-center gap-3 text-or focus-visible:outline-2 focus-visible:outline-or">
            <Logo className="w-9" />
            <span className="text-sm font-medium tracking-[0.22em]">MAISON FAWZEYNI</span>
          </Link>
          <p className="mt-6 font-display text-2xl text-or">{site.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Maison de couture mouride &amp; de personal shopping.
          </p>
        </div>

        <nav aria-label="Pied de page">
          <h2 className="text-sm text-white/60">La Maison</h2>
          <ul className="mt-3">
            {mainNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Instagram
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm text-white/60">Contact</h2>
          <ul className="mt-3">
            <li>
              <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp
              </a>
            </li>
            {site.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:+221${phone.replaceAll(" ", "")}`} className={linkClass}>
                  {phone}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-white/60">Livraison : {site.delivery}.</p>
        </div>
      </div>
    </footer>
  );
}
