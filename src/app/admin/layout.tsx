// Le cadre de l'espace gérant : une barre sobre, sans le menu ni le pied de page de la boutique.
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/Logo";
import { getCurrentAdmin } from "@/server/auth";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: { default: "Gestion", template: "%s · Gestion MaisonFawzeyni" },
  robots: { index: false, follow: false }, // Google n'a rien à faire ici
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-ivoire">
      <header className="bg-nuit text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/admin" className="flex items-center gap-3 text-or focus-visible:outline-2 focus-visible:outline-or">
              <Logo className="w-7" />
              <span className="text-xs font-medium tracking-[0.22em]">
                MAISON FAWZEYNI <span className="hidden text-white/50 sm:inline">· GESTION</span>
              </span>
            </Link>
            {/* Lire le cookie se fait au moment de la visite : derrière Suspense. */}
            <Suspense>
              <AdminMenu />
            </Suspense>
          </div>
          {/* Le menu n'apparaît qu'une fois connecté (pas sur la page de connexion). */}
          <Suspense>
            <AdminNavIfConnected />
          </Suspense>
        </div>
      </header>
      {children}
    </div>
  );
}

async function AdminNavIfConnected() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  return (
    <div className="-mx-4 overflow-x-auto border-t border-white/10 px-4 sm:mx-0 sm:px-0">
      <AdminNav />
    </div>
  );
}

async function AdminMenu() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="hidden text-white/70 sm:inline">{admin.name}</span>
      <form action={logoutAction}>
        <button
          type="submit"
          className="min-h-11 px-1 whitespace-nowrap text-white/80 underline-offset-4 transition-colors hover:text-or hover:underline focus-visible:outline-2 focus-visible:outline-or"
        >
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
