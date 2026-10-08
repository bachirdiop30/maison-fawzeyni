// Monogramme « M » de MaisonFawzeyni, redessiné en vectoriel d'après logo/logo-original.jpeg.
// C'est le seul endroit du site où le logo est dessiné : pour le remplacer
// (par exemple par le fichier vectoriel du graphiste), il suffit de modifier ce composant.
//
// La couleur vient du texte autour (`currentColor`) : on choisit l'or avec la classe `text-or`.

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 396 400"
      fill="currentColor"
      className={className}
      role="img"
      aria-label="MaisonFawzeyni"
    >
      <polygon points="21,0 83,0 198,117 313,0 375,0 198,180" />
      <polygon points="164,0 232,0 198,40" />
      <polygon points="0,68 198,265 396,68 396,400 350,400 350,172 198,326 46,172 46,400 0,400" />
      <polygon points="99,287 173,353 173,400 99,400" />
      <polygon points="297,287 223,353 223,400 297,400" />
    </svg>
  );
}
