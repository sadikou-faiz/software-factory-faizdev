# Software Factory FaizDev

Une usine agentique : un besoin en une phrase donne une Pull Request testée, que tu relis avant de merger.

```text
Idée -> Architecte -> Builder -> Reviewer -> Pull Request -> validation humaine
         (plan)      (code + tests   (audit,
                      jusqu'au vert)  nettoyage)
```

## Prérequis

- Claude Code
- GitHub CLI connecté (`gh auth login`)

## Utilisation

```text
/factory ajouter une API de gestion de tâches
/retro
```

`/factory` crée la branche, fait le plan, le code et les tests, l'audit, puis ouvre la PR.
`/retro` propose des améliorations des règles de l'usine.

## Règles

Voir [CLAUDE.md](CLAUDE.md). Les règles immuables : aucun emoji, code minimal, explications minimales, l'essentiel d'abord.
