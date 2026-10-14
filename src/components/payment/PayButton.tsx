// Le bouton « Payer » : demande au serveur d'ouvrir un paiement, puis envoie le client
// sur la page du prestataire (la page DÉMO aujourd'hui, la page Wave demain).
"use client";

import { useState } from "react";

export function PayButton({ orderId, label }: { orderId: string; label: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      window.location.assign(data.redirectUrl); // peut être une adresse d'un autre site (Wave)
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Le paiement n'a pas pu démarrer.");
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={pay}
        disabled={pending}
        className="flex min-h-12 w-full items-center justify-center bg-bleu px-6 text-[0.95rem] font-medium tracking-wide text-white transition-colors hover:bg-nuit focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-bleu disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Ouverture du paiement…" : label}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
