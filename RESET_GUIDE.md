# 🗑️ Script de Réinitialisation Complète

## Méthode 1: Via l'Interface Web

1. Ouvrir "Planning des Séances"
2. Cliquer sur le bouton rouge **"🗑️ TOUT Supprimer"**
3. Taper **"RESET"** dans la fenêtre de confirmation
4. La page se rechargera automatiquement

## Méthode 2: Via la Console du Navigateur

Ouvrir la console (F12) et coller ce code :

```javascript
// Supprimer toutes les données de plannings
const classes = [
    'Tronc Commun Scientifique',
    '1ère Bac Sciences Expérimentales',
    '1ère Bac Sciences Mathématiques',
    '2ème Bac Sciences Expérimentales',
    '2ème Bac Sciences Mathématiques'
];

classes.forEach(className => {
    localStorage.removeItem(`sessions_${className}`);
    localStorage.removeItem(`nextId_${className}`);
});

// Supprimer anciennes clés
localStorage.removeItem('sessions');
localStorage.removeItem('nextId');
localStorage.removeItem('selectedClass');
localStorage.removeItem('planning_sessions');

console.log('✅ Toutes les données ont été supprimées!');
location.reload();
```

## Méthode 3: Via PowerShell (Nettoyer toolbox_data)

```powershell
# Supprimer tous les fichiers de plannings du CLI
Remove-Item "c:\Users\Me\CODING\TOOLS\toolbox_data\plannings\*.json" -Force

Write-Host "✅ Fichiers de plannings supprimés!" -ForegroundColor Green
```

## Vérification

Après réinitialisation, vous devriez voir :
- ✅ Aucune séance affichée
- ✅ Compteur de séances à 0
- ✅ Chaque classe indépendante
- ✅ Pas de conflit entre classes

## Commencer Fresh

1. Sélectionner une classe (ex: TCS)
2. Cliquer "Ajouter une séance"
3. Remplir les informations
4. Cliquer "Enregistrer"
5. Les séances seront maintenant **isolées par classe**

## Architecture Corrigée

```
localStorage:
├── sessions_Tronc Commun Scientifique        [Session[]]
├── nextId_Tronc Commun Scientifique          number
├── sessions_1ère Bac Sciences Expérimentales [Session[]]
├── nextId_1ère Bac Sciences Expérimentales   number
├── sessions_1ère Bac Sciences Mathématiques  [Session[]]
├── nextId_1ère Bac Sciences Mathématiques    number
├── sessions_2ème Bac Sciences Expérimentales [Session[]]
├── nextId_2ème Bac Sciences Expérimentales   number
├── sessions_2ème Bac Sciences Mathématiques  [Session[]]
├── nextId_2ème Bac Sciences Mathématiques    number
└── selectedClass                             string
```

Chaque classe a maintenant :
- ✅ Ses propres sessions
- ✅ Son propre compteur d'ID
- ✅ Aucune interférence avec les autres classes
