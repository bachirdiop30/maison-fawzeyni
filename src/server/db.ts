// La connexion à la base de données, partagée par tout le serveur.
//
// « server-only » fait échouer la compilation si ce fichier est importé
// par erreur dans du code envoyé au navigateur : l'adresse de la base
// et les coûts ne peuvent donc jamais fuiter côté client.
//
// On passe par l'adaptateur Neon, qui parle à la base en WebSocket sur le
// port 443 (celui de tous les sites web), plutôt que par le port 5432 de
// PostgreSQL : certains réseaux (Wi-Fi d'école, partages de connexion)
// bloquent ce dernier. Les commandes `prisma migrate`, elles, utilisent
// toujours le port 5432 (DIRECT_URL) et doivent être lancées depuis un
// réseau qui l'autorise.
import "server-only";
import { connection } from "next/server";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
  }).$extends({
    query: {
      // Avant chaque requête : « attends qu'un vrai visiteur soit là ».
      // Sans cela, Next.js tenterait de lire la base pendant `npm run build`
      // pour préparer les pages à l'avance, et le pilote Neon (qui tire un
      // nombre aléatoire pour ouvrir sa connexion) ferait échouer la compilation.
      // Les pages affichent ainsi toujours le stock et les prix du moment.
      async $allOperations({ args, query }) {
        await connection();
        return query(args);
      },
    },
  });
}

type Db = ReturnType<typeof createPrismaClient>;

// En développement, Next.js recharge les fichiers à chaque modification.
// Sans cette astuce, chaque rechargement ouvrirait une nouvelle connexion à Neon.
// On garde donc une seule connexion dans `globalThis`, qui survit aux rechargements.
const globalForPrisma = globalThis as unknown as { prisma?: Db };

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
