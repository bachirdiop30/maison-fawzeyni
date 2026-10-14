// La fiche d'un modèle : /catalogue/baye-sonhibou, /catalogue/turki-njaareem…
// Le dossier [slug] entre crochets veut dire : « n'importe quel mot à cet endroit de l'adresse ».
// Next nous donne ce mot dans `params.slug`, et on cherche le modèle correspondant dans la base.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductOptions } from "@/components/product/ProductOptions";
import { site } from "@/config/site";
import { getProduct } from "@/server/catalogue";

export async function generateMetadata(props: PageProps<"/catalogue/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: "Modèle introuvable" };
  return { title: product.name, description: product.description };
}

// La page n'attend rien : le cadre s'affiche tout de suite, la fiche arrive dès que la base a répondu.
export default function ProductPage(props: PageProps<"/catalogue/[slug]">) {
  return (
    <main className="flex-1 pb-24 lg:pb-0">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductView params={props.params} />
      </Suspense>
    </main>
  );
}

async function ProductView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound(); // adresse inconnue ou modèle désactivé → page 404

  return (
    <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:px-6 lg:py-12">
      <ProductGallery name={product.name} images={product.images} />

      <div className="px-4 pt-8 sm:px-6 lg:px-0 lg:pt-0">
        {/* Sur ordinateur, ce panneau reste en place pendant qu'on fait défiler les photos. */}
        <div className="lg:sticky lg:top-24">
          <nav aria-label="Fil d'Ariane" className="text-sm text-gris">
            <Link href="/catalogue" className="underline-offset-4 hover:text-bleu hover:underline">
              Nos modèles
            </Link>
            <span aria-hidden className="mx-2">/</span>
            {product.category}
          </nav>

          <h1 className="mt-4 font-display text-4xl leading-tight text-bleu sm:text-5xl">{product.name}</h1>
          <p className="mt-5 leading-relaxed text-gris">{product.description}</p>

          <ProductOptions name={product.name} formulas={product.formulas} colors={product.colors} />

          <dl className="mt-10 divide-y divide-encre/10 border-y border-encre/10 text-sm">
            <div className="flex justify-between gap-6 py-3">
              <dt className="text-gris">Confection</dt>
              <dd className="text-right">Cousu sur mesure</dd>
            </div>
            <div className="flex justify-between gap-6 py-3">
              <dt className="text-gris">Livraison</dt>
              <dd className="text-right">{site.delivery}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div aria-label="Chargement du modèle" className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:px-6 lg:py-12">
      <div className="aspect-[4/5] bg-ivoire" />
      <div className="px-4 pt-8 sm:px-6 lg:px-0 lg:pt-0">
        <div className="h-4 w-32 bg-ivoire" />
        <div className="mt-5 h-10 w-2/3 bg-ivoire" />
        <div className="mt-6 h-20 bg-ivoire" />
      </div>
    </div>
  );
}
