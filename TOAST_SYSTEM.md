# 🔔 Système de Notifications Toast - Planning des Séances

## Fonctionnement Intelligent

Le système de toasts est conçu pour être **non-intrusif** et **intelligent** :

### ✨ Caractéristiques

#### 1. **File d'attente avec priorités**
Les toasts sont affichés selon leur importance :
- 🔴 **Critical** (6s) : Erreurs graves, conflits horaires
- 🟠 **High** (4s) : Sauvegardes réussies, actions importantes
- 🟡 **Normal** (3s) : Informations générales
- 🔵 **Low** (2s) : Changements de classe, actions mineures

#### 2. **Déduplication automatique**
- Les toasts identiques ne s'affichent qu'une seule fois
- Évite les répétitions lors de multiples sauvegardes

#### 3. **Limite d'affichage**
- Maximum **3 toasts visibles** simultanément
- Les autres sont mis en file d'attente
- Indicateur "+N en attente" si débordement

#### 4. **Durées adaptatives**
- Les erreurs restent plus longtemps (5-6s)
- Les infos rapides disparaissent vite (2s)

---

## 📋 Types de Notifications

### ✅ Succès (Vert)
- Sauvegarde réussie
- Synchronisation ToolBox complétée
- Action confirmée

### ❌ Erreur (Rouge)
- Échec de sauvegarde
- Erreur de synchronisation
- Problème technique

### ⚠️ Avertissement (Jaune/Orange)
- Conflits horaires détectés
- Séances qui se chevauchent
- Actions nécessitant attention

### ℹ️ Information (Bleu)
- Changement de classe
- Chargement de données
- Actions courantes

---

## 🎯 Exemples d'Utilisation

### Sauvegarde avec succès
```
✓ 12 séance(s) sauvegardées • Tronc Commun Scientifique • 3 cette semaine
[Priorité: HIGH - 4s]
```

### Conflit horaire détecté
```
⚠️ 2 conflit(s) horaire(s) détecté(s)
[Priorité: CRITICAL - 6s]
```

### Changement de classe
```
1ère Bac Sciences Mathématiques • 8 séance(s) sauvegardées
[Priorité: LOW - 2s]
```

### Erreur de sauvegarde
```
❌ Erreur sauvegarde: Impossible de synchroniser avec ToolBox
[Priorité: CRITICAL - 6s]
```

---

## 🔧 Configuration

Le système est configuré dans `components/Toast.tsx` :

```typescript
maxVisible: 3        // Max de toasts visibles
durations: {
  error: 5000ms,     // Erreurs
  critical: 6000ms,  // Critique
  high: 4000ms,      // Important
  normal: 3000ms,    // Standard
  low: 2000ms        // Rapide
}
```

---

## 💡 Bonnes Pratiques

### ✅ Quand afficher un toast :
- Confirmation d'une action importante (sauvegarde, suppression)
- Erreur nécessitant l'attention de l'utilisateur
- Conflit ou problème détecté
- Synchronisation réussie/échouée

### ❌ Quand NE PAS afficher de toast :
- Chargement automatique des données
- Actions répétitives (édition de champ)
- Survol de souris
- Actions passives (changement d'onglet)

---

## 🚀 Synchronisation avec ToolBox

Les toasts de synchronisation sont déclenchés automatiquement :

1. **Création/Modification de session** → Toast LOW (discret)
2. **Sauvegarde manuelle** → Toast HIGH avec détails
3. **Conflits détectés** → Toast CRITICAL (prioritaire)
4. **Erreur réseau** → Toast CRITICAL avec message détaillé

---

## 🎨 Design

- **Backdrop blur** pour effet glassmorphisme
- **Animations fluides** (slide-in depuis la droite)
- **Gradients dynamiques** selon le type
- **Icônes animées** (pulse sur certains types)
- **Position fixe** en haut à droite
- **Empilage intelligent** avec espacement

---

## 🐛 Debugging

Pour voir les toasts en action dans la console :
```javascript
console.log('🔕 Toast dédupliqué:', message);
console.log('✅ Toast ajouté:', message, priority);
```

Les logs de synchronisation apparaissent avec emoji :
- 📂 Chargement
- 💾 Sauvegarde
- ✅ Succès
- ❌ Erreur
