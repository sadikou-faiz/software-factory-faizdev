# 🏭 Software Factory FaizDev

Une **usine logicielle agentique, autonome et supervisée**.

Ce dépôt ne contient pas encore d'application : il contient **la machine qui la fabriquera**.
Tu décris un besoin en une phrase, et trois agents spécialisés le transforment en **Pull Request GitHub testée**, prête pour ta validation.

---

## ⚙️ Comment ça marche

```text
  ┌──────────────┐
  │    💡 Idée    │   /factory "ajouter une page de connexion"
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐   Analyse le dépôt, découpe le travail,
  │ 📐 Architecte │   écrit .factory-plan.md (fichiers, critères, tests)
  └──────┬───────┘   ✗ n'écrit aucun code
         │
         ▼
  ┌──────────────┐   Code + tests → exécute tests / lint / build
  │  🔨 Builder   │──┐
  └──────┬───────┘  │ ❌ rouge ? lit les logs, corrige, relance
         │   ▲──────┘
         │ ✅ 100 % vert
         ▼
  ┌──────────────┐   Audit du diff vs plan, sécurité,
  │ 🔍 Reviewer   │   nettoyage, rapport de conformité
  └──────┬───────┘
         │
         ▼
  ┌──────────────────────┐
  │ 📬 Pull Request GitHub│   👤 Validation humaine (Human-in-the-loop)
  └──────────────────────┘
```

---

## 🚀 Lancer une fabrication

Prérequis :
- [Claude Code](https://claude.com/claude-code)
- [GitHub CLI](https://cli.github.com/) authentifié (`gh auth login`)
- Un remote `origin` pointant vers ce dépôt GitHub

Dans Claude Code, à la racine du dépôt :

```text
/factory ajouter une API REST de gestion de tâches avec création, liste et suppression
```

L'usine va :
1. créer une branche `feat/factory-<slug>` à partir de `main` à jour ;
2. produire un plan technique (`.factory-plan.md`) ;
3. coder et tester en boucle jusqu'à ce que tout soit vert ;
4. auditer le résultat et supprimer les fichiers temporaires ;
5. pousser la branche et ouvrir une **Pull Request** dont elle t'affiche le lien.

Ensuite, c'est toi qui relis et merges.

---

## 🔁 Améliorer l'usine

```text
/retro
```

Analyse les derniers commits, les Pull Requests et les difficultés rencontrées, puis **propose** des modifications de `CLAUDE.md` ou des agents.
Rien n'est appliqué sans ton accord.

---

## 📂 Structure

```text
.
├── README.md                 # Ce fichier
├── CLAUDE.md                 # La Constitution : règles globales, standards, sécurité
├── .gitignore
└── .claude/
    ├── agents/
    │   ├── architect.md      # Conception technique et découpage
    │   ├── builder.md        # Développement et tests
    │   └── reviewer.md       # Audit qualité, sécurité, conformité
    └── commands/
        ├── factory.md        # /factory : du besoin à la Pull Request
        └── retro.md          # /retro : amélioration continue
```

Le code produit vivra dans `src/` et `tests/`.

---

## 📜 Les règles d'or

- 🚫 Aucun commit direct sur `main`.
- 📐 Pas de code sans plan.
- ✅ Pas de livraison sans tests, lint et build au vert.
- 🔐 Aucun secret dans le code.
- 👤 Toute livraison passe par une Pull Request relue par un humain.

Le détail est dans [CLAUDE.md](CLAUDE.md).
