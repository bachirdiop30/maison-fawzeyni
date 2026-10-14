// Teinte affichée pour chaque nom de couleur (pastilles sous les modèles).
// Pour une nouvelle couleur : ajoutez son nom et sa teinte ici.
const swatches: Record<string, string> = {
  "bleu nuit": "#14254a",
  "bleu ciel": "#9cc3dc",
  bleu: "#1f4e8c",
  blanc: "#f7f5ef",
  beige: "#d9bf94",
  marron: "#5a3b26",
  gris: "#8a8d91",
  noir: "#1b1b1d",
  vert: "#24553a",
};

// Renvoie la teinte d'une couleur, ou un gris neutre si le nom est inconnu.
export function swatchFor(colorName: string): string {
  return swatches[colorName.trim().toLowerCase()] ?? "#b9b4aa";
}
