---
description: Rétrospective de l'usine. Analyse les commits, les PR et les difficultés récentes, puis propose des améliorations de CLAUDE.md et des agents
argument-hint: "[nombre de PR à analyser, 5 par défaut]"
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep, Glob, Edit
---

# 🔁 /retro : l'amélioration continue de l'usine

Tu analyses comment l'usine a fonctionné récemment, et tu **proposes** des améliorations de ses règles.
Tu n'appliques **rien** sans l'accord explicite de l'utilisateur.

Périmètre : les `$ARGUMENTS` dernières Pull Requests (5 si rien n'est précisé).

---

## 1. Collecter les faits

```bash
git log --oneline -n 50 --all
gh pr list --state all --limit <N> --json number,title,state,headRefName,url,mergedAt
```

Pour chaque PR retenue :
```bash
gh pr view <num> --json title,body,comments,reviews,commits,files
```

Collecter aussi :
- les **commentaires de revue humaine** : ce que l'humain a dû corriger ou demander ;
- les PR **fermées sans merge** et leur raison ;
- les commits de correction qui ont suivi une PR (`fix: …` sur le même sujet) ;
- dans la session courante : les échecs de la boucle du Builder, les verdicts BLOQUÉ du Reviewer, les blocages de `/factory`.

## 2. Diagnostiquer

Classer chaque difficulté par cause racine :

| Cause | Exemple | Fichier à améliorer |
|-------|---------|---------------------|
| Plan incomplet | cas d'erreur oublié | `.claude/agents/architect.md` |
| Implémentation fragile | même type de bug répété | `.claude/agents/builder.md` |
| Audit trop laxiste | l'humain trouve ce que le Reviewer a raté | `.claude/agents/reviewer.md` |
| Règle manquante ou floue | convention de nommage non écrite | `CLAUDE.md` |
| Workflow défaillant | étape Git qui casse | `.claude/commands/factory.md` |

Ne retenir que les problèmes **récurrents ou coûteux**. Un incident isolé ne justifie pas une règle.

## 3. Proposer

Pour chaque amélioration, présenter :

```markdown
### Proposition N : <titre>
- **Constat :** <faits, avec liens vers les PR ou commits>
- **Cause racine :** …
- **Fichier :** `<chemin>`
- **Modification proposée :**
  ```diff
  - ancienne règle
  + nouvelle règle
  ```
- **Effet attendu :** …
```

Règles pour les propositions :
- Elles doivent être concrètes, courtes et vérifiables. Pas de vœux pieux du genre « être plus rigoureux ».
- Préférer préciser une règle existante plutôt qu'en empiler une nouvelle.
- Proposer aussi de **supprimer** les règles devenues inutiles ou contradictoires.

## 4. Appliquer, avec accord

- Demander à l'utilisateur quelles propositions il accepte.
- Appliquer **uniquement** celles-là.
- Ces modifications touchent l'usine : elles passent par une branche `chore/retro-<date>` et une Pull Request, jamais par un commit direct sur `main`.

S'il n'y a pas encore d'historique à analyser, dis-le simplement et ne propose rien d'inventé.
