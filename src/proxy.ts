// Le « vigile à l'entrée » : il passe AVANT chaque page de /admin.
//
// Il vérifie seulement qu'un badge est présenté (le cookie existe), sans le contrôler en base :
// c'est un premier filtre rapide qui renvoie tout de suite les visiteurs sans badge.
// La VRAIE vérification (le badge est-il valide ?) est faite par requireAdmin() dans chaque page.
import { type NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "mf_session"; // le même nom que dans src/server/auth/session.ts
const LOGIN_PATH = "/admin/connexion";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === LOGIN_PATH) return NextResponse.next();
  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
