import type { Action, IAgentRuntime, Memory, State } from "@elizaos/core";
import axios from "axios";

interface MessageLog {
    timestamp: string;
    sender: string;
    content: string;
    type: 'user' | 'agent';
}

interface EmergencyData {
    name?: string;
    age?: number;
    phone?: string;
    emergency_type?: string;
    symptoms?: string[];
    location?: {
        address?: string,
        coordinates?: {
            lat: number,
            lng: number
        }
    };
    medical_history?: string[];
    current_medications?: string[];
    allergies?: string[];
    priority?: number;
    consciousness?: string;
    breathing?: string;
    timestamp: string;
    conversation_id: string;
    language: string;
    conversation_log: MessageLog[];
}

export const syncDashboardAction: Action = {
    name: "sync-dashboard",
    similes: ["sync", "dashboard-sync"],
    description: "Synchronise les données d'urgence avec le dashboard",
    examples: [],
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return runtime.providers.length > 0;
    },

    handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        try {
            const dashboardProvider = runtime.providers[0]; // On prend le premier provider qui devrait être le dashboard
            if (!dashboardProvider) {
                console.error("Dashboard provider not found");
                return;
            }

            const emergencyData = extractEmergencyData(message, state, runtime);
            
            // Récupérer l'URL et le token du provider
            const config = JSON.parse(await dashboardProvider.get(runtime, message, state));
            const { apiUrl, apiToken } = config;

            // Envoyer les données au dashboard
            const response = await axios.post(apiUrl, emergencyData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`
                }
            });

            console.log('Données synchronisées avec le dashboard:', response.status);
            console.log('Log de la conversation:', JSON.stringify(emergencyData.conversation_log, null, 2));

        } catch (error) {
            console.error('Erreur lors de la synchronisation avec le dashboard:', error);
        }
    }
};

function extractEmergencyData(message: Memory, state: State | undefined, runtime: IAgentRuntime): EmergencyData {
    const conversation = state?.recentMessagesData || [];
    
    const data: EmergencyData = {
        timestamp: new Date().toISOString(),
        conversation_id: message.id || `msg-${Date.now()}`,
        language: 'fr',
        conversation_log: []
    };

    // Extraire l'historique des messages
    data.conversation_log = conversation.map(msg => ({
        timestamp: new Date(msg.createdAt || Date.now()).toISOString(),
        sender: 'Utilisateur',
        content: msg.content?.text || '',
        type: 'user'
    }));

    // Extraire les informations d'urgence
    conversation.forEach(msg => {
        const info = msg.content?.extractedInfo as ExtractedInfo | undefined;
        if (info) {
            if (info.name) data.name = info.name;
            if (info.age) data.age = parseInt(info.age);
            if (info.phone) data.phone = info.phone;
            
            if (info.emergency_type) data.emergency_type = info.emergency_type;
            if (info.symptoms) data.symptoms = Array.isArray(info.symptoms) ? info.symptoms : [info.symptoms];
            
            if (info.location) {
                data.location = {
                    address: typeof info.location === 'string' ? info.location : info.location.address,
                    coordinates: typeof info.location === 'string' ? undefined : info.location.coordinates
                };
            }
            
            if (info.medical_history) data.medical_history = Array.isArray(info.medical_history) ? info.medical_history : [info.medical_history];
            if (info.medications) data.current_medications = Array.isArray(info.medications) ? info.medications : [info.medications];
            if (info.allergies) data.allergies = Array.isArray(info.allergies) ? info.allergies : [info.allergies];
            
            if (info.priority) data.priority = parseInt(info.priority);
            if (info.consciousness) data.consciousness = info.consciousness;
            if (info.breathing) data.breathing = info.breathing;
        }
    });

    return data;
}

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

export default syncDashboardAction; 