#!/bin/bash

# Fonction pour construire le projet
install() {
    echo "Construction du projet..."
	pnpm install --no-frozen-lockfile
    pnpm build
}

# Fonction pour lancer le client et le personnage
start() {
    echo "Lancement du client et du personnage..."
    pnpm start --character="characters/first_help.json" & 
    pnpm start:client & 
    wait
}

start_twilio() {
    echo "Lancement du serveur Twilio..."
    cd packages/_plugin-twilio
    pnpm build
    pnpm dev:server
    cd ../..
}


# Vérification des arguments
case "$1" in
    install)
        install
        ;;
    start)
        start
        ;;
    start_twilio)
        start_twilio
        ;;
    *)
        echo "Usage: $0 {install|start|start_twilio}"
        exit 1
        ;;
esac