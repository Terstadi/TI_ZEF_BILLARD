# 🎱 L'Estocade — Site Club Billard
**Site statique + Google Sheets comme CMS**

---

## 📁 Structure du projet

```
billard-club/
├── index.html          ← Page principale
├── css/
│   └── style.css       ← Styles
├── js/
│   └── app.js          ← Logique + intégration Sheets
└── README.md           ← Ce fichier
```

---

## 🚀 Déployer sur Netlify (5 minutes)

### Méthode 1 — Glisser-déposer (la plus simple)
1. Allez sur **[netlify.com](https://netlify.com)** et créez un compte gratuit
2. Depuis le dashboard, faites **glisser le dossier** `billard-club/` dans la zone de dépôt
3. Votre site est en ligne en 30 secondes ! Netlify vous donne une URL du type `random-name.netlify.app`
4. Dans **Site settings > Domain management**, vous pouvez changer le nom ou connecter votre propre domaine

### Méthode 2 — Via GitHub (recommandé pour les mises à jour)
1. Poussez le dossier sur un dépôt GitHub
2. Dans Netlify : **Add new site > Import from Git**
3. Connectez votre repo — Netlify se mettra à jour automatiquement à chaque commit

---

## 📊 Configurer Google Sheets (le CMS)

### Étape 1 — Créer le Google Sheet
1. Créez un nouveau Google Sheets sur **[sheets.google.com](https://sheets.google.com)**
2. Créez **3 onglets** avec exactement ces noms :
   - `Calendrier`
   - `Galerie`
   - `Tarifs`

### Étape 2 — Rendre le Sheet public
1. Cliquez sur **Partager** (bouton vert en haut à droite)
2. Changez l'accès à **"Toute personne avec le lien"** en mode **Lecteur**
3. Copiez l'URL — elle ressemble à :
   `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`**`/edit`
4. L'ID est la partie en gras entre `/d/` et `/edit`

### Étape 3 — Configurer le site
Dans `js/app.js`, ligne 20, remplacez :
```js
SHEET_ID: "VOTRE_SHEET_ID_ICI",
```
par votre ID :
```js
SHEET_ID: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
```

---

## 📋 Format des onglets Google Sheets

### Onglet `Calendrier`
| titre | date | heure | type | description |
|---|---|---|---|---|
| Entraînement Carom | Mardi 15 Janvier 2026 | 19h00 – 21h30 | entrainement | Séance hebdomadaire... |
| Tournoi Mensuel | Samedi 25 Janvier 2026 | 14h00 – 19h00 | tournoi | Tournoi en round-robin... |

**Valeurs valides pour `type`** : `entrainement` | `tournoi` | `evenement`

---

### Onglet `Galerie`
| url | legende |
|---|---|
| https://exemple.com/photo1.jpg | Salle principale |
| https://exemple.com/photo2.jpg | Tournoi mensuel |

> 💡 Astuce : utilisez [Google Photos](https://photos.google.com) ou [Imgur](https://imgur.com) pour héberger vos photos gratuitement, puis collez l'URL directe.

---

### Onglet `Tarifs`
| nom | description | prix | periode | avantages | vedette |
|---|---|---|---|---|---|
| Adulte | Formule standard | 120 | / an | Accès illimité\|Entraînements\|Licence incluse | TRUE |
| Étudiant | Moins de 26 ans | 80 | / an | Accès illimité\|Entraînements | FALSE |
| Découverte | Séance d'essai | Gratuit | 1 séance | 1 séance offerte\|Sans engagement | FALSE |

> ⚠️ Séparez les avantages avec le caractère `|` (pipe)
> Pour la colonne `vedette` : `TRUE` = met en avant la carte (bordure dorée)

---

## 📬 Activer le formulaire de contact

Le formulaire fonctionne nativement avec **Netlify Forms** :

1. Dans `index.html`, trouvez la balise `<form id="contactForm" ...>`
2. Ajoutez l'attribut `data-netlify="true"` et un champ caché :
```html
<form id="contactForm" class="contact-form" data-netlify="true" name="contact">
  <input type="hidden" name="form-name" value="contact" />
  ...
</form>
```
3. Vous recevrez les soumissions dans votre dashboard Netlify → **Forms**
4. Activez les notifications email dans **Forms > Settings**

---

## ✏️ Modifier le contenu fixe (nom, adresse, horaires...)

Les informations fixes du club sont dans `index.html`. Recherchez et remplacez :
- `L'Estocade` → Nom de votre club
- `12 Rue des Joueurs, 75000 Paris` → Votre adresse
- `01 23 45 67 89` → Votre numéro
- `contact@lestocade.fr` → Votre email
- `Fondé en 1987` → Votre année de fondation
- `150+ Membres`, `37 Ans d'histoire`, `12 Tables pro` → Vos statistiques

---

## 🎨 Personnaliser les couleurs

Dans `css/style.css`, modifiez les variables CSS en haut du fichier :
```css
:root {
  --green: #1a5c38;       /* Couleur principale (vert billard) */
  --gold: #c9a84c;        /* Couleur accent (dorée) */
  --dark: #12120f;        /* Fond principal */
  --cream: #f5f0e8;       /* Couleur du texte */
}
```
