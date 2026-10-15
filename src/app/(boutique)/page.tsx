// La page d'accueil. Chaque section a un rôle :
// 1. Hero           : l'émotion et l'identité, en un coup d'œil
// 2. BrandStory     : qui est la Maison
// 3. FeaturedModels : les modèles, lus dans la base
// 4. SavoirFaire    : comment se passe une commande sur mesure
// 5. ContactCta     : passer à l'action, par WhatsApp
import { BrandStory } from "@/components/home/BrandStory";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedModels } from "@/components/home/FeaturedModels";
import { Hero } from "@/components/home/Hero";
import { SavoirFaire } from "@/components/home/SavoirFaire";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <BrandStory />
      <FeaturedModels />
      <SavoirFaire />
      <ContactCta />
    </main>
  );
}
