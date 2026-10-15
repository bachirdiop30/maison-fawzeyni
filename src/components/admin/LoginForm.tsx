// Le formulaire de connexion. Il envoie l'e-mail et le mot de passe à l'action serveur
// `loginAction` : la vérification se fait UNIQUEMENT sur le serveur.
"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

const inputClass =
  "mt-1.5 block min-h-12 w-full border border-encre/20 bg-white px-3 text-base focus:border-bleu focus:outline-2 focus:outline-offset-0 focus:outline-bleu/30";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state?.email}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex min-h-12 w-full items-center justify-center bg-bleu px-6 text-[0.95rem] font-medium tracking-wide text-white transition-colors hover:bg-nuit focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-bleu disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Vérification…" : "Se connecter"}
      </button>
    </form>
  );
}
