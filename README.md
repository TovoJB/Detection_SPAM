# Projet SPAM/HAM Classifier

Ce projet est une application web permettant de détecter si un message est du SPAM ou du HAM (légitime) en utilisant du Machine Learning.

## Architecture
- **Frontend** : Next.js, Tailwind CSS
- **Backend** : FastAPI, Python, Scikit-learn, Spacy

## Prérequis
- Node.js & pnpm
- Python 3.10+

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
