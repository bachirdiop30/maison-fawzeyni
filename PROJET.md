# PROJET — MaisonFawzeyni

> Cahier des charges rédigé par le fondateur le 2026-10-08. Ce document fait foi.

Construire une vraie application web e-commerce pour **MaisonFawzeyni**, marque sénégalaise de boubous traditionnels. Le projet doit être :

1. une vraie application fonctionnelle ;
2. un projet propre et professionnel, qui pourra continuer à évoluer ;
3. un projet qui permet au fondateur de COMPRENDRE ce qu'il construit.

## Règle principale : apprendre en construisant

Pour chaque étape importante :

1. **Le pourquoi** de la technologie ou de l'architecture.
2. **Ce qu'on construit** et comment les parties communiquent (Client → Frontend → API → Backend → Base de données ; Client → Checkout → Backend → Prestataire → Webhook → Backend → Commande payée → Dashboard).
3. **Les concepts** expliqués simplement : Next.js, React, TypeScript, Node.js, API, PostgreSQL, Prisma, authentification, cookies/session, webhook, paiement, variables d'environnement. Ce que fait chaque commande, pas seulement laquelle taper.
4. **Ensuite seulement**, l'implémentation : le code et l'explication des fichiers importants.
5. **Le test** : quoi lancer, quelle URL ouvrir, quoi observer, comment savoir si ça marche, quelles erreurs sont normales, comment diagnostiquer.
6. **Ne pas sauter d'étapes.** Avancer progressivement avec une application qui fonctionne réellement.

Format de chaque étape : CE QU'ON FAIT / POURQUOI / CE QUE JE DOIS APPRENDRE / CE QUE JE DOIS FAIRE / CODE / TEST / ERREURS COURANTES. Attendre la validation du fondateur avant de passer à l'étape suivante quand elle demande une vérification de sa part.

Choix techniques : ne pas dire « on va utiliser X », mais « je recommande X plutôt que Y parce que… ».

## 1. La marque

Le logo (`logo/`) est la référence centrale de la direction artistique. Ne pas le modifier arbitrairement. Analyser ses couleurs, formes, style, sophistication et ambiance, puis construire une interface cohérente avec cet univers.

## 2. Pas de site IA générique

Pas de template Shopify, pas de template Tailwind, pas de look « généré par IA », SaaS ou marketplace impersonnelle. Le site doit donner l'impression d'être le site officiel d'une **véritable maison de mode sénégalaise** : élégant, sobre, premium, contemporain, chaleureux, culturel sans être caricatural, simple, très propre. L'identité sénégalaise est présente subtilement : pas de motifs africains partout ; le textile, les couleurs, les photos, la typographie, les compositions et les détails suffisent.

## 3. Le produit final

Une vraie application, pas une maquette. Parcours : Visiteur → Catalogue → Produit → Panier → Checkout → Paiement → Confirmation → Commande enregistrée → Dashboard du gérant.

## 4. Stack technique

- Frontend : Next.js, React, TypeScript, Tailwind CSS.
- Backend : Node.js, API propre, logique métier séparée.
- Base de données : PostgreSQL, Prisma ORM.

Expliquer pourquoi cette stack avant de l'utiliser. Toute modification doit être justifiée avant d'être faite.

## 5. Architecture

Expliquer le rôle de chaque couche : Frontend → API → Backend / logique métier → Prisma → PostgreSQL ; et Frontend → Checkout → Payment API → Prestataire → Webhook → Backend → Database.

## 6. Homepage

Logo, navigation, hero, présentation de la marque, collections, produits mis en avant, section savoir-faire, appel à l'action, footer. Une vraie direction artistique, pas « Hero + 3 cards + testimonials + newsletter ». Chaque section a une raison d'exister.

## 7. Catalogue

Chaque produit : photo, nom, prix, disponibilité, catégorie. Éventuellement filtres, catégories, tri, recherche, sans surcharger l'interface.

## 8. Page produit

Grandes photos, nom, prix, description, tailles/options, disponibilité, informations de livraison, bouton « Ajouter au panier ». Les photos sont très importantes : images de démonstration en attendant le shooting, remplaçables très facilement.

## 9. Panier

Ajouter, modifier la quantité, supprimer, sous-total, frais éventuels, total, passer au checkout. Expliquer comment le panier est stocké et pourquoi.

## 10. Checkout

Nom, prénom, téléphone, adresse, ville, informations de livraison, puis moyen de paiement. Extrêmement simple sur mobile.

## 11. Paiements sénégalais

Wave, Orange Money, éventuellement d'autres moyens pertinents. Pas de faux système impossible à remplacer : une architecture qui permet d'intégrer ensuite le vrai prestataire. Sans identifiants API, un **mode DEMO clairement identifié** qui simule paiement réussi, échoué et en attente, en expliquant que ce n'est pas un vrai paiement.

## 12. Webhooks

