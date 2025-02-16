/**
 * @file twilioWebhooks.ts
 * @description Gestion des webhooks Twilio pour les appels entrants
 */

import express, { Router, Request, Response, NextFunction } from 'express';
import { TwilioService } from '../services/twilioService';
import { elizaLogger } from '@elizaos/core';
import { validateRequest } from 'twilio/lib/webhooks/webhooks';
import twilio from 'twilio';

export function createTwilioRouter(twilioService: TwilioService, config: { authToken: string }): Router {
    const router = Router();
    const VoiceResponse = twilio.twiml.VoiceResponse;

    // Middleware pour vérifier la signature Twilio
    const validateTwilioRequest = (req: Request, res: Response, next: NextFunction) => {
        const signature = req.headers['x-twilio-signature'] as string;
        const url = req.protocol + '://' + req.get('host') + req.originalUrl;
        
        elizaLogger.info(`Requête Twilio reçue - URL: ${url}, Signature: ${signature}`);
        elizaLogger.info(`Headers:`, req.headers);
        elizaLogger.info(`Body:`, req.body);

        if (!signature) {
            elizaLogger.error('Signature Twilio manquante');
            return res.status(403).send('Signature manquante');
        }

        if (validateRequest(config.authToken, signature, url, req.body)) {
            next();
        } else {
            elizaLogger.error('Signature Twilio invalide');
            res.status(403).send('Signature invalide');
        }
    };

    // Route de test
    router.get('/call', (req: Request, res: Response) => {
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="en-GB" voice="Google.en-GB-Standard-B">This is a test of the GET route.</Say>
</Response>`;
        
        res.type('text/xml');
        res.send(twiml);
    });

    /**
     * Gestion des appels entrants
     * URL: POST /twilio/call
     */
    router.post('/call', async (req: Request, res: Response) => {
        elizaLogger.info('Nouvel appel entrant - Headers:', req.headers);
        elizaLogger.info('Nouvel appel entrant - Body:', req.body);
        
        try {
            const response = new VoiceResponse();
            const callStatus = req.body.CallStatus;
            const speechResult = req.body.SpeechResult;

            // Si nous avons un résultat de reconnaissance vocale via Gather
            if (speechResult) {
                elizaLogger.info('Transcription reçue via Gather:', speechResult);
                
                try {
                    // Traiter la réponse via le service
                    const agentResponse = await twilioService.handleAudioStream(speechResult, req.body.CallSid);
                    elizaLogger.info('Réponse de l\'agent via Gather:', agentResponse);
                    
                    // Configurer la nouvelle écoute
                    const gather = response.gather({
                        input: ['speech'],
                        language: 'en-GB',
                        speechTimeout: 'auto',
                        enhanced: true,
                        action: '/api/twilio/call',
                        method: 'POST'
                    });

                    // Répondre avec le message de l'agent
                    gather.say({
                        language: 'en-GB',
                        voice: 'Google.en-GB-Standard-B'
                    }, agentResponse || 'I am listening, please continue.');

                } catch (error) {
                    elizaLogger.error('Erreur lors du traitement de la transcription Gather:', error);
                    
                    // En cas d'erreur, continuer la conversation
                    const gather = response.gather({
                        input: ['speech'],
                        language: 'en-GB',
                        speechTimeout: 'auto',
                        enhanced: true,
                        action: '/api/twilio/call',
                        method: 'POST'
                    });

                    gather.say({
                        language: 'en-GB',
                        voice: 'Google.en-GB-Standard-B'
                    }, 'I apologize, I did not understand. Could you please repeat that?');
                }
            } 
            // Si c'est un nouvel appel ou pas de reconnaissance
            else if (callStatus !== 'completed') {
                const gather = response.gather({
                    input: ['speech'],
                    language: 'en-GB',
                    speechTimeout: 'auto',
                    enhanced: true,
                    action: '/api/twilio/call',
                    method: 'POST'
                });

                // Message d'accueil
                gather.say({
                    language: 'en-GB',
                    voice: 'Google.en-GB-Standard-B'
                }, 'You have reached Emergency Medical Services. An AI assistant will help you while waiting for a medical professional to take your call.');
            }

            // Configuration du streaming (toujours présent pour permettre la transcription en temps réel)
            const connect = response.connect();
            const stream = connect.stream({
                url: `wss://${req.headers.host}/media`,
                track: 'inbound_track'
            });

            stream.parameter({
                name: 'transcriptionConfig',
                value: JSON.stringify({
                    enable: true,
                    languageCode: 'en-GB'
                })
            });

            const twimlString = response.toString();
            elizaLogger.info('TwiML généré:', twimlString);
            
            res.writeHead(200, {
                'Content-Type': 'text/xml',
                'Content-Length': Buffer.byteLength(twimlString)
            });
            res.end(twimlString);
        } catch (error) {
            elizaLogger.error("Erreur lors de la gestion de l'appel:", error);
            const errorResponse = new VoiceResponse();
            const gather = errorResponse.gather({
                input: ['speech'],
                language: 'en-GB',
                speechTimeout: 'auto',
                enhanced: true,
                action: '/api/twilio/call',
                method: 'POST'
            });
            
            gather.say({
                language: 'en-GB',
                voice: 'Google.en-GB-Standard-B'
            }, 'Sorry, an error has occurred. How may I assist you?');
            
            res.type('text/xml');
            res.send(errorResponse.toString());
        }
    });

    /**
     * Gestion du streaming audio
     * Cette route n'est plus nécessaire car nous utilisons le WebSocket pour la transcription
     */
    router.post('/stream/:callSid', validateTwilioRequest, async (req: Request, res: Response) => {
        elizaLogger.info('Requête de streaming reçue (déprécié):', {
            callSid: req.params.callSid,
            body: req.body
        });
        res.status(200).json({ message: 'Streaming géré via WebSocket' });
    });

    return router;
} 