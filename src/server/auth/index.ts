// L'authentification du gérant : se connecter, et vérifier qu'on est connecté.
//
// Règle d'or : CHAQUE page et CHAQUE action de l'admin appelle requireAdmin().
// Cacher un bouton ne protège rien ; c'est le serveur qui refuse.
import "server-only";
import { redirect } from "next/navigation";
import { db } from "../db";
import { hashPassword, verifyPassword } from "./password";
import { createSession, getCurrentAdmin } from "./session";

export { getCurrentAdmin } from "./session";

export const LOGIN_PATH = "/admin/connexion";

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;

// Une empreinte « bidon », calculée une fois. Quand l'e-mail n'existe pas, on fait quand même
// le calcul : la réponse met le même temps, et on ne révèle pas quels e-mails existent.
let dummyHash: Promise<string> | undefined;

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  const wrong = { ok: false, error: "E-mail ou mot de passe incorrect." } as const;

  const user = await db.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, passwordHash: true, failedLogins: true, lockedUntil: true },
  });

  if (!user) {
    dummyHash ??= hashPassword("mot-de-passe-bidon");
    await verifyPassword(password, await dummyHash);
    return wrong;
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { ok: false, error: `Trop d'essais. Réessayez dans ${LOCK_MINUTES} minutes.` };
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    const failedLogins = user.failedLogins + 1;
    const locked = failedLogins >= MAX_FAILED_LOGINS;
    await db.user.update({
      where: { id: user.id },
      data: locked
        ? { failedLogins: 0, lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60 * 1000) }
        : { failedLogins },
    });
    return locked ? { ok: false, error: `Trop d'essais. Réessayez dans ${LOCK_MINUTES} minutes.` } : wrong;
  }

  await db.user.update({ where: { id: user.id }, data: { failedLogins: 0, lockedUntil: null } });
  await createSession(user.id);
  return { ok: true };
}

// Le gardien de l'admin : renvoie le gérant connecté, sinon envoie vers la page de connexion.
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect(LOGIN_PATH);
  return admin;
}
