// Les boutons de la page DÉMO. Chacun simule ce que ferait le client sur la page Wave.
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DemoPaymentActions({ reference, orderId }: { reference: string; orderId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"PAID" | "FAILED" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function simulate(outcome: "PAID" | "FAILED") {
    setPending(outcome);
    setError(null);
    const response = await fetch("/api/payments/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, outcome }),
    }).catch(() => null);

    if (!response?.ok) {
      const data = await response?.json().catch(() => null);
      setError(data?.error ?? "La simulation a échoué.");
      setPending(null);
      return;
    }
    // Comme après un vrai paiement : le prestataire renvoie le client vers la boutique.
    router.push(`/commande/${orderId}`);
    router.refresh();
  }

  return (
    <div className="mt-10 space-y-3">
      <button type="button" onClick={() => simulate("PAID")} disabled={pending !== null} className={`${buttonClass} bg-emerald-700 text-white hover:bg-emerald-800`}>
        {pending === "PAID" ? "Envoi du webhook…" : "✓ Simuler un paiement réussi"}
      </button>
      <button type="button" onClick={() => simulate("FAILED")} disabled={pending !== null} className={`${buttonClass} border border-red-800 text-red-800 hover:bg-red-50`}>
        {pending === "FAILED" ? "Envoi du webhook…" : "✕ Simuler un paiement échoué"}
      </button>
      <Link href={`/commande/${orderId}`} className={`${buttonClass} text-gris underline underline-offset-4 hover:text-encre`}>
        Quitter sans payer (la commande reste en attente)
      </Link>
      {error && (
        <p role="alert" className="text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

const buttonClass =
  "flex min-h-12 w-full items-center justify-center px-6 text-[0.95rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-bleu disabled:cursor-wait disabled:opacity-60";
