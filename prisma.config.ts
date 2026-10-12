// Configuration de l'outil Prisma (les commandes `npx prisma ...`).
// Le site, lui, n'utilise pas ce fichier.

// Charge le fichier .env : l'outil Prisma ne le fait pas tout seul.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Où se trouve la description des tableaux de la base.
  schema: "prisma/schema.prisma",

  // Où ranger l'historique des modifications de la base (les migrations).
  migrations: {
    path: "prisma/migrations",
  },

  // Les commandes Prisma modifient la structure de la base :
  // elles passent par la connexion directe, sans le pool de Neon.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
