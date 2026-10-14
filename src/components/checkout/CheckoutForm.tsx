// Le formulaire de commande : coordonnées, livraison, moyen de paiement.
// Composant client : il lit le panier (stocké dans le navigateur) et l'envoie à l'API.
//
// Le parcours : le visiteur remplit → POST /api/orders → le serveur vérifie et enregistre
// → on vide le panier → POST /api/payments → page de paiement du prestataire (DÉMO pour l'instant).
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentProps, type FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { cartSubtotal, clearCart, useCart } from "@/lib/cart";
import { formatFcfa } from "@/lib/money";

type FieldErrors = Partial<Record<string, string[]>>;

export function CheckoutForm() {
  const router = useRouter();
  const lines = useCart();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false); // commande enregistrée, redirection en cours
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (lines === null || done) {
    return <div className="h-96" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="py-10">
        <p className="text-lg text-gris">Votre panier est vide.</p>
        <Button href="/catalogue" className="mt-8">
          Découvrir nos modèles
        </Button>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines || pending) return;
    setPending(true);
    setError(null);
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    // On envoie seulement QUOI commander. Les prix, le serveur les relira lui-même.
    const payload = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      phone: form.get("phone"),
      address: form.get("address"),
      city: form.get("city"),
      deliveryNotes: form.get("deliveryNotes"),
      paymentMethod: form.get("paymentMethod"),
      items: lines.map((line) => ({ formulaId: line.formulaId, color: line.color, quantity: line.quantity })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setFieldErrors(data.fields ?? {});
        setPending(false);
        return;
      }

      // La commande est enregistrée : on vide le panier, puis on ouvre directement le paiement.
      // Si le paiement ne démarre pas, le client arrive sur sa commande, où il pourra réessayer.
      setDone(true);
      clearCart();
      const payment = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.id }),
      }).catch(() => null);
      const paymentData = payment?.ok ? await payment.json() : null;
      if (paymentData?.redirectUrl) {
        window.location.assign(paymentData.redirectUrl);
      } else {
        router.push(`/commande/${data.id}`);
      }
    } catch {
      setError("Connexion impossible. Vérifiez votre connexion internet et réessayez.");
      setPending(false);
    }
  }

  const subtotal = cartSubtotal(lines);
  const errorFor = (name: string) => fieldErrors[name]?.[0];

  return (
    <form onSubmit={handleSubmit} noValidate className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
      <div className="space-y-12">
        <fieldset>
          <legend className={legendClass}>VOS COORDONNÉES</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field name="firstName" label="Prénom" autoComplete="given-name" error={errorFor("firstName")} />
            <Field name="lastName" label="Nom" autoComplete="family-name" error={errorFor("lastName")} />
            <Field
              name="phone"
              label="Téléphone (WhatsApp)"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="77 123 45 67"
              error={errorFor("phone")}
              className="sm:col-span-2"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className={legendClass}>LIVRAISON</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              name="address"
              label="Adresse"
              autoComplete="street-address"
              placeholder="Quartier, rue, repère"
              error={errorFor("address")}
              className="sm:col-span-2"
            />
            <Field name="city" label="Ville" autoComplete="address-level2" placeholder="Dakar" error={errorFor("city")} />
            <Field
              name="deliveryNotes"
              label="Précisions (facultatif)"
              required={false}
              error={errorFor("deliveryNotes")}
              className="sm:col-span-2"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className={legendClass}>PAIEMENT</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {paymentOptions.map((option, index) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 border border-encre/15 p-4 transition-colors hover:border-bleu/50 has-checked:border-bleu has-checked:bg-bleu/[0.04] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-bleu"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  defaultChecked={index === 0}
                  className="size-4 accent-bleu"
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="mt-12 lg:mt-0">
        <div className="bg-ivoire p-6 lg:sticky lg:top-24">
          <h2 className={legendClass}>VOTRE COMMANDE</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4">
                <span>
                  {line.quantity} × {line.name}
                  <span className="block text-gris">
                    {line.formulaName}
                    {line.color && ` · ${line.color}`}
                  </span>
                </span>
                <span className="shrink-0">{formatFcfa(line.priceFcfa * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-encre/10 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gris">Livraison</dt>
              <dd className="text-right text-gris">Confirmée avec vous</dd>
            </div>
            <div className="flex justify-between gap-4 text-base">
              <dt className="font-medium">Total</dt>
              <dd className="font-semibold text-bleu">{formatFcfa(subtotal)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="mt-5 border-l-2 border-red-700 bg-white px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 flex min-h-12 w-full items-center justify-center bg-bleu px-6 text-[0.95rem] font-medium tracking-wide text-white transition-colors hover:bg-nuit focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-bleu disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Enregistrement…" : "Valider la commande"}
          </button>
          <Link href="/panier" className="mt-4 block text-center text-sm text-gris underline underline-offset-4 hover:text-encre">
            Modifier le panier
          </Link>
        </div>
      </aside>
    </form>
  );
}

const legendClass = "text-sm tracking-widest text-gris";

const paymentOptions = [
  { value: "WAVE", label: "Wave" },
  { value: "ORANGE_MONEY", label: "Orange Money" },
] as const;

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
} & Pick<ComponentProps<"input">, "type" | "inputMode" | "autoComplete" | "placeholder">;

// Un champ de formulaire : étiquette, zone de saisie, message d'erreur éventuel.
function Field({ name, label, error, required = true, className = "", type = "text", ...rest }: FieldProps) {
  const errorId = `${name}-erreur`;
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
        className="mt-2 block min-h-12 w-full border border-encre/20 bg-white px-3 text-base transition-colors placeholder:text-gris/60 focus:border-bleu focus:outline-2 focus:outline-offset-0 focus:outline-bleu/20 aria-invalid:border-red-700"
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
