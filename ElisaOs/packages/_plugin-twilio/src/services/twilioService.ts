/**
 * @file twilioService.ts
 * @description Service de gestion des communications Twilio
 */

import { Service, ServiceType, elizaLogger, type IAgentRuntime, stringToUuid } from "@elizaos/core";
import twilio from "twilio";
import type { TwilioConfig, SMSMessage, CallOptions, TwilioResponse } from "../types/twilio";
import fs from 'fs';
import { OpenAI } from "openai";

export class TwilioService extends Service {
    private client: twilio.Twilio;
    private config: TwilioConfig;
    private runtime: IAgentRuntime | null;
    private VoiceResponse: typeof twilio.twiml.VoiceResponse;

    static get serviceType(): ServiceType {
        return ServiceType.TEXT_GENERATION;
    }

    constructor(config: TwilioConfig, runtime: IAgentRuntime | null) {
        super();
        this.config = config;
        this.runtime = runtime;
        this.client = twilio(config.accountSid, config.authToken);
        this.VoiceResponse = twilio.twiml.VoiceResponse;
    }

    public setRuntime(runtime: IAgentRuntime) {
        this.runtime = runtime;
    }

    /**
     * Initialise le service Twilio
     */
    async initialize(): Promise<void> {
        elizaLogger.info("Initialisation du service Twilio");
        // Vérifier la configuration
        if (!this.config.accountSid || !this.config.authToken) {
            throw new Error("Configuration Twilio incomplète");
        }
        // Vérifier la connexion à Twilio
        try {
            await this.client.api.accounts(this.config.accountSid).fetch();
            elizaLogger.info("Connexion à Twilio établie avec succès");
        } catch (error) {
            elizaLogger.error("Erreur de connexion à Twilio:", error);
            throw error;
        }
    }

    /**
     * Envoie un SMS via Twilio
     */
    async sendSMS(message: SMSMessage): Promise<TwilioResponse> {
        try {
            const response = await this.client.messages.create({
                body: message.body,
                from: this.config.fromNumber,
                to: message.to,
                mediaUrl: message.mediaUrl
            });

            return {
                success: true,
                messageId: response.sid
            };
        } catch (error: any) {
            elizaLogger.error("Erreur lors de l'envoi du SMS:", error);
            return {
                success: false,
                error: error?.message || "Erreur inconnue"
            };
        }
    }

    /**
     * Effectue un appel via Twilio
     */
    async makeCall(options: CallOptions): Promise<TwilioResponse> {
        try {
            const response = await this.client.calls.create({
                to: options.to,
                from: this.config.fromNumber,
                ...(options.twiml ? { twiml: options.twiml } : {}),
                ...(options.url ? { url: options.url } : {})
            });

            return {
                success: true,
                messageId: response.sid
            };
        } catch (error: any) {
            elizaLogger.error("Erreur lors de l'appel:", error);
            return {
                success: false,
                error: error?.message || "Erreur inconnue"
            };
        }
    }

    /**
     * Gère un appel entrant de Twilio
     */
    async handleIncomingCall(callSid: string): Promise<twilio.twiml.VoiceResponse> {
        const response = new this.VoiceResponse();

        try {
            // Récupérer la configuration depuis le runtime
            const providerConfig = await this.runtime?.providers.find(p => p.get)?.get(this.runtime, {
                id: stringToUuid(`twilio-${callSid}`),
                userId: stringToUuid(`user-${callSid}`),
                roomId: stringToUuid(`room-${callSid}`),
                agentId: this.runtime?.agentId || stringToUuid('default-agent'),
                content: { 
                    text: '',
                    source: 'twilio_call',
                    attachments: []
                },
                createdAt: Date.now()
            });

            // Configurer le webhook pour la transcription en temps réel
            response.start()
                .stream({
                    url: `${this.config.webhookBaseUrl}/twilio/stream/${callSid}`,
                    track: "inbound_track"
                });

            // Ajouter un message d'accueil avec la configuration du provider
            response.say({
                language: providerConfig?.language || 'en-GB',
                voice: providerConfig?.voice || 'Google.en-GB-Standard-B'
            }, "You have reached Emergency Medical Services. An AI assistant will help you while waiting for a medical professional to take your call.");

            return response;
        } catch (error: any) {
            elizaLogger.error("Erreur lors de la gestion de l'appel entrant:", error);
            response.say({
                language: 'en-GB',
                voice: 'Google.en-GB-Standard-B'
            }, 'Sorry, an error has occurred. Please try again later.');
            return response;
        }
    }

    /**
     * Gère le flux audio en temps réel
     */
    public async handleAudioStream(transcriptionText: string, callSid: string): Promise<string> {
        try {
            elizaLogger.info(`Traitement de la transcription pour l'appel ${callSid}`);
            elizaLogger.info(`Texte transcrit: ${transcriptionText}`);

            if (!this.runtime) {
                elizaLogger.error('Runtime non initialisé');
                return "Je suis désolé, je ne suis pas encore prêt à répondre. Pouvez-vous réessayer dans quelques instants ?";
            }

            if (!transcriptionText || transcriptionText.trim().length === 0) {
                return "Je n'ai pas bien entendu. Pouvez-vous répéter s'il vous plaît ?";
            }

            // Créer un nouveau message pour l'agent
            const memory = {
                id: stringToUuid(`${Date.now()}-${callSid}`),
                content: {
                    text: transcriptionText,
                    source: 'twilio_call',
                    attachments: []
                },
                userId: stringToUuid(callSid),
                roomId: stringToUuid(`twilio-${callSid}`),
                agentId: this.runtime.agentId,
                createdAt: Date.now()
            };

            try {
                // Sauvegarder le message
                await this.runtime.messageManager.addEmbeddingToMemory(memory);
                await this.runtime.messageManager.createMemory(memory);

                // Composer l'état pour l'agent
                const state = await this.runtime.composeState({
                    content: memory.content,
                    userId: memory.userId,
                    roomId: memory.roomId,
                    agentId: this.runtime.agentId
                }, {
                    agentName: this.runtime.character.name
                });
                
                // Obtenir une réponse de l'agent
                const facts = await this.runtime.evaluate(memory, state);
                elizaLogger.info('Réponse de l\'agent:', facts);

                // Traiter la réponse de manière sûre
                const lastFact = facts?.at(-1) as { text: string } | string | undefined;
                const responseText = typeof lastFact === 'string' ? lastFact : 
                                   typeof lastFact === 'object' && lastFact && 'text' in lastFact ? lastFact.text :
                                   "Je vous écoute, comment puis-je vous aider ?";
                return responseText;

            } catch (error: any) {
                elizaLogger.error('Erreur lors du traitement avec l\'agent:', error);
                return "Je suis désolé, j'ai du mal à traiter votre demande. Pouvez-vous reformuler ?";
            }

        } catch (error: any) {
            elizaLogger.error('Erreur lors du traitement de la transcription:', error);
            return "Désolé, j'ai rencontré une difficulté. Comment puis-je vous aider ?";
        }
    }
} 