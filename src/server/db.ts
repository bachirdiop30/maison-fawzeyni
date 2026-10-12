// La connexion à la base de données, partagée par tout le serveur.
//
// « server-only » fait échouer la compilation si ce fichier est importé
// par erreur dans du code envoyé au navigateur : l'adresse de la base
// et les coûts ne peuvent donc jamais fuiter côté client.
import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
}

// En développement, Next.js recharge les fichiers à chaque modification.
// Sans cette astuce, chaque rechargement ouvrirait une nouvelle connexion à Neon.
// On garde donc une seule connexion dans `globalThis`, qui survit aux rechargements.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
