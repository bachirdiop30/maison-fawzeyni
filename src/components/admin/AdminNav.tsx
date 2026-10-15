// Le menu de l'espace gérant. Le lien de la page ouverte est souligné en or.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const links = [
  { label: "Tableau de bord", href: "/admin" },
  { label: "Commandes", href: "/admin/commandes" },
] as const;

const linkClass =
  "inline-flex min-h-11 items-center border-b-2 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-or";

export function AdminNav() {
  return (
    <nav aria-label="Gestion" className="flex gap-6">
      {links.map((link) => (
        // usePathname lit l'adresse de la visite : derrière Suspense (règle de Next.js).
        <Suspense key={link.href} fallback={<NavLink {...link} active={false} />}>
          <ActiveNavLink {...link} />
        </Suspense>
      ))}
    </nav>
  );
}

function ActiveNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  // « Tableau de bord » n'est actif que sur /admin exactement ; « Commandes » aussi sur /admin/commandes/…
  const active = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return <NavLink href={href} label={label} active={active} />;
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${linkClass} ${active ? "border-or text-white" : "border-transparent text-white/65 hover:text-white"}`}
    >
      {label}
    </Link>
  );
}
