/**
 * @file start.ts
 * @description Point d'entrée du serveur Twilio
 */

import { fileURLToPath } from 'url';
import { elizaLogger } from '@elizaos/core';
import { createTwilioServer } from './server';
import { TwilioService } from './services/twilioService';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config();

// Configuration Twilio
const config = {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    fromNumber: process.env.TWILIO_PHONE_NUMBER!,
    webhookBaseUrl: process.env.WEBHOOK_BASE_URL!
};

// Créer le service Twilio
const twilioService = new TwilioService(config, null);

// Vérifier les variables d'environnement requises
const requiredEnvVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'WEBHOOK_BASE_URL'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingVars.length > 0) {
    elizaLogger.error(`Variables d'environnement manquantes: ${missingVars.join(', ')}`);
    process.exit(1);
}

// Configuration de l'URL de l'API ElizaOS
const ELIZA_API_URL = process.env.ELIZA_API_URL || 'http://localhost:3000';
const FIRST_HELP_AGENT_ID = process.env.AGENT_ID || 'First Help Agent';

// Fonction pour communiquer avec l'agent first_help
async function communicateWithFirstHelp(message: string, userId: string, roomId: string) {
    try {
        elizaLogger.info(`Envoi du message à l'agent ${FIRST_HELP_AGENT_ID}:`, {
            message,
            userId,
            roomId,
            url: `${ELIZA_API_URL}/${encodeURIComponent(FIRST_HELP_AGENT_ID)}/message`
        });

        const response = await fetch(`${ELIZA_API_URL}/${encodeURIComponent(FIRST_HELP_AGENT_ID)}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: message,
                userId,
                roomId,
                source: 'twilio'
            })
        });

        if (!response.ok) {
            elizaLogger.error(`Erreur API (${response.status}):`, await response.text());
            throw new Error(`Erreur API: ${response.statusText}`);
        }

        const data = await response.json();
        elizaLogger.info('Réponse reçue:', data);
        
        // Extraire le texte de la réponse en tenant compte de la structure exacte
        if (Array.isArray(data) && data.length > 0) {
            const firstResponse = data[0];
            if (typeof firstResponse === 'object' && firstResponse !== null) {
                elizaLogger.info('Traitement de la réponse:', firstResponse);
                return firstResponse.text || firstResponse.content?.text || "Je suis désolé, je ne peux pas traiter votre demande pour le moment.";
            }
        }
        return "Je suis désolé, je ne peux pas traiter votre demande pour le moment.";
    } catch (error) {
        elizaLogger.error('Erreur lors de la communication avec first_help:', error);
        return "Une erreur est survenue. En cas d'urgence, veuillez appeler directement le 15.";
    }
}

// Modifier le service Twilio pour utiliser first_help
twilioService.handleAudioStream = async (transcriptionText: string, callSid: string) => {
    elizaLogger.info(`Transcription reçue: ${transcriptionText}`);
    return await communicateWithFirstHelp(
        transcriptionText,
        `twilio-user-${callSid}`,
        `twilio-room-${callSid}`
    );
};

// Démarrer le serveur Twilio
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule || process.env.STANDALONE === 'true') {
    elizaLogger.info('Démarrage du serveur Twilio');
    const { startServer } = createTwilioServer(twilioService, {
        authToken: process.env.TWILIO_AUTH_TOKEN!
    });
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    startServer(port);
}

export { twilioService, config };  