import { Provider, IAgentRuntime, Memory, State } from '@elizaos/core';
import { TwilioSettings, CharacterWithTwilio } from '../types/twilio';

export const twilioProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        try {
            const character = runtime.character as CharacterWithTwilio;
            const twilioSettings = character.settings?.twilio;
            
            if (!twilioSettings) {
                return 'Configuration Twilio non disponible';
            }

            // Récupérer les messages récents pour le contexte
            const recentMessages = await runtime.messageManager.getMemories({
                roomId: message.roomId,
                count: 5,
            });

            // Formater le contexte Twilio
            return `
# Configuration Twilio
- Voix: ${twilioSettings.voice}
- Langue: ${twilioSettings.language}
- Délai de réponse: ${twilioSettings.responseTimeout}ms

# Messages Récents
${recentMessages.map(m => `- ${m.content.text}`).join('\n')}
            `.trim();
        } catch (error) {
            console.error('Erreur dans le provider Twilio:', error);
            return 'Contexte Twilio temporairement indisponible';
        }
    },
}; 