/**
 * @file setup.ts
 * @description Exemple de configuration du plugin Twilio
 */

import express from 'express';
import { TwilioService, createTwilioRouter, TwilioConfig } from '@elizaos/plugin-twilio';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(express.json());

// Configuration Twilio
const twilioConfig: TwilioConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_PHONE_NUMBER,
    webhookBaseUrl: process.env.WEBHOOK_BASE_URL // ex: https://votre-domaine.com/api
};

// Exemple de fichier .env nécessaire :
/*
TWILIO_ACCOUNT_SID=votre_account_sid
TWILIO_AUTH_TOKEN=votre_auth_token
TWILIO_PHONE_NUMBER=votre_numero_twilio
WEBHOOK_BASE_URL=https://votre-domaine.com/api
*/

async function setupTwilioPlugin(runtime) {
    // Créer le service Twilio
    const twilioService = new TwilioService(twilioConfig, runtime);

    // Créer et monter le routeur Twilio
    const twilioRouter = createTwilioRouter(twilioService, { 
        authToken: twilioConfig.authToken 
    });

    // Monter le routeur sur /api/twilio
    app.use('/api/twilio', twilioRouter);

    // Démarrer le serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
        console.log('URLs des webhooks Twilio :');
        console.log(`- Appels entrants : ${twilioConfig.webhookBaseUrl}/twilio/call`);
        console.log(`- Streaming audio : ${twilioConfig.webhookBaseUrl}/twilio/stream/:callSid`);
    });
}

export { setupTwilioPlugin }; 