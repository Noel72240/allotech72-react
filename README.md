# Allotech72 — Site React + Vite

Site vitrine professionnel pour technicien informatique indépendant.
Entièrement configurable via `src/config.js`.

---

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev
# → http://localhost:5173

# 3. Build pour la production
npm run build
# → dossier dist/ à déposer sur l'hébergeur
```

---

## 📁 Structure du projet

```
src/
├── config.js              ⭐ FICHIER CLIENT — modifier ici
├── App.jsx                Routeur principal
├── main.jsx               Point d'entrée React
├── styles/
│   └── globals.css        Tous les styles
├── hooks/
│   ├── useAuth.jsx        Authentification admin (Supabase Auth)
│   └── useCookies.js      Consentement cookies RGPD
├── components/
│   ├── Background.jsx     Particles + aurora animée
│   ├── CookieBanner.jsx   Bandeau cookies CNIL/RGPD
│   ├── Cursor.jsx         Curseur custom
│   ├── Nav.jsx            Navigation principale
│   ├── PageLayout.jsx     Layout partagé pages secondaires
│   ├── Hero.jsx           Section hero
│   ├── Services.jsx       Cartes services
│   ├── Avantages.jsx      Section avantages
│   ├── About.jsx          Qui suis-je
│   ├── Zone.jsx           Zone d'intervention
│   ├── Avis.jsx           Carousel avis (accueil)
│   ├── Contact.jsx        Formulaire Formspree
│   ├── Footer.jsx         Pied de page + liens légaux
│   └── Modals.jsx         Mentions légales + RGPD complets
└── pages/
    ├── Galerie.jsx        Page galerie photos
    ├── AvisPage.jsx       Page avis clients complète
    ├── NotFound.jsx       Page 404
    └── admin/
        ├── AdminPage.jsx      Routeur login/dashboard
        ├── AdminLogin.jsx     Formulaire connexion
        ├── ChangePassword.jsx Changement mdp (1ère connexion)
        └── AdminDashboard.jsx Gestion galerie + avis
```

---

## ⚙️ Configuration client

Tout se modifie dans **`src/config.js`** :

| Clé            | Description                        |
|----------------|------------------------------------|
| `brand`        | Nom de marque                      |
| `prenom` / `nom` | Identité du technicien           |
| `siret`        | Numéro SIRET                       |
| `telephone`    | Numéro affiché                     |
| `telBrut`      | Numéro sans espaces (lien tel:)    |
| `adresse`      | Adresse complète                   |
| `siteUrl`      | URL du site en production          |
| `formspreeId`  | ID Formspree pour le formulaire    |
| `services`     | Liste des services (icon/titre/desc/tags) |
| `communes`     | Zones d'intervention               |
| `avis`         | Avis clients de base               |
| `hebergeur`    | Infos hébergeur (mentions légales) |

---

## 📧 Formulaire de contact (Formspree)

1. Créer un compte sur [formspree.io](https://formspree.io)
2. Créer un nouveau formulaire → destination : `contact@allotech72.fr`
3. Copier l'ID (ex: `xpwzgkqb`) dans `config.js` :
   ```js
   formspreeId: 'xpwzgkqb',
   ```

---

## 🔐 Espace Admin

**URL :** `/admin`

**Connexion :** email + mot de passe **Supabase Auth** (un seul compte, identique sur PC, téléphone et tablette). Créez l’utilisateur dans le tableau Supabase : **Authentication → Users → Add user**.

Variables d’environnement (fichier `.env` local, et **Vercel → Settings → Environment Variables**) :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- *(optionnel)* `VITE_ADMIN_EMAIL` — préremplit le champ email sur la page de connexion.

Après création du compte admin, exécutez le script SQL `supabase/rls-admin-auth.sql` dans **SQL Editor** : lecture publique des avis/galerie pour le site, écriture réservée aux utilisateurs authentifiés. Si la connexion échoue alors que le mot de passe est bon, vérifiez **Authentication → Providers → Email** (confirmation d’email) ou créez l’utilisateur avec **Auto Confirm User** activé.

Dans **Storage → Policies**, supprimez toute ancienne règle trop permissive sur le bucket `galerie` (insertion publique) après avoir appliqué le script.

**Fonctionnalités :**
- 📷 Gestion galerie photos (upload avant/après, bucket Storage)
- ⭐ Ajout/suppression d'avis clients
- ⚙️ Visualisation des infos du site
- 🔑 Changement de mot de passe (menu **Mot de passe**), appliqué partout via Supabase

---

## 🍪 Cookies & RGPD

- Bandeau cookies conforme **CNIL** (refus aussi simple que l'acceptation)
- Politique de confidentialité complète (9 articles, tous les droits RGPD art. 15-21)
- Mentions légales complètes (LCEN, médiation européenne)
- Lien "Gérer mes cookies" dans le footer

---

## 🗺️ Routes

| Route      | Page                         |
|------------|------------------------------|
| `/`        | Accueil                      |
| `/galerie` | Galerie photos               |
| `/avis`    | Page avis clients            |
| `/admin`   | Espace administrateur        |
| `*`        | Page 404                     |

---

## 📦 Mise en ligne

```bash
npm run build
```
Dépose le contenu du dossier `dist/` sur ton hébergeur via FTP.

> **Important :** Configurer la réécriture d'URL sur l'hébergeur pour le routing React.
> Ajouter un fichier `.htaccess` à la racine du `dist/` :
> ```apache
> Options -MultiViews
> RewriteEngine On
> RewriteCond %{REQUEST_FILENAME} !-f
> RewriteRule ^ index.html [QSA,L]
> ```

---

## 🛠️ Extensions VS Code recommandées

- **ES7+ React Snippets** — rafp
- **Prettier** — esbenp.prettier-vscode
- **Auto Rename Tag** — formulahendry
- **Path IntelliSense** — christian-kohler

---

*© 2026 Allotech72 — Noël Liebault*
