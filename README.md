![GameVault Logo](./GameVaultClient/public/GameVault-Logo.svg)
## 📖 Description

GameVault est une application web moderne qui permet aux passionnés de jeux vidéo de créer et gérer leur collection personnelle de titres de jeux en ligne. Organisez votre bibliothèque ludique, découvrez de nouveaux jeux et gardez une trace de vos aventures gaming !

### ✨ Fonctionnalités principales

- 📚 **Gestion de collection** : Ajoutez, modifiez et supprimez des titres de jeux
- 🔍 **Recherche avancée** : Trouvez rapidement vos jeux par titre, genre ou plateforme
- 🏷️ **Système de tags** : Organisez vos jeux avec des étiquettes personnalisées
- ⭐ **Évaluations** : Notez et commentez vos jeux favoris
- 📱 **Interface responsive** : Accédez à votre collection depuis n'importe quel appareil
- 🔐 **Authentification sécurisée** : Comptes utilisateur protégés
- 🌙 **Mode sombre/clair** : Interface adaptée à vos préférences

## 🛠️ Technologies utilisées

### Frontend - GameVaultClient
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Développement typé et sécurisé
- **Tailwind CSS** - Framework CSS utilitaire pour un design moderne
- **React Query/TanStack Query** - Gestion d'état et cache des données
- **React Hook Form** - Gestion des formulaires performante
- **React** - Bibliothèque JavaScript pour les interfaces utilisateur
- **Zustand** - Store global léger pour l'état de l'application
- **Framer Motion** - Animations fluides et interactives

### Backend - GameVaultApi
- **ASP.NET Core 8** - Framework web robuste et performant
- **Entity Framework Core** - ORM moderne pour .NET
- **SQL Server** - Base de données relationnelle
- **JWT Authentication** - Authentification sécurisée par tokens
- **AutoMapper** - Mapping automatique des objets
- **FluentValidation** - Validation des données côté serveur
- **Swagger/OpenAPI** - Documentation automatique de l'API

### Outils de développement
- **Git** - Contrôle de version
- **Visual Studio / VS Code** - Environnements de développement
- **Postman** - Tests d'API
- **GitHub** - Hébergement du code source

## 🚀 Installation et lancement

### Prérequis
- Node.js 18+ 
- .NET 8 SDK
- SQL Server (LocalDB ou instance complète)

### Backend (GameVaultApi)
```bash
cd GameVaultApi
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend (GameVaultClient)
```bash
cd GameVaultClient
npm install
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000
- Documentation API : http://localhost:5000/swagger

## 📁 Structure du projet

```
GameVault/
├── GameVaultApi/          # Backend ASP.NET Core
│   ├── Controllers/       # Contrôleurs API
│   ├── Models/           # Modèles de données
│   ├── Services/         # Logique métier
│   ├── Data/            # Contexte Entity Framework
│   └── ...
├── GameVaultClient/      # Frontend Next.js
│   ├── app/             # Pages et layouts (App Router)
│   ├── components/      # Composants React réutilisables
│   ├── hooks/          # Hooks personnalisés
│   ├── lib/            # Utilitaires et configurations
│   └── ...
└── README.md
```

## 🎯 Fonctionnalités à venir

- [ ] Intégration avec les APIs de jeux (IGDB, Steam)
- [ ] Système de recommandations
- [ ] Partage de collections entre utilisateurs
- [ ] Application mobile (React Native)
- [ ] Statistiques et graphiques de gaming
- [ ] Import/Export de données

## 👨‍💻 Auteur

Développé avec ❤️ par **Martin**

---

*GameVault - Votre collection de jeux, organisée et accessible partout !*