Expliquer pourquoi un paiement n'est pas réussi simplement parce que le navigateur arrive sur une page « paiement réussi ». Système final : Client → Paiement → Prestataire → Webhook sécurisé → Backend → Vérification → Commande = PAID → Dashboard.

## 13. Commandes

Historique conservé : numéro de commande, client, produits, quantités, prix au moment de l'achat, coût au moment de l'achat, total, moyen de paiement, statut du paiement, statut de livraison, date. Si le prix d'un produit change, une ancienne commande ne change pas (expliquer pourquoi le prix est enregistré dans `OrderItem`).

## 14. Administration

Interface protégée, connexion du gérant. Dashboard : chiffre d'affaires, commandes, ventes, paiements, produits, stock, bénéfices.

## 15. Bénéfices

- Chiffre d'affaires : ce que les clients ont payé.
- Coût : ce que le produit a coûté à MaisonFawzeyni.
- Bénéfice brut : prix de vente − coût (ex. 40 000 − 25 000 = 15 000 FCFA).

Le dashboard montre ce que le client a payé, ce que le produit a coûté, ce que la maison a gagné, ce qui reste à encaisser selon les commandes. Expliquer les calculs.

## 16. Gestion des produits (admin)

Créer, modifier, désactiver un produit ; modifier prix, coût, stock, description ; ajouter des images ; gérer tailles et catégories.

## 17. Base de données

Modèles probables : User, Customer, Product, ProductImage, Category, Order, OrderItem, Payment, Inventory, Delivery. Expliquer chaque modèle et chaque relation (Customer 1 → n Orders, Order 1 → n OrderItems, Product 1 → n OrderItems, Order 1 → n Payments…).

## 18. Authentification

Expliquer : comment le login fonctionne, comment le serveur sait qu'on est connecté, comment protéger `/admin`, pourquoi cacher le bouton admin ne suffit pas, comment empêcher un utilisateur normal d'accéder aux données admin.

## 19. Sécurité

Infos sensibles côté serveur uniquement. Clés de paiement dans `.env`, jamais dans le frontend. Prévoir `.env.example` et expliquer les variables d'environnement. Calculs importants vérifiés côté backend.

## 20. Design mobile

Excellent sur téléphone, tablette, ordinateur. Priorité au mobile, surtout pour le checkout.

## 21. Photos

Images temporaires de démonstration ; plus tard, remplacer `image-demo.jpg` par les vraies photos sans refaire le frontend.

## 22. Données de démonstration

Quelques produits fictifs (Boubou Saly, Boubou Teranga, Boubou Dakar, Boubou Baobab…), clairement marqués comme démo et faciles à modifier.

## 23. Qualité du code

Éviter : énormes fichiers, logique mélangée, données codées en dur partout, hacks, fausses fonctionnalités présentées comme terminées. Utiliser : TypeScript, composants réutilisables, validation, gestion des erreurs, architecture claire, variables d'environnement, migrations, README.

## 25. Ordre de construction

- **Phase 1 — Fondations** : 1. architecture ; 2. installation ; 3. Git ; 4. variables d'environnement ; 5. configuration Next.js ; 6. Tailwind ; 7. structure des dossiers.
- **Phase 2 — Base de données** : 8. PostgreSQL ; 9. Prisma ; 10. modèles ; 11. migrations ; 12. données de démonstration.
- **Phase 3 — Frontend** : 13. design system ; 14. navigation ; 15. homepage ; 16. catalogue ; 17. page produit ; 18. panier.
- **Phase 4 — Backend** : 19. API ; 20. produits ; 21. commandes ; 22. clients ; 23. validation ; 24. gestion des erreurs.
- **Phase 5 — Checkout** : 25. checkout ; 26. création de commande ; 27. calcul des totaux ; 28. paiement DEMO.
- **Phase 6 — Paiement réel** : 29. architecture PaymentProvider ; 30. intégration du prestataire ; 31. Wave/Orange Money selon les API réellement disponibles ; 32. webhook ; 33. confirmation serveur ; 34. erreurs de paiement.
- **Phase 7 — Administration** : 35. authentification ; 36. dashboard ; 37. commandes ; 38. produits ; 39. stock ; 40. chiffre d'affaires ; 41. bénéfices.
- **Phase 8 — Finalisation** : 42. responsive ; 43. sécurité ; 44. validation ; 45. tests ; 46. optimisation ; 47. SEO ; 48. déploiement.

## 27. Design

Peu d'éléments, une expérience mémorable. **Élégant + sénégalais + contemporain + humain + premium + simple.** Le site doit pouvoir évoluer vers une vraie marque de mode.

## 28. Objectif final

Côté client : découvre les boubous → consulte un produit → ajoute au panier → passe commande → choisit son moyen de paiement → paie → reçoit une confirmation.

Côté gérant : connexion admin → voit la commande, le paiement, le prix payé, le coût, le bénéfice → gère les commandes, les produits, le stock → consulte les ventes.

Et surtout : **comprendre comment tout cela fonctionne.**
