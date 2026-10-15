// Le coffre des mots de passe : fabriquer une empreinte, et vérifier un mot de passe.
//
// On n'enregistre JAMAIS le mot de passe, seulement son empreinte « scrypt ».
// On ne peut pas revenir de l'empreinte au mot de passe ; on peut seulement
// refaire le calcul avec le mot de passe tapé et comparer les deux résultats.
//
// Ce fichier n'importe pas « server-only » : le script `npm run admin:creer` l'utilise aussi.
// Il ne contient aucun secret, seulement des calculs.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

function scryptAsync(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

// Le « sel » : 16 octets au hasard, différents pour chaque mot de passe.
// Deux gérants avec le même mot de passe auront donc deux empreintes différentes.
// Format enregistré : « scrypt$<sel>$<empreinte> ».
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, saltText, keyText] = stored.split("$");
  if (algorithm !== "scrypt" || !saltText || !keyText) return false;
  const expected = Buffer.from(keyText, "base64");
  const key = await scryptAsync(password, Buffer.from(saltText, "base64"));
  // Comparaison « à temps constant », comme pour la signature des webhooks.
  return key.length === expected.length && timingSafeEqual(key, expected);
}

export const MIN_PASSWORD_LENGTH = 12;
