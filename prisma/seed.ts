// Remplit la base avec les données de démonstration de prisma/demo-data.ts.
// Lancement : `npx prisma db seed`
//
// On peut le relancer autant de fois qu'on veut : il met à jour les modèles
// existants au lieu de créer des doublons.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { demoCategory, demoProducts } from "./demo-data";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // « upsert » = update + insert : met à jour la ligne si elle existe, sinon la crée.
  const category = await prisma.category.upsert({
    where: { slug: demoCategory.slug },
    update: { name: demoCategory.name },
    create: demoCategory,
  });

  for (const demo of demoProducts) {
    const fields = {
      name: demo.name,
      description: demo.description,
      colors: demo.colors,
      categoryId: category.id,
    };

    // Une transaction : tout réussit, ou rien n'est modifié.
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.upsert({
        where: { slug: demo.slug },
        update: fields,
        create: { slug: demo.slug, ...fields },
      });

      // Les formules et photos de démonstration sont remplacées à chaque lancement.
      await tx.formula.deleteMany({ where: { productId: product.id } });
      await tx.productImage.deleteMany({ where: { productId: product.id } });

      await tx.formula.createMany({
        data: demo.formulas.map((formula, position) => ({ ...formula, position, productId: product.id })),
      });
      await tx.productImage.createMany({
        data: demo.images.map((image, position) => ({ ...image, position, productId: product.id })),
      });
    });

    console.log(`✓ ${demo.name} : ${demo.formulas.length} formule(s), ${demo.images.length} photo(s)`);
  }
}

main()
  .catch((error) => {
    console.error("Échec du remplissage :", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
