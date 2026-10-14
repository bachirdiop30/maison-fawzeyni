// Informations générales sur la boutique, utilisées partout sur le site.
// Modifier une valeur ici la modifie sur toutes les pages.
export const site = {
  name: "MaisonFawzeyni",
  description: "Boubous traditionnels sénégalais, pensés et confectionnés par MaisonFawzeyni.",
  tagline: "L'élégance en héritage",
  locale: "fr",

  // Contact (numéros publiés sur Instagram)
  whatsapp: "221784303944", // format international, sans « + » ni espaces : utilisé dans les liens wa.me
  phones: ["78 430 39 44", "76 538 39 44"],
  instagram: "https://www.instagram.com/_lamaisonfawzeyni/",

  delivery: "Dakar, Touba, Paris et international",
} as const;

// Les liens du menu principal. Une page n'apparaît ici que lorsqu'elle existe.
export const mainNav = [{ label: "Nos modèles", href: "/catalogue" }] as const;
