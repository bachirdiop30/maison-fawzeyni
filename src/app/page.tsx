import { Logo } from "@/components/Logo";
import { site } from "@/config/site";

// Page d'accueil provisoire : elle sert à vérifier que le thème et le logo fonctionnent.
// La vraie page d'accueil sera construite à l'étape 15.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-bleu px-4 text-center">
      <Logo className="w-28 text-or sm:w-36" />
      <div className="space-y-3">
        <h1 className="text-2xl tracking-wide text-or">{site.name}</h1>
        <p className="text-white/80">Site en construction</p>
      </div>
    </main>
  );
}
