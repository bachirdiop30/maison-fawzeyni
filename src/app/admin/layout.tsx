// Le cadre de l'espace gérant : une barre sobre, sans le menu ni le pied de page de la boutique.
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3 text-or focus-visible:outline-2 focus-visible:outline-or">
            <Logo className="w-7" />
            <span className="text-xs font-medium tracking-[0.22em]">
              MAISON FAWZEYNI <span className="text-white/50">· GESTION</span>
            </span>
          </Link>
          {/* Lire le cookie se fait au moment de la visite : derrière Suspense. */}
          <Suspense>
            <AdminMenu />
          </Suspense>
        </div>
      </header>
      {children}
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
          className="min-h-11 px-1 text-white/80 underline-offset-4 transition-colors hover:text-or hover:underline focus-visible:outline-2 focus-visible:outline-or"
        >
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
