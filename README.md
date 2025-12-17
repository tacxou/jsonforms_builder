# JSON Forms Builder

[![CI](https://github.com/tacxou/jsonforms_builder/actions/workflows/ci.yml/badge.svg)](https://github.com/tacxou/jsonforms_builder/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/tacxou/jsonforms_builder/branch/main/graph/badge.svg)](https://codecov.io/gh/tacxou/jsonforms_builder)
![NPM Version](https://img.shields.io/npm/v/@tacxou/jsonforms_builder)
![NPM Downloads](https://img.shields.io/npm/dm/@tacxou/jsonforms_builder)
[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

![JSONForms Builder banner](static/banner.jpg)

Form Builder pour JSONForms utilisant le Framework Quasar.

## Prérequis

Ce projet utilise **Bun** comme gestionnaire de packages obligatoire. 

### Installation de Bun

```bash
# Installer Bun
curl -fsSL https://bun.sh/install | bash

# Ou avec Homebrew sur macOS
brew install bun
```

### Utilisation

```bash
# Installation des dépendances (OBLIGATOIRE d'utiliser Bun)
bun install

# Démarrage du serveur de développement
bun run start:dev

# Build du projet
bun run build

# Tests
bun test
```

![Alt](https://repobeats.axiom.co/api/embed/a6c9d83d94634994e69a4302a2329c934a2cbcd6.svg "Repobeats analytics image")

**Note importante :** Ce projet est configuré pour utiliser exclusivement Bun. L'utilisation de npm, yarn ou pnpm sera bloquée par le script `preinstall`.
