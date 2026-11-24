---
description: Analyse les commits et PR récents, puis propose des améliorations de CLAUDE.md et des agents
argument-hint: "[nombre de PR, 5 par défaut]"
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep, Glob, Edit
---

# /retro

Analyser les $ARGUMENTS dernières PR (5 par défaut) et proposer des améliorations de l'usine. N'appliquer que ce que l'humain accepte.

**Les règles immuables de `CLAUDE.md` sont hors périmètre** : ne jamais proposer de les modifier ni de les assouplir.

## 1. Faits

- `git log --oneline -n 50`
- `gh pr list --state all --limit <N> --json number,title,state,url`
- `gh pr view <num> --json body,comments,reviews,files`

À chercher : ce que l'humain a dû corriger, les PR fermées sans merge, les `fix:` qui suivent une PR, les blocages de la session (échecs du Builder, verdicts BLOQUÉ).

## 2. Diagnostic

Ne retenir que les problèmes récurrents ou coûteux, puis associer chacun à son fichier :
- plan incomplet : `architect.md` ;
- bug répété : `builder.md` ;
- défaut que l'audit a laissé passer : `reviewer.md` ;
- règle floue : `CLAUDE.md` ;
- workflow cassé : `factory.md`.

## 3. Propositions

Pour chacune : le constat (avec un lien vers la PR ou le commit), le fichier concerné et un diff court. Préférer préciser ou supprimer une règle plutôt qu'en ajouter une.

S'il n'y a pas d'historique, le dire et ne rien proposer.
