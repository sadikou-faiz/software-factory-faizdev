---
description: Fabrique une fonctionnalité (Architecte, Builder, Reviewer) et ouvre une Pull Request GitHub
argument-hint: <description du besoin>
allowed-tools: Bash(git:*), Bash(gh:*), Bash(mktemp:*), Bash(mkdir:*), Bash(cp:*), Bash(rm:*), Read, Grep, Glob, Write, Edit, Agent
---

# /factory

Besoin : $ARGUMENTS

Si le besoin est vide, le demander puis s'arrêter. Respecter `CLAUDE.md`, en particulier les règles immuables. Chaque phase est confiée au sous-agent du même nom ; à défaut, appliquer soi-même le fichier `.claude/agents/<nom>.md`.

## 0. Branche

1. `git status --porcelain` doit être vide. Sinon, s'arrêter et montrer les fichiers.
2. `git checkout main && git pull --ff-only origin main`. En cas d'échec, s'arrêter.
3. `git checkout -b feat/factory-<slug>` : slug en minuscules, sans accents, mots séparés par des tirets, 40 caractères au plus. Utiliser `fix/` pour une correction.

## 1. Architecte

Lancer `architect`. Vérifier que `.factory-plan.md` contient des critères, des tests et des commandes, sinon le relancer. Résumer le plan en trois lignes.

## 2. Builder

Lancer `builder`. S'il rend un rapport d'échec, s'arrêter : ne rien livrer, montrer le rapport.

## 3. Reviewer

Lancer `reviewer`. Si le verdict est BLOQUÉ, renvoyer les corrections à `builder` puis relancer `reviewer`, deux fois au plus. Au-delà, s'arrêter et montrer le rapport.

## 4. Livraison

1. Vérifier avec `git status` qu'il n'y a ni `.factory-plan.md`, ni `.env`, ni fichier de debug, et que l'usine n'a pas été modifiée.
2. `git add <fichiers nommés>` puis `git commit -m "feat: <résumé>"` (ou `fix:`).
3. `git push -u origin HEAD`.
4. Publier les captures sur la branche `pr-screenshots`, sans toucher à la branche courante :
   ```bash
   B=$(git branch --show-current); T=$(mktemp -d)
   if git ls-remote --exit-code --heads origin pr-screenshots >/dev/null; then
     git fetch origin pr-screenshots && git worktree add -B pr-screenshots "$T" origin/pr-screenshots
   else
     git worktree add --orphan -b pr-screenshots "$T"
   fi
   mkdir -p "$T/$B" && cp .factory-shots/*.png "$T/$B/"
   git -C "$T" add -A && git -C "$T" commit -m "chore: captures $B" && git -C "$T" push origin pr-screenshots
   git worktree remove --force "$T" && rm -rf .factory-shots
   ```
   Dans le rapport, remplacer chaque `{{CAPTURE:<nom>}}` par `![<nom>](https://github.com/<owner>/<repo>/blob/pr-screenshots/<B>/<nom>.png?raw=true)` (`<owner>/<repo>` vient de `gh repo view --json nameWithOwner -q .nameWithOwner`).
5. `gh pr create --base main --title "<même titre>" --body-file <fichier temporaire>`, avec le rapport comme description. Supprimer ensuite le fichier temporaire.
6. Afficher le lien de la PR, les résultats des vérifications et les points d'attention.

Ne jamais merger.
