#!/bin/bash
set -e

echo "=== Installation des dépendances principales ==="
npm install

echo "=== Setup Backend ==="
cd back
npm install
mkdir -p MongoDB

echo "=== Setup Frontend ==="
cd ../front
npm install

echo "=== Lancement du Backend et de la DB ==="
cd ../back
# Démarre MongoDB en arrière-plan (mongod se fork lui-même grâce à --fork)
mongod --dbpath MongoDB --fork --logpath mongod.log
# Lancement du backend en tâche de fond pour ne pas bloquer le script
npm start src/app.js &
BACK_PID=$!

echo "=== Lancement du Frontend ==="
cd ../front
npm run dev

# Optionnel : attendre la fin du serveur backend (si besoin)
wait $BACK_PID
