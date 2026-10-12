// ⚠️ DONNÉES DE DÉMONSTRATION — à remplacer par les vraies données de MaisonFawzeyni.
//
// Ce fichier sert à remplir la base pour tester le site (`npx prisma db seed`).
// Pour modifier un nom, un prix ou une photo de démonstration : changez-le ici,
// puis relancez la commande. Les vraies données seront ensuite gérées depuis l'administration.
//
// Prix : ceux des publications Instagram quand ils existent.
// Coûts : INVENTÉS pour tester le calcul du bénéfice — à remplacer par les vrais coûts.
//
// Photos : Unsplash (licence gratuite, usage commercial autorisé), en attendant le shooting.
// - Bruno Ngarukiye : baye-sonhibou-1, turki-njaareem-1 et 2, njitlay-1 et 2, baye-lahad-1 et 2
// - cecil yang : baye-sonhibou-2 (tissu bleu nuit)
// - Kateryna Hliznitsova : turki-njaareem-3 (tissu bleu nuit)

export type DemoProduct = {
  name: string;
  slug: string;
  description: string;
  colors: string[];
  formulas: { name: string; description: string; priceFcfa: number; costFcfa: number }[];
  images: { url: string; alt: string }[];
};

export const demoCategory = { name: "Homme", slug: "homme" };

export const demoProducts: DemoProduct[] = [
  {
    name: "Baye Sonhibou",
    slug: "baye-sonhibou",
    description:
      "Le grand boubou ample de la Maison, en Getzner, cousu sur mesure avec une finition soignée. Indiquez votre taille ou vos mesures : nous nous occupons du reste.",
    colors: ["Bleu nuit", "Blanc", "Gris", "Noir", "Vert"],
    formulas: [
      {
        name: "Formule 1",
        description: "4 mètres de Getzner Baye Sonhibou + couture sur mesure haute finition",
        priceFcfa: 65000,
        costFcfa: 42000,
      },
      {
        name: "Formule 2",
        description: "6 mètres de Getzner, dont 2 mètres de Kaala assorti + couture sur mesure",
        priceFcfa: 85000,
        costFcfa: 55000,
      },
      {
        name: "Version 3/4",
        description: "Le Baye Sonhibou en version courte, qui s'arrête aux genoux",
        priceFcfa: 18000,
        costFcfa: 11000,
      },
    ],
    images: [
      { url: "/images/produits/baye-sonhibou-1.jpg", alt: "Baye Sonhibou gris porté, vue de face" },
      { url: "/images/produits/baye-sonhibou-2.jpg", alt: "Détail d'un tissu bleu nuit au reflet satiné" },
    ],
  },
  {
    name: "Turki Njaareem",
    slug: "turki-njaareem",
    description:
      "Modèle Gora, en trois pièces : un ensemble Njitlay à l'intérieur avec son Thiaya, sous un habit extérieur ouvert sur la poitrine. Tissu fil à fil italien.",
    colors: ["Beige", "Marron", "Bleu nuit", "Blanc"],
    formulas: [
      {
        name: "Ensemble 3 pièces",
        description: "Njitlay + Thiaya + habit extérieur, en fil à fil italien, couture sur mesure",
        priceFcfa: 55000,
        costFcfa: 34000,
      },
    ],
    images: [
      { url: "/images/produits/turki-njaareem-1.jpg", alt: "Turki Njaareem marron porté, portrait" },
      { url: "/images/produits/turki-njaareem-2.jpg", alt: "Turki Njaareem marron porté, en pied" },
      { url: "/images/produits/turki-njaareem-3.jpg", alt: "Détail d'un tissu bleu nuit plissé" },
    ],
  },
  {
    name: "Njitlay",
    slug: "njitlay",
    description:
      "Tunique longue et pantalon assorti, sobre et élégant. Brodé à l'encolure. (Description de démonstration.)",
    colors: ["Bleu ciel", "Blanc", "Gris"],
    formulas: [
      {
        name: "Ensemble",
        description: "Tunique + pantalon, couture sur mesure (prix de démonstration)",
        priceFcfa: 35000,
        costFcfa: 21000,
      },
    ],
    images: [
      { url: "/images/produits/njitlay-1.jpg", alt: "Njitlay bleu ciel porté, en pied" },
      { url: "/images/produits/njitlay-2.jpg", alt: "Njitlay bleu ciel porté, de trois quarts" },
    ],
  },
  {
    name: "Baye Lahad",
    slug: "baye-lahad",
    description:
      "Une tenue au port droit, avec broderie à l'encolure et à la poche. (Description de démonstration.)",
    colors: ["Beige", "Blanc", "Bleu nuit"],
    formulas: [
      {
        name: "Ensemble",
        description: "Tunique + pantalon, couture sur mesure (prix de démonstration)",
        priceFcfa: 40000,
        costFcfa: 25000,
      },
    ],
    images: [
      { url: "/images/produits/baye-lahad-1.jpg", alt: "Baye Lahad beige porté, portrait" },
      { url: "/images/produits/baye-lahad-2.jpg", alt: "Baye Lahad beige porté, en pied" },
    ],
  },
];
