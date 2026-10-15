// Les « actions serveur » de connexion et de déconnexion.
// « use server » : ces fonctions tournent UNIQUEMENT sur le serveur ;
// le formulaire du navigateur les appelle comme s'il appelait une API.
"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { LOGIN_PATH, login } from "@/server/auth";
import { deleteSession } from "@/server/auth/session";

export type LoginState = { error?: string; email?: string } | undefined;

const loginSchema = z.object({
  email: z.string().trim().min(1).max(200),
  password: z.string().min(1).max(200),
});

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) {
    return { error: "Renseignez votre e-mail et votre mot de passe.", email: String(formData.get("email") ?? "") };
  }

  const result = await login(parsed.data.email, parsed.data.password);
  if (!result.ok) return { error: result.error, email: parsed.data.email };

  redirect("/admin");
}

export async function logoutAction() {
  await deleteSession();
  redirect(LOGIN_PATH);
}
