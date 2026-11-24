---
description: Fabrique une fonctionnalité de bout en bout (Architecte → Builder → Reviewer) et ouvre une Pull Request GitHub
argument-hint: <description du besoin>
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep, Glob, Write, Edit, Agent
---

# 🏭 /factory : du besoin à la Pull Request

**Besoin à fabriquer :** $ARGUMENTS

Tu es le **chef d'usine**. Tu orchestres les trois rôles dans l'ordre, tu ne sautes aucune phase et tu respectes `CLAUDE.md` à la lettre.
Si `$ARGUMENTS` est vide, demande le besoin à l'utilisateur et arrête-toi.

Pour chaque phase, délègue au sous-agent correspondant (`architect`, `builder`, `reviewer`) avec l'outil Agent. Si les sous-agents ne sont pas disponibles, applique toi-même les consignes de leur fichier dans `.claude/agents/`.

---

## Phase 0 : Initialisation Git

1. Vérifier que l'arbre de travail est propre (`git status --porcelain`). S'il ne l'est pas, **arrête-toi** et montre les fichiers concernés à l'utilisateur.
2. Se placer sur `main` et le mettre à jour :
   ```bash
   git checkout main
   git pull --ff-only origin main
   ```
   Si le pull échoue (divergence, absence de remote), arrête-toi et explique.
3. Calculer un `<slug>` à partir du besoin : minuscules, mots séparés par des tirets, sans accents, 40 caractères au plus (ex. `api-gestion-taches`).
4. Choisir le préfixe : `fix/` si le besoin est une correction de bug, sinon `feat/`.
5. Créer la branche et basculer dessus :
   ```bash
   git checkout -b feat/factory-<slug>
   ```

## Phase 1 : 📐 Architecte

- Lancer le sous-agent **architect** avec le besoin complet.
- Résultat attendu : `.factory-plan.md` existe à la racine.
- Vérifier que le plan contient des critères d'acceptation, des tests obligatoires et des commandes de vérification. Sinon, relancer l'Architecte en précisant ce qui manque.
- Afficher à l'utilisateur un résumé du plan en cinq lignes au plus.

## Phase 2 : 🔨 Builder

- Lancer le sous-agent **builder** en lui demandant d'implémenter `.factory-plan.md`.
- Résultat attendu : tests, lint et build **100 % verts**, avec les commandes exécutées et leurs résultats.
- Si le Builder rend un rapport d'échec (garde-fou des 5 itérations atteint), **arrête la chaîne** : ne livre rien, montre le rapport à l'utilisateur et laisse la branche en l'état.

## Phase 3 : 🔍 Reviewer

- Lancer le sous-agent **reviewer**.
- Résultat attendu : rapport de conformité et verdict, `.factory-plan.md` supprimé.
- Si le verdict est **⛔ BLOQUÉ** : renvoyer la liste des corrections au **builder**, puis relancer le **reviewer**. Deux allers-retours au maximum. Au-delà, arrête-toi et présente le rapport à l'utilisateur.
- Garder le rapport du Reviewer : c'est la description de la Pull Request.

## Phase 4 : 📬 Livraison GitHub

1. Vérifier une dernière fois :
   - `git status` ne montre ni `.factory-plan.md`, ni `.env`, ni fichier de debug ;
   - aucun fichier de `.claude/` ni `CLAUDE.md` n'est modifié (`git diff --name-only main...HEAD` et `git status`).
2. Commiter proprement, en ajoutant les fichiers **nommément** (pas de `git add -A` à l'aveugle) :
   ```bash
   git add <fichiers du produit>
   git commit -m "feat: <résumé court du besoin>"
   ```
   (`fix: …` pour une branche `fix/`.)
3. Pousser :
   ```bash
   git push -u origin HEAD
   ```
4. Ouvrir la Pull Request vers `main`, avec le rapport du Reviewer comme description (qui contient Objectif, Architecture, Preuves des tests exécutés et Points d'attention) :
   ```bash
   gh pr create --base main --title "feat: <résumé court>" --body-file <fichier temporaire contenant le rapport>
   ```
   Supprimer le fichier temporaire ensuite.
5. **Afficher le lien de la Pull Request.**

## Fin

Termine par un récapitulatif court :
- la branche créée ;
- le lien de la PR ;
- les résultats des vérifications ;
- les points d'attention à relire en priorité.

❌ Ne merge jamais la Pull Request : c'est la décision de l'humain.
