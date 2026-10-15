// Crée un compte gérant, ou change le mot de passe d'un compte existant.
// Lancement : `npm run admin:creer`, puis répondre aux questions.
//
// Pourquoi un script et pas une page « Créer un compte » sur le site ?
// Parce que n'importe qui pourrait l'utiliser pour devenir gérant.
// Ici, il faut avoir accès à l'ordinateur ET au fichier .env.
import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import * as z from "zod";
import { PrismaClient } from "../src/generated/prisma/client";
import { MIN_PASSWORD_LENGTH, hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const rl = createInterface({ input: stdin, output: stdout, terminal: true });

// Pose une question sans afficher ce qui est tapé (pour le mot de passe).
async function askHidden(question: string): Promise<string> {
  const output = rl as unknown as { _writeToOutput: (text: string) => void };
  const original = output._writeToOutput;
  stdout.write(question);
  output._writeToOutput = () => {};
  try {
    return await rl.question("");
  } finally {
    output._writeToOutput = original;
    stdout.write("\n");
  }
}

async function main() {
  console.log("\nCréation d'un compte gérant MaisonFawzeyni\n");

  const email = (await rl.question("E-mail : ")).trim().toLowerCase();
  // Même règle que le champ « E-mail » du navigateur : quelquechose@domaine.extension
  if (!z.email().safeParse(email).success) {
    throw new Error(`« ${email} » n'est pas un e-mail valide (exemple : gerant@maisonfawzeyni.com).`);
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { name: true } });
  const name = existing
    ? existing.name
    : (await rl.question("Prénom (affiché dans l'admin) : ")).trim() || "Gérant";
  if (existing) console.log(`Ce compte existe déjà (${existing.name}) : on va changer son mot de passe.`);

  const password = await askHidden(`Mot de passe (au moins ${MIN_PASSWORD_LENGTH} caractères, rien ne s'affiche) : `);
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Mot de passe trop court : au moins ${MIN_PASSWORD_LENGTH} caractères.`);
  }
  const confirmation = await askHidden("Retapez le mot de passe : ");
  if (confirmation !== password) throw new Error("Les deux mots de passe sont différents.");

  const passwordHash = await hashPassword(password);
  await prisma.user.upsert({
    where: { email },
    // En changeant le mot de passe, on ferme aussi toutes les connexions ouvertes.
    update: { passwordHash, failedLogins: 0, lockedUntil: null, sessions: { deleteMany: {} } },
    create: { email, name, passwordHash },
  });

  console.log(existing ? "\n✓ Mot de passe changé." : `\n✓ Compte créé pour ${name}.`);
  console.log("Connexion : http://localhost:3000/admin/connexion\n");
}

main()
  .catch((error: unknown) => {
    console.error(`\n✗ ${error instanceof Error ? error.message : error}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
