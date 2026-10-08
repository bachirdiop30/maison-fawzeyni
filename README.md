# MaisonFawzeyni

Boutique en ligne de boubous traditionnels sénégalais : catalogue, panier, commande, paiement (Wave, Orange Money) et espace d'administration pour le gérant.

Le cahier des charges complet est dans [`PROJET.md`](PROJET.md).

## Technologies

- **Next.js 16** (App Router) + **React 19** + **TypeScript** : les pages et l'API, dans un seul projet
- **Tailwind CSS 4** : le style, avec le thème de la marque dans `src/app/globals.css`
- **PostgreSQL** (hébergé chez [Neon](https://neon.tech)) + **Prisma** : la base de données (à venir)

## Installer le projet

Prérequis : Node.js 20 ou plus récent, Git.

```bash
npm install                 # télécharge les bibliothèques dans node_modules/
cp .env.example .env        # puis remplir les valeurs dans .env (sous PowerShell : Copy-Item .env.example .env)
npm run dev                 # lance le site sur http://localhost:3000
```

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement, rechargé à chaque modification |
| `npm run build` | fabrique la version de production et vérifie TypeScript |
| `npm run start` | lance la version fabriquée par `build` |
| `npm run lint` | vérifie le code avec ESLint |

## Organisation du code

```
src/
├── app/          Les pages et l'API. Un dossier = une adresse du site.
├── components/   Les morceaux d'interface réutilisables (Logo, boutons, cartes…)
├── config/       Les réglages de la boutique (nom, coordonnées…)
├── lib/          Les fonctions utilitaires pures, sans affichage (format des prix…)
└── server/       La logique métier, exécutée uniquement sur le serveur
                  (calcul des commandes, paiements, accès à la base)
```

Règle principale : **les pages affichent, le serveur décide.** Un prix, un total ou un statut de paiement est toujours calculé ou vérifié dans `src/server/`, jamais dans le navigateur.

## Variables d'environnement

La liste des variables nécessaires est dans [`.env.example`](.env.example). Les vraies valeurs vont dans `.env`, qui n'est jamais envoyé sur Git.
