Institut Supérieur Polytechnique de Madagascar - ISPM
Site web : www.ispm-edu.com 

# Les membres du groupe
TOVO Jean Bien Aimé , 
RAJOHARIVELO Andriarivony Antenaina , 
RAHERIMANANA Andriniaina Koloina Mandresy , 

# Projet SPAM/HAM Classifier

Ce projet est une application web permettant de détecter si un message est du SPAM ou du HAM (légitime) en utilisant du Machine Learning.

## Lien vers l'application web hébergée

## Stack technologique
- **Frontend** : Next.js, Tailwind CSS
- **Backend** : FastAPI, Python, Scikit-learn, Spacy

## Prérequis
- Node.js & pnpm
- Python 3.10+

## La description du processus et du modèle
L'objectif de ce projet est de construire un système capable d'identifier automatiquement les messages indésirables (Spam) parmi les messages légitimes (Ham) en utilisant des techniques de traitement du langage naturel (NLP) et d'apprentissage automatique.

1. Préparation du Texte (Pipeline NLP)
Pour que la machine puisse "lire" les messages, nous avons transformé le texte brut en données numériques :

Nettoyage : Suppression du "bruit" (ponctuation, mots de liaison inutiles).

Analyse par Bigrammes : Nous n'analysons pas seulement les mots seuls, mais aussi les groupes de deux mots (ex: "urgent call", "free prize"). Cela permet de capturer le contexte et d'augmenter la pertinence de la détection.

2. Le Modèle : Arbre de Décision
Nous avons choisi un Arbre de Décision (Decision Tree) pour sa clarté et sa rapidité :

Fonctionnement : Le modèle apprend une série de questions binaires (ex: "Le message contient-il '0871' ?"). Si oui, il descend vers une branche ; si non, vers une autre.

Équilibrage : Grâce à l'option class_weight='balanced', le modèle traite les spams avec la même importance que les messages normaux, même s'ils sont beaucoup moins nombreux dans les données.

Analyse des Résultats
Le projet ne se contente pas de prédire, il explique :

Importance des variables : Nous avons extrait le Top 20 des mots et expressions qui trahissent le plus souvent un spam.

Validation : Une matrice de confusion permet de vérifier si le modèle fait trop de "fausses alertes" (bloquer un message sain par erreur).

## Les méthodes ML
1. Naive Bayes (MultinomialNB)
Le modèle Bayésien Naïf est souvent le point de départ idéal pour la classification de texte.

Principe : Il repose sur le théorème de Bayes. Il calcule la probabilité qu'un message soit un spam en fonction de la fréquence d'apparition de chaque mot. On l'appelle "naïf" car il suppose que chaque mot est indépendant des autres (il ignore l'ordre des mots).

Point fort : Extrêmement rapide et très performant sur les petits jeux de données textuelles.

Cas d'usage ici : Il sert de "baseline" (modèle de référence) pour comparer les autres modèles.

2. Decision Tree (Arbre de Décision)
L'Arbre de Décision est un modèle qui segmente les données en posant une série de questions binaires (Oui/Non).

Principe : Il crée des embranchements basés sur les mots les plus discriminants (ex: "Si le message contient 'GRATUIT', alors probabilité de Spam = 90%"). Il cherche à maximiser la "pureté" de chaque branche (avoir uniquement des spams ou uniquement des hams dans un groupe).

Point fort : Très facile à interpréter. On peut littéralement dessiner le cheminement logique du modèle.

Limites : Sensible au "bruit" et a tendance au surapprentissage (apprendre par cœur les données d'entraînement).

3. Random Forest (Forêt Aléatoire)
La Forêt Aléatoire est un modèle dit "d'ensemble" qui combine plusieurs arbres de décision pour obtenir un résultat plus stable.

Principe : Au lieu de créer un seul arbre, il en crée des centaines (ex: 100). Chaque arbre est entraîné sur un sous-ensemble aléatoire de données et de mots. Pour la prédiction finale, la forêt fait voter tous les arbres et choisit la réponse majoritaire.

Point fort : Beaucoup plus robuste et précis que l'arbre seul. Il réduit considérablement le risque de surapprentissage.

Cas d'usage ici : C'est le modèle "poids lourd" utilisé pour obtenir la meilleure performance globale sur des patterns complexes.

## Les datasets utilisés
https://drive.google.com/uc?export=download&id=1bm32nrmEkfmNakLl3UA4MAyrEjaGXrUC&usp=gmail

## 🚀 Comment lancer le projet

Ce projet nécessite de lancer deux serveurs simultanément (Backend et Frontend).

### Etape 1 : Lancer le Backend (Machine Learning API)
Le backend gère l'analyse des messages. Il doit être lancé en premier.

Ouvrez un terminal à la racine du projet et exécutez :
```bash
./start_backend.sh
```
*Si le script ne fonctionne pas, vous pouvez lancer manuellement :*
```bash
# Créer l'environnement virtuel (si pas fait)
python3 -m venv venv
# Installer les dépendances
./venv/bin/pip install -r backend/requirements.txt
./venv/bin/python -m spacy download fr_core_news_sm
# Lancer le serveur
./venv/bin/uvicorn backend.main:app --reload --port 8000
```
Le serveur backend sera accessible sur `http://localhost:8000`.

### Etape 2 : Lancer le Frontend (Interface Utilisateur)
Ouvrez un **nouveau terminal** à la racine du projet et exécutez :
```bash
pnpm run dev
```
Ouvrez votre navigateur sur `http://localhost:3000`.

## Utilisation
1. Tapez un message dans la zone de chat (ex: "Gagnez un iPhone maintenant !").
2. Cliquez sur **Analyze** ou appuyez sur Entrée.
3. L'IA affichera si c'est un SPAM ou un HAM, avec un score de confiance et une visualisation graphique.
