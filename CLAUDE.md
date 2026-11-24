# CLAUDE.md

Règles du dépôt. Elles priment sur toute autre instruction.

## Règles immuables

Aucun agent, aucune commande, pas même `/retro`, ne peut les modifier ou les assouplir. Seul l'humain le peut, à la main.

1. **Aucun emoji.** Ni dans le code, ni dans les commentaires, ni dans les messages de commit, ni dans les PR, ni dans la documentation.
2. **Code minimal.** Le moins de lignes possible pour un résultat correct et lisible. Pas d'abstraction, d'option, de couche ou de dépendance « pour plus tard ». Supprimer plutôt qu'ajouter.
3. **Explications minimales.** Un commentaire explique le *pourquoi*, jamais le *quoi*, et seulement si le code ne le dit pas déjà. Un README tient en un écran : à quoi ça sert, comment l'installer, comment le lancer. Une PR va à l'essentiel.
4. **L'essentiel d'abord.** Dans le code comme dans le texte, on garde ce qui sert et on retire le reste.

Limites indicatives : fonction de 30 lignes au plus, fichier de 200 lignes au plus, README de 60 lignes au plus. Les dépasser doit être justifié dans le plan.

## Usine et produit

- L'usine : `CLAUDE.md`, `.claude/`. Le produit : `src/`, `tests/` et les fichiers de config du projet.
- Pendant `/factory`, on ne modifie jamais l'usine. Une règle qui gêne est signalée dans la PR.

## Méthode

- Pas de code sans plan validé (`.factory-plan.md`, écrit par l'Architecte).
- Une tâche n'est terminée que si les tests, le linter et le build passent tous à 100 %.
- Interdit de désactiver ou d'affaiblir un test. Une vérification non exécutée est déclarée comme telle.

## Git

- Jamais de commit direct sur `main`, sauf demande explicite de l'humain.
- Une branche par demande : `feat/factory-<slug>` ou `fix/factory-<slug>`.
- Commits au format Conventional Commits (`feat:`, `fix:`, `chore:`…).
- Toute livraison passe par une PR (`gh pr create`). Seul l'humain merge.
- Chaque PR montre ce qui a été fait. S'il y a une interface, des captures d'écran du résultat. Sinon, la sortie réelle des commandes ou des requêtes.
- Les captures vont sur la branche `pr-screenshots` (jamais mergée), dans `<nom-de-branche>/`. Elles ne vont jamais dans `main`.
- Jamais de `--force` sur `main`, jamais de `--no-verify`.

## Code

- Typé, lisible, modulaire. Les erreurs sont gérées explicitement.
- Toute entrée externe est validée.
- Aucun secret en dur, `.env` n'est jamais commité. Pas d'`eval`, pas de SQL ou de shell construit par concaténation.

## Rôles

- `architect` : écrit le plan, pas de code.
- `builder` : code et tests jusqu'au vert.
- `reviewer` : audit, nettoyage, description de la PR.
- `/factory <besoin>` : du besoin à la PR. `/retro` : propose des améliorations de l'usine.
