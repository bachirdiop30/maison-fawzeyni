// Les « badges » de connexion du gérant.
//
// À la connexion, le serveur fabrique un badge (32 octets au hasard), le donne au navigateur
// dans un cookie, et range son EMPREINTE dans le tableau Session. À chaque page de l'admin,
// le navigateur présente le cookie ; le serveur recalcule l'empreinte et la cherche en base.
//
// Pourquoi l'empreinte et pas le badge lui-même ? Si quelqu'un lisait la base,
// il ne pourrait pas s'en servir pour se faire passer pour le gérant.
import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "../db";

export const SESSION_COOKIE = "mf_session";
const SESSION_DAYS = 7;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt } });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // le JavaScript de la page ne peut pas le lire : un script piégé ne peut pas le voler
    secure: process.env.NODE_ENV === "production", // en ligne : envoyé uniquement en HTTPS
    sameSite: "lax", // pas envoyé quand un AUTRE site essaie d'agir à notre place
    path: "/",
    expires: expiresAt,
  });
}

// Le gérant connecté, ou null. `cache` : lu une seule fois par affichage de page,
// même si plusieurs composants le demandent.
export const getCurrentAdmin = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { id: true, expiresAt: true, user: { select: { id: true, name: true, email: true } } },
  });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session.user;
});

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}
