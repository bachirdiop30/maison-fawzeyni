// Les boutons du site. Trois styles seulement, pour que le site reste cohérent :
// - "primary"   : l'action principale d'une page (« Ajouter au panier »), bleu plein
// - "secondary" : une action secondaire sur fond clair, contour bleu
// - "onDark"    : une action sur fond bleu ou nuit, contour or
//
// <Button href="/catalogue"> crée un lien qui a l'air d'un bouton ;
// sans href, c'est un vrai bouton (pour un formulaire, par exemple).
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "onDark";

const base =
  "inline-flex min-h-11 items-center justify-center px-6 text-[0.95rem] font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-bleu text-white hover:bg-nuit focus-visible:outline-bleu",
  secondary: "border border-bleu text-bleu hover:bg-bleu hover:text-white focus-visible:outline-bleu",
  onDark: "border border-or text-or hover:bg-or hover:text-nuit focus-visible:outline-or",
};

type ButtonProps = { variant?: Variant; className?: string } & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
);

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (props.href !== undefined) {
    return <Link {...props} className={classes} />;
  }
  const { type = "button", ...rest } = props;
  return <button type={type} {...rest} className={classes} />;
}
