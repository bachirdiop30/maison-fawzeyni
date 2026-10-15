// L'accueil de l'espace gérant : /admin
// Protégé par requireAdmin() : sans badge valide, le serveur renvoie vers la connexion.
import { Suspense } from "react";
import { requireAdmin } from "@/server/auth";

export default function AdminHomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <Suspense fallback={<div className="h-40" />}>
        <Welcome />
      </Suspense>
    </main>
  );
}

async function Welcome() {
  const admin = await requireAdmin();
  return (
    <>
      <p className="text-sm tracking-widest text-or-fonce">ESPACE GÉRANT</p>
      <h1 className="mt-3 font-display text-4xl text-bleu">Bonjour, {admin.name}.</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-gris">
        Vous êtes connecté. Le tableau de bord (commandes, chiffre d&apos;affaires, bénéfices) arrive à
        l&apos;étape suivante.
      </p>
    </>
  );
}
