import type { Evaluator, IAgentRuntime, Memory, State } from "@elizaos/core";

interface ExtractedInfo {
    name?: string;
    age?: string;
    phone?: string;
    emergency_type?: string;
    symptoms?: string[];
    location?: string | {
        address?: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    medical_history?: string[];
    medications?: string[];
    allergies?: string[];
    priority?: string;
    consciousness?: string;
    breathing?: string;
}

export const emergencyDataEvaluator: Evaluator = {
    name: "emergency-data",
    similes: ["emergency", "emergency-eval"],
    description: "Évalue et extrait les informations d'urgence des messages",
    examples: [],
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return message.content?.text ? true : false;
    },

    handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        try {
            // Analyser le contenu du message pour extraire les informations
            const extractedInfo = await extractInformation(message.content?.text || '', runtime);
            
            // Stocker les informations extraites dans le contenu du message
            await runtime.messageManager.createMemory({
                id: message.id,
                content: {
                    ...message.content,
                    extractedInfo
                },
                roomId: message.roomId,
                userId: message.userId,
                agentId: runtime.agentId
            });
            
            // Déclencher l'action de synchronisation
            const syncAction = runtime.actions[0]; // On prend la première action qui devrait être sync-dashboard
            if (syncAction && syncAction.handler) {
                await syncAction.handler(runtime, message, state);
            }
            
        } catch (error) {
            console.error('Erreur lors de l\'évaluation des données d\'urgence:', error);
        }
    }
};

async function extractInformation(text: string, runtime: IAgentRuntime): Promise<ExtractedInfo> {
    const prompt = `
    Analyse le texte suivant et extrait les informations d'urgence pertinentes.
    Texte: "${text}"
    
    Format de réponse attendu (JSON) :
    {
        "name": "nom de la personne",
        "age": "âge",
        "phone": "numéro de téléphone",
        "emergency_type": "type d'urgence",
        "symptoms": ["symptôme 1", "symptôme 2"],
        "location": {
            "address": "adresse",
            "coordinates": {"lat": 0, "lng": 0}
        },
        "medical_history": ["antécédent 1", "antécédent 2"],
        "medications": ["médicament 1", "médicament 2"],
        "allergies": ["allergie 1", "allergie 2"],
        "priority": "niveau de priorité (1-5)",
        "consciousness": "état de conscience",
        "breathing": "état respiratoire"
    }
    
    Retourne uniquement les informations présentes dans le texte.
    `;

    const llmProvider = runtime.providers.find(p => p.get.toString().includes('llm'));
    if (!llmProvider) {
        throw new Error("LLM provider not found");
    }

    const response = await llmProvider.get(runtime, { content: { text: prompt } } as Memory);

    try {
        return JSON.parse(response) as ExtractedInfo;
    } catch (error) {
        console.error('Erreur lors du parsing de la réponse LLM:', error);
        return {};
    }
}

export default emergencyDataEvaluator; 