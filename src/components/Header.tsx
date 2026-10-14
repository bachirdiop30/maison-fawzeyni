"use client";
// « use client » : ce composant s'exécute AUSSI dans le navigateur,
// car il doit réagir à ce que fait le visiteur (défiler la page, ouvrir le menu).
// Les composants sans cette ligne restent sur le serveur.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentProps, Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { mainNav, site } from "@/config/site";
import { cartCount, useCart } from "@/lib/cart";
import { whatsappLink } from "@/lib/whatsapp";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // L'en-tête se réduit dès qu'on a un peu défilé.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu ouvert : la page derrière ne défile plus, et la touche Échap le ferme.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-bleu text-white">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-[height] duration-300 sm:px-6 ${
          scrolled ? "h-14" : "h-18 sm:h-20"
        }`}
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3 text-or focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or"
        >
          <Logo className={`transition-[width] duration-300 ${scrolled ? "w-7" : "w-8 sm:w-9"}`} />
          <span className="text-[0.8rem] font-medium tracking-[0.22em] sm:text-sm">MAISON FAWZEYNI</span>
        </Link>

        <div className="flex items-center gap-1 md:gap-8">
        {/* Ordinateur et tablette : les liens sont visibles */}
        <nav aria-label="Menu principal" className="hidden items-center gap-8 md:flex">
          {mainNav.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="py-2 text-white/85 transition-colors hover:text-or focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or aria-[current=page]:text-or"
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href={whatsappLink(site.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 text-white/85 transition-colors hover:text-or focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or"
          >
            Contact
          </a>
        </nav>

        <CartLink onClick={closeMenu} />

        {/* Téléphone : un bouton ouvre le menu plein écran */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="relative z-50 -mr-2 flex size-11 items-center justify-center text-or focus-visible:outline-2 focus-visible:outline-or md:hidden"
        >
          {/* Deux traits qui se croisent en X quand le menu est ouvert */}
          <span aria-hidden className="relative block h-3 w-6">
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
        </div>
      </div>

      {/* Le menu plein écran du téléphone */}
      <div
        id="menu-mobile"
        hidden={!menuOpen}
        className="fixed inset-0 z-40 flex flex-col bg-nuit px-6 pt-28 pb-10 md:hidden"
      >
        <nav aria-label="Menu principal" className="flex flex-col gap-2">
          {mainNav.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="animate-menu-in py-2 font-display text-4xl text-white focus-visible:outline-2 focus-visible:outline-or aria-[current=page]:text-or"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto animate-menu-in space-y-4 border-t border-or/30 pt-8">
          <a
            href={whatsappLink(site.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center text-lg text-or focus-visible:outline-2 focus-visible:outline-or"
          >
            Écrire sur WhatsApp
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center text-white/80 focus-visible:outline-2 focus-visible:outline-or"
          >
            Instagram
          </a>
          <p className="text-sm text-white/60">{site.tagline}</p>
        </div>
      </div>
    </header>
  );
}

// Un lien du menu, en or quand on est sur sa page (ou une page en dessous : /catalogue/baye-sonhibou).
// L'adresse de la page n'est connue qu'au moment de la visite : <Suspense> laisse Next préparer
// l'en-tête à l'avance avec un lien simple, puis la couleur s'ajoute dans le navigateur.
type NavLinkProps = ComponentProps<typeof Link> & { href: string };

function NavLink(props: NavLinkProps) {
  return (
    <Suspense fallback={<Link {...props} />}>
      <ActiveLink {...props} />
    </Suspense>
  );
}

function ActiveLink(props: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === props.href || pathname.startsWith(`${props.href}/`);
  return <Link {...props} aria-current={active ? "page" : undefined} />;
}

// Le lien vers le panier, avec le nombre d'articles dans une pastille or.
function CartLink({ onClick }: { onClick: () => void }) {
  const lines = useCart();
  const count = lines ? cartCount(lines) : 0;

  return (
    <Link
      href="/panier"
      onClick={onClick}
      aria-label={count > 0 ? `Panier, ${count} article${count > 1 ? "s" : ""}` : "Panier"}
      className="relative z-50 flex min-h-11 items-center gap-2 px-2 text-white/85 transition-colors hover:text-or focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or"
    >
      Panier
      {count > 0 && (
        // `key` : la pastille rejoue sa petite animation à chaque ajout.
        <span
          key={count}
          aria-hidden
          className="flex size-5 animate-prix items-center justify-center rounded-full bg-or text-xs font-semibold text-nuit tabular-nums"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
