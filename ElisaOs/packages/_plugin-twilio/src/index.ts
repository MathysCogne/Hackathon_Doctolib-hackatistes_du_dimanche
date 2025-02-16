/**
 * @file index.ts
 * @description Point d'entrée du plugin Twilio
 */

import { 
    type IAgentRuntime, 
    type Provider, 
    type Plugin,
    type Memory,
    type State,
    ServiceType
} from '@elizaos/core';
import { TwilioService } from "./services/twilioService";
import { createTwilioRouter } from "./routes/twilioWebhooks";
import { elizaLogger } from "@elizaos/core";
import { twilioProvider as provider } from './providers/twilioProvider';
import { TwilioConfig } from './types/twilio';

export * from "./types/twilio";
export * from "./services/twilioService";

// Instance singleton du service Twilio
export let twilioServiceInstance: TwilioService | null = null;

// Fonction pour obtenir l'instance du service
export function getTwilioService(): TwilioService {
    if (!twilioServiceInstance) {
        twilioServiceInstance = new TwilioService({
            accountSid: process.env.TWILIO_ACCOUNT_SID!,
            authToken: process.env.TWILIO_AUTH_TOKEN!,
            fromNumber: process.env.TWILIO_PHONE_NUMBER!,
            webhookBaseUrl: process.env.WEBHOOK_BASE_URL!
        }, null);
    }
    return twilioServiceInstance;
}

// Export du service pour ElizaOS
export const twilioService = {
    serviceType: ServiceType.TEXT_GENERATION,
    name: "twilio",
    description: "Service de communication via Twilio",
    initialize: async (runtime: IAgentRuntime): Promise<void> => {
        try {
            const service = getTwilioService();
            service.setRuntime(runtime);
            await service.initialize();
            elizaLogger.info('Service Twilio initialisé avec succès');

            // Enregistrer le service dans le runtime
            runtime.registerService(service);
            elizaLogger.info('Service Twilio enregistré dans le runtime');
        } catch (error) {
            elizaLogger.error('Erreur lors de l\'initialisation du service Twilio:', error);
            throw error;
        }
    }
};

const twilioProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.info('Récupération des données Twilio:', { message, state });
        
        // Récupérer la configuration Twilio depuis le character
        const twilioConfig = (runtime.character.settings as any)?.twilio || {
            voice: 'Polly.Lea',
            language: 'fr-FR',
            responseTimeout: 5000
        };

        // Retourner les informations pertinentes
        return {
            voice: twilioConfig.voice,
            language: twilioConfig.language,
            responseTimeout: twilioConfig.responseTimeout,
            isCallActive: message.content?.source === 'twilio_call',
            callId: message.content?.source === 'twilio_call' ? message.userId : null,
            lastInteraction: message.createdAt
        };
    }
};

const logger = elizaLogger.child({ module: 'twilio-plugin' });

// Configuration par défaut qui sera remplacée lors de l'initialisation
const defaultConfig: TwilioConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '',
    webhookBaseUrl: process.env.TWILIO_WEBHOOK_BASE_URL || '',
};

// Le service sera initialisé avec le runtime lors de l'initialisation du plugin
const service = new TwilioService(defaultConfig, null);

export const twilioPlugin: Plugin = {
    name: 'twilio-plugin',
    description: 'Plugin pour intégrer les fonctionnalités Twilio dans Eliza',
    providers: [provider],
    services: [service],
};

export default twilioPlugin; 