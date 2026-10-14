// Comment se passe une commande sur mesure : trois étapes réelles, donc numérotées.
const steps = [
  {
    title: "Choisissez votre modèle",
    text: "Un modèle, une formule et une couleur. Nos tissus : Getzner, bazin, fil à fil italien.",
  },
  {
    title: "Donnez votre taille",
    text: "Nos coupes sont amples : votre taille suffit souvent. Vous pouvez aussi nous confier vos mesures complètes.",
  },
  {
    title: "Nous cousons, puis livrons",
    text: "Votre tenue est confectionnée pour vous, puis livrée à Dakar, à Touba, à Paris ou à l'international.",
  },
];

export function SavoirFaire() {
  return (
    <section className="bg-nuit text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <h2 className="max-w-xl font-display text-4xl leading-tight text-or sm:text-5xl">
          Le sur-mesure, du tissu à la dernière couture
        </h2>

        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-or/30 pt-6">
              <span aria-hidden className="font-display text-5xl text-or">
                {index + 1}
              </span>
              <h3 className="mt-4 text-xl font-medium">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-white/75">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
