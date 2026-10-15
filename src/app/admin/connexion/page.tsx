// La page de connexion du gérant : /admin/connexion
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-sm bg-white p-8 shadow-[0_1px_0_rgb(0_0_0/0.04)] sm:p-10">
        <p className="text-sm tracking-widest text-or-fonce">ESPACE GÉRANT</p>
        <h1 className="mt-3 font-display text-3xl text-bleu">Connexion</h1>
        <LoginForm />
      </div>
    </main>
  );
}
